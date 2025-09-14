from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Dict, Optional
from pydantic import BaseModel
import json
import uuid
from datetime import datetime

from ..database import get_db
from ..auth import get_current_user_optional
from ..models.database_models import RoomScan, FurniturePlacement, User

router = APIRouter(prefix="/api/v1/ar", tags=["AR Scanning"])

# Pydantic models
class RoomDimensions(BaseModel):
    width: float
    height: float
    depth: float
    units: str = "feet"

class DetectedSurface(BaseModel):
    surface_id: str
    surface_type: str  # floor, wall, ceiling
    confidence: float
    bounds: Dict[str, float]  # x, y, z coordinates
    area: float

class RoomScanData(BaseModel):
    scan_id: Optional[str] = None
    dimensions: RoomDimensions
    detected_surfaces: List[DetectedSurface]
    scan_quality: float
    timestamp: Optional[datetime] = None

class FurnitureItem(BaseModel):
    item_id: str
    model_id: str
    position: Dict[str, float]  # x, y, z
    rotation: Dict[str, float]  # x, y, z rotation
    scale: Dict[str, float]  # x, y, z scale
    surface_id: Optional[str] = None

class ARPlacementRequest(BaseModel):
    scan_id: str
    furniture_items: List[FurnitureItem]
    design_name: Optional[str] = "AR Design"

@router.post("/scan/process")
async def process_room_scan(
    scan_data: RoomScanData,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_optional)
):
    """Process and validate room scan data"""
    try:
        # Generate scan ID if not provided
        if not scan_data.scan_id:
            scan_data.scan_id = str(uuid.uuid4())

        # Validate scan quality
        if scan_data.scan_quality < 0.6:
            return {
                "status": "warning",
                "message": "Scan quality is low. Consider rescanning for better results.",
                "scan_id": scan_data.scan_id,
                "quality_score": scan_data.scan_quality,
                "recommendations": [
                    "Ensure good lighting in the room",
                    "Move phone slowly during scanning",
                    "Scan all corners and surfaces thoroughly"
                ]
            }

        # Store scan data
        room_scan = RoomScan(
            scan_id=scan_data.scan_id,
            user_id=current_user.get("sub") if current_user else None,
            room_dimensions={
                "width": scan_data.dimensions.width,
                "height": scan_data.dimensions.height,
                "depth": scan_data.dimensions.depth,
                "units": scan_data.dimensions.units
            },
            detected_surfaces=[surface.dict() for surface in scan_data.detected_surfaces],
            scan_quality=scan_data.scan_quality,
            processing_metadata={
                "surfaces_count": len(scan_data.detected_surfaces),
                "room_area": scan_data.dimensions.width * scan_data.dimensions.depth,
                "room_volume": scan_data.dimensions.width * scan_data.dimensions.depth * scan_data.dimensions.height
            }
        )

        db.add(room_scan)
        db.commit()
        db.refresh(room_scan)

        # Generate placement suggestions
        placement_suggestions = generate_placement_suggestions(scan_data)

        return {
            "status": "success",
            "scan_id": scan_data.scan_id,
            "quality_score": scan_data.scan_quality,
            "room_analysis": {
                "area_sqft": round(scan_data.dimensions.width * scan_data.dimensions.depth, 1),
                "volume_cuft": round(scan_data.dimensions.width * scan_data.dimensions.depth * scan_data.dimensions.height, 1),
                "surfaces_detected": len(scan_data.detected_surfaces),
                "room_category": categorize_room_size(scan_data.dimensions)
            },
            "placement_suggestions": placement_suggestions
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scan processing failed: {str(e)}")

@router.post("/placement/save")
async def save_furniture_placement(
    placement_request: ARPlacementRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_optional)
):
    """Save AR furniture placement configuration"""
    try:
        # Verify scan exists
        room_scan = db.query(RoomScan).filter(RoomScan.scan_id == placement_request.scan_id).first()
        if not room_scan:
            raise HTTPException(status_code=404, detail="Room scan not found")

        # Get or create user
        user_id = None
        if current_user:
            user_id = current_user.get("sub")
            db_user = db.query(User).filter(User.auth0_user_id == user_id).first()
            if not db_user:
                db_user = User(
                    auth0_user_id=user_id,
                    email=current_user.get("email"),
                    name=current_user.get("name")
                )
                db.add(db_user)
                db.commit()
                db.refresh(db_user)
                user_id = db_user.user_id

        # Save furniture placements
        placement_id = str(uuid.uuid4())
        total_estimated_cost = 0.0

        for furniture_item in placement_request.furniture_items:
            # Calculate estimated cost (in production, would fetch real prices)
            estimated_cost = estimate_furniture_cost(furniture_item.model_id)
            total_estimated_cost += estimated_cost

            placement = FurniturePlacement(
                placement_id=placement_id,
                scan_id=placement_request.scan_id,
                user_id=user_id,
                model_id=furniture_item.model_id,
                position=furniture_item.position,
                rotation=furniture_item.rotation,
                scale=furniture_item.scale,
                surface_id=furniture_item.surface_id,
                estimated_cost=estimated_cost
            )
            db.add(placement)

        db.commit()

        return {
            "status": "success",
            "placement_id": placement_id,
            "items_placed": len(placement_request.furniture_items),
            "estimated_total_cost": round(total_estimated_cost, 2),
            "design_name": placement_request.design_name,
            "message": "Furniture placement saved successfully"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Placement save failed: {str(e)}")

@router.get("/placement/{placement_id}")
async def get_furniture_placement(
    placement_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_optional)
):
    """Retrieve saved furniture placement"""
    try:
        placements = db.query(FurniturePlacement).filter(
            FurniturePlacement.placement_id == placement_id
        ).all()

        if not placements:
            raise HTTPException(status_code=404, detail="Placement not found")

        # Get scan data
        scan = db.query(RoomScan).filter(RoomScan.scan_id == placements[0].scan_id).first()

        furniture_items = []
        total_cost = 0.0

        for placement in placements:
            furniture_items.append({
                "item_id": str(placement.id),
                "model_id": placement.model_id,
                "position": placement.position,
                "rotation": placement.rotation,
                "scale": placement.scale,
                "surface_id": placement.surface_id,
                "estimated_cost": placement.estimated_cost
            })
            total_cost += placement.estimated_cost or 0.0

        return {
            "placement_id": placement_id,
            "scan_data": {
                "scan_id": scan.scan_id,
                "dimensions": scan.room_dimensions,
                "detected_surfaces": scan.detected_surfaces
            } if scan else None,
            "furniture_items": furniture_items,
            "total_estimated_cost": round(total_cost, 2),
            "created_at": placements[0].created_at,
            "status": "success"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Placement retrieval failed: {str(e)}")

@router.get("/user/scans")
async def get_user_scans(
    current_user: dict = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Get all room scans for the current user"""
    if not current_user:
        return {"scans": [], "count": 0}

    try:
        user_id = current_user.get("sub")
        scans = db.query(RoomScan).filter(RoomScan.user_id == user_id).all()

        scan_list = []
        for scan in scans:
            # Get placement count for each scan
            placement_count = db.query(FurniturePlacement).filter(
                FurniturePlacement.scan_id == scan.scan_id
            ).count()

            scan_list.append({
                "scan_id": scan.scan_id,
                "room_dimensions": scan.room_dimensions,
                "scan_quality": scan.scan_quality,
                "surfaces_detected": len(scan.detected_surfaces or []),
                "placement_count": placement_count,
                "created_at": scan.created_at
            })

        return {
            "scans": scan_list,
            "count": len(scan_list),
            "status": "success"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scan retrieval failed: {str(e)}")

@router.post("/validate-placement")
async def validate_furniture_placement(
    placement_data: Dict,
    db: Session = Depends(get_db)
):
    """Validate if furniture placement is physically realistic"""
    try:
        scan_id = placement_data.get("scan_id")
        furniture_items = placement_data.get("furniture_items", [])

        # Get room scan data
        room_scan = db.query(RoomScan).filter(RoomScan.scan_id == scan_id).first()
        if not room_scan:
            raise HTTPException(status_code=404, detail="Room scan not found")

        validation_results = []
        
        for item in furniture_items:
            validation = validate_single_placement(item, room_scan)
            validation_results.append({
                "item_id": item.get("item_id"),
                "model_id": item.get("model_id"),
                "is_valid": validation["is_valid"],
                "warnings": validation["warnings"],
                "suggestions": validation["suggestions"]
            })

        overall_valid = all(result["is_valid"] for result in validation_results)

        return {
            "overall_valid": overall_valid,
            "item_validations": validation_results,
            "global_suggestions": generate_layout_suggestions(furniture_items, room_scan),
            "status": "success"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Validation failed: {str(e)}")

def generate_placement_suggestions(scan_data: RoomScanData) -> List[Dict]:
    """Generate intelligent furniture placement suggestions based on room scan"""
    suggestions = []
    
    room_area = scan_data.dimensions.width * scan_data.dimensions.depth
    
    # Basic suggestions based on room size and detected surfaces
    if room_area < 80:  # Small room
        suggestions.extend([
            {
                "item_type": "bed",
                "suggestion": "Place bed along the longest wall to maximize floor space",
                "priority": "high",
                "position_hint": "corner_placement"
            },
            {
                "item_type": "desk",
                "suggestion": "Position desk near window for natural light",
                "priority": "high",
                "position_hint": "wall_adjacent"
            },
            {
                "item_type": "storage",
                "suggestion": "Use vertical storage solutions to save floor area",
                "priority": "medium",
                "position_hint": "wall_mounted"
            }
        ])
    else:  # Larger room
        suggestions.extend([
            {
                "item_type": "bed",
                "suggestion": "Consider centering bed to create distinct zones",
                "priority": "medium",
                "position_hint": "room_center"
            },
            {
                "item_type": "seating",
                "suggestion": "Add seating area for socializing",
                "priority": "low",
                "position_hint": "corner_grouping"
            }
        ])
    
    return suggestions

def validate_single_placement(item: Dict, room_scan: RoomScan) -> Dict:
    """Validate a single furniture item placement"""
    warnings = []
    suggestions = []
    is_valid = True
    
    position = item.get("position", {})
    model_id = item.get("model_id", "")
    
    room_dims = room_scan.room_dimensions
    
    # Check if item is within room bounds
    if (position.get("x", 0) < 0 or position.get("x", 0) > room_dims.get("width", 0) or
        position.get("z", 0) < 0 or position.get("z", 0) > room_dims.get("depth", 0)):
        warnings.append("Item is placed outside room boundaries")
        is_valid = False
    
    # Check for realistic placement (e.g., bed on floor, not floating)
    if "bed" in model_id.lower() and position.get("y", 0) > 2:
        warnings.append("Bed appears to be floating - should be placed on floor")
        suggestions.append("Lower bed to floor level")
    
    # Check for accessibility (basic spacing)
    if position.get("x", 0) < 2 or position.get("z", 0) < 2:
        warnings.append("Item may be too close to wall - ensure accessibility")
        suggestions.append("Move item at least 2 feet from walls for access")
    
    return {
        "is_valid": is_valid,
        "warnings": warnings,
        "suggestions": suggestions
    }

def generate_layout_suggestions(furniture_items: List[Dict], room_scan: RoomScan) -> List[str]:
    """Generate overall layout suggestions"""
    suggestions = []
    
    room_area = room_scan.room_dimensions.get("width", 0) * room_scan.room_dimensions.get("depth", 0)
    item_count = len(furniture_items)
    
    if item_count > room_area / 20:  # More than 1 item per 20 sq ft
        suggestions.append("Room may be overcrowded - consider removing some items")
    
    if room_area < 80 and item_count > 4:
        suggestions.append("For small rooms, limit to 4 major furniture pieces")
    
    # Check for flow and accessibility
    bed_count = sum(1 for item in furniture_items if "bed" in item.get("model_id", "").lower())
    if bed_count > 1:
        suggestions.append("Multiple beds detected - ensure adequate spacing between them")
    
    return suggestions

def categorize_room_size(dimensions: RoomDimensions) -> str:
    """Categorize room size for appropriate furniture recommendations"""
    area = dimensions.width * dimensions.depth
    
    if area < 50:
        return "micro"
    elif area < 80:
        return "small"
    elif area < 120:
        return "medium"
    else:
        return "large"

def estimate_furniture_cost(model_id: str) -> float:
    """Estimate furniture cost based on model type (simplified for MVP)"""
    cost_estimates = {
        "bed": 150.0,
        "desk": 100.0,
        "chair": 75.0,
        "shelf": 50.0,
        "storage": 40.0,
        "lamp": 30.0,
        "mirror": 25.0,
        "plant": 20.0
    }
    
    for item_type, cost in cost_estimates.items():
        if item_type in model_id.lower():
            return cost
    
    return 50.0  # Default estimate

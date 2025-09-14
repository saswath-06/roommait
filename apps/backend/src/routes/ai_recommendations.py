from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Optional
from pydantic import BaseModel
import openai
import os
import json
import asyncio
import httpx

from src.database import get_db
from src.auth import get_current_user_optional
from src.models.database_models import ProductSearch, User

router = APIRouter(prefix="/api/v1/ai", tags=["AI Recommendations"])

# Pydantic models for request/response
class RoomContext(BaseModel):
    dimensions: Dict[str, float]  # width, height, depth in feet
    style_preference: Optional[str] = "modern"
    budget_range: Optional[Dict[str, float]] = {"min": 50, "max": 200}
    existing_items: Optional[List[str]] = []
    room_type: Optional[str] = "dorm"

class ProductSearchRequest(BaseModel):
    room_context: RoomContext
    selected_category: str
    subcategory: Optional[str] = None
    search_intent: str
    max_results: Optional[int] = 10

class ProductRecommendation(BaseModel):
    product_name: str
    price: float
    sale_price: Optional[float] = None
    rating: float
    review_count: int
    image_url: str
    store: str
    product_url: str
    affiliate_link: Optional[str] = None
    why_recommended: str
    shipping: str
    in_stock: bool
    specifications: Optional[Dict] = {}

@router.post("/product-search")
async def search_products(
    search_request: ProductSearchRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_optional)
):
    """AI-powered product search based on room context and user preferences"""
    try:
        # Log search for analytics
        search_log = ProductSearch(
            user_id=current_user.get("sub") if current_user else None,
            search_query=search_request.search_intent,
            category=search_request.selected_category,
            room_context=search_request.room_context.dict(),
            filters={}
        )
        db.add(search_log)
        db.commit()

        # Generate AI-powered product recommendations
        recommendations = await generate_product_recommendations(search_request)
        
        # Update search log with results
        search_log.results_count = len(recommendations)
        db.commit()

        return {
            "recommendations": recommendations,
            "search_context": search_request.room_context.dict(),
            "total_results": len(recommendations),
            "status": "success"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Product search failed: {str(e)}")

@router.post("/room-analysis")
async def analyze_room(
    room_data: Dict,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_optional)
):
    """Analyze scanned room and provide AI recommendations"""
    try:
        dimensions = room_data.get("dimensions", {})
        detected_surfaces = room_data.get("detected_surfaces", 0)
        room_type = room_data.get("room_type", "dorm")

        # Calculate room area and volume
        area = dimensions.get("width", 0) * dimensions.get("depth", 0)
        volume = area * dimensions.get("height", 0)

        # AI analysis of room suitability
        analysis = await analyze_room_with_ai({
            "dimensions": dimensions,
            "area_sqft": area,
            "volume_cuft": volume,
            "surfaces_detected": detected_surfaces,
            "room_type": room_type
        })

        return {
            "room_analysis": analysis,
            "calculated_metrics": {
                "area_sqft": round(area, 1),
                "volume_cuft": round(volume, 1),
                "space_category": categorize_space_size(area),
                "furniture_capacity": estimate_furniture_capacity(area)
            },
            "status": "success"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Room analysis failed: {str(e)}")

@router.get("/style-suggestions")
async def get_style_suggestions(
    room_size: float,
    budget: float,
    current_user: dict = Depends(get_current_user_optional)
):
    """Get AI-powered style suggestions based on room size and budget"""
    try:
        suggestions = await generate_style_suggestions(room_size, budget)
        
        return {
            "style_suggestions": suggestions,
            "room_size": room_size,
            "budget_range": budget,
            "status": "success"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Style suggestion failed: {str(e)}")

async def generate_product_recommendations(search_request: ProductSearchRequest) -> List[ProductRecommendation]:
    """Generate AI-powered product recommendations using OpenAI and real product APIs"""
    
    # For MVP, we'll simulate AI recommendations with realistic data
    # In production, this would integrate with OpenAI GPT-4 and real retail APIs
    
    category = search_request.selected_category
    budget = search_request.room_context.budget_range
    room_size = search_request.room_context.dimensions.get("width", 10) * search_request.room_context.dimensions.get("depth", 10)
    
    # Sample product database (in production, this would be real API calls)
    sample_products = {
        "seating": [
            {
                "product_name": "IKEA Markus Office Chair",
                "price": 179.0,
                "sale_price": 149.0,
                "rating": 4.3,
                "review_count": 2847,
                "image_url": "https://example.com/ikea-markus.jpg",
                "store": "IKEA",
                "product_url": "https://ikea.com/markus-chair",
                "why_recommended": f"Perfect size for your {room_size:.0f} sq ft room, highly rated for study sessions",
                "shipping": "Free pickup",
                "in_stock": True,
                "specifications": {"weight_capacity": "240 lbs", "warranty": "10 years"}
            },
            {
                "product_name": "Amazon Basics Mesh Chair",
                "price": 89.0,
                "rating": 4.1,
                "review_count": 1203,
                "image_url": "https://example.com/amazon-mesh.jpg",
                "store": "Amazon",
                "product_url": "https://amazon.com/basics-mesh-chair",
                "why_recommended": f"Within your ${budget['max']:.0f} budget, breathable for long study sessions",
                "shipping": "Prime 1-day",
                "in_stock": True,
                "specifications": {"material": "Mesh", "adjustable_height": True}
            }
        ],
        "storage": [
            {
                "product_name": "IKEA Kallax Shelf Unit",
                "price": 49.99,
                "rating": 4.5,
                "review_count": 3421,
                "image_url": "https://example.com/ikea-kallax.jpg",
                "store": "IKEA",
                "product_url": "https://ikea.com/kallax-shelf",
                "why_recommended": "Modular design perfect for dorm organization, fits your modern style",
                "shipping": "Free pickup",
                "in_stock": True,
                "specifications": {"dimensions": "30 3/8x57 7/8\"", "weight": "73 lbs"}
            },
            {
                "product_name": "Wayfair College Storage Cube",
                "price": 34.99,
                "rating": 4.2,
                "review_count": 856,
                "image_url": "https://example.com/wayfair-cube.jpg",
                "store": "Wayfair",
                "product_url": "https://wayfair.com/storage-cube",
                "why_recommended": "Student-friendly price, stackable for flexible storage",
                "shipping": "Free shipping over $35",
                "in_stock": True,
                "specifications": {"material": "Fabric", "collapsible": True}
            }
        ]
    }
    
    # Get products for the requested category
    products = sample_products.get(category, [])
    
    # Filter by budget
    filtered_products = [
        p for p in products 
        if p["price"] <= budget["max"] and p["price"] >= budget["min"]
    ]
    
    # Convert to ProductRecommendation objects
    recommendations = []
    for product in filtered_products[:search_request.max_results]:
        recommendations.append(ProductRecommendation(**product))
    
    return recommendations

async def analyze_room_with_ai(room_data: Dict) -> Dict:
    """Use AI to analyze room characteristics and provide insights"""
    
    area = room_data["area_sqft"]
    dimensions = room_data["dimensions"]
    
    # AI analysis simulation (in production, would use OpenAI)
    analysis = {
        "space_efficiency": "good" if area > 80 else "challenging" if area > 50 else "very_tight",
        "layout_suggestions": [
            "Place bed along the longest wall to maximize floor space",
            "Use vertical storage solutions to save floor area",
            "Consider a lofted bed to create study space underneath"
        ],
        "furniture_priorities": [
            {"item": "bed", "importance": "essential", "space_allocation": 0.3},
            {"item": "desk", "importance": "high", "space_allocation": 0.2},
            {"item": "storage", "importance": "high", "space_allocation": 0.15},
            {"item": "seating", "importance": "medium", "space_allocation": 0.1}
        ],
        "color_recommendations": [
            "Light colors to make space feel larger",
            "Mirrors to reflect light and create depth",
            "Minimal patterns to avoid visual clutter"
        ],
        "budget_guidance": {
            "total_recommended": min(area * 15, 800),  # $15 per sq ft, max $800
            "priority_spending": "bed and desk (60% of budget)",
            "savings_tips": "Check local student marketplaces for gently used items"
        }
    }
    
    return analysis

async def generate_style_suggestions(room_size: float, budget: float) -> List[Dict]:
    """Generate style suggestions based on room constraints"""
    
    styles = [
        {
            "style_name": "Minimalist Modern",
            "description": "Clean lines, neutral colors, and functional furniture",
            "best_for": "Small spaces, focused study environment",
            "key_pieces": ["Platform bed", "Simple desk", "Floating shelves"],
            "color_palette": ["White", "Gray", "Natural wood"],
            "budget_fit": "excellent" if budget >= 300 else "good",
            "difficulty": "easy"
        },
        {
            "style_name": "Cozy Scandinavian",
            "description": "Warm woods, soft textures, and hygge comfort",
            "best_for": "Creating a homey atmosphere in small spaces",
            "key_pieces": ["Wooden bed frame", "Cozy textiles", "Plants"],
            "color_palette": ["Cream", "Sage green", "Natural wood"],
            "budget_fit": "good" if budget >= 400 else "moderate",
            "difficulty": "medium"
        },
        {
            "style_name": "Industrial Student",
            "description": "Metal accents, exposed elements, and durable materials",
            "best_for": "Durable furniture that lasts through college",
            "key_pieces": ["Metal bed frame", "Industrial desk", "Wire storage"],
            "color_palette": ["Black", "Gray", "Raw metal"],
            "budget_fit": "excellent" if budget >= 250 else "good",
            "difficulty": "easy"
        }
    ]
    
    # Filter styles based on room size and budget
    suitable_styles = []
    for style in styles:
        if room_size < 60 and "Small spaces" in style["best_for"]:
            suitable_styles.append(style)
        elif room_size >= 60:
            suitable_styles.append(style)
    
    return suitable_styles[:3]  # Return top 3 suggestions

def categorize_space_size(area_sqft: float) -> str:
    """Categorize room size for furniture recommendations"""
    if area_sqft < 50:
        return "micro"
    elif area_sqft < 80:
        return "small"
    elif area_sqft < 120:
        return "medium"
    else:
        return "large"

def estimate_furniture_capacity(area_sqft: float) -> Dict:
    """Estimate how many pieces of furniture can fit"""
    return {
        "major_pieces": min(int(area_sqft / 25), 6),  # One major piece per 25 sq ft
        "storage_units": min(int(area_sqft / 40), 4),
        "decorative_items": min(int(area_sqft / 15), 8),
        "recommended_layout": "linear" if area_sqft < 80 else "L-shaped" if area_sqft < 120 else "flexible"
    }

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import database components
from src.database import engine, get_db, Base
from src.models.database_models import User, GenericModel, RoomDesign, ProductSearch, RoomScan, FurniturePlacement
from src.auth import get_current_user, get_current_user_optional

# Import route modules
from src.routes.ai_recommendations import router as ai_router
from src.routes.ar_scanning import router as ar_router

# Create tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="roomait API",
    description="AR Interior Design API for College Students",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:19006,exp://192.168.2.29:8081,exp://192.168.2.29:8082").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include route modules
app.include_router(ai_router)
app.include_router(ar_router)

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "roomait API is running!",
        "version": "1.0.0",
        "status": "healthy"
    }

@app.get("/api/v1/health")
async def health_check(db: Session = Depends(get_db)):
    """Detailed health check for monitoring"""
    try:
        # Test database connection
        db.execute("SELECT 1")
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return {
        "status": "healthy",
        "environment": os.getenv("RAILWAY_ENVIRONMENT", "development"),
        "database": db_status,
        "ai_service": "not_configured"  # Will be updated when OpenAI is configured
    }

@app.get("/api/v1/models")
async def get_generic_models(db: Session = Depends(get_db)):
    """Get all generic 3D models for AR placement"""
    try:
        models = db.query(GenericModel).filter(GenericModel.is_active == True).all()
        
        model_list = []
        for model in models:
            model_list.append({
                "model_id": model.model_id,
                "category": model.category,
                "subcategory": model.subcategory,
                "display_name": model.display_name,
                "description": model.description,
                "model_url": model.model_url,
                "thumbnail_url": model.thumbnail_url,
                "dimensions": {
                    "width": model.width,
                    "depth": model.depth,
                    "height": model.height
                },
                "technical_specs": {
                    "polygon_count": model.polygon_count,
                    "file_size_mb": model.file_size_mb
                }
            })
        
        return {
            "models": model_list,
            "count": len(model_list),
            "status": "success"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.post("/api/v1/models/seed")
async def seed_generic_models(db: Session = Depends(get_db)):
    """Seed the database with initial generic models"""
    try:
        # Sample models to seed
        sample_models = [
            {
                "model_id": "generic-desk-chair",
                "category": "seating",
                "subcategory": "office-chair",
                "display_name": "Desk Chair",
                "description": "Office and study seating",
                "model_url": "/models/generic-desk-chair.glb",
                "thumbnail_url": "/images/generic-desk-chair-thumb.jpg",
                "width": 24, "depth": 26, "height": 38
            },
            {
                "model_id": "generic-shelf-unit",
                "category": "storage",
                "subcategory": "bookshelf",
                "display_name": "Shelf Unit",
                "description": "Modular storage for books and decor",
                "model_url": "/models/generic-shelf-unit.glb",
                "thumbnail_url": "/images/generic-shelf-unit-thumb.jpg",
                "width": 30, "depth": 12, "height": 60
            },
            {
                "model_id": "generic-bed-twin",
                "category": "sleeping",
                "subcategory": "twin-bed",
                "display_name": "Twin Bed",
                "description": "Standard twin bed for dorms",
                "model_url": "/models/generic-bed-twin.glb",
                "thumbnail_url": "/images/generic-bed-twin-thumb.jpg",
                "width": 38, "depth": 75, "height": 20
            }
        ]
        
        added_count = 0
        for model_data in sample_models:
            # Check if model already exists
            existing = db.query(GenericModel).filter(GenericModel.model_id == model_data["model_id"]).first()
            if existing:
                continue
                
            # Create new model
            db_model = GenericModel(
                model_id=model_data["model_id"],
                category=model_data["category"],
                subcategory=model_data["subcategory"],
                display_name=model_data["display_name"],
                description=model_data["description"],
                model_url=model_data["model_url"],
                thumbnail_url=model_data["thumbnail_url"],
                width=model_data["width"],
                depth=model_data["depth"],
                height=model_data["height"],
                polygon_count=3000,
                file_size_mb=2.5,
                is_active=True
            )
            
            db.add(db_model)
            added_count += 1
        
        db.commit()
        
        return {
            "message": f"Successfully seeded {added_count} models",
            "added_count": added_count,
            "status": "success"
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Seeding error: {str(e)}")

# Auth0 protected routes
@app.get("/api/v1/user/profile")
async def get_user_profile(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get authenticated user profile"""
    user_id = current_user.get("sub")
    
    # Check if user exists in database
    db_user = db.query(User).filter(User.auth0_user_id == user_id).first()
    
    if not db_user:
        # Create user profile if doesn't exist
        db_user = User(
            auth0_user_id=user_id,
            email=current_user.get("email"),
            name=current_user.get("name"),
            university="Not specified",
            preferences={}
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
    
    return {
        "user_id": db_user.user_id,
        "auth0_id": db_user.auth0_user_id,
        "email": db_user.email,
        "name": db_user.name,
        "university": db_user.university,
        "preferences": db_user.preferences,
        "created_at": db_user.created_at
    }

@app.post("/api/v1/user/designs")
async def save_room_design(
    design_data: dict,
    current_user: dict = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """Save a room design for authenticated user"""
    user_id = current_user.get("sub")
    
    # Get or create user
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
    
    # Create room design
    room_design = RoomDesign(
        user_id=db_user.user_id,
        design_name=design_data.get("design_name", "Untitled Design"),
        room_dimensions=design_data.get("room_dimensions", {}),
        furniture_placement=design_data.get("furniture_placement", []),
        style_preferences=design_data.get("style_preferences", {}),
        estimated_cost=design_data.get("estimated_cost", 0.0)
    )
    
    db.add(room_design)
    db.commit()
    db.refresh(room_design)
    
    return {
        "design_id": room_design.design_id,
        "message": "Room design saved successfully",
        "status": "success"
    }

@app.get("/api/v1/user/designs")
async def get_user_designs(
    current_user: dict = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """Get all room designs for authenticated user"""
    user_id = current_user.get("sub")
    
    # Get user
    db_user = db.query(User).filter(User.auth0_user_id == user_id).first()
    if not db_user:
        return {"designs": [], "count": 0}
    
    # Get user's designs
    designs = db.query(RoomDesign).filter(RoomDesign.user_id == db_user.user_id).all()
    
    design_list = []
    for design in designs:
        design_list.append({
            "design_id": design.design_id,
            "design_name": design.design_name,
            "room_dimensions": design.room_dimensions,
            "furniture_placement": design.furniture_placement,
            "style_preferences": design.style_preferences,
            "estimated_cost": design.estimated_cost,
            "created_at": design.created_at,
            "updated_at": design.updated_at
        })
    
    return {
        "designs": design_list,
        "count": len(design_list),
        "status": "success"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

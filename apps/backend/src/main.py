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
from src.models.database_models import User, GenericModel, RoomDesign, ProductSearch

# Create tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="roomait API",
    description="AR Interior Design API for College Students",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:19006").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

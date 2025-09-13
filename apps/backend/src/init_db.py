#!/usr/bin/env python3
"""
Database initialization script for roomait
Creates all tables and seeds initial data
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.database import engine, Base, SessionLocal
from src.models.database_models import User, GenericModel, RoomDesign, ProductSearch, UserPreference
import json

def create_tables():
    """Create all database tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created successfully!")

def seed_generic_models():
    """Seed generic 3D models from data file"""
    print("Seeding generic 3D models...")
    
    db = SessionLocal()
    try:
        # Load generic models data
        with open('../../../data/generic-models.json', 'r') as f:
            models_data = json.load(f)
        
        # Add more models for a complete set
        additional_models = [
            {
                "model_id": "generic-bed-twin",
                "category": "sleeping",
                "subcategory": "twin-bed",
                "model_url": "/models/generic-bed-twin.glb",
                "thumbnail": "/images/generic-bed-twin-thumb.jpg",
                "display_name": "Twin Bed",
                "description": "Standard twin bed for dorms",
                "typical_dimensions": {"width": 38, "depth": 75, "height": 20, "units": "inches"}
            },
            {
                "model_id": "generic-desk-study",
                "category": "workspace",
                "subcategory": "desk",
                "model_url": "/models/generic-desk-study.glb",
                "thumbnail": "/images/generic-desk-study-thumb.jpg",
                "display_name": "Study Desk",
                "description": "Computer desk for studying",
                "typical_dimensions": {"width": 48, "depth": 24, "height": 30, "units": "inches"}
            },
            {
                "model_id": "generic-dresser",
                "category": "storage",
                "subcategory": "dresser",
                "model_url": "/models/generic-dresser.glb",
                "thumbnail": "/images/generic-dresser-thumb.jpg",
                "display_name": "Dresser",
                "description": "Clothing storage dresser",
                "typical_dimensions": {"width": 36, "depth": 18, "height": 32, "units": "inches"}
            },
            {
                "model_id": "generic-nightstand",
                "category": "storage",
                "subcategory": "nightstand",
                "model_url": "/models/generic-nightstand.glb",
                "thumbnail": "/images/generic-nightstand-thumb.jpg",
                "display_name": "Nightstand",
                "description": "Bedside storage table",
                "typical_dimensions": {"width": 18, "depth": 16, "height": 24, "units": "inches"}
            },
            {
                "model_id": "generic-floor-lamp",
                "category": "lighting",
                "subcategory": "floor-lamp",
                "model_url": "/models/generic-floor-lamp.glb",
                "thumbnail": "/images/generic-floor-lamp-thumb.jpg",
                "display_name": "Floor Lamp",
                "description": "Standing room lighting",
                "typical_dimensions": {"width": 12, "depth": 12, "height": 60, "units": "inches"}
            },
            {
                "model_id": "generic-mini-fridge",
                "category": "appliances",
                "subcategory": "refrigerator",
                "model_url": "/models/generic-mini-fridge.glb",
                "thumbnail": "/images/generic-mini-fridge-thumb.jpg",
                "display_name": "Mini Fridge",
                "description": "Compact dorm refrigerator",
                "typical_dimensions": {"width": 19, "depth": 20, "height": 33, "units": "inches"}
            },
            {
                "model_id": "generic-bean-bag",
                "category": "seating",
                "subcategory": "casual-chair",
                "model_url": "/models/generic-bean-bag.glb",
                "thumbnail": "/images/generic-bean-bag-thumb.jpg",
                "display_name": "Bean Bag Chair",
                "description": "Casual seating for relaxation",
                "typical_dimensions": {"width": 36, "depth": 36, "height": 30, "units": "inches"}
            },
            {
                "model_id": "generic-plant-pot",
                "category": "decor",
                "subcategory": "plant",
                "model_url": "/models/generic-plant-pot.glb",
                "thumbnail": "/images/generic-plant-pot-thumb.jpg",
                "display_name": "Plant Pot",
                "description": "Decorative plant container",
                "typical_dimensions": {"width": 8, "depth": 8, "height": 12, "units": "inches"}
            }
        ]
        
        # Combine existing and additional models
        all_models = models_data + additional_models
        
        for model_data in all_models:
            # Check if model already exists
            existing = db.query(GenericModel).filter(GenericModel.model_id == model_data["model_id"]).first()
            if existing:
                print(f"⏭️  Model {model_data['model_id']} already exists, skipping...")
                continue
                
            # Create new model
            db_model = GenericModel(
                model_id=model_data["model_id"],
                category=model_data["category"],
                subcategory=model_data["subcategory"],
                display_name=model_data["display_name"],
                description=model_data["description"],
                model_url=model_data["model_url"],
                thumbnail_url=model_data["thumbnail"],
                width=model_data["typical_dimensions"]["width"],
                depth=model_data["typical_dimensions"]["depth"],
                height=model_data["typical_dimensions"]["height"],
                polygon_count=3000,  # Estimated for mobile AR
                file_size_mb=2.5,    # Estimated compressed GLB size
                is_active=True
            )
            
            db.add(db_model)
            print(f"✅ Added model: {model_data['display_name']}")
        
        db.commit()
        print(f"✅ Seeded {len(all_models)} generic models!")
        
    except Exception as e:
        print(f"❌ Error seeding models: {e}")
        db.rollback()
    finally:
        db.close()

def create_test_user():
    """Create a test user for development"""
    print("Creating test user...")
    
    db = SessionLocal()
    try:
        # Check if test user exists
        existing_user = db.query(User).filter(User.email == "test@roomait.com").first()
        if existing_user:
            print("⏭️  Test user already exists, skipping...")
            return
            
        test_user = User(
            email="test@roomait.com",
            username="testuser",
            password_hash="hashed_password_here",  # In real app, use proper hashing
            full_name="Test User",
            university="Test University",
            room_type="dorm",
            budget_min=25.0,
            budget_max=150.0,
            style_preferences=["modern", "minimalist"],
            is_active=True
        )
        
        db.add(test_user)
        db.commit()
        print("✅ Test user created!")
        
    except Exception as e:
        print(f"❌ Error creating test user: {e}")
        db.rollback()
    finally:
        db.close()

def main():
    """Main initialization function"""
    print("🏠 Initializing roomait database...")
    print("=" * 50)
    
    try:
        # Create tables
        create_tables()
        print()
        
        # Seed data
        seed_generic_models()
        print()
        
        # Create test user
        create_test_user()
        print()
        
        print("=" * 50)
        print("🎉 Database initialization complete!")
        print("✅ Tables created")
        print("✅ Generic models seeded")
        print("✅ Test user created")
        print()
        print("Next steps:")
        print("1. Set your OpenAI API key in Railway environment variables")
        print("2. Test the API endpoints")
        print("3. Connect the mobile app!")
        
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

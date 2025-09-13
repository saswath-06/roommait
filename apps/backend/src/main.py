from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

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
async def health_check():
    """Detailed health check for monitoring"""
    return {
        "status": "healthy",
        "environment": os.getenv("RAILWAY_ENVIRONMENT", "development"),
        "database": "not_connected",  # Will be updated when DB is connected
        "ai_service": "not_configured"  # Will be updated when OpenAI is configured
    }

@app.get("/api/v1/models")
async def get_generic_models():
    """Get all generic 3D models for AR placement"""
    # This will be populated with actual model data
    return {
        "models": [],
        "count": 0,
        "message": "Generic 3D models endpoint - to be implemented"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

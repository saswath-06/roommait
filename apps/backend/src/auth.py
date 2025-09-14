from functools import wraps
from fastapi import HTTPException, Security, Depends
from fastapi.security import HTTPBearer
from jose import jwt, JWTError
import requests
import os
from typing import Optional

# Auth0 configuration
AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN")
AUTH0_API_AUDIENCE = os.getenv("AUTH0_AUDIENCE", "")
AUTH0_ALGORITHMS = ["RS256"]

# JWT Bearer token security
bearer = HTTPBearer()

def get_auth0_public_key():
    """Get Auth0 public key for JWT verification"""
    try:
        response = requests.get(f"https://{AUTH0_DOMAIN}/.well-known/jwks.json")
        jwks = response.json()
        return jwks
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get Auth0 public key: {str(e)}")

def verify_token(token: str) -> dict:
    """Verify Auth0 JWT token"""
    try:
        # Get the public key
        jwks = get_auth0_public_key()
        
        # Decode the header to get key ID
        unverified_header = jwt.get_unverified_header(token)
        key_id = unverified_header["kid"]
        
        # Find the correct key
        key = None
        for jwk in jwks["keys"]:
            if jwk["kid"] == key_id:
                key = jwk
                break
        
        if not key:
            raise HTTPException(status_code=401, detail="Invalid token key")
        
        # Verify and decode the token
        payload = jwt.decode(
            token,
            key,
            algorithms=AUTH0_ALGORITHMS,
            audience=AUTH0_API_AUDIENCE,
            issuer=f"https://{AUTH0_DOMAIN}/"
        )
        
        return payload
        
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Token verification failed: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Authentication error: {str(e)}")

def get_current_user(token: str = Security(bearer)) -> dict:
    """Dependency to get current authenticated user"""
    if not AUTH0_DOMAIN:
        raise HTTPException(status_code=500, detail="Auth0 configuration missing")
    
    # Extract token from Bearer format
    if hasattr(token, 'credentials'):
        token_str = token.credentials
    else:
        token_str = str(token)
    
    payload = verify_token(token_str)
    return payload

def get_current_user_optional(token: Optional[str] = Security(bearer, auto_error=False)) -> Optional[dict]:
    """Optional authentication - returns None if no token provided"""
    if not token:
        return None
    
    try:
        return get_current_user(token)
    except HTTPException:
        return None

# Decorator for protected routes
def auth_required(f):
    """Decorator to require authentication"""
    @wraps(f)
    async def decorated_function(*args, **kwargs):
        user = kwargs.get('current_user')
        if not user:
            raise HTTPException(status_code=401, detail="Authentication required")
        return await f(*args, **kwargs)
    return decorated_function

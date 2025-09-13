# RoomGenie - Project Scope Documentation

## Project Overview

### Vision Statement
RoomGenie transforms how college students design and personalize their living spaces by combining cutting-edge AR technology with AI-powered interior design recommendations, making professional-quality room design accessible and affordable for student budgets.

### Mission Statement
To democratize interior design for college students by providing an intuitive AR platform that bridges the gap between imagination and reality, helping students create inspiring, functional living spaces within budget constraints while connecting them directly to affordable, real products.

### Target Audience

**Primary Users:**
- College students (ages 18-25) living in dorms, apartments, or shared housing
- Budget-conscious individuals with $15-200 spending range for room improvements
- Tech-savvy students comfortable with mobile AR experiences
- Students seeking to personalize their temporary living spaces

**User Personas:**
1. **Emma** - Freshman in dorm, wants to make her space feel like home, $50 budget
2. **Marcus** - Junior in apartment, looking to upgrade his bedroom aesthetic, $150 budget
3. **Sophia** - Graduate student, shared housing, wants functional and stylish solutions, $100 budget

### Core Value Proposition

**"See it before you buy it"** - RoomGenie eliminates the guesswork in room design by letting students:
- Visualize furniture and decor in their actual space using AR
- Get personalized AI recommendations based on room dimensions, style preferences, and budget
- Access direct purchase links to verified, affordable products
- Avoid costly design mistakes and returns

### Market Need

**Problems Solved:**
- Students waste money on furniture that doesn't fit or match their space
- Lack of affordable interior design guidance for temporary living situations
- Difficulty visualizing how products will look in actual rooms
- Time-consuming research for budget-friendly, stylish options
- Fear of commitment to purchases for temporary living spaces

**Market Opportunity:**
- $13 billion college housing market
- 20+ million college students in the US
- Average student spends $400-800 annually on room/apartment decor
- Growing AR adoption in retail (projected $8 billion by 2025)

### Success Metrics

**Primary KPIs:**
- Monthly Active Users (MAU): Target 10,000+ by end of year 1
- Conversion Rate: AR view to purchase click >15%
- User Engagement: Average session time >8 minutes
- Retention: 30-day retention rate >40%

**Business Goals:**
- Revenue through affiliate marketing partnerships
- Freemium model with premium AI features
- Partnership deals with student-focused retailers
- Data insights for furniture/decor brands targeting students

## Technical Architecture

### Tech Stack Overview

```
Frontend (Mobile App)
├── React Native (Cross-platform mobile development)
├── Expo (Development and deployment platform)
├── NativeWind (Tailwind CSS for React Native)
├── React Native Vision Camera (Camera access)
├── @react-native-async-storage/async-storage (Local storage)
└── Expo AR (Augmented Reality capabilities)

Backend API
├── FastAPI (Python web framework)
├── SQLAlchemy (ORM)
├── Alembic (Database migrations)
├── Redis (Caching and session management)
├── OpenAI API (AI recommendations)
└── Auth0 (Authentication service)

Database & Infrastructure
├── PostgreSQL (Primary database)
├── Redis (Cache and session store)
├── Railway (Hosting and deployment)
├── AWS S3 (3D model and image storage)
└── CDN (Asset delivery)

External Integrations
├── Auth0 (User authentication)
├── OpenAI GPT-4 (AI recommendations)
├── Amazon Product API (Product data)
├── Wayfair API (Furniture data)
└── Analytics (Mixpanel/Amplitude)
```

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Mobile App    │    │   Web Dashboard │    │   Admin Panel   │
│  (React Native)│    │   (React/Next)  │    │   (FastAPI)     │
│                 │    │                 │    │                 │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────┴─────────────┐
                    │                           │
                    │     API Gateway/LB        │
                    │     (Railway Proxy)       │
                    │                           │
                    └─────────────┬─────────────┘
                                  │
          ┌───────────────────────┼───────────────────────┐
          │                       │                       │
┌─────────┴───────┐    ┌─────────┴───────┐    ┌─────────┴───────┐
│                 │    │                 │    │                 │
│   Auth Service  │    │   Main API      │    │   AI Service    │
│   (Auth0)       │    │   (FastAPI)     │    │   (OpenAI)      │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────┬───────┘    └─────────────────┘
                                 │
                    ┌─────────────┴─────────────┐
                    │                           │
                    │     Data Layer            │
                    │                           │
                    └─────────────┬─────────────┘
                                  │
          ┌───────────────────────┼───────────────────────┐
          │                       │                       │
┌─────────┴───────┐    ┌─────────┴───────┐    ┌─────────┴───────┐
│                 │    │                 │    │                 │
│   PostgreSQL    │    │     Redis       │    │   File Storage  │
│   (Primary DB)  │    │   (Cache/Sessions)   │   (AWS S3)      │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Database Schema Overview

```sql
-- Core Entities
Users
├── id (UUID, Primary Key)
├── auth0_id (String, Unique)
├── email (String, Unique)
├── profile_data (JSONB)
├── preferences (JSONB)
├── created_at (Timestamp)
└── updated_at (Timestamp)

Rooms
├── id (UUID, Primary Key)
├── user_id (UUID, Foreign Key)
├── name (String)
├── room_type (Enum: dorm, bedroom, studio)
├── dimensions (JSONB: length, width, height)
├── scan_data (JSONB: point cloud, planes)
├── created_at (Timestamp)
└── updated_at (Timestamp)

Generic_Models
├── id (UUID, Primary Key)
├── model_name (String)
├── category (String)
├── subcategory (String)
├── model_url (String, GLB file path)
├── thumbnail_url (String)
├── typical_dimensions (JSONB: length, width, height)
├── description (Text)
├── created_at (Timestamp)
└── updated_at (Timestamp)

Product_Searches
├── id (UUID, Primary Key)
├── user_id (UUID, Foreign Key)
├── generic_model_id (UUID, Foreign Key)
├── search_context (JSONB: room, budget, style)
├── ai_recommendations (JSONB Array)
├── selected_products (JSONB Array)
├── created_at (Timestamp)
└── session_id (UUID)

Room_Designs
├── id (UUID, Primary Key)
├── room_id (UUID, Foreign Key)
├── name (String)
├── design_data (JSONB: placed objects, positions)
├── total_cost (Decimal)
├── created_at (Timestamp)
└── updated_at (Timestamp)

AI_Recommendations
├── id (UUID, Primary Key)
├── user_id (UUID, Foreign Key)
├── room_id (UUID, Foreign Key)
├── context (JSONB: chat history, preferences)
├── recommendations (JSONB Array)
├── created_at (Timestamp)
└── confidence_score (Float)
```

### API Design Principles

**RESTful Architecture:**
- Resource-based URLs (`/api/v1/rooms/{id}/designs`)
- HTTP methods follow semantic meaning (GET, POST, PUT, DELETE)
- Consistent response formats with envelope pattern
- Proper HTTP status codes

**Authentication & Authorization:**
- Auth0 JWT tokens for all protected endpoints
- Role-based access control (user, premium, admin)
- API rate limiting per user/IP
- Request validation using Pydantic models

**Data Flow:**
```
Mobile App → Auth0 (Login) → FastAPI (Protected Routes) → Database
     ↓
AR Experience → Product Recommendations → AI Service → Response
     ↓
Purchase Intent → Affiliate Links → External Store
```

### Security and Authentication Flow

```
User Registration/Login Flow:
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Mobile    │    │    Auth0    │    │   Backend   │
│    App      │────│   Service   │────│     API     │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       │ 1. Login Request  │                   │
       │──────────────────▶│                   │
       │                   │                   │
       │ 2. JWT Token      │                   │
       │◀──────────────────│                   │
       │                   │                   │
       │ 3. API Request + JWT                  │
       │──────────────────────────────────────▶│
       │                   │                   │
       │                   │ 4. Validate JWT   │
       │                   │◀──────────────────│
       │                   │                   │
       │                   │ 5. User Info      │
       │                   │──────────────────▶│
       │                   │                   │
       │ 6. API Response   │                   │
       │◀──────────────────────────────────────│
```

**Security Measures:**
- HTTPS/TLS encryption for all communications
- JWT token expiration and refresh mechanisms
- Input validation and sanitization
- SQL injection prevention through ORM
- Rate limiting and DDoS protection
- Secure file upload with content validation

## Feature Breakdown

### Core Features

#### 1. Room Scanning and 3D Mapping
**Technical Implementation:**
- ARKit (iOS) / ARCore (Android) plane detection
- LiDAR support for compatible devices
- Point cloud generation and mesh creation
- Room boundary detection and measurement
- Lighting condition analysis

**Features:**
- Guided scanning process with visual feedback
- Automatic room dimension calculation
- Multiple scan sessions for complex rooms
- Scan quality validation and improvement suggestions
- Export scan data for future sessions

#### 2. Hybrid 3D Models + AI Product Discovery
**Two-Layer System:**
- **AR Layer**: Limited generic 3D models (8-12 items) for spatial visualization
- **Product Layer**: Unlimited real products via AI-powered search APIs

**Generic 3D Models for AR:**
- Basic furniture archetypes (chair, desk, lamp, shelf, etc.)
- Optimized for mobile AR performance
- Used for room planning and spatial understanding
- Tap to trigger real product discovery

**AI Product Discovery Engine:**
```python
def discover_real_products(generic_model, room_context, user_preferences):
    search_query = {
        "category": generic_model.category,
        "room_dimensions": room_context.dimensions,
        "budget_range": user_preferences.budget,
        "style_preference": user_preferences.style,
        "existing_items": room_context.placed_objects
    }
    
    ai_response = openai.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": PRODUCT_DISCOVERY_PROMPT},
            {"role": "user", "content": json.dumps(search_query)}
        ]
    )
    
    # Combine AI insights with real product APIs
    products = search_product_apis(ai_response.search_terms)
    return rank_by_ai_criteria(products, ai_response.reasoning)
```

#### 3. AR Object Placement and Manipulation
**AR Interface:**
- Touch-based object placement on detected planes
- Multi-touch gestures for scaling, rotation
- Physics-based collision detection
- Real-time shadow and lighting simulation
- Undo/redo functionality

**Object Management:**
- Generic 3D model library optimized for mobile AR
- Snap-to-grid and alignment helpers for spatial planning
- Room layout templates and spatial arrangements
- Save/load room configurations with placed generic models
- Real product discovery triggered by tapping placed objects

#### 4. Contextual Chat System Integration
**Chat Features:**
- Slide-up chat drawer during AR experience
- Context-aware AI responses based on current room view
- Product-specific questions and recommendations
- Style guidance and design tips
- Budget optimization suggestions

**AI Chat Integration:**
```
User: "This chair looks too big for my space"
AI Context: 
- Current room: 10x12 dorm room
- Placed object: $89 desk chair (24"W x 26"D)
- Available space: 30" width remaining
- User budget: $50-100

AI Response: "You're right! That chair takes up 24" of width, leaving only 30" for movement. Here are 3 slimmer alternatives under $90 that would fit better..."
```

#### 5. E-commerce Integration
**Affiliate Partnership System:**
- Real-time price checking across multiple retailers
- Deep-link generation for seamless purchasing
- Price tracking and alert system
- Review aggregation from multiple sources
- Student discount discovery and application

**Supported Retailers:**
- Amazon (College essentials)
- Wayfair (Furniture focus)
- Target (Budget-friendly options)
- IKEA (Student-oriented designs)
- Facebook Marketplace (Local/used items)

#### 6. User Profile and Preference Management
**Preference Engine:**
- Style quiz for initial setup
- Learning from user interactions and choices
- Budget tracking and spending insights
- Wishlist and saved room designs
- Social sharing capabilities

**Data Collection:**
- Implicit: interaction time, object selections, purchase clicks
- Explicit: style ratings, budget updates, room photos
- Privacy-first approach with user consent

### Advanced Features (Post-MVP)

#### 1. Social Features
- Room design sharing and collaboration
- Student community for design inspiration
- Before/after photo sharing
- Design challenges and competitions

#### 2. Smart Recommendations
- Seasonal design updates
- Academic calendar-aware suggestions (back-to-school, finals prep)
- Roommate compatibility design suggestions
- Sustainability and eco-friendly options

#### 3. Enhanced AR Features
- Multi-room design planning
- Virtual staging for moving between spaces
- Lighting simulation for different times of day
- Texture and material customization

## Project Timeline

### Hackathon MVP (48-72 hours)

**Day 1 (Backend Foundation):**
- [ ] Project setup and monorepo structure
- [ ] FastAPI backend with basic user authentication
- [ ] Database setup with core entities (Users, Rooms, Generic_Models)
- [ ] Generic 3D model database seeding (8-12 basic models)
- [ ] OpenAI integration for product discovery API
- [ ] Basic external product API integration (Amazon/Wayfair)

**Day 2 (Mobile App Core):**
- [ ] React Native app initialization with Expo
- [ ] Basic AR setup and plane detection
- [ ] Generic 3D model placement functionality
- [ ] Model catalog browsing (8-12 generic items)
- [ ] Tap-to-discover product search integration
- [ ] Basic chat interface

**Day 3 (Integration & Polish):**
- [ ] Backend-mobile integration
- [ ] AR generic model placement with real product discovery
- [ ] AI-powered product recommendations from tapped objects
- [ ] Purchase flow to external stores
- [ ] Demo preparation and testing
- [ ] Bug fixes and performance optimization

### Post-Hackathon Roadmap

**Month 1-2 (MVP Enhancement):**
- Enhanced AR features (better manipulation, lighting)
- Expanded product database (200+ items)
- Improved AI recommendations with user preferences
- User onboarding and tutorial system
- Basic analytics and usage tracking

**Month 3-4 (Growth Features):**
- Social features (sharing, community)
- Advanced recommendation engine
- Multiple retailer integrations
- Premium features (advanced AI, unlimited designs)
- Marketing and user acquisition campaigns

**Month 5-6 (Scale & Monetization):**
- Affiliate partnership expansion
- Advanced analytics and insights
- Performance optimization for scale
- Enterprise features (university partnerships)
- Revenue optimization and business model refinement

### Technical Risk Assessment

**High Risk:**
- AR performance on older devices
- 3D model loading and rendering optimization
- Cross-platform AR consistency (iOS vs Android)
- Real-time AI response latency

**Medium Risk:**
- Product data accuracy and availability
- Affiliate link tracking and attribution
- User authentication complexity
- Database performance at scale

**Low Risk:**
- Basic CRUD operations
- Static content delivery
- Email notifications
- Basic user interface components

**Mitigation Strategies:**
- Progressive feature degradation for older devices
- Aggressive caching and preloading strategies
- Fallback modes for AR failures
- Comprehensive testing on target devices

### Resource Requirements

**Development Team (Hackathon):**
- 1 Full-stack developer (FastAPI + React Native)
- 1 Frontend/AR specialist (React Native + AR)
- 1 AI/Backend specialist (OpenAI + FastAPI)
- 1 Designer/Product (UX + Product management)

**Infrastructure Costs (Monthly):**
- Railway hosting: $20-50
- Auth0: $0-25 (free tier initially)
- OpenAI API: $50-200 (based on usage)
- AWS S3 storage: $10-30
- Database: Included with Railway

**Total Monthly Operating Cost:** $80-305

**Growth Scaling Requirements:**
- CDN implementation for global performance
- Database read replicas for scaling
- Microservices architecture for team scaling
- Advanced monitoring and alerting systems
- Customer support and community management tools

## Success Criteria

**Hackathon Demo Success:**
- Successfully scan a room and place 3+ furniture items
- Generate contextual AI recommendations
- Demonstrate purchase flow (click to external store)
- Show before/after room transformation
- Handle edge cases gracefully (poor lighting, small spaces)

**Post-Hackathon Success Metrics:**
- 1000+ app downloads within first month
- 50+ successful room scans per week
- 10%+ conversion rate from AR view to store click
- Average session time >5 minutes
- 4.0+ app store rating

This comprehensive project scope provides the foundation for building RoomGenie from conception through scalable growth, with clear technical specifications and realistic timelines for both hackathon and long-term success.

# RoomGenie - MVP Specification

## MVP Core Features (Must-Have)

### 1. Essential Functionality for Demo

**Critical Path User Journey:**
```
App Launch → Quick Signup → Room Scan → Object Placement → AI Chat → Purchase Intent
```

**Must-Work Features:**
1. **Basic Room Scanning**
   - Plane detection on floor and walls
   - Simple room boundary visualization
   - Manual dimension adjustment if auto-detection fails
   - Minimum viable scan quality validation

2. **Generic 3D Model Catalog (8-12 Models)**
   - Limited set of optimized generic furniture models
   - Categories: Seating, Storage, Lighting, Decor, Study
   - High-performance 3D models optimized for mobile AR
   - Models represent furniture archetypes, not specific products

3. **Hybrid AR + Product Discovery**
   - Touch-to-place generic models on detected planes
   - Basic scale adjustment (small/medium/large presets)
   - Simple rotation (90-degree increments)
   - **Tap placed objects to discover real products**
   - Object removal functionality

4. **AI-Powered Product Discovery**
   - Tap any placed AR object to trigger product search
   - AI analyzes room context, budget, and style preferences
   - Real-time search across multiple retailer APIs
   - 5-10 ranked product suggestions with explanations
   - Actual product images, prices, and store links

5. **Real Product Purchase Flow**
   - Product detail view with real images and pricing
   - Multiple store options with price comparison
   - AI explanations for why products are recommended
   - Direct links to external retailers for purchase
   - Basic affiliate tracking (click tracking)

### 2. Simplified User Flow

```
┌─────────────────┐
│   App Launch    │
│                 │
│ [Get Started]   │
└─────┬───────────┘
      │
      ▼
┌─────────────────┐    ┌─────────────────┐
│  Quick Setup    │    │   Skip Setup    │
│                 │    │                 │
│ • Name          │ OR │ Use Demo Mode   │
│ • Budget Range  │    │                 │
│ • Style Quiz    │    │                 │
└─────┬───────────┘    └─────┬───────────┘
      │                      │
      └──────────┬───────────┘
                 │
                 ▼
┌─────────────────┐
│   Room Scan     │
│                 │
│ • Guided UI     │
│ • Plane Detection│
│ • Dimension Set │
└─────┬───────────┘
      │
      ▼
┌─────────────────┐
│  AR Placement   │
│                 │
│ • Browse Items  │
│ • Place Objects │
│ • Basic Editing │
└─────┬───────────┘
      │
      ▼
┌─────────────────┐
│  AI Assistant   │
│                 │
│ • Room Analysis │
│ • Recommendations│
│ • Chat Interface│
└─────┬───────────┘
      │
      ▼
┌─────────────────┐
│  Purchase Flow  │
│                 │
│ • Item Details  │
│ • Price/Store   │
│ • External Link │
└─────────────────┘
```

### 3. Monorepo Project Structure

```
roomait/
├── README.md
├── package.json (workspace root)
├── railway.json (deployment config)
├── .gitignore
├── .env.example
│
├── apps/
│   ├── mobile/                 # React Native + Expo
│   │   ├── package.json
│   │   ├── app.json
│   │   ├── babel.config.js
│   │   ├── src/
│   │   │   ├── screens/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── utils/
│   │   │   └── types/
│   │   └── assets/
│   │
│   └── backend/                # FastAPI
│       ├── pyproject.toml
│       ├── requirements.txt
│       ├── src/
│       │   ├── main.py
│       │   ├── models/
│       │   ├── routes/
│       │   ├── services/
│       │   └── utils/
│       └── migrations/
│
├── packages/                   # Shared code
│   ├── types/                  # TypeScript definitions
│   └── constants/              # Shared constants
│
├── data/                       # Static data
│   ├── generic-models.json     # Generic 3D model catalog
│   ├── models/                 # Generic 3D model files (.glb)
│   └── images/                 # Model thumbnails and UI assets
│
└── docs/                       # Documentation
    ├── projectscope.md
    ├── mvp.md
    ├── design.md
    └── deployment.md
```

### 4. Railway Deployment Strategy

**Separate Service Deployments:**
- **Mobile App**: Static build deployed to Railway Static Sites
- **Backend API**: FastAPI service on Railway with PostgreSQL
- **Assets**: 3D models and images on Railway static hosting

**Environment Configuration:**
```yaml
# railway.json
{
  "services": {
    "backend": {
      "source": "apps/backend",
      "buildCommand": "pip install -r requirements.txt",
      "startCommand": "uvicorn src.main:app --host 0.0.0.0 --port $PORT"
    },
    "mobile-build": {
      "source": "apps/mobile",
      "buildCommand": "expo build:web",
      "staticPublishPath": "dist"
    }
  }
}
```

### 5. Hybrid 3D Model + AI Product Strategy

**Limited 3D Models for AR Visualization (8-12 Generic Models):**

**Seating (2-3 models):**
- Generic desk chair model
- Generic bean bag/floor seating model
- Generic accent chair model

**Storage (2-3 models):**
- Generic shelf unit model
- Generic storage box/ottoman model
- Generic desk organizer model

**Lighting (2-3 models):**
- Generic desk lamp model
- Generic floor lamp model
- Generic string lights model

**Decor (2-3 models):**
- Generic wall art/frame model
- Generic plant model
- Generic mirror model

**AI-Powered Product Database (Unlimited via API):**
When users tap any 3D model in AR, the system queries AI for real product recommendations:

**Real Product Integration:**
- Live product data from Amazon, Wayfair, Target APIs
- AI-optimized search based on room context and user preferences
- Real prices, reviews, and purchase links
- Actual product images and specifications
- Dynamic inventory and availability

**3D Model Data Structure:**
```json
{
  "model_id": "generic-desk-chair",
  "category": "seating",
  "subcategory": "office-chair",
  "model_url": "/models/generic-desk-chair.glb",
  "thumbnail": "/images/generic-desk-chair-thumb.jpg",
  "display_name": "Desk Chair",
  "description": "Office and study seating",
  "typical_dimensions": {
    "width": 24,
    "depth": 26, 
    "height": 38,
    "units": "inches"
  }
}
```

**AI Product Search Query (when user taps model):**
```json
{
  "room_context": {
    "dimensions": "10x12 feet",
    "style_preference": "modern",
    "budget_range": "$50-100",
    "existing_items": ["bed", "desk"]
  },
  "selected_category": "seating",
  "subcategory": "office-chair",
  "search_intent": "desk chair for study",
  "filters": {
    "max_price": 100,
    "min_rating": 4.0,
    "student_friendly": true
  }
}
```

**AI Response with Real Products:**
```json
{
  "recommendations": [
    {
      "product_name": "IKEA Markus Office Chair",
      "price": 179,
      "sale_price": 149,
      "rating": 4.3,
      "review_count": 2847,
      "image_url": "https://ikea.com/...",
      "store": "IKEA",
      "affiliate_link": "https://...",
      "why_recommended": "Perfect size for your 10x12 room, highly rated for study sessions",
      "shipping": "Free pickup",
      "in_stock": true
    },
    {
      "product_name": "Amazon Basics Mesh Chair",
      "price": 89,
      "rating": 4.1,
      "review_count": 1203,
      "image_url": "https://amazon.com/...",
      "store": "Amazon",
      "affiliate_link": "https://...",
      "why_recommended": "Within your budget, breathable for long study sessions",
      "shipping": "Prime 1-day",
      "in_stock": true
    }
  ]
}
```

## MVP Limitations (Acknowledged Scope Cuts)

### Features Pushed to Post-MVP

**Advanced AR Features:**
- Multi-object selection and grouping
- Precise rotation and scaling controls
- Physics simulation (objects falling/colliding)
- Advanced lighting and shadow simulation
- Room measurement tools beyond basic dimensions

**AI Capabilities:**
- Full conversational AI with complex context
- Learning from user behavior over time
- Advanced style analysis and recommendations
- Seasonal or trend-based suggestions
- Multi-room design coordination

**Social Features:**
- User accounts with profile customization
- Room design sharing and collaboration
- Community features and user-generated content
- Reviews and ratings system
- Friend recommendations

**E-commerce Integration:**
- Real-time price comparison across stores
- Advanced affiliate tracking and attribution
- Shopping cart and wishlist functionality
- Price drop alerts and notifications
- Student discount integration

**Data and Analytics:**
- Comprehensive user behavior tracking
- A/B testing framework
- Advanced recommendation algorithms
- Performance analytics dashboard
- Business intelligence reporting

### Technical Compromises for Speed

**Database:**
- Simplified schema without full normalization
- Limited indexing (only critical queries)
- No database migrations during hackathon
- Basic error handling without retry logic

**Authentication:**
- Simple JWT implementation (no refresh tokens)
- Basic user model without full profile management
- No password reset or account recovery
- Limited session management

**Mobile Performance:**
- Basic 3D model optimization (not fully optimized)
- Limited error handling for AR failures
- No offline capability
- Basic caching strategy

**API Design:**
- Minimal validation on endpoints
- Basic error responses without detailed codes
- No rate limiting or security hardening
- Limited API documentation

### Dataset Limitations

**Generic 3D Models:**
- Only 8-12 generic furniture archetypes vs specific product models
- Low-poly models optimized for mobile AR performance
- Limited texture quality and material variations
- Basic collision detection shapes
- No brand-specific or detailed product representations

**Real Product Data:**
- Dependent on external API availability and rate limits
- Product data accuracy varies by retailer API quality
- Limited to stores with accessible APIs (Amazon, Wayfair, etc.)
- No real-time inventory verification for all products
- Basic affiliate tracking without advanced attribution

## Success Criteria

### MVP Demo Success Metrics

**Core Functionality (Must Work):**
1. **Room Scan Success Rate**: >80% successful scans in demo environment
2. **Generic Model Placement**: Ability to place and adjust 3+ generic models without crashes
3. **Product Discovery**: Tap-to-search functionality triggers real product results
4. **AI Response Time**: Real product recommendations appear within 5 seconds
5. **Purchase Flow**: Click-through to external stores works 100% of time
6. **Cross-Platform**: Works on both iOS and Android test devices

**Demo Performance Benchmarks:**
- App launch to room scan: <30 seconds
- Scan completion to first generic model placement: <15 seconds
- Generic model placement to real product discovery: <5 seconds
- AI product recommendation generation: <10 seconds
- Overall demo duration: 3-5 minutes for full journey

### User Experience Standards

**Usability Requirements:**
- Intuitive UI requiring no instruction for basic operations
- Clear visual feedback for all user actions
- Graceful error handling with helpful messages
- Accessible design following basic WCAG guidelines
- Responsive design for different screen sizes

**AR Experience Quality:**
- Stable object placement without jitter
- Objects appear correctly scaled in room context
- Lighting integration (objects don't look "pasted on")
- Smooth interaction with minimal latency

### Technical Performance Requirements

**Mobile Performance:**
- App startup time: <3 seconds
- Memory usage: <200MB during normal operation
- Battery drain: <10% for 10-minute session
- 3D model loading: <2 seconds per item

**Backend Performance:**
- API response time: <500ms for standard queries
- AI recommendation generation: <5 seconds
- Database query performance: <100ms for simple queries
- 99% uptime during demo period

**Data Accuracy:**
- Real product prices accurate within 10% of current store prices
- Generic 3D model dimensions represent typical furniture category sizes
- Store links functional and lead to correct product pages
- Room dimension calculation within 5% accuracy
- AI product recommendations relevant to placed generic model category

## MVP User Stories

### Primary User Journey: Emma (Freshman)

**Background:** Emma is a freshman who just moved into a dorm room. She has $75 to spend on making her space feel more like home and wants to buy the right things that will actually fit and look good together.

**User Story 1: Onboarding**
```
As Emma, I want to quickly set up the app with my basic preferences
So that I can get personalized recommendations without lengthy setup

Acceptance Criteria:
- Complete setup in under 2 minutes
- Simple style quiz (5 questions max)
- Budget range selection with student-friendly presets
- Option to skip setup and explore first
```

**User Story 2: Room Scanning**
```
As Emma, I want to scan my dorm room easily
So that I can see how furniture will look in my actual space

Acceptance Criteria:
- Clear visual guidance for scanning process
- Works in typical dorm lighting conditions
- Handles small/narrow dorm room dimensions
- Provides feedback if scan quality is poor
- Option to manually adjust room dimensions
```

**User Story 3: AR Visualization and Product Discovery**
```
As Emma, I want to place furniture models in my room and discover real products
So that I can visualize my space and find actual items to purchase

Acceptance Criteria:
- Browse generic 3D models by category (seating, storage, etc.)
- Place models with simple tap gesture in AR
- Models appear stable and properly sized
- Tap placed objects to see real product recommendations
- Filter real products by budget range ($0-75)
- Easy to remove or replace AR models
```

**User Story 4: AI Assistance**
```
As Emma, I want to get style advice and product recommendations
So that I can make confident purchasing decisions

Acceptance Criteria:
- Ask questions about room layout in plain English
- Get specific product recommendations based on room size
- Understand why certain items are recommended
- Receive budget-conscious suggestions
- Get style coordination advice
```

**User Story 5: Real Product Purchase Flow**
```
As Emma, I want to easily find and purchase actual products I've visualized
So that I can complete my room transformation with confidence

Acceptance Criteria:
- Tap AR objects to see real product recommendations with actual prices
- View product details, reviews, and multiple store options
- See AI explanation of why products are recommended for my space
- Click through to retailer without losing place in app
- Save specific products for later consideration
- Compare prices across different stores
```

### Edge Cases and Error Handling

**Scanning Edge Cases:**
1. **Poor Lighting**: App provides guidance and lighting tips
2. **Very Small Room**: Adjusts recommendation algorithm for space constraints
3. **Irregular Room Shape**: Allows manual boundary adjustment
4. **Scan Failure**: Provides fallback manual room setup option

**AR Performance Edge Cases:**
1. **Older Device**: Gracefully degrades to 2D preview mode
2. **AR Not Supported**: Falls back to room layout tool
3. **Tracking Lost**: Shows guidance to re-establish tracking
4. **Memory Issues**: Reduces model quality automatically

**Product and AI Edge Cases:**
1. **No Products in Budget**: Expands search or suggests similar items
2. **AI Service Down**: Falls back to rule-based recommendations
3. **External Store Link Broken**: Shows alternative store options
4. **No Internet**: Shows appropriate offline message

## Demo Strategy

### Hackathon Presentation Plan

**Demo Flow (4-5 minutes):**
1. **Hook (30 seconds)**: Show problem - student frustrated with furniture shopping
2. **Setup (30 seconds)**: Launch app, quick user setup
3. **Room Scan (60 seconds)**: Scan demonstration space, show room detection
4. **AR Magic (90 seconds)**: Place generic furniture models, show scale/fit
5. **Product Discovery (60 seconds)**: Tap placed objects, show real product recommendations
6. **Purchase Flow (30 seconds)**: Show real prices, click to external store
7. **Before/After (30 seconds)**: Show room transformation with real product options

**Key Demo Moments:**
- "Place a generic chair model to see if it fits your space"
- "Tap the placed chair to discover real products that match"
- "AI found 8 chairs under $100 perfect for your dorm room"
- "One tap to purchase from Amazon, IKEA, or Wayfair"
- "Transform your space with confidence - see first, then buy"

### Backup Plans for Technical Failures

**Primary Backup - Video Demo:**
- Pre-recorded demo video of full user journey
- Interactive slides for Q&A
- Live product placement on judge's device

**Secondary Backup - 2D Version:**
- Room layout tool with top-down view
- Product placement without AR
- AI recommendations still functional

**Tertiary Backup - Presentation Mode:**
- Slide deck with interactive mockups
- Product database browsing
- AI chat demonstration

### Data Needed for Compelling Demo

**Demo Environment Setup:**
- Well-lit demo space (conference room/booth)
- Multiple device types for testing (iOS/Android)
- Stable internet connection
- Power banks for extended demos

**Demo Room Configuration:**
- 10x12 foot space (typical dorm size)
- Minimal existing furniture
- Good lighting conditions
- Flat surfaces for plane detection

**Demo Product Selection:**
- 5-7 hero products that work well in demo space
- Range of price points to show budget filtering
- Different categories to show variety
- Products with compelling visual impact

**Demo Script Variations:**
- 2-minute elevator pitch version
- 5-minute detailed demo
- 10-minute technical deep-dive for technical judges
- Q&A preparation for common questions

### Success Metrics for Demo

**Audience Engagement:**
- Judges try the app themselves during demo
- Questions focused on implementation vs concept explanation
- Interest in technical architecture and scalability
- Discussion of business model and market opportunity

**Technical Demonstration:**
- Zero crashes during demo period
- Smooth AR performance on multiple devices
- Fast AI response times
- Successful purchase flow completion

**Feedback Quality:**
- Constructive technical feedback vs basic feature requests
- Questions about team background and experience
- Interest in post-hackathon development plans
- Networking opportunities with potential advisors/investors

This MVP specification provides a focused, achievable scope for the hackathon while establishing a clear foundation for post-hackathon growth and development.

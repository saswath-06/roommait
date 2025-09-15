# roomait - AR Interior Design for Students

**Version:** MVP Ready  
**Status:** Documentation Complete  
**Target:** Hackathon + Post-Launch Growth

## 🎯 Project Overview

roomait is an AR interior design app specifically built for college students. It combines **generic 3D models** for spatial planning with **AI-powered real product discovery** to help students visualize, design, and purchase furniture within their budget ($15-200).

### Key Innovation: Hybrid AR + AI Approach

Unlike traditional AR apps that require massive 3D product catalogs, roomait uses:

1. **8-12 generic 3D models** for fast AR visualization and spatial planning
2. **AI-powered product discovery** that finds real products from any store when users tap placed objects
3. **Contextual recommendations** based on room size, budget, and style preferences

## 📚 Documentation Structure

### 1. [projectscope.md](./projectscope.md) - Complete Project Foundation
- **Vision & Market Analysis**: Target college students, $13B market opportunity
- **Technical Architecture**: Full stack (React Native, FastAPI, PostgreSQL, OpenAI)
- **Feature Specifications**: Room scanning, hybrid AR/AI system, e-commerce integration  
- **Timeline & Resources**: 48-72 hour hackathon plan + 6-month roadmap
- **Risk Assessment**: Technical challenges and mitigation strategies

### 2. [mvp.md](./mvp.md) - Focused Hackathon Implementation
- **Core Features**: 8-12 generic models + AI product discovery system
- **User Stories**: Detailed journey for "Emma the Freshman" persona
- **Technical Scope**: Monorepo structure, Railway deployment, API integration
- **Demo Strategy**: 4-5 minute presentation plan with backup options
- **Success Metrics**: Measurable goals for hackathon and post-launch

### 3. [design.md](./design.md) - Comprehensive UI/UX Specifications
- **ASCII UI Mockups**: Complete app flow from onboarding to purchase
- **AR Interface Design**: Object placement, manipulation, and product discovery
- **Design System**: Colors, typography, components (NativeWind/Tailwind)
- **Technical Specs**: 3D model requirements, API endpoints, database schema
- **Accessibility**: WCAG compliance, mobile-first responsive design

## 🚀 Quick Start Guide

### Development Team Setup
```bash
# Clone and setup monorepo
git clone https://github.com/saswath-06/roommait.git
cd roomait
npm install

# Setup backend
cd apps/backend
pip install -r requirements.txt
uvicorn src.main:app --reload

# Setup mobile app
cd apps/mobile
expo start
```

### Key Files to Understand First
1. `projectscope.md` - Overall vision and technical architecture
2. `mvp.md` - What to build for hackathon demo
3. `design.md` - How it should look and work

## 🎨 Core User Experience

```
1. Student opens app → Quick 2-minute setup
2. Scans dorm room → AR plane detection
3. Places generic furniture models → Spatial planning
4. Taps placed objects → AI finds real products
5. Reviews recommendations → Price comparison across stores  
6. Clicks to purchase → External store (Amazon, IKEA, Wayfair)
```

## 🛠 Technical Architecture Summary

**Frontend:** React Native + Expo (AR capabilities)  
**Backend:** FastAPI + PostgreSQL + Redis  
**AI:** OpenAI GPT-4 for product discovery and recommendations  
**Deployment:** Railway (monorepo with separate mobile/backend services)  
**3D Models:** 8-12 generic GLB files (<3K polygons each)  
**Product Data:** Live APIs from Amazon, Wayfair, IKEA  

## 📊 Success Metrics

**Hackathon Demo:**
- ✅ Room scan success rate >80%
- ✅ Place 3+ generic models without crashes  
- ✅ Tap-to-discover shows real products <5 seconds
- ✅ Purchase flow to external store works 100%

**Post-Launch (Month 1):**
- 1,000+ app downloads
- 50+ room scans per week  
- 15%+ AR view to purchase click conversion
- 4.0+ app store rating

## 🎯 Target Market

**Primary Users:**
- College students (ages 18-25)
- Living in dorms, apartments, shared housing
- Budget: $15-200 per purchase
- Tech-savvy, mobile-first

**Market Opportunity:**
- 20+ million US college students
- $400-800 annual spending on room decor
- $13 billion college housing market
- Growing AR adoption in retail

## 💡 Business Model

**Revenue Streams:**
- Affiliate commissions from retailer partnerships
- Premium AI features (advanced recommendations)
- University partnership programs
- Student discount marketplace integration

## 🔄 Development Phases

### Phase 1: Hackathon MVP (48-72 hours)
- Basic room scanning
- 8-12 generic 3D models  
- AI product discovery
- External store integration
- Demo-ready user flow

### Phase 2: Enhancement (Months 1-2)  
- Improved AR features
- Expanded retailer partnerships
- Advanced AI recommendations
- User onboarding optimization

### Phase 3: Growth (Months 3-6)
- Social features (sharing, community)
- Multi-room planning
- University partnerships
- Advanced analytics and optimization

## 📞 Next Steps

1. **For Developers**: Start with `mvp.md` for implementation roadmap
2. **For Designers**: Review `design.md` for UI/UX specifications  
3. **For Product**: Use `projectscope.md` for feature planning
4. **For Demo**: Follow demo strategy in `mvp.md`

---

**Built for Hackathon Success** 🏆  
This documentation provides everything needed to build roomait from concept to deployment, with clear specifications for both hackathon MVP and long-term growth.

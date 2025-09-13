# RoomGenie - Design Documentation

## ASCII UI Mockups

### App Navigation Structure

```
RoomGenie App Structure:
┌─────────────────────────────────────┐
│              RoomGenie              │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────┬─────────┬─────────┐    │
│  │  Scan   │   AR    │ Profile │    │
│  │  Room   │ Design  │ & Help  │    │
│  └─────────┴─────────┴─────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │     Active Room Design      │    │
│  │                             │    │
│  │  ┌─────────┬─────────────┐  │    │
│  │  │   3D    │  Chat with  │  │    │
│  │  │   AR    │   AI Guide  │  │    │
│  │  │  View   │             │  │    │
│  │  └─────────┴─────────────┘  │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │      Product Catalog        │    │
│  │   ┌─────┬─────┬─────┬─────┐ │    │
│  │   │Seat │Store│Light│Decor│ │    │
│  │   └─────┴─────┴─────┴─────┘ │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

### 1. Onboarding Flow Screens

**Welcome Screen:**
```
┌─────────────────────────────────────┐
│              RoomGenie              │
│                 🏠                   │
│                                     │
│        Transform Your Space         │
│         with AR + AI Magic          │
│                                     │
│  ┌─────────────────────────────┐    │
│  │                             │    │
│  │    [Scan & Visualize]       │    │
│  │    [AI Recommendations]     │    │
│  │    [Shop with Confidence]   │    │
│  │                             │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │        Get Started          │    │
│  └─────────────────────────────┘    │
│                                     │
│           Skip for now              │
└─────────────────────────────────────┘
```

**Quick Setup Screen:**
```
┌─────────────────────────────────────┐
│              ← Back                 │
│                                     │
│         Let's personalize!          │
│                                     │
│  What's your budget range?          │
│  ┌─────┬─────┬─────┬─────┬─────┐    │
│  │$15-│$50-│$100-│$150-│I'll │    │
│  │$50 │$100│$150 │$200+│set  │    │
│  │    │    │     │     │later│    │
│  └─────┴─────┴─────┴─────┴─────┘    │
│                                     │
│  What's your style?                 │
│  ┌─────────────┬─────────────┐      │
│  │  🌿 Boho    │  ⭐ Modern  │      │
│  │  Relaxed    │  Clean      │      │
│  └─────────────┴─────────────┘      │
│  ┌─────────────┬─────────────┐      │
│  │  🎨 Colorful│  🖤 Minimal │      │
│  │  Vibrant    │  Simple     │      │
│  └─────────────┴─────────────┘      │
│                                     │
│  ┌─────────────────────────────┐    │
│  │           Continue          │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

### 2. Room Scanning Interface

**Scanning Tutorial:**
```
┌─────────────────────────────────────┐
│  📷         Room Scan               │
│                                     │
│  ┌─────────────────────────────┐    │
│  │                             │    │
│  │    📱 Hold phone upright    │    │
│  │    👀 Look for flat floor   │    │
│  │    🔄 Move slowly around    │    │
│  │       room edges            │    │
│  │                             │    │
│  └─────────────────────────────┘    │
│                                     │
│         Tip: Good lighting          │
│           makes scanning            │
│             much easier!            │
│                                     │
│  ┌─────────────────────────────┐    │
│  │        Start Scanning       │    │
│  └─────────────────────────────┘    │
│                                     │
│           Skip to manual            │
└─────────────────────────────────────┘
```

**Active Scanning Screen:**
```
┌─────────────────────────────────────┐
│  ✕         Scanning...              │
│                                     │
│  ┌─────────────────────────────┐    │
│  │                             │    │
│  │        📷 Camera View       │    │
│  │                             │    │
│  │  ┌─────────────────────┐    │    │
│  │  │ ░░░░░░░░░░░░░░░░░░░ │    │    │
│  │  │ Floor Detected ✓    │    │    │
│  │  └─────────────────────┘    │    │
│  │                             │    │
│  │    👆 Tap detected floor    │    │
│  └─────────────────────────────┘    │
│                                     │
│     Scanning Progress: ████▒▒       │
│            65% Complete             │
│                                     │
│  ┌─────────────────────────────┐    │
│  │       Stop & Review         │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

### 3. AR Design Interface

**Main AR View:**
```
┌─────────────────────────────────────┐
│  ≡  Room Design       💬  🛒  ⚙   │
│                                     │
│  ┌─────────────────────────────┐    │
│  │                             │    │
│  │       🏠 AR Camera View     │    │
│  │                             │    │
│  │     ┌─────┐    ┌─────┐      │    │
│  │     │Chair│    │Desk │      │    │
│  │     │Model│    │Model│      │    │
│  │     └─────┘    └─────┘      │    │
│  │          ┌─────────┐        │    │
│  │          │   Rug   │        │    │
│  │          │  Model  │        │    │
│  │          └─────────┘        │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────┬─────┬─────┬─────┬─────┐    │
│  │Seat │Store│Light│Decor│More │    │
│  └─────┴─────┴─────┴─────┴─────┘    │
│                                     │
│   👆 Tap any object for real prices │
└─────────────────────────────────────┘
```

**Generic Model Placement Toolbar:**
```
┌─────────────────────────────────────┐
│  Selected: Generic Chair Model      │
│                                     │
│  ┌─────────────────────────────┐    │
│  │        🪑 Preview           │    │
│  │                             │    │
│  │      Generic Office Chair   │    │
│  │      (24"W x 26"D x 38"H)   │    │
│  │   Tap after placing for     │    │
│  │      real products!         │    │
│  └─────────────────────────────┘    │
│                                     │
│  Size:  ⚪ Small  🔵 Medium  ⚪ Large │
│                                     │
│  ┌─────┬─────┬─────┬─────┬─────┐    │
│  │Place│Rotate│Move│Delete│Find│    │
│  │     │     │     │     │Real│    │
│  └─────┴─────┴─────┴─────┴─────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │       Place in Room         │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

### 4. Chat Interface Integration

**Chat Drawer (Slide-up):**
```
┌─────────────────────────────────────┐
│  💬 AI Designer    ⚙ Settings  ✕   │
│  ─────────────────────────────────  │
│                                     │
│  🤖 AI: I see you've placed generic │
│      desk and chair models! The    │
│      proportions look great for     │
│      your 10x12 space. Tap the     │
│      models to discover real        │
│      products, or ask me for tips!  │
│                                     │
│           💡 Find lighting models   │
│           📚 Add storage models     │
│           🎨 Suggest decor models   │
│                                     │
│  👤 You: This feels a bit empty     │
│                                     │
│  🤖 AI: Perfect! Try placing these  │
│      models, then tap for products: │
│      • String light model          │
│      • Plant model                 │
│      • Wall art model              │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ Ask anything about your room... │
│  │                         [>] │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

### 5. Product Catalog Screens

**3D Model Browser (for AR placement):**
```
┌─────────────────────────────────────┐
│  ← AR View     Browse 3D Models     │
│                                     │
│  📱 Place models, tap for products  │
│                                     │
│  ┌─────┬─────┬─────┬─────┬─────┐    │
│  │ All │Seat │Store│Light│Decor│    │
│  └─────┴─────┴─────┴─────┴─────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  🪑        🗄️        💡     │    │
│  │ Chair      Shelf     Desk    │    │
│  │ Model      Model     Lamp    │    │
│  │ Generic    Generic   Model   │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  🪴        🖼️        ✨     │    │
│  │ Plant      Wall      String  │    │
│  │ Model      Art       Light   │    │
│  │ Generic    Model     Model   │    │
│  └─────────────────────────────┘    │
│                                     │
│    Tap any model to place in room   │
│   Then tap placed object for real   │
│          product options!           │
└─────────────────────────────────────┘
```

**AI Product Recommendations (from tapping AR object):**
```
┌─────────────────────────────────────┐
│  ← Back to AR    💬 Ask AI  ❤️ Save │
│                                     │
│  🤖 AI found 8 chairs for your room │
│     Based on your $50-100 budget    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  🏆 Top Pick                │    │
│  │  ┌─────┬─────────────────┐  │    │
│  │  │ 📷  │ IKEA Markus     │  │    │
│  │  │Chair│ ⭐ 4.3 (2.8k)   │  │    │
│  │  │     │ $149 (was $179) │  │    │
│  │  └─────┴─────────────────┘  │    │
│  │  "Perfect for your 10x12    │    │
│  │   room size" - AI           │    │
│  │  🏪 IKEA • 📦 Free pickup   │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  💰 Best Value              │    │
│  │  ┌─────┬─────────────────┐  │    │
│  │  │ 📷  │ Amazon Basics   │  │    │
│  │  │Chair│ ⭐ 4.1 (1.2k)   │  │    │
│  │  │     │ $89             │  │    │
│  │  └─────┴─────────────────┘  │    │
│  │  "Breathable for long       │    │
│  │   study sessions" - AI      │    │
│  │  🏪 Amazon • 📦 Prime 1-day │    │
│  └─────────────────────────────┘    │
│                                     │
│       View all 8 results →         │
└─────────────────────────────────────┘
```

## UX Flow Diagrams

### Complete User Journey Flow

```
App Launch
    │
    ▼
┌─────────────┐    Skip    ┌─────────────┐
│  Welcome    │─────────→ │   Main      │
│   Screen    │            │   Menu      │
└──────┬──────┘            └─────────────┘
       │ Get Started              │
       ▼                          │
┌─────────────┐                   │
│  Quick      │                   │
│  Setup      │                   │
└──────┬──────┘                   │
       │                          │
       ▼                          │
┌─────────────┐    Manual    ┌────▼──────┐
│  Scan Room  │─────────────→│  Room     │
│  (AR Guide) │              │  Setup    │
└──────┬──────┘              └───────────┘
       │ Scan Complete              │
       ▼                           │
┌─────────────┐                    │
│  Scan       │                    │
│  Review     │                    │
└──────┬──────┘                    │
       │ Looks Good               │
       ▼                          │
┌─────────────┐◀──────────────────┘
│   AR Room   │
│   Design    │
└──────┬──────┘
       │
       ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Browse    │    │    Chat     │    │  Purchase   │
│  Products   │◀──▶│ with AI     │    │    Flow     │
│             │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                  │
       ▼                   ▼                  ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Place      │    │   Get       │    │  External   │
│  Objects    │    │ Recommend.  │    │   Store     │
│             │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
```

### AR Object Placement & Product Discovery Flow

```
User Selects Generic 3D Model
         │
         ▼
┌─────────────────┐
│   Generic Model │
│   Preview       │
│   (Chair/Desk)  │
└─────┬───────────┘
      │ "Place in Room"
      ▼
┌─────────────────┐
│   Switch to     │
│   AR Camera     │
└─────┬───────────┘
      │
      ▼
┌─────────────────┐    No Planes    ┌─────────────────┐
│   Plane         │─────────────────▶│   Guidance      │
│   Detection     │                  │   Screen        │
└─────┬───────────┘                  │   "Move phone   │
      │ Planes Found                 │    around"      │
      ▼                              └─────────────────┘
┌─────────────────┐
│   Show Generic  │
│   Object Preview│
└─────┬───────────┘
      │ User Taps Plane
      ▼
┌─────────────────┐
│   Place Generic │
│   Object in AR  │
└─────┬───────────┘
      │
      ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Manipulation  │    │   Object        │    │   User Taps     │
│   Tools Appear  │───▶│   Editing       │───▶│   Object for    │
│   (Move/Rotate/ │    │   (Gestures)    │    │   Products      │
│    Scale)       │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────┬───────────┘
                                                      │
                                                      ▼
                                            ┌─────────────────┐
                                            │   AI Product    │
                                            │   Search API    │
                                            │   Call          │
                                            └─────┬───────────┘
                                                  │
                                                  ▼
                                            ┌─────────────────┐
                                            │   Real Product  │
                                            │   Recommendations│
                                            │   Screen        │
                                            └─────────────────┘
```

### Chat Integration During AR Experience

```
User in AR Mode
       │
       ▼
┌─────────────────┐     ┌─────────────────┐
│   Room with     │     │   Chat Icon     │
│   Placed        │────▶│   Floating      │
│   Objects       │     │   on Screen     │
└─────────────────┘     └─────┬───────────┘
                              │ User Taps
                              ▼
                    ┌─────────────────┐
                    │   Chat Drawer   │
                    │   Slides Up     │
                    │   (50% screen)  │
                    └─────┬───────────┘
                          │
                          ▼
   ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
   │   AI Analyzes   │    │   User Types    │    │   AI Provides   │
   │   Current Room  │◀───│   Question/     │───▶│   Contextual    │
   │   State         │    │   Request       │    │   Response      │
   └─────────────────┘    └─────────────────┘    └─────┬───────────┘
                                                       │
                                                       ▼
                                            ┌─────────────────┐
                                            │   Action        │
                                            │   Buttons:      │
                                            │   - Show Items  │
                                            │   - Add to Room │
                                            │   - More Info   │
                                            └─────────────────┘
```

### Purchase Flow from AR (Updated)

```
User Taps Generic Object in AR
         │
         ▼
┌─────────────────┐
│   AI Product    │
│   Search Query  │
│   Based on Room │
│   Context       │
└─────┬───────────┘
      │
      ▼
┌─────────────────┐
│   AI Returns    │
│   Real Products │
│   with Prices   │
│   & Reviews     │
└─────┬───────────┘
      │ User Selects Product
      ▼
┌─────────────────┐
│   Product       │
│   Detail View   │
│   • Real Images │
│   • Store Options│
│   • AI Reasoning│
└─────┬───────────┘
      │ "Buy at [Store]"
      ▼
┌─────────────────┐    Analytics    ┌─────────────────┐
│   Track Click   │─────────────────▶│   External      │
│   (Attribution) │                  │   Store Opens   │
└─────────────────┘                  │   (Amazon/IKEA) │
                                     └─────┬───────────┘
                                           │
                                           ▼
                                    ┌─────────────────┐
                                    │   User          │
                                    │   Completes     │
                                    │   Purchase      │
                                    │   (Outside App) │
                                    └─────────────────┘
```

## Design System

### Color Palette

**Primary Colors:**
```
Brand Purple:     #8B5CF6 (Primary actions, accent)
Deep Purple:      #6D28D9 (Headers, emphasis)
Light Purple:     #DDD6FE (Backgrounds, highlights)

Neutral Grays:
Dark Gray:        #374151 (Text, UI elements)
Medium Gray:      #6B7280 (Secondary text)
Light Gray:       #F3F4F6 (Backgrounds)
White:            #FFFFFF (Cards, overlays)

Functional Colors:
Success Green:    #10B981 (Confirmations, success states)
Warning Orange:   #F59E0B (Alerts, warnings)
Error Red:        #EF4444 (Errors, destructive actions)
Info Blue:        #3B82F6 (Information, links)
```

### Typography Hierarchy

**Font System (Using System Fonts):**
```
Heading 1:        32px, Bold,    Letter-spacing: -0.5px
Heading 2:        28px, Bold,    Letter-spacing: -0.25px
Heading 3:        24px, SemiBold, Letter-spacing: 0px
Heading 4:        20px, SemiBold, Letter-spacing: 0px

Body Large:       18px, Regular,  Line-height: 1.5
Body Regular:     16px, Regular,  Line-height: 1.5
Body Small:       14px, Regular,  Line-height: 1.4

Label Large:      16px, Medium,   Letter-spacing: 0.25px
Label Regular:    14px, Medium,   Letter-spacing: 0.25px
Label Small:      12px, Medium,   Letter-spacing: 0.5px

Caption:          12px, Regular,  Letter-spacing: 0.25px
```

### Component Library (NativeWind/Tailwind)

**Button Components:**
```jsx
// Primary Button
className="bg-purple-600 px-6 py-3 rounded-xl text-white font-semibold 
          shadow-lg active:bg-purple-700"

// Secondary Button  
className="border-2 border-purple-600 px-6 py-3 rounded-xl 
          text-purple-600 font-semibold"

// Ghost Button
className="px-6 py-3 rounded-xl text-purple-600 font-semibold"

// Small Button
className="bg-purple-600 px-4 py-2 rounded-lg text-white font-medium text-sm"
```

**Card Components:**
```jsx
// Standard Card
className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"

// Product Card
className="bg-white rounded-xl shadow-sm border border-gray-100 p-3
          active:shadow-md transition-shadow"

// Info Card
className="bg-purple-50 rounded-xl border border-purple-200 p-4"
```

**Input Components:**
```jsx
// Text Input
className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900
          focus:border-purple-600 focus:ring-purple-600"

// Search Input
className="bg-gray-100 rounded-full px-4 py-3 text-gray-900
          placeholder-gray-500"
```

### Accessibility Considerations

**Color Contrast:**
- All text meets WCAG AA standards (4.5:1 ratio minimum)
- Interactive elements have 3:1 contrast minimum
- Color is never the only indicator of state/meaning

**Touch Targets:**
- Minimum 44x44pt touch targets for all interactive elements
- Adequate spacing between touch targets (8pt minimum)
- Clear visual feedback for all touch interactions

**Screen Reader Support:**
- Semantic HTML structure for web components
- Proper accessibility labels for React Native components
- Clear focus indicators for keyboard navigation
- Descriptive text for AR elements and 3D objects

**Motor Accessibility:**
- Single-tap actions preferred over complex gestures
- Alternative input methods for AR manipulation
- Undo/redo functionality for all placement actions
- Voice input support for chat interface

## AR Interface Design

### AR Overlay UI Positioning

```
┌─────────────────────────────────────┐
│ [≡] RoomGenie    [💬] [🛒] [⚙]    │ ← Top Bar (Safe Area)
├─────────────────────────────────────┤
│                                     │
│                                     │ ← AR Camera View
│         🏠 3D Room Space            │   (Full Screen)
│                                     │
│     [Object] [Object] [Object]      │
│                                     │
│                                     │
│                                     │
├─────────────────────────────────────┤
│ [Seat] [Store] [Light] [Decor] [+]  │ ← Category Toolbar
├─────────────────────────────────────┤
│ Total: $284  |  💡 Get AI tips     │ ← Bottom Info Bar
└─────────────────────────────────────┘
```

**UI Layer Hierarchy:**
1. **Background**: AR Camera feed
2. **3D Layer**: Placed furniture objects with AR tracking
3. **AR UI Layer**: Object labels, prices, selection indicators
4. **Overlay Layer**: Semi-transparent navigation and tools
5. **Modal Layer**: Chat drawer, product details, settings

### Visual Feedback Systems

**Object Placement States:**
```
Ghost Object (Preview):
┌─────────────┐
│ ░░░░░░░░░░░ │  ← Semi-transparent with dotted outline
│ ░ CHAIR  ░  │
│ ░░░░░░░░░░░ │
└─────────────┘

Placed Object (Normal):
┌─────────────┐
│ █████████   │  ← Solid with subtle shadow
│ █ CHAIR █   │
│ █████████   │
└─────────────┘

Selected Object (Editing):
┌─────────────┐
│ ■■■■■■■■■   │  ← Highlighted border with handles
│ ■ CHAIR ■   │
│ ■■■■■■■■■   │  
└─────────────┘
    │ │ │
   Resize Handles
```

**Plane Detection Visualization:**
```
Floor Plane Detected:
┌─────────────────────────────────────┐
│                                     │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │ ← Subtle grid overlay
│  ▓                             ▓  │   on detected surface
│  ▓     ✓ Floor Detected        ▓  │
│  ▓     Tap to place object     ▓  │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
│                                     │
└─────────────────────────────────────┘
```

### Room Boundary Visualization

**Room Perimeter Display:**
```
┌─────────────────────────────────────┐
│                                     │
│  ┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐   │ ← Dashed line outline
│  │                             │   │   showing room bounds
│  │         Room Space          │   │
│  │                             │   │
│  │         10' x 12'           │   │ ← Dimensions display
│  │                             │   │
│  └─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘   │
│                                     │
└─────────────────────────────────────┘
```

### Object Selection and Manipulation UI

**Object Interaction Controls:**
```
Selected Object with Controls:

        🔄 Rotate
         │
    🔍 Scale───●───[Chair]───●───🔍 Scale
         │                 │
    ✋ Move              📋 Info
         │
      ❌ Delete

Touch Gestures:
• Single Tap: Select/Deselect
• Drag: Move object
• Pinch: Scale object
• Rotate: Two-finger rotation
• Long Press: Context menu
```

## Technical Design Specs

### Generic 3D Model Requirements

**File Format & Performance:**
- File format: GLB (optimized for mobile AR)
- Polygon count: <3,000 polygons per model (performance optimized)
- Texture resolution: 256x256px maximum (lightweight)
- Model dimensions: Representative of furniture category averages
- Compression: Draco geometry compression enabled
- Total models: 8-12 generic furniture archetypes

**Model Categories:**
```
Seating: generic-chair, generic-bean-bag, generic-stool
Storage: generic-shelf, generic-dresser, generic-organizer  
Lighting: generic-desk-lamp, generic-floor-lamp, generic-string-lights
Decor: generic-plant, generic-wall-art, generic-mirror
```

### Real Product Discovery Integration

**API Performance Specs:**
- Product search response time: <3 seconds
- AI recommendation processing: <5 seconds
- Product image resolution: 400x400px minimum
- Store API integration: Amazon Product API, Wayfair API, IKEA API
- Affiliate tracking: UTM parameters and click attribution
- Price accuracy: Updated within 24 hours via scheduled API calls

**Product Data Structure:**
```json
{
  "search_id": "uuid",
  "generic_model_category": "seating",
  "room_context": {...},
  "products": [
    {
      "name": "IKEA Markus Office Chair",
      "price": 149,
      "image_url": "https://...",
      "store": "IKEA",
      "affiliate_link": "https://...",
      "ai_reasoning": "Perfect size for your room..."
    }
  ]
}
```

### AR Performance Specifications

**Mobile AR Requirements:**
- Target frame rate: 30 FPS minimum
- Plane detection: Floor and vertical surfaces
- Lighting estimation: Basic ambient lighting integration
- Occlusion: Basic depth-based occlusion
- Device compatibility: iOS 11+ (ARKit), Android 7+ (ARCore)
- Memory usage: <150MB for AR session

### Database Entity Relationships

```sql
-- Generic 3D Models for AR
CREATE TABLE generic_models (
    id UUID PRIMARY KEY,
    model_name VARCHAR NOT NULL,
    category VARCHAR NOT NULL,
    subcategory VARCHAR,
    model_url VARCHAR NOT NULL,
    thumbnail_url VARCHAR,
    typical_dimensions JSONB,
    file_size_kb INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Product Discovery Sessions
CREATE TABLE product_searches (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    generic_model_id UUID REFERENCES generic_models(id),
    search_context JSONB NOT NULL,
    ai_recommendations JSONB,
    selected_products JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    session_id UUID
);

-- Room Layout with Generic Models
CREATE TABLE room_designs (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    room_id UUID REFERENCES rooms(id),
    name VARCHAR DEFAULT 'My Design',
    placed_models JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User Preferences for AI
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    budget_range JSONB,
    style_preferences JSONB,
    room_type VARCHAR,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### API Endpoint Structure

**Core AR & Model Endpoints:**
```
GET  /api/v1/models                     # Get all generic models
GET  /api/v1/models?category=seating    # Filter by category
POST /api/v1/rooms/{id}/designs         # Save room design
PUT  /api/v1/designs/{id}/models        # Update placed models
```

**Product Discovery Endpoints:**
```
POST /api/v1/discover-products          # AI product search
GET  /api/v1/search-results/{search_id} # Get search results
POST /api/v1/track-click               # Affiliate click tracking
```

**AI & Chat Endpoints:**
```
POST /api/v1/ai/recommendations         # Get AI advice
POST /api/v1/ai/chat                   # Chat interface
GET  /api/v1/ai/context/{room_id}      # Get room context
```

### Responsive Design Breakpoints

**Mobile-First Design System:**
```css
/* Small phones */
@media (max-width: 375px) { ... }

/* Standard phones */
@media (min-width: 376px) and (max-width: 414px) { ... }

/* Large phones/small tablets */
@media (min-width: 415px) and (max-width: 768px) { ... }

/* Tablets (landscape AR experience) */
@media (min-width: 769px) { ... }
```

**AR Interface Adaptations:**
- Portrait mode: Full-screen AR with bottom toolbar
- Landscape mode: AR view with side panel for models
- Small screens: Collapsible UI elements
- Large screens: Picture-in-picture product discovery

This comprehensive design documentation provides all the visual, technical, and architectural specifications needed to build RoomGenie's hybrid AR visualization and AI-powered product discovery experience, optimized for college students' needs and mobile device constraints.

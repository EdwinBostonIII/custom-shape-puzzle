# INTERLOCK - Product Requirements Document

## Vision Statement

INTERLOCK is a relationship intelligence platform that helps couples and best friends architect and express the story of their connection through premium physical artifacts. Our flagship product is the **Narrative Puzzle** — a custom wooden jigsaw where each of the 5-15 chosen shapes repeats throughout the puzzle, and hint cards replace the reference photo to make assembly an emotional journey.

---

## Product Tiers

| Tier | Pieces | Shapes | Price | Target Margin |
|------|--------|--------|-------|---------------|
| **Essential** | 50 | 5 | $45 | 72% |
| **Classic** (Hero) | 100 | 7 | $69 | 75% |
| **Grand** | 150 | 10 | $99 | 77% |
| **Heirloom** | 250 | 15 | $159 | 78% |

Each shape repeats proportionally across the puzzle (e.g., Essential = 10 pieces per shape, Classic ≈ 14 pieces per shape).

---

## Core User Flows

### Flow 1: Solo Creation
1. **Tier Selection** → Choose puzzle size (Essential/Classic/Grand/Heirloom)
2. **Shape Selection** → Pick shapes based on tier limit
3. **Memory Engine** → Add milestones, inside jokes, symbols (optional)
4. **Image Choice** → Photo upload OR Comfy Colors
5. **Hint Card Builder** → Create prompts that replace reference photo
6. **Preview & Checkout** → Review puzzle, add packaging upgrades
7. **Confirmation** → Order summary with production timeline

### Flow 2: Couples/BFFs Collaboration
1. **Person A**: Selects tier → picks HALF the shapes → adds meanings → generates shareable link
2. **Person B**: Opens link → sees remaining shapes (A's choices removed) → picks their half → adds meanings
3. **Merge**: System combines both selections → both can contribute to Memory Engine
4. **Continue**: Photo/Colors → Hint Cards → Checkout

---

## Memory Engine (Layer 1)

The Memory Engine stores relationship data that powers hint card suggestions and future product personalization.

### Data Categories

#### Milestones Registry
```typescript
interface Milestone {
  id: string
  date: string           // "2019-06-15"
  title: string          // "First Date"
  description?: string   // "Coffee at Blue Bottle"
  category: 'first' | 'anniversary' | 'travel' | 'home' | 'achievement' | 'other'
}
```

#### Inside Jokes Registry
```typescript
interface InsideJoke {
  id: string
  phrase: string         // "That's so fetch"
  origin?: string        // "Movie night, March 2020"
  tags?: string[]        // ["movies", "humor"]
}
```

#### Shared Symbols Library
```typescript
interface SharedSymbol {
  id: string
  shapeId: ShapeType     // Links to puzzle shape
  meaning: string        // "The turtle = our slow morning walks"
  dateAdded: string
}
```

---

## Hint Card System

Hint cards replace the reference photo, transforming puzzle assembly into an emotional scavenger hunt.

### Card Structure
- **3-6 cards** per puzzle (based on tier)
- Each card has **multiple prompts** that describe a section
- Prompts are emotional, not spatial ("pieces that remind you of our first apartment")

### Builder Interface
```typescript
interface HintCard {
  id: string
  title: string                    // "Our Beginning"
  prompts: HintPrompt[]
  shapesReferenced?: ShapeType[]   // Which shapes this card hints at
}

interface HintPrompt {
  type: 'fill-in-blank' | 'memory' | 'emotion' | 'location'
  template: string                 // "The place where we ____"
  userInput: string                // "first said I love you"
  characterLimit: number           // 50-100 chars
}
```

### Streaming Examples (Live in Builder)
When user focuses a prompt field, stream example completions:
- "first met" → "had our first fight" → "realized we were meant to be"
- "you make me feel ____" → "safe" → "understood" → "home"

---

## Image Options

### Option A: Photo Upload
- Accept JPG/PNG/WEBP, max 20MB
- AI face detection for quality warnings
- Crop/zoom interface
- Preview on puzzle shape

### Option B: Comfy Colors
Curated muted/earthy palette where each shape type gets ONE consistent color.

```typescript
const COMFY_PALETTE = [
  { name: 'Sage', hex: '#9CAF88' },
  { name: 'Terracotta', hex: '#C67B5C' },
  { name: 'Dusty Blue', hex: '#8BA5B5' },
  { name: 'Warm Sand', hex: '#D4C4A8' },
  { name: 'Soft Plum', hex: '#9B8AA3' },
  { name: 'Forest', hex: '#4A5D4A' },
  { name: 'Clay', hex: '#B5846B' },
  { name: 'Mist', hex: '#B8C4C4' },
  { name: 'Honey', hex: '#D4A854' },
  { name: 'Charcoal', hex: '#4A4A4A' },
  // 15 total for Heirloom tier
]
```

### Premium Upgrade: Wood Stains (+$15)
- Natural Birch
- Honey Oak  
- Walnut
- Ebony
- Gray Wash
- White Wash

---

## Packaging Options

### Standard (Included)
- Kraft box with sleeve
- Protective tissue
- Care instructions

### Premium Box (+$12)
- Magnetic closure rigid box
- Velvet-touch lining
- Puzzle assembly mat

### Wax Seal (+$5)
- Hand-stamped wax seal on ribbon
- Color options: Gold, Burgundy, Forest, Navy

### Box Patterns (Free Choice)
- Solid (default)
- Constellation
- Botanical line art
- Geometric minimal
- Custom initials (coming soon)

---

## Technical Architecture

### State Management
```typescript
interface PuzzleSession {
  id: string
  
  // Tier & Shapes
  tier: 'essential' | 'classic' | 'grand' | 'heirloom'
  selectedShapes: ShapeType[]
  shapeMeanings?: Record<ShapeType, string>
  
  // Collaboration
  isCollaborative: boolean
  collaboratorId?: string
  personAShapes?: ShapeType[]
  personBShapes?: ShapeType[]
  shareLink?: string
  
  // Memory Engine
  milestones: Milestone[]
  insideJokes: InsideJoke[]
  sharedSymbols: SharedSymbol[]
  
  // Image
  imageChoice: 'photo' | 'comfy-colors'
  photoUrl?: string
  colorAssignments?: Record<ShapeType, string>
  
  // Hint Cards
  hintCards: HintCard[]
  
  // Packaging
  packaging: {
    box: 'standard' | 'premium'
    waxSeal: boolean
    waxColor?: string
    pattern: string
  }
  
  // Pricing
  basePrice: number
  upgrades: number
  total: number
  
  // Meta
  createdAt: number
  updatedAt: number
}
```

### Component Hierarchy
```
App.tsx
├── TierSelection.tsx          # NEW: Choose puzzle size
├── ShapeSelection.tsx         # UPDATED: Tier-aware limits
├── CollaborationFlow.tsx      # NEW: A→B handoff
├── MemoryEngine.tsx           # NEW: Milestones/jokes/symbols
├── ImageChoice.tsx            # UPDATED: Photo or ComfyColors
├── HintCardBuilder.tsx        # NEW: Prompt builder with streaming
├── PackagingSelection.tsx     # NEW: Box/seal/pattern
├── PuzzlePreview.tsx          # UPDATED: 3D-ish wooden render
├── Checkout.tsx               # UPDATED: Tiered pricing
└── OrderConfirmation.tsx
```

---

## API Endpoints (Future)

```
POST /api/session              # Create new session
GET  /api/session/:id          # Get session (for collaboration)
PUT  /api/session/:id          # Update session
POST /api/session/:id/share    # Generate share link
POST /api/upload               # Photo upload
POST /api/checkout             # Stripe checkout
POST /api/hints/suggest        # AI hint suggestions (future)
```

---

## Production Specifications

### Materials
- 3mm Baltic Birch plywood
- Laser-cut precision
- Food-safe finish (for stains)
- Traditional interlocking tabs (not magnetic)

### Timeline
- Production: 10-14 business days
- Shipping: 2-5 business days (US)
- International: 7-14 business days

### Quality Checks
- Piece fit tolerance: ±0.2mm
- Finish inspection
- Packaging integrity
- Photo reproduction accuracy

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Conversion Rate | 3.5% |
| Average Order Value | $85 |
| Cart Abandonment | <60% |
| NPS | >70 |
| Repeat Purchase | 25% within 12mo |
| LTV:CAC | 10:1 |

---

## Phase 1 Scope (MVP)

### Included
- [x] All 4 puzzle tiers with dynamic pricing
- [x] Shape selection with tier-based limits
- [x] Solo and Couples/BFFs collaboration flows
- [x] Full Memory Engine (milestones, jokes, symbols)
- [x] Photo upload with cropping
- [x] Comfy Colors palette
- [x] Hint Card Builder with prompts
- [x] Packaging selection (box, seal, pattern)
- [x] Stripe checkout integration
- [x] Order confirmation with timeline
- [x] Session persistence (localStorage)
- [x] Mobile-responsive design

### Deferred
- [ ] AI hint suggestions (streaming)
- [ ] Anniversary/occasion reminders
- [ ] User accounts & order history
- [ ] Memory Book product
- [ ] Coordinates Collection
- [ ] Sound Artifacts
- [ ] Custom initials on packaging
- [ ] International shipping calculator
- [ ] Admin dashboard for orders

---

## Design System

### Colors
```css
--cream: #FAF7F2
--charcoal: #2C2C2C
--terracotta: #C67B5C
--sage: #9CAF88
--dusty-blue: #8BA5B5
--warm-sand: #D4C4A8
```

### Typography
- Headings: Playfair Display (serif)
- Body: Inter (sans-serif)
- Accent: Caveat (handwritten, for quotes)

### Principles
- Premium feel on small-business budget
- Warm, not cold luxury
- Personal, not corporate
- Tactile references (wood grain, paper texture)
- Emotional copy over functional

---

## Target Audience

### Primary
- **Romantic Partners** (25-45)
  - Anniversaries, Valentine's Day, "just because"
  - Long-distance couples
  - Newly engaged/married

### Secondary  
- **Best Friends** (20-35)
  - Friendship anniversaries
  - Going-away gifts
  - Birthday milestones

### NOT Targeting (Phase 1)
- Children (legal complexity with photo uploads)
- Corporate/team gifts (future expansion)

---

## Competitive Positioning

| Competitor | Gap We Fill |
|------------|-------------|
| Generic photo puzzles | No personalization beyond image |
| Etsy handmade | Inconsistent quality, long lead times |
| Shutterfly/Snapfish | Mass-market, no emotional depth |
| Jiggy | Art-focused, not relationship-focused |

**Our Moat**: Memory Engine + Hint Card system creates emotional depth no competitor offers.

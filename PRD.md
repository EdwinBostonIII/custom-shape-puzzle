# Planning Guide

A custom puzzle creation platform where users design personalized jigsaw puzzles by selecting unique piece shapes, uploading photos or choosing colors, and ordering physical products delivered to their door.

**Experience Qualities**: 
1. **Delightful** - The process of creating a puzzle should feel magical and personal, with smooth transitions and satisfying interactions that build excitement.
2. **Intimate** - Especially for couples/friends mode, the shared creation experience should feel like a meaningful gesture of connection.
3. **Effortless** - Despite the customization complexity, the flow should feel natural and intuitive, guiding users confidently through each step.

**Complexity Level**: Light Application (multiple features with basic state)
  - Multi-step workflow with different paths, shared links for collaborative creation, state management across steps, but no user accounts or complex backend requirements.

## Essential Features

### Feature: Puzzle Type Selection
- **Functionality**: User selects from three puzzle types: Couples/Best Friends ($65), Solo ($65), or Children's ($85)
- **Purpose**: Segments users into appropriate creation flows and sets expectations for pricing and features
- **Trigger**: Landing on homepage
- **Progression**: View hero section → Read type descriptions with visuals → Click puzzle type card → Navigate to shape selection
- **Success criteria**: Clear visual distinction between types, pricing displayed, smooth navigation to next step

### Feature: Collaborative Shape Selection (Couples/Friends)
- **Functionality**: Primary user selects 5 shapes, generates shareable link, partner selects 5 shapes, both selections merge
- **Purpose**: Creates shared creation experience that strengthens the gift's meaning
- **Trigger**: Selecting Couples/Best Friends option
- **Progression**: View shape gallery → Select 5 pieces → Generate/copy share link → Send to partner → Partner opens link and selects 5 → Primary user sees completion → Continue to template
- **Success criteria**: Link copies successfully, real-time update when partner completes, visual feedback for selection progress (5/5 shapes)

### Feature: Solo Shape Selection
- **Functionality**: User independently selects all 10 puzzle piece shapes
- **Purpose**: Simplified personal customization without coordination
- **Trigger**: Selecting Solo option
- **Progression**: View shape gallery → Select 10 pieces (progress indicator) → Continue to template
- **Success criteria**: Clear count of selected shapes, prevents continuing until 10 selected

### Feature: Children's Shape Selection
- **Functionality**: Similar to solo but with child-friendly shape options (larger, simpler)
- **Purpose**: Age-appropriate puzzle creation with safety features
- **Trigger**: Selecting Children's option  
- **Progression**: View child-themed shape gallery → Select 10 pieces → Continue to template
- **Success criteria**: Distinct visual presentation, child-appropriate shapes visible

### Feature: Template Preview
- **Functionality**: Displays custom puzzle template using selected shapes arranged attractively
- **Purpose**: Validates shape choices before committing to design phase
- **Trigger**: Completing shape selection
- **Progression**: View generated template → Verify satisfaction → Continue or go back to modify → Proceed to design
- **Success criteria**: Template clearly shows all selected shapes, back button allows modification

### Feature: Design Choice (Photo vs. Colors)
- **Functionality**: Toggle between uploading reference photo or choosing colors per-piece
- **Purpose**: Provides creative flexibility for different use cases
- **Trigger**: Continuing from template preview
- **Progression**: Choose photo/color mode → [Photo: upload image + preview] OR [Color: select color for each shape] → Continue to checkout
- **Success criteria**: Clear mode switching, photo upload with preview, color picker for each piece, visual representation of final design

### Feature: Checkout & Order Confirmation
- **Functionality**: Collect shipping/billing info, process $65 or $85 payment, confirm order
- **Purpose**: Complete transaction and set delivery expectations
- **Trigger**: Finalizing design
- **Progression**: Enter shipping address → Enter payment details → Review order summary → Submit → View confirmation with order number
- **Success criteria**: Form validation, clear pricing display, confirmation page with next steps

## Edge Case Handling

- **Partner never completes selection**: Display "waiting for partner" state with option to send reminder or switch to solo mode
- **Invalid share link**: Show friendly error message with option to start new puzzle
- **Photo upload fails**: Display error with retry option and file size/format requirements
- **Incomplete shape selection**: Disable continue button until required number reached
- **Browser refresh mid-creation**: Persist state using KV storage so users don't lose progress
- **No shapes available**: Show "coming soon" or contact support message
- **Payment fails**: Return to payment form with clear error message

## Design Direction

The design should feel warm, playful, and premium—like unwrapping a thoughtful gift. It should balance whimsy (celebrating creativity and connection) with sophistication (this is a quality product worth the price). The interface should be spacious and uncluttered, letting each step breathe while maintaining momentum through the multi-step flow.

## Color Selection

**Triadic color scheme** - Using three equally-spaced colors to create vibrancy and energy while maintaining balance. The palette celebrates creativity and joy with a mature, premium feel.

- **Primary Color**: Warm Coral `oklch(0.72 0.15 25)` - Communicates warmth, affection, and creativity; perfect for a gift-centered product
- **Secondary Colors**: 
  - Soft Sage Green `oklch(0.75 0.08 145)` - Provides calm, natural grounding
  - Muted Lavender `oklch(0.70 0.10 285)` - Adds sophistication and playfulness
- **Accent Color**: Vibrant Amber `oklch(0.75 0.18 65)` - High-energy call-to-action color for important buttons and highlights
- **Foreground/Background Pairings**:
  - Background (Cream White `oklch(0.97 0.01 85)`): Warm Coral text `oklch(0.35 0.12 25)` - Ratio 7.2:1 ✓
  - Card (Pure White `oklch(0.99 0 0)`): Deep Charcoal `oklch(0.25 0.01 260)` - Ratio 14.8:1 ✓
  - Primary (Warm Coral `oklch(0.72 0.15 25)`): White text `oklch(0.99 0 0)` - Ratio 5.1:1 ✓
  - Secondary (Soft Sage `oklch(0.75 0.08 145)`): Deep Charcoal `oklch(0.25 0.01 260)` - Ratio 7.8:1 ✓
  - Accent (Vibrant Amber `oklch(0.75 0.18 65)`): Deep Charcoal `oklch(0.25 0.01 260)` - Ratio 7.5:1 ✓
  - Muted (Pale Lavender `oklch(0.92 0.03 285)`): Medium Gray `oklch(0.45 0.01 260)` - Ratio 6.1:1 ✓

## Font Selection

Typefaces should feel friendly yet refined—approachable without being childish. A rounded sans-serif for headings conveys warmth, while a clean geometric sans for body text ensures readability.

- **Typographic Hierarchy**: 
  - H1 (Hero/Page Titles): Outfit Bold / 48px / -0.02em letter spacing / 1.1 line height
  - H2 (Section Headers): Outfit Semibold / 32px / -0.01em letter spacing / 1.2 line height
  - H3 (Card Titles): Outfit Medium / 24px / 0 letter spacing / 1.3 line height
  - Body (Primary Text): Inter Regular / 16px / 0 letter spacing / 1.6 line height
  - Button Labels: Inter Semibold / 14px / 0.01em letter spacing / 1.4 line height
  - Captions: Inter Regular / 14px / 0 letter spacing / 1.5 line height

## Animations

Animations should feel organic and delightful—like puzzle pieces sliding into place. Use motion to guide attention through the multi-step flow and celebrate completions. Balance should lean toward subtle functionality with occasional "wow" moments (partner completing their selection, template generation).

- **Purposeful Meaning**: Transitions between steps feel like forward progress; shape selections have satisfying "snap" feedback; collaborative completion triggers celebratory animation
- **Hierarchy of Movement**: 
  - High priority: Shape selection feedback, step transitions, partner completion notification
  - Medium priority: Button hovers, card reveals, progress indicators
  - Low priority: Decorative background elements, subtle micro-interactions

## Component Selection

- **Components**: 
  - Cards (shadcn) - For puzzle type selection with hover effects and gradient borders
  - Button (shadcn) - Primary CTAs with custom coral/amber styling
  - Progress indicator (shadcn) - Step navigation showing user's position in flow
  - Dialog (shadcn) - Share link modal with copy functionality
  - Tabs (shadcn) - Photo vs. Color design choice
  - Input (shadcn) - Shipping and payment forms
  - Badge (shadcn) - Shape selection count, price labels
  - Tooltip (shadcn) - Shape name/description on hover
  - Toast (sonner) - Link copied, partner completion, order success notifications
  
- **Customizations**: 
  - Shape selector grid (custom) - Interactive gallery with multi-select capability
  - Puzzle template visualizer (custom) - SVG-based preview of selected shapes arranged
  - Color picker per shape (custom) - Touch-friendly color selection UI
  - Collaborative state indicator (custom) - Real-time "waiting for partner" status
  
- **States**: 
  - Buttons: Default coral with white text → Hover deeper coral with subtle scale → Active pressed down → Disabled pale coral
  - Shape tiles: Default white border → Hover sage border with lift → Selected amber border with checkmark → Disabled (when count reached) pale gray
  - Progress steps: Completed sage checkmark → Current coral dot → Upcoming gray outline
  
- **Icon Selection**: 
  - Heart (love/couples), Users (friends), Baby (children's), Shapes (shape selection), Image (photo upload), Palette (color choice), ShoppingCart (checkout), Check (completion), Link (share), ArrowRight (navigation)
  
- **Spacing**: 
  - Container padding: px-6 md:px-12 lg:px-24
  - Section gaps: gap-16 md:gap-24
  - Card padding: p-6 md:p-8
  - Element gaps: gap-4 (small), gap-6 (medium), gap-8 (large)
  - Button padding: px-6 py-3 (primary), px-4 py-2 (secondary)
  
- **Mobile**: 
  - Hero stacks vertically on mobile with full-width cards
  - Shape grid: 2 columns mobile → 4 columns tablet → 6 columns desktop
  - Progress indicator: Compact horizontal scroll mobile → Full horizontal layout desktop
  - Form fields: Single column mobile → Two column (when appropriate) desktop
  - Sticky CTA buttons on mobile for easy access to "Continue"

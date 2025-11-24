# Planning Guide

Create a one-of-a-kind wooden puzzle using shapes that hold special meaning. Each piece represents a memory, a milestone, or something you love. Together, they form something beautiful to treasure forever.

**Experience Qualities**: 
1. **Comforting** - The design should feel warm and inviting, like wrapping yourself in a cozy blanket. Every interaction should feel safe, friendly, and thoughtful.
2. **Meaningful** - Each shape carries emotional weight. The experience of selecting pieces should feel personal and reflective, helping users tell their unique story.
3. **Effortless** - Despite the deep customization, the flow should feel natural and intuitive, gently guiding users through each decision without overwhelming them.

**Complexity Level**: Light Application (multiple features with basic state)
  - Multi-step workflow with different paths, shared links for collaborative creation, state management across steps, but no user accounts or complex backend requirements.

## Essential Features

### Feature: Puzzle Type Selection
- **Functionality**: User selects from three puzzle types: For Couples & Friends ($65), Just for You ($65), or For Little Ones ($85)
- **Purpose**: Helps users choose the right creation path with clear, friendly language that emphasizes meaning over transaction
- **Trigger**: Landing on homepage
- **Progression**: Read welcoming hero text → View three beautifully presented options → Click puzzle type card → Navigate to shape selection
- **Success criteria**: Clear emotional appeal, pricing feels secondary to meaning, smooth animated navigation to next step

### Feature: Collaborative Shape Selection (Couples/Friends)
- **Functionality**: Primary user selects 5 shapes (each with meaningful descriptions), generates shareable link, partner selects 5 shapes, both selections merge
- **Purpose**: Creates shared creation experience where each person contributes shapes that represent their perspective on the relationship
- **Trigger**: Selecting "For Couples & Friends" option
- **Progression**: View shape gallery with descriptions → Select 5 pieces → Generate/copy share link → Send to partner → Partner opens link and selects 5 → Primary user sees completion → Continue to template
- **Success criteria**: Descriptions clearly visible, link copies successfully, real-time update when partner completes, visual feedback for selection progress (5/5 shapes), all pieces solid and able to interlock

### Feature: Solo Shape Selection
- **Functionality**: User independently selects all 10 puzzle piece shapes, each with a meaningful description (romantic, friendship, or childhood meaning)
- **Purpose**: Personal customization that helps users reflect on what matters most in their life
- **Trigger**: Selecting "Just for You" option
- **Progression**: View shape gallery organized by category → Read descriptions under each shape → Select 10 pieces (progress indicator) → Continue to template
- **Success criteria**: Descriptions visible under each piece, clear count of selected shapes, prevents continuing until 10 selected, pieces displayed in pastel colors

### Feature: Children's Shape Selection
- **Functionality**: Similar to solo but with child-friendly shape options (larger, simpler), each with playful descriptions
- **Purpose**: Age-appropriate puzzle creation that captures childhood wonder with safety features
- **Trigger**: Selecting "For Little Ones" option  
- **Progression**: View child-themed shape gallery with descriptions → Select 10 pieces → Continue to template
- **Success criteria**: Distinct visual presentation, child-appropriate shapes visible with playful descriptions, all pieces solid with no disconnected parts

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

The design should feel warm, comforting, and genuine. Like receiving a handwritten letter from someone you love. It should balance whimsy (celebrating creativity and connection) with sincerity (this is a treasured keepsake). The interface should be spacious and gentle, with soft colors and rounded edges that invite touch. Every element should feel handcrafted and considered, never corporate or transactional. The experience should wrap users in emotional warmth while making the technical process feel effortless.

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

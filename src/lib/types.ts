// INTERLOCK - Type Definitions
// Relationship Intelligence Platform

// ============================================================================
// SHAPE TYPES
// ============================================================================

export type ShapeType = 
  // Flora (8 shapes)
  | 'rose' | 'sunflower' | 'lotus' | 'tree' | 'leaf-simple' | 'tulip' | 'daisy' | 'succulent'
  // Fauna (16 shapes)
  | 'butterfly' | 'fox' | 'dog' | 'cat' | 'owl' | 'whale' | 'turtle' | 'penguin' 
  | 'deer' | 'rabbit' | 'bear' | 'elephant' | 'lion' | 'giraffe' | 'panda' | 'koala'
  // Celestial (8 shapes)
  | 'moon' | 'sun' | 'star' | 'cloud' | 'mountain' | 'wave' | 'rainbow' | 'snowflake'
  // Symbols (10 shapes)
  | 'heart' | 'infinity' | 'diamond' | 'key' | 'anchor' | 'compass'
  | 'crown' | 'clover' | 'peace' | 'yin-yang'
  // Celebration (8 shapes)
  | 'gift' | 'balloon' | 'cake' | 'champagne' | 'ribbon' | 'confetti' | 'candle' | 'party-hat'
  // Family & Life (8 shapes)
  | 'baby' | 'paw-print' | 'handprint' | 'family-tree' | 'home-heart' | 'cradle' | 'stroller' | 'rattle'
  // Adventure & Creative (14 shapes)
  | 'camera' | 'music-note' | 'book' | 'coffee' | 'airplane' | 'hot-air-balloon'
  | 'house' | 'lighthouse' | 'bicycle' | 'feather' | 'ring' | 'guitar' | 'palette' | 'globe'

export type ShapeCategory = 'flora' | 'fauna' | 'celestial' | 'symbols' | 'celebration' | 'family' | 'adventure'

export interface Shape {
  id: ShapeType
  name: string
  category: ShapeCategory
  description: string
  occasionTags?: OccasionTag[]
}

export type OccasionTag = 'anniversary' | 'friendship' | 'family' | 'travel' | 'nature' | 'milestone' | 'baby' | 'wedding' | 'birthday' | 'graduation'

// ============================================================================
// PUZZLE TIERS
// ============================================================================

export type PuzzleTier = 'essential' | 'classic' | 'grand' | 'heirloom'

export interface TierConfig {
  id: PuzzleTier
  name: string
  pieces: number
  shapes: number
  price: number
  hintCards: number
  description: string
  isHero?: boolean
}

// ============================================================================
// MEMORY ENGINE
// ============================================================================

export interface Milestone {
  id: string
  date: string           // ISO date string "2019-06-15"
  title: string          // "First Date"
  description?: string   // "Coffee at Blue Bottle"
  category: 'first' | 'anniversary' | 'travel' | 'home' | 'achievement' | 'other'
}

export interface InsideJoke {
  id: string
  phrase: string         // "That's so fetch"
  origin?: string        // "Movie night, March 2020"
  tags?: string[]        // ["movies", "humor"]
}

export interface SharedSymbol {
  id: string
  shapeId: ShapeType     // Links to puzzle shape
  meaning: string        // "The turtle = our slow morning walks"
  dateAdded: string
}

// ============================================================================
// HINT CARDS
// ============================================================================

export type HintPromptType = 'fill-in-blank' | 'memory' | 'emotion' | 'location'

export interface HintPrompt {
  id: string
  type: HintPromptType
  template: string       // "The place where we ____"
  userInput: string      // "first said I love you"
  characterLimit: number // 50-100 chars
}

export interface HintCard {
  id: string
  title: string          // "Our Beginning"
  prompts: HintPrompt[]
  shapesReferenced?: ShapeType[]
}

// ============================================================================
// IMAGE OPTIONS
// ============================================================================

export type ImageChoice = 'photo' | 'comfy-colors'

export interface ComfyColor {
  id: string
  name: string
  hex: string
}

// ============================================================================
// PACKAGING
// ============================================================================

export type BoxType = 'standard' | 'premium'
export type WaxSealColor = 'gold' | 'burgundy' | 'forest' | 'navy'
export type BoxPattern = 'solid' | 'constellation' | 'botanical' | 'geometric'

export interface PackagingOptions {
  box: BoxType
  waxSeal: boolean
  waxColor?: WaxSealColor
  pattern: BoxPattern
}

// ============================================================================
// WOOD STAINS (Premium upgrade)
// ============================================================================

export type WoodStainColor = 
  | 'natural'    // Light natural wood
  | 'honey'      // Warm honey oak
  | 'walnut'     // Rich walnut brown
  | 'ebony'      // Deep dark brown
  | 'gray-wash'  // Modern gray
  | 'white-wash' // Light whitewash

// ============================================================================
// SESSION & STATE
// ============================================================================

export interface PuzzleSession {
  id: string
  
  // Tier & Shapes
  tier: PuzzleTier
  selectedShapes: ShapeType[]
  shapeMeanings?: Partial<Record<ShapeType, string>>
  
  // Collaboration
  isCollaborative: boolean
  collaboratorRole?: 'person-a' | 'person-b'
  personAShapes?: ShapeType[]
  personBShapes?: ShapeType[]
  shareLink?: string
  partnerName?: string
  
  // Memory Engine
  milestones: Milestone[]
  insideJokes: InsideJoke[]
  sharedSymbols: SharedSymbol[]
  
  // Image
  imageChoice: ImageChoice
  photoUrl?: string
  colorAssignments?: Partial<Record<ShapeType, string>>
  
  // Premium: Wood Stain
  hasWoodStain: boolean
  woodStain?: WoodStainColor
  
  // Hint Cards
  hintCards: HintCard[]
  
  // Packaging
  packaging: PackagingOptions
  
  // Shipping
  shippingInfo?: ShippingInfo
  
  // Order State
  orderComplete?: boolean
  
  // Meta
  createdAt: number
  updatedAt: number
}

export interface ShippingInfo {
  fullName: string
  email: string
  address: string
  city: string
  state: string
  zipCode: string
}

// ============================================================================
// OCCASION PACKS
// ============================================================================

export interface OccasionPack {
  id: string
  name: string
  description: string
  icon: string
  shapes: ShapeType[]
}

// ============================================================================
// PRICING
// ============================================================================

export interface PricingBreakdown {
  base: number
  woodStain: number
  premiumBox: number
  waxSeal: number
  subtotal: number
  shipping: number
  total: number
}

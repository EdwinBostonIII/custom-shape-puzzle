// Simplified types for streamlined MVP launch
// Based on Validated Improvements Master List recommendations

export type ShapeType = 
  // Flora (8 shapes - expanded)
  | 'rose' | 'sunflower' | 'lotus' | 'tree' | 'leaf-simple' | 'tulip' | 'daisy' | 'cactus'
  // Fauna (16 shapes - expanded)
  | 'butterfly' | 'fox' | 'dog' | 'cat' | 'owl' | 'whale' | 'turtle' | 'penguin' 
  | 'deer' | 'rabbit' | 'bear' | 'elephant' | 'lion' | 'giraffe' | 'panda' | 'koala'
  // Celestial (8 shapes - expanded)
  | 'moon' | 'sun' | 'star' | 'cloud' | 'mountain' | 'wave' | 'rainbow' | 'snowflake'
  // Symbols (10 shapes - expanded)
  | 'heart' | 'infinity' | 'diamond' | 'key' | 'anchor' | 'compass'
  | 'crown' | 'clover' | 'peace' | 'yin-yang'
  // Celebration (8 shapes - NEW category)
  | 'gift' | 'balloon' | 'cake' | 'champagne' | 'ribbon' | 'confetti' | 'candle' | 'party-hat'
  // Family & Life (8 shapes - NEW category)  
  | 'baby' | 'paw-print' | 'handprint' | 'family-tree' | 'home-heart' | 'cradle' | 'stroller' | 'rattle'
  // Creative & Adventure (14 shapes - expanded)
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

export interface PuzzleSession {
  id: string
  selectedShapes: ShapeType[]
  shapeMeanings?: Partial<Record<ShapeType, string>>
  woodStain: WoodStainColor
  shippingInfo?: ShippingInfo
  orderComplete?: boolean
  isPartnerComplete?: boolean
  partnerShapes?: ShapeType[]
  createdAt: number
}

export type WoodStainColor = 
  | 'natural'    // Light natural wood
  | 'honey'      // Warm honey oak
  | 'walnut'     // Rich walnut brown
  | 'ebony'      // Deep dark brown
  | 'gray-wash'  // Modern gray
  | 'white-wash' // Light whitewash

export interface ShippingInfo {
  fullName: string
  email: string
  address: string
  city: string
  state: string
  zipCode: string
}

// Occasion-based starter packs for quick selection
export interface OccasionPack {
  id: string
  name: string
  description: string
  icon: string
  shapes: ShapeType[]
}

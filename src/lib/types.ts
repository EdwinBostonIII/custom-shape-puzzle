// Simplified types for streamlined MVP launch
// Based on Validated Improvements Master List recommendations

export type ShapeType = 
  // Flora (5 shapes - curated)
  | 'rose' | 'sunflower' | 'lotus' | 'tree' | 'leaf-simple'
  // Fauna (12 shapes - curated)
  | 'butterfly' | 'fox' | 'dog' | 'cat' | 'owl' | 'whale' | 'turtle' | 'penguin' | 'deer' | 'rabbit' | 'bear' | 'elephant'
  // Celestial (6 shapes - curated)
  | 'moon' | 'sun' | 'star' | 'cloud' | 'mountain' | 'wave'
  // Symbols (6 shapes - curated)
  | 'heart' | 'infinity' | 'diamond' | 'key' | 'anchor' | 'compass'
  // Creative & Adventure (11 shapes - curated)
  | 'camera' | 'music-note' | 'book' | 'coffee' | 'airplane' | 'hot-air-balloon'
  | 'house' | 'lighthouse' | 'bicycle' | 'feather' | 'ring'

export interface Shape {
  id: ShapeType
  name: string
  category: 'flora' | 'fauna' | 'celestial' | 'symbols' | 'adventure'
  description: string
  occasionTags?: OccasionTag[]
}

export type OccasionTag = 'anniversary' | 'friendship' | 'family' | 'travel' | 'nature' | 'milestone'

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

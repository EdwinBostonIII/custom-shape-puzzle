export type PuzzleType = 'couple' | 'solo' | 'children'

export type ShapeType = 
  | 'heart' | 'star' | 'flower' | 'dolphin' | 'turtle' 
  | 'butterfly' | 'moon' | 'sun' | 'cloud' | 'rainbow'
  | 'tree' | 'mountain' | 'wave' | 'spiral' | 'diamond'
  | 'circle' | 'hexagon' | 'triangle' | 'square'
  | 'car' | 'train' | 'airplane' | 'boat' | 'rocket'
  | 'cat' | 'dog' | 'bear' | 'elephant' | 'giraffe'
  | 'rose' | 'tulip' | 'lily' | 'lotus' | 'sunflower' | 'daisy'
  | 'maple-leaf' | 'oak-leaf' | 'pine' | 'palm' | 'cactus' | 'mushroom'
  | 'whale' | 'octopus' | 'fish' | 'seahorse' | 'starfish' | 'shell'
  | 'owl' | 'eagle' | 'hummingbird' | 'peacock' | 'swan' | 'penguin'
  | 'fox' | 'rabbit' | 'deer' | 'hedgehog' | 'squirrel' | 'koala'
  | 'crescent' | 'lightning' | 'snowflake' | 'flame' | 'raindrop' | 'wind'
  | 'guitar' | 'piano' | 'music-note' | 'microphone' | 'headphones'
  | 'book' | 'pencil' | 'palette' | 'camera' | 'telescope'
  | 'coffee' | 'cupcake' | 'ice-cream' | 'pizza' | 'cookie'
  | 'house' | 'castle' | 'lighthouse' | 'tent' | 'windmill'
  | 'anchor' | 'compass' | 'hot-air-balloon' | 'bicycle' | 'skateboard'
  | 'crown' | 'gem' | 'ring' | 'key' | 'lock' | 'hourglass'
  | 'infinity' | 'clover' | 'feather' | 'paw' | 'leaf-simple'

export interface Shape {
  id: ShapeType
  name: string
  category: 'flora' | 'fauna-sea' | 'fauna-land' | 'fauna-sky' | 'geometric' 
    | 'celestial' | 'creative' | 'culinary' | 'structures' | 'adventure' | 'treasures' | 'symbols'
  availableFor: PuzzleType[]
}

export interface PuzzleSession {
  id: string
  type: PuzzleType
  selectedShapes: ShapeType[]
  partnerShapes?: ShapeType[]
  isPartnerComplete?: boolean
  designType?: 'photo' | 'colors'
  photoData?: string
  colorMap?: Partial<Record<ShapeType, string>>
  shippingInfo?: ShippingInfo
  orderComplete?: boolean
}

export interface ShippingInfo {
  fullName: string
  email: string
  address: string
  city: string
  state: string
  zipCode: string
  cardNumber: string
  expiryDate: string
  cvv: string
}

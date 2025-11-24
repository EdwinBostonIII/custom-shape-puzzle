export type PuzzleType = 'couple' | 'solo' | 'children'

export type ShapeType = 
  | 'heart' | 'star' | 'flower' | 'dolphin' | 'turtle' 
  | 'butterfly' | 'moon' | 'sun' | 'cloud' | 'rainbow'
  | 'tree' | 'mountain' | 'wave' | 'spiral' | 'diamond'
  | 'circle' | 'hexagon' | 'triangle' | 'square'
  | 'car' | 'train' | 'airplane' | 'boat' | 'rocket'
  | 'cat' | 'dog' | 'bear' | 'elephant' | 'giraffe'

export interface Shape {
  id: ShapeType
  name: string
  category: 'nature' | 'geometric' | 'transport' | 'animals'
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

import { Shape, OccasionPack, WoodStainColor, ShapeCategory, TierConfig, PuzzleTier, ComfyColor, PackagingOptions } from './types'

// ============================================================================
// PUZZLE TIERS
// ============================================================================

export const PUZZLE_TIERS: TierConfig[] = [
  {
    id: 'essential',
    name: 'Essential',
    pieces: 50,
    shapes: 5,
    price: 45,
    hintCards: 3,
    description: 'Perfect for a meaningful gesture',
  },
  {
    id: 'classic',
    name: 'Classic',
    pieces: 100,
    shapes: 7,
    price: 69,
    hintCards: 4,
    description: 'Our most popular size',
    isHero: true,
  },
  {
    id: 'grand',
    name: 'Grand',
    pieces: 150,
    shapes: 10,
    price: 99,
    hintCards: 5,
    description: 'For stories that deserve more space',
  },
  {
    id: 'heirloom',
    name: 'Heirloom',
    pieces: 250,
    shapes: 15,
    price: 159,
    hintCards: 6,
    description: 'A legacy piece to treasure forever',
  },
]

export function getTierConfig(tier: PuzzleTier): TierConfig {
  return PUZZLE_TIERS.find(t => t.id === tier) || PUZZLE_TIERS[1] // Default to Classic
}

export function getShapesForTier(tier: PuzzleTier): number {
  return getTierConfig(tier).shapes
}

export function getCollaboratorShapeCount(tier: PuzzleTier): { personA: number; personB: number } {
  const total = getShapesForTier(tier)
  const half = Math.floor(total / 2)
  return {
    personA: half,
    personB: total - half, // Person B gets the remainder if odd
  }
}

// ============================================================================
// COMFY COLORS PALETTE
// ============================================================================

export const COMFY_PALETTE: ComfyColor[] = [
  { id: 'sage', name: 'Sage', hex: '#9CAF88' },
  { id: 'terracotta', name: 'Terracotta', hex: '#C67B5C' },
  { id: 'dusty-blue', name: 'Dusty Blue', hex: '#8BA5B5' },
  { id: 'warm-sand', name: 'Warm Sand', hex: '#D4C4A8' },
  { id: 'soft-plum', name: 'Soft Plum', hex: '#9B8AA3' },
  { id: 'forest', name: 'Forest', hex: '#4A5D4A' },
  { id: 'clay', name: 'Clay', hex: '#B5846B' },
  { id: 'mist', name: 'Mist', hex: '#B8C4C4' },
  { id: 'honey', name: 'Honey', hex: '#D4A854' },
  { id: 'charcoal', name: 'Charcoal', hex: '#4A4A4A' },
  { id: 'blush', name: 'Blush', hex: '#D4A5A5' },
  { id: 'olive', name: 'Olive', hex: '#7A8B5C' },
  { id: 'slate', name: 'Slate', hex: '#6B7B8C' },
  { id: 'rust', name: 'Rust', hex: '#A65D3F' },
  { id: 'cream', name: 'Cream', hex: '#E8DFD0' },
]

// ============================================================================
// PRICING
// ============================================================================

export const PRICING = {
  woodStain: 15,      // Premium wood stain upgrade
  premiumBox: 12,     // Magnetic closure box
  waxSeal: 5,         // Hand-stamped wax seal
  shipping: 0,        // Free shipping (US)
}

export function calculateTotal(
  tier: PuzzleTier,
  options: {
    hasWoodStain?: boolean
    premiumBox?: boolean
    waxSeal?: boolean
  } = {}
): { base: number; woodStain: number; premiumBox: number; waxSeal: number; subtotal: number; shipping: number; total: number } {
  const base = getTierConfig(tier).price
  const woodStain = options.hasWoodStain ? PRICING.woodStain : 0
  const premiumBox = options.premiumBox ? PRICING.premiumBox : 0
  const waxSeal = options.waxSeal ? PRICING.waxSeal : 0
  const subtotal = base + woodStain + premiumBox + waxSeal
  const shipping = PRICING.shipping
  const total = subtotal + shipping
  
  return { base, woodStain, premiumBox, waxSeal, subtotal, shipping, total }
}

// ============================================================================
// SHAPE LIBRARY (72 shapes)
// ============================================================================

export const PUZZLE_SHAPES: Shape[] = [
  // Flora (8 shapes)
  { id: 'rose', name: 'Rose', category: 'flora', description: 'Love blooms eternal', occasionTags: ['anniversary', 'milestone', 'wedding'] },
  { id: 'sunflower', name: 'Sunflower', category: 'flora', description: 'Bright and sunny days', occasionTags: ['friendship', 'family'] },
  { id: 'lotus', name: 'Lotus', category: 'flora', description: 'New beginnings', occasionTags: ['milestone', 'nature'] },
  { id: 'tree', name: 'Tree', category: 'flora', description: 'Deep roots and growth', occasionTags: ['family', 'nature'] },
  { id: 'leaf-simple', name: 'Leaf', category: 'flora', description: 'Nature walks together', occasionTags: ['nature', 'travel'] },
  { id: 'tulip', name: 'Tulip', category: 'flora', description: 'Spring renewal', occasionTags: ['nature', 'friendship'] },
  { id: 'daisy', name: 'Daisy', category: 'flora', description: 'Simple joys', occasionTags: ['friendship', 'family'] },
  { id: 'succulent', name: 'Succulent', category: 'flora', description: 'Resilient love', occasionTags: ['friendship', 'milestone'] },

  // Fauna (16 shapes)
  { id: 'butterfly', name: 'Butterfly', category: 'fauna', description: 'Beautiful transformation', occasionTags: ['milestone', 'nature'] },
  { id: 'fox', name: 'Fox', category: 'fauna', description: 'Clever adventures', occasionTags: ['travel', 'nature'] },
  { id: 'dog', name: 'Dog', category: 'fauna', description: 'Unconditional love', occasionTags: ['family', 'friendship'] },
  { id: 'cat', name: 'Cat', category: 'fauna', description: 'Cozy comfort', occasionTags: ['family'] },
  { id: 'owl', name: 'Owl', category: 'fauna', description: 'Shared wisdom', occasionTags: ['nature', 'milestone', 'graduation'] },
  { id: 'whale', name: 'Whale', category: 'fauna', description: 'Gentle giant wisdom', occasionTags: ['nature', 'travel'] },
  { id: 'turtle', name: 'Turtle', category: 'fauna', description: 'Patient journeys together', occasionTags: ['anniversary', 'nature'] },
  { id: 'penguin', name: 'Penguin', category: 'fauna', description: 'Loyal companions', occasionTags: ['anniversary', 'friendship'] },
  { id: 'deer', name: 'Deer', category: 'fauna', description: 'Graceful moments', occasionTags: ['nature'] },
  { id: 'rabbit', name: 'Rabbit', category: 'fauna', description: 'Gentle energy', occasionTags: ['family', 'nature', 'baby'] },
  { id: 'bear', name: 'Bear', category: 'fauna', description: 'Protective embrace', occasionTags: ['family', 'baby'] },
  { id: 'elephant', name: 'Elephant', category: 'fauna', description: 'Never forgetting', occasionTags: ['family', 'milestone', 'baby'] },
  { id: 'lion', name: 'Lion', category: 'fauna', description: 'Brave heart', occasionTags: ['family', 'milestone'] },
  { id: 'giraffe', name: 'Giraffe', category: 'fauna', description: 'Standing tall together', occasionTags: ['family', 'baby'] },
  { id: 'panda', name: 'Panda', category: 'fauna', description: 'Playful spirit', occasionTags: ['friendship', 'baby'] },
  { id: 'koala', name: 'Koala', category: 'fauna', description: 'Cozy cuddles', occasionTags: ['family', 'baby'] },

  // Celestial (8 shapes)
  { id: 'moon', name: 'Moon', category: 'celestial', description: 'Nighttime promises', occasionTags: ['anniversary'] },
  { id: 'sun', name: 'Sun', category: 'celestial', description: 'You are my sunshine', occasionTags: ['family', 'friendship', 'baby'] },
  { id: 'star', name: 'Star', category: 'celestial', description: 'Wish upon together', occasionTags: ['milestone', 'anniversary', 'baby'] },
  { id: 'cloud', name: 'Cloud', category: 'celestial', description: 'Daydreaming side by side', occasionTags: ['nature', 'baby'] },
  { id: 'mountain', name: 'Mountain', category: 'celestial', description: 'Conquering peaks together', occasionTags: ['travel', 'milestone'] },
  { id: 'wave', name: 'Wave', category: 'celestial', description: 'Ocean adventures', occasionTags: ['travel', 'nature'] },
  { id: 'rainbow', name: 'Rainbow', category: 'celestial', description: 'After every storm', occasionTags: ['milestone', 'baby', 'family'] },
  { id: 'snowflake', name: 'Snowflake', category: 'celestial', description: 'Unique like you', occasionTags: ['friendship', 'family'] },

  // Symbols (10 shapes)
  { id: 'heart', name: 'Heart', category: 'symbols', description: 'Love always', occasionTags: ['anniversary', 'family', 'friendship', 'wedding'] },
  { id: 'infinity', name: 'Infinity', category: 'symbols', description: 'Forever and always', occasionTags: ['anniversary', 'milestone', 'wedding'] },
  { id: 'diamond', name: 'Diamond', category: 'symbols', description: 'Rare and precious', occasionTags: ['anniversary', 'milestone', 'wedding'] },
  { id: 'key', name: 'Key', category: 'symbols', description: 'You unlock my heart', occasionTags: ['anniversary', 'wedding'] },
  { id: 'anchor', name: 'Anchor', category: 'symbols', description: 'You keep me grounded', occasionTags: ['family', 'friendship'] },
  { id: 'compass', name: 'Compass', category: 'symbols', description: 'Finding our way together', occasionTags: ['travel', 'milestone', 'graduation'] },
  { id: 'crown', name: 'Crown', category: 'symbols', description: 'Royally loved', occasionTags: ['birthday', 'milestone'] },
  { id: 'clover', name: 'Clover', category: 'symbols', description: 'Lucky in love', occasionTags: ['friendship', 'anniversary'] },
  { id: 'peace', name: 'Peace', category: 'symbols', description: 'Peaceful hearts', occasionTags: ['friendship', 'family'] },
  { id: 'yin-yang', name: 'Yin Yang', category: 'symbols', description: 'Perfect balance', occasionTags: ['anniversary', 'friendship'] },

  // Celebration (8 shapes)
  { id: 'gift', name: 'Gift', category: 'celebration', description: 'The joy of giving', occasionTags: ['birthday', 'milestone'] },
  { id: 'balloon', name: 'Balloon', category: 'celebration', description: 'Rising spirits', occasionTags: ['birthday', 'baby'] },
  { id: 'cake', name: 'Cake', category: 'celebration', description: 'Sweet celebrations', occasionTags: ['birthday', 'wedding', 'milestone'] },
  { id: 'champagne', name: 'Champagne', category: 'celebration', description: 'Toast to us', occasionTags: ['wedding', 'anniversary', 'milestone'] },
  { id: 'ribbon', name: 'Ribbon', category: 'celebration', description: 'Tied together', occasionTags: ['wedding', 'baby'] },
  { id: 'confetti', name: 'Confetti', category: 'celebration', description: 'Party time', occasionTags: ['birthday', 'graduation'] },
  { id: 'candle', name: 'Candle', category: 'celebration', description: 'Make a wish', occasionTags: ['birthday', 'milestone'] },
  { id: 'party-hat', name: 'Party Hat', category: 'celebration', description: 'Celebration mode', occasionTags: ['birthday'] },

  // Family & Life (8 shapes)
  { id: 'baby', name: 'Baby', category: 'family', description: 'Precious little one', occasionTags: ['baby', 'family'] },
  { id: 'paw-print', name: 'Paw Print', category: 'family', description: 'Fur family', occasionTags: ['family', 'friendship'] },
  { id: 'handprint', name: 'Handprint', category: 'family', description: 'Small hands, big love', occasionTags: ['family', 'baby'] },
  { id: 'family-tree', name: 'Family Tree', category: 'family', description: 'Our branches', occasionTags: ['family', 'milestone'] },
  { id: 'home-heart', name: 'Home Heart', category: 'family', description: 'Home is where you are', occasionTags: ['family', 'wedding'] },
  { id: 'cradle', name: 'Cradle', category: 'family', description: 'Sweet dreams', occasionTags: ['baby'] },
  { id: 'stroller', name: 'Stroller', category: 'family', description: 'New journey', occasionTags: ['baby', 'family'] },
  { id: 'rattle', name: 'Rattle', category: 'family', description: 'Baby joy', occasionTags: ['baby'] },

  // Adventure & Creative (14 shapes)
  { id: 'camera', name: 'Camera', category: 'adventure', description: 'Capturing moments', occasionTags: ['travel', 'milestone'] },
  { id: 'music-note', name: 'Music Note', category: 'adventure', description: 'Melodies and memories', occasionTags: ['friendship', 'anniversary'] },
  { id: 'book', name: 'Book', category: 'adventure', description: 'Stories we love', occasionTags: ['friendship', 'graduation'] },
  { id: 'coffee', name: 'Coffee', category: 'adventure', description: 'Morning ritual together', occasionTags: ['friendship', 'family'] },
  { id: 'airplane', name: 'Airplane', category: 'adventure', description: 'Flying to new places', occasionTags: ['travel'] },
  { id: 'hot-air-balloon', name: 'Hot Air Balloon', category: 'adventure', description: 'Rising above together', occasionTags: ['travel', 'milestone'] },
  { id: 'house', name: 'House', category: 'adventure', description: 'Our home together', occasionTags: ['family', 'milestone', 'wedding'] },
  { id: 'lighthouse', name: 'Lighthouse', category: 'adventure', description: 'Guiding light', occasionTags: ['family', 'travel'] },
  { id: 'bicycle', name: 'Bicycle', category: 'adventure', description: 'Rides together', occasionTags: ['travel', 'nature'] },
  { id: 'feather', name: 'Feather', category: 'adventure', description: 'Light as air', occasionTags: ['nature'] },
  { id: 'ring', name: 'Ring', category: 'adventure', description: 'Eternal promise', occasionTags: ['anniversary', 'milestone', 'wedding'] },
  { id: 'guitar', name: 'Guitar', category: 'adventure', description: 'Our song', occasionTags: ['friendship', 'anniversary'] },
  { id: 'palette', name: 'Palette', category: 'adventure', description: 'Colors of life', occasionTags: ['friendship', 'milestone'] },
  { id: 'globe', name: 'Globe', category: 'adventure', description: 'World travelers', occasionTags: ['travel', 'graduation'] },
]

// Occasion-based starter packs for quick selection
export const OCCASION_PACKS: OccasionPack[] = [
  {
    id: 'anniversary',
    name: 'Anniversary',
    description: 'Celebrate your love story',
    icon: '💕',
    shapes: ['heart', 'rose', 'ring', 'infinity', 'moon', 'star', 'penguin', 'turtle', 'key', 'diamond'],
  },
  {
    id: 'wedding',
    name: 'Wedding',
    description: 'For the happy couple',
    icon: '💒',
    shapes: ['heart', 'ring', 'diamond', 'champagne', 'cake', 'rose', 'infinity', 'home-heart', 'ribbon', 'star'],
  },
  {
    id: 'baby-shower',
    name: 'Baby Shower',
    description: 'Welcome the little one',
    icon: '👶',
    shapes: ['baby', 'star', 'moon', 'cloud', 'rainbow', 'elephant', 'bear', 'rabbit', 'balloon', 'heart'],
  },
  {
    id: 'best-friends',
    name: 'Best Friends',
    description: 'Friendship that lasts forever',
    icon: '🤝',
    shapes: ['heart', 'sun', 'coffee', 'music-note', 'anchor', 'dog', 'book', 'sunflower', 'star', 'butterfly'],
  },
  {
    id: 'family',
    name: 'Family',
    description: 'The roots that keep us grounded',
    icon: '🏠',
    shapes: ['tree', 'house', 'heart', 'elephant', 'bear', 'sun', 'anchor', 'lighthouse', 'family-tree', 'owl'],
  },
  {
    id: 'birthday',
    name: 'Birthday',
    description: 'Another trip around the sun',
    icon: '🎂',
    shapes: ['cake', 'balloon', 'gift', 'star', 'crown', 'confetti', 'candle', 'party-hat', 'heart', 'sun'],
  },
  {
    id: 'graduation',
    name: 'Graduation',
    description: 'New chapter begins',
    icon: '🎓',
    shapes: ['owl', 'book', 'star', 'compass', 'globe', 'mountain', 'confetti', 'infinity', 'butterfly', 'key'],
  },
  {
    id: 'adventure',
    name: 'Adventure',
    description: 'For the explorers at heart',
    icon: '✈️',
    shapes: ['airplane', 'compass', 'mountain', 'wave', 'hot-air-balloon', 'camera', 'bicycle', 'whale', 'fox', 'star'],
  },
]

// Wood stain options with visual colors for preview
export const WOOD_STAINS: { id: WoodStainColor; name: string; hex: string; description: string }[] = [
  { id: 'natural', name: 'Natural', hex: '#DEB887', description: 'Light natural birch' },
  { id: 'honey', name: 'Honey Oak', hex: '#CD853F', description: 'Warm golden tones' },
  { id: 'walnut', name: 'Walnut', hex: '#5D4037', description: 'Rich dark brown' },
  { id: 'ebony', name: 'Ebony', hex: '#2C2416', description: 'Deep charcoal' },
  { id: 'gray-wash', name: 'Gray Wash', hex: '#8B8B83', description: 'Modern driftwood' },
  { id: 'white-wash', name: 'White Wash', hex: '#F5F5DC', description: 'Coastal whitewash' },
]

// Category labels for shape organization (simple string map for display)
export const SHAPE_CATEGORIES: Record<string, string> = {
  flora: 'Nature & Plants',
  fauna: 'Animals',
  celestial: 'Sky & Elements',
  symbols: 'Symbols',
  celebration: 'Celebrations',
  family: 'Family & Life',
  adventure: 'Adventures',
}

// Production timeline constants
export const PRODUCTION = {
  daysToShip: 14, // 2 weeks
  shippingDays: { min: 2, max: 5 },
}

// Calculate estimated delivery date
export function getEstimatedDeliveryDate(): string {
  const today = new Date()
  const deliveryDate = new Date(today)
  deliveryDate.setDate(today.getDate() + PRODUCTION.daysToShip + PRODUCTION.shippingDays.max)
  
  return deliveryDate.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric' 
  })
}

// ============================================================================
// DEFAULT SESSION
// ============================================================================

export const DEFAULT_PACKAGING: PackagingOptions = {
  box: 'standard',
  waxSeal: false,
  pattern: 'solid',
}

export function createDefaultSession(id: string): import('./types').PuzzleSession {
  return {
    id,
    tier: 'classic',
    selectedShapes: [],
    isCollaborative: false,
    milestones: [],
    insideJokes: [],
    sharedSymbols: [],
    imageChoice: 'photo',
    hasWoodStain: false,
    hintCards: [],
    packaging: { ...DEFAULT_PACKAGING },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

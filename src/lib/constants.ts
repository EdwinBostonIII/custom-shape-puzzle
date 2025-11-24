import { Shape, OccasionPack, WoodStainColor } from './types'

// Curated 40-shape library based on research
// Focus on most meaningful, laser-cuttable shapes
export const PUZZLE_SHAPES: Shape[] = [
  // Flora (5 shapes)
  { id: 'rose', name: 'Rose', category: 'flora', description: 'Love blooms eternal', occasionTags: ['anniversary', 'milestone'] },
  { id: 'sunflower', name: 'Sunflower', category: 'flora', description: 'Bright and sunny days', occasionTags: ['friendship', 'family'] },
  { id: 'lotus', name: 'Lotus', category: 'flora', description: 'New beginnings', occasionTags: ['milestone', 'nature'] },
  { id: 'tree', name: 'Tree', category: 'flora', description: 'Deep roots and growth', occasionTags: ['family', 'nature'] },
  { id: 'leaf-simple', name: 'Leaf', category: 'flora', description: 'Nature walks together', occasionTags: ['nature', 'travel'] },

  // Fauna (12 shapes)
  { id: 'butterfly', name: 'Butterfly', category: 'fauna', description: 'Beautiful transformation', occasionTags: ['milestone', 'nature'] },
  { id: 'fox', name: 'Fox', category: 'fauna', description: 'Clever adventures', occasionTags: ['travel', 'nature'] },
  { id: 'dog', name: 'Dog', category: 'fauna', description: 'Unconditional love', occasionTags: ['family', 'friendship'] },
  { id: 'cat', name: 'Cat', category: 'fauna', description: 'Cozy comfort', occasionTags: ['family'] },
  { id: 'owl', name: 'Owl', category: 'fauna', description: 'Shared wisdom', occasionTags: ['nature', 'milestone'] },
  { id: 'whale', name: 'Whale', category: 'fauna', description: 'Gentle giant wisdom', occasionTags: ['nature', 'travel'] },
  { id: 'turtle', name: 'Turtle', category: 'fauna', description: 'Patient journeys together', occasionTags: ['anniversary', 'nature'] },
  { id: 'penguin', name: 'Penguin', category: 'fauna', description: 'Loyal companions', occasionTags: ['anniversary', 'friendship'] },
  { id: 'deer', name: 'Deer', category: 'fauna', description: 'Graceful moments', occasionTags: ['nature'] },
  { id: 'rabbit', name: 'Rabbit', category: 'fauna', description: 'Gentle energy', occasionTags: ['family', 'nature'] },
  { id: 'bear', name: 'Bear', category: 'fauna', description: 'Protective embrace', occasionTags: ['family'] },
  { id: 'elephant', name: 'Elephant', category: 'fauna', description: 'Never forgetting', occasionTags: ['family', 'milestone'] },

  // Celestial (6 shapes)
  { id: 'moon', name: 'Moon', category: 'celestial', description: 'Nighttime promises', occasionTags: ['anniversary'] },
  { id: 'sun', name: 'Sun', category: 'celestial', description: 'You are my sunshine', occasionTags: ['family', 'friendship'] },
  { id: 'star', name: 'Star', category: 'celestial', description: 'Wish upon together', occasionTags: ['milestone', 'anniversary'] },
  { id: 'cloud', name: 'Cloud', category: 'celestial', description: 'Daydreaming side by side', occasionTags: ['nature'] },
  { id: 'mountain', name: 'Mountain', category: 'celestial', description: 'Conquering peaks together', occasionTags: ['travel', 'milestone'] },
  { id: 'wave', name: 'Wave', category: 'celestial', description: 'Ocean adventures', occasionTags: ['travel', 'nature'] },

  // Symbols (6 shapes)
  { id: 'heart', name: 'Heart', category: 'symbols', description: 'Love always', occasionTags: ['anniversary', 'family', 'friendship'] },
  { id: 'infinity', name: 'Infinity', category: 'symbols', description: 'Forever and always', occasionTags: ['anniversary', 'milestone'] },
  { id: 'diamond', name: 'Diamond', category: 'symbols', description: 'Rare and precious', occasionTags: ['anniversary', 'milestone'] },
  { id: 'key', name: 'Key', category: 'symbols', description: 'You unlock my heart', occasionTags: ['anniversary'] },
  { id: 'anchor', name: 'Anchor', category: 'symbols', description: 'You keep me grounded', occasionTags: ['family', 'friendship'] },
  { id: 'compass', name: 'Compass', category: 'symbols', description: 'Finding our way together', occasionTags: ['travel', 'milestone'] },

  // Adventure & Creative (11 shapes)
  { id: 'camera', name: 'Camera', category: 'adventure', description: 'Capturing moments', occasionTags: ['travel', 'milestone'] },
  { id: 'music-note', name: 'Music Note', category: 'adventure', description: 'Melodies and memories', occasionTags: ['friendship', 'anniversary'] },
  { id: 'book', name: 'Book', category: 'adventure', description: 'Stories we love', occasionTags: ['friendship'] },
  { id: 'coffee', name: 'Coffee', category: 'adventure', description: 'Morning ritual together', occasionTags: ['friendship', 'family'] },
  { id: 'airplane', name: 'Airplane', category: 'adventure', description: 'Flying to new places', occasionTags: ['travel'] },
  { id: 'hot-air-balloon', name: 'Hot Air Balloon', category: 'adventure', description: 'Rising above together', occasionTags: ['travel', 'milestone'] },
  { id: 'house', name: 'House', category: 'adventure', description: 'Our home together', occasionTags: ['family', 'milestone'] },
  { id: 'lighthouse', name: 'Lighthouse', category: 'adventure', description: 'Guiding light', occasionTags: ['family', 'travel'] },
  { id: 'bicycle', name: 'Bicycle', category: 'adventure', description: 'Rides together', occasionTags: ['travel', 'nature'] },
  { id: 'feather', name: 'Feather', category: 'adventure', description: 'Light as air', occasionTags: ['nature'] },
  { id: 'ring', name: 'Ring', category: 'adventure', description: 'Eternal promise', occasionTags: ['anniversary', 'milestone'] },
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
    shapes: ['tree', 'house', 'heart', 'elephant', 'bear', 'sun', 'anchor', 'lighthouse', 'rabbit', 'owl'],
  },
  {
    id: 'adventure',
    name: 'Adventure',
    description: 'For the explorers at heart',
    icon: '✈️',
    shapes: ['airplane', 'compass', 'mountain', 'wave', 'hot-air-balloon', 'camera', 'bicycle', 'whale', 'fox', 'star'],
  },
]

// Single price point (no couple/solo distinction per master list)
export const PRICING = {
  base: 65,
  shipping: 0, // Free shipping
}

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
  adventure: 'Adventures',
}

// Production timeline constants
export const PRODUCTION = {
  daysToShip: 14, // 2 weeks as stated in master list
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

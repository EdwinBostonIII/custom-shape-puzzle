/**
 * DECORATIVE MOTIFS
 * 
 * These are the laser-engraved designs that appear ON TOP of puzzle pieces.
 * They are smaller, simpler, and designed to look good when laser-cut into wood.
 * 
 * Each motif is a single continuous path optimized for laser engraving:
 * - No fragmented pieces
 * - Clean, bold lines
 * - Scaled to fit within a 60x60 unit area (centered in 100x100 piece)
 */

import { ShapeType } from './types'

interface MotifDefinition {
  id: ShapeType
  name: string
  category: string
  // SVG path designed for laser engraving (fits in 60x60, centered at 50,50)
  path: string
  // Fill mode: 'solid' for filled shapes, 'outline' for line art
  fillMode: 'solid' | 'outline'
}

/**
 * Clean, laser-optimized motifs
 * Each path is designed to:
 * 1. Be a single connected shape (no fragments)
 * 2. Have clean curves suitable for laser cutting
 * 3. Look good when engraved on wood grain
 * 
 * Note: Not all ShapeTypes have motifs defined. The getMotifPath function
 * returns a fallback circle for undefined shapes.
 */
export const MOTIF_PATHS: Partial<Record<ShapeType, MotifDefinition>> = {
  // ═══════════════════════════════════════════════════════════════
  // FLORA - Nature & Plants
  // ═══════════════════════════════════════════════════════════════
  'rose': {
    id: 'rose',
    name: 'Rose',
    category: 'flora',
    // Stylized rose with layered petals - single solid shape
    path: 'M50 25 C60 25 70 35 70 45 C70 55 60 60 55 62 L55 75 L45 75 L45 62 C40 60 30 55 30 45 C30 35 40 25 50 25 Z M50 32 C55 32 58 37 58 42 C58 47 55 50 50 50 C45 50 42 47 42 42 C42 37 45 32 50 32 Z',
    fillMode: 'solid',
  },
  'sunflower': {
    id: 'sunflower',
    name: 'Sunflower',
    category: 'flora',
    // Sunflower with center and petals
    path: 'M50 20 L55 35 L70 30 L60 42 L75 50 L60 58 L70 70 L55 65 L50 80 L45 65 L30 70 L40 58 L25 50 L40 42 L30 30 L45 35 Z M50 40 A10 10 0 1 1 50 60 A10 10 0 1 1 50 40 Z',
    fillMode: 'solid',
  },
  'lotus': {
    id: 'lotus',
    name: 'Lotus',
    category: 'flora',
    // Lotus flower with petals rising from center
    path: 'M50 75 C50 75 35 60 35 50 C35 40 42 35 50 30 C58 35 65 40 65 50 C65 60 50 75 50 75 Z M50 30 C50 30 30 45 25 50 C30 55 50 65 50 65 M50 30 C50 30 70 45 75 50 C70 55 50 65 50 65',
    fillMode: 'outline',
  },
  'tree': {
    id: 'tree',
    name: 'Tree',
    category: 'flora',
    // Simple tree silhouette
    path: 'M50 20 L30 50 L38 50 L25 70 L45 70 L45 80 L55 80 L55 70 L75 70 L62 50 L70 50 Z',
    fillMode: 'solid',
  },
  'leaf-simple': {
    id: 'leaf-simple',
    name: 'Leaf',
    category: 'flora',
    // Simple leaf shape with vein
    path: 'M50 25 C70 35 75 55 65 70 C55 80 45 80 35 70 C25 55 30 35 50 25 Z M50 25 L50 70 M40 45 L50 50 M60 45 L50 50 M42 60 L50 62 M58 60 L50 62',
    fillMode: 'outline',
  },

  // ═══════════════════════════════════════════════════════════════
  // FAUNA - Animals
  // ═══════════════════════════════════════════════════════════════
  'butterfly': {
    id: 'butterfly',
    name: 'Butterfly',
    category: 'fauna',
    // Symmetrical butterfly
    path: 'M50 30 L50 70 M50 50 C30 40 20 30 25 45 C30 55 45 55 50 50 C55 55 70 55 75 45 C80 30 70 40 50 50 M50 50 C30 60 20 70 25 55 C30 45 45 45 50 50 C55 45 70 45 75 55 C80 70 70 60 50 50',
    fillMode: 'outline',
  },
  'fox': {
    id: 'fox',
    name: 'Fox',
    category: 'fauna',
    // Fox face silhouette
    path: 'M50 25 L30 45 L25 25 L35 40 L50 35 L65 40 L75 25 L70 45 L50 25 Z M50 35 L50 55 L40 65 L50 60 L60 65 L50 55 M42 50 A3 3 0 1 1 42 51 M58 50 A3 3 0 1 1 58 51',
    fillMode: 'outline',
  },
  'dog': {
    id: 'dog',
    name: 'Dog',
    category: 'fauna',
    // Dog face
    path: 'M30 40 C30 30 40 25 50 25 C60 25 70 30 70 40 L75 30 L70 45 C70 60 60 70 50 70 C40 70 30 60 30 45 L25 30 Z M40 50 A4 4 0 1 1 40 51 M60 50 A4 4 0 1 1 60 51 M50 55 L50 60 L45 65 L55 65 L50 60',
    fillMode: 'outline',
  },
  'cat': {
    id: 'cat',
    name: 'Cat',
    category: 'fauna',
    // Cat face with ears
    path: 'M30 50 C30 35 40 30 50 30 C60 30 70 35 70 50 C70 65 60 75 50 75 C40 75 30 65 30 50 Z M30 50 L25 25 L40 40 M70 50 L75 25 L60 40 M42 52 A3 3 0 1 1 42 53 M58 52 A3 3 0 1 1 58 53 M50 58 L47 62 L53 62 Z',
    fillMode: 'outline',
  },
  'owl': {
    id: 'owl',
    name: 'Owl',
    category: 'fauna',
    // Owl with big eyes
    path: 'M50 25 C70 25 75 45 75 55 C75 70 65 75 50 75 C35 75 25 70 25 55 C25 45 30 25 50 25 Z M35 45 A10 10 0 1 1 35 46 M55 45 A10 10 0 1 1 55 46 M40 45 A4 4 0 1 1 40 46 M60 45 A4 4 0 1 1 60 46 M50 55 L47 60 L53 60 Z M30 30 L35 40 M70 30 L65 40',
    fillMode: 'outline',
  },
  'whale': {
    id: 'whale',
    name: 'Whale',
    category: 'fauna',
    // Whale silhouette
    path: 'M20 50 C25 35 45 30 60 35 C75 40 80 50 80 55 C80 65 70 70 55 68 L60 75 L50 68 L40 75 L45 68 C30 65 20 60 20 50 Z M35 50 A3 3 0 1 1 35 51',
    fillMode: 'solid',
  },
  'turtle': {
    id: 'turtle',
    name: 'Turtle',
    category: 'fauna',
    // Turtle with shell pattern
    path: 'M50 30 C75 30 80 50 80 55 C80 65 70 70 50 70 C30 70 20 65 20 55 C20 50 25 30 50 30 Z M50 35 L50 65 M35 45 L65 45 M30 55 L70 55 M25 50 L20 45 M75 50 L80 45 M30 65 L25 72 M70 65 L75 72',
    fillMode: 'outline',
  },
  'penguin': {
    id: 'penguin',
    name: 'Penguin',
    category: 'fauna',
    // Penguin standing
    path: 'M50 20 C60 20 68 30 68 40 C68 50 65 60 65 70 C65 78 55 80 50 80 C45 80 35 78 35 70 C35 60 32 50 32 40 C32 30 40 20 50 20 Z M40 50 C40 45 45 42 50 42 C55 42 60 45 60 50 C60 58 55 62 50 62 C45 62 40 58 40 50 Z M42 35 A3 3 0 1 1 42 36 M58 35 A3 3 0 1 1 58 36',
    fillMode: 'outline',
  },
  'deer': {
    id: 'deer',
    name: 'Deer',
    category: 'fauna',
    // Deer head with antlers
    path: 'M50 40 C60 40 68 48 68 58 C68 70 60 78 50 78 C40 78 32 70 32 58 C32 48 40 40 50 40 Z M35 40 L30 25 L35 30 L30 20 M65 40 L70 25 L65 30 L70 20 M43 55 A3 3 0 1 1 43 56 M57 55 A3 3 0 1 1 57 56 M50 62 L50 68',
    fillMode: 'outline',
  },
  'rabbit': {
    id: 'rabbit',
    name: 'Rabbit',
    category: 'fauna',
    // Rabbit with long ears
    path: 'M50 45 C65 45 72 55 72 65 C72 75 62 80 50 80 C38 80 28 75 28 65 C28 55 35 45 50 45 Z M38 45 C38 35 40 20 42 20 C45 20 46 35 46 45 M54 45 C54 35 55 20 58 20 C60 20 62 35 62 45 M42 60 A3 3 0 1 1 42 61 M58 60 A3 3 0 1 1 58 61 M50 65 L47 68 L53 68 Z',
    fillMode: 'outline',
  },
  'bear': {
    id: 'bear',
    name: 'Bear',
    category: 'fauna',
    // Bear face
    path: 'M50 30 C70 30 78 45 78 55 C78 70 65 78 50 78 C35 78 22 70 22 55 C22 45 30 30 50 30 Z M28 35 A8 8 0 1 1 28 36 M72 35 A8 8 0 1 1 72 36 M40 52 A4 4 0 1 1 40 53 M60 52 A4 4 0 1 1 60 53 M50 58 A8 5 0 1 1 50 59',
    fillMode: 'outline',
  },
  'elephant': {
    id: 'elephant',
    name: 'Elephant',
    category: 'fauna',
    // Elephant head with trunk
    path: 'M50 25 C72 25 80 40 80 50 C80 65 70 75 55 75 L55 80 L45 80 L45 75 L40 80 L35 75 C30 75 25 72 25 65 L25 50 C25 40 28 25 50 25 Z M25 50 C20 52 18 58 20 65 C22 72 28 75 35 75 M35 45 A4 4 0 1 1 35 46 M55 45 A4 4 0 1 1 55 46',
    fillMode: 'outline',
  },

  // ═══════════════════════════════════════════════════════════════
  // CELESTIAL - Sky & Elements
  // ═══════════════════════════════════════════════════════════════
  'moon': {
    id: 'moon',
    name: 'Moon',
    category: 'celestial',
    // Crescent moon
    path: 'M60 25 C45 30 35 42 35 55 C35 68 45 80 60 75 C50 72 42 62 42 50 C42 38 50 28 60 25 Z',
    fillMode: 'solid',
  },
  'sun': {
    id: 'sun',
    name: 'Sun',
    category: 'celestial',
    // Sun with rays
    path: 'M50 35 A15 15 0 1 1 50 65 A15 15 0 1 1 50 35 M50 20 L50 28 M50 72 L50 80 M35 50 L27 50 M73 50 L65 50 M37 37 L30 30 M70 70 L63 63 M63 37 L70 30 M30 70 L37 63',
    fillMode: 'outline',
  },
  'star': {
    id: 'star',
    name: 'Star',
    category: 'celestial',
    // Five-pointed star
    path: 'M50 20 L56 40 L78 40 L60 52 L68 75 L50 60 L32 75 L40 52 L22 40 L44 40 Z',
    fillMode: 'solid',
  },
  'cloud': {
    id: 'cloud',
    name: 'Cloud',
    category: 'celestial',
    // Fluffy cloud
    path: 'M25 55 C20 55 18 50 20 45 C22 40 28 38 32 40 C35 32 45 28 55 32 C62 28 72 30 76 38 C82 40 85 48 80 55 C80 62 72 65 65 62 C58 68 42 68 35 62 C28 65 22 60 25 55 Z',
    fillMode: 'solid',
  },
  'mountain': {
    id: 'mountain',
    name: 'Mountain',
    category: 'celestial',
    // Mountain peaks
    path: 'M15 75 L35 35 L45 50 L55 30 L75 75 Z M55 30 L50 38 L60 50 L55 58 M35 35 L42 48',
    fillMode: 'outline',
  },
  'wave': {
    id: 'wave',
    name: 'Wave',
    category: 'celestial',
    // Ocean wave
    path: 'M20 50 C30 40 35 40 40 50 C45 60 50 60 55 50 C60 40 65 40 70 50 C75 60 80 60 85 50 M20 60 C28 52 33 52 38 60 C43 68 48 68 53 60 C58 52 63 52 68 60 C73 68 78 68 83 60',
    fillMode: 'outline',
  },

  // ═══════════════════════════════════════════════════════════════
  // SYMBOLS - Abstract & Meaningful
  // ═══════════════════════════════════════════════════════════════
  'heart': {
    id: 'heart',
    name: 'Heart',
    category: 'symbols',
    // Classic heart
    path: 'M50 75 C20 55 20 30 35 30 C42 30 48 35 50 40 C52 35 58 30 65 30 C80 30 80 55 50 75 Z',
    fillMode: 'solid',
  },
  'infinity': {
    id: 'infinity',
    name: 'Infinity',
    category: 'symbols',
    // Infinity symbol
    path: 'M50 50 C45 42 35 35 28 40 C20 45 20 55 28 60 C35 65 45 58 50 50 C55 42 65 35 72 40 C80 45 80 55 72 60 C65 65 55 58 50 50',
    fillMode: 'outline',
  },
  'diamond': {
    id: 'diamond',
    name: 'Diamond',
    category: 'symbols',
    // Gem diamond
    path: 'M50 20 L75 40 L50 80 L25 40 Z M25 40 L75 40 M50 20 L40 40 L50 80 M50 20 L60 40 L50 80',
    fillMode: 'outline',
  },
  'key': {
    id: 'key',
    name: 'Key',
    category: 'symbols',
    // Vintage key
    path: 'M35 35 A12 12 0 1 1 35 36 M35 35 A5 5 0 1 0 35 36 M42 45 L75 45 L75 52 L68 52 L68 45 M60 45 L60 55 M75 45 L75 38 L70 38 L70 45',
    fillMode: 'outline',
  },
  'anchor': {
    id: 'anchor',
    name: 'Anchor',
    category: 'symbols',
    // Ship anchor
    path: 'M50 20 A5 5 0 1 1 50 21 M50 25 L50 70 M35 75 C35 65 50 60 50 70 C50 60 65 65 65 75 M30 45 L70 45 M50 45 L50 25',
    fillMode: 'outline',
  },
  'compass': {
    id: 'compass',
    name: 'Compass',
    category: 'symbols',
    // Navigation compass
    path: 'M50 20 A30 30 0 1 1 50 80 A30 30 0 1 1 50 20 M50 25 L50 30 M50 70 L50 75 M25 50 L30 50 M70 50 L75 50 M50 35 L42 50 L50 65 L58 50 Z',
    fillMode: 'outline',
  },

  // ═══════════════════════════════════════════════════════════════
  // ADVENTURE - Activities & Objects
  // ═══════════════════════════════════════════════════════════════
  'camera': {
    id: 'camera',
    name: 'Camera',
    category: 'adventure',
    // Vintage camera
    path: 'M25 35 L75 35 L75 70 L25 70 Z M35 35 L40 25 L60 25 L65 35 M50 52 A12 12 0 1 1 50 53 M50 52 A5 5 0 1 0 50 53',
    fillMode: 'outline',
  },
  'music-note': {
    id: 'music-note',
    name: 'Music Note',
    category: 'adventure',
    // Musical note
    path: 'M40 70 A8 8 0 1 1 40 71 M48 70 L48 28 L72 22 L72 60 A8 8 0 1 1 72 61 M48 28 L72 22',
    fillMode: 'outline',
  },
  'book': {
    id: 'book',
    name: 'Book',
    category: 'adventure',
    // Open book
    path: 'M50 30 C40 30 30 25 25 25 L25 70 C30 70 40 72 50 75 C60 72 70 70 75 70 L75 25 C70 25 60 30 50 30 Z M50 30 L50 75',
    fillMode: 'outline',
  },
  'coffee': {
    id: 'coffee',
    name: 'Coffee',
    category: 'adventure',
    // Coffee cup
    path: 'M30 40 L30 72 C30 78 38 80 50 80 C62 80 70 78 70 72 L70 40 Z M70 48 C78 48 82 52 82 58 C82 64 78 68 70 68 M35 32 C35 28 40 25 40 32 M50 28 C50 22 55 20 55 28 M65 32 C65 28 70 25 70 32',
    fillMode: 'outline',
  },
  'airplane': {
    id: 'airplane',
    name: 'Airplane',
    category: 'adventure',
    // Simple airplane
    path: 'M50 20 L55 35 L80 45 L55 50 L55 65 L65 75 L55 72 L50 80 L45 72 L35 75 L45 65 L45 50 L20 45 L45 35 Z',
    fillMode: 'solid',
  },
  'hot-air-balloon': {
    id: 'hot-air-balloon',
    name: 'Hot Air Balloon',
    category: 'adventure',
    // Hot air balloon
    path: 'M50 20 C70 20 80 35 80 50 C80 60 70 70 60 72 L58 78 L42 78 L40 72 C30 70 20 60 20 50 C20 35 30 20 50 20 Z M50 20 L50 65 M30 45 C35 55 45 60 50 60 C55 60 65 55 70 45',
    fillMode: 'outline',
  },
  'house': {
    id: 'house',
    name: 'House',
    category: 'adventure',
    // Home
    path: 'M50 20 L80 45 L75 45 L75 78 L25 78 L25 45 L20 45 Z M40 78 L40 58 L60 58 L60 78 M55 45 A8 8 0 1 1 55 46',
    fillMode: 'outline',
  },
  'lighthouse': {
    id: 'lighthouse',
    name: 'Lighthouse',
    category: 'adventure',
    // Lighthouse
    path: 'M40 80 L35 40 L40 25 L60 25 L65 40 L60 80 Z M45 25 L45 18 C45 15 55 15 55 18 L55 25 M35 50 L30 48 M65 50 L70 48 M35 60 L30 62 M65 60 L70 62 M40 40 L60 40 M42 55 L58 55 M44 70 L56 70',
    fillMode: 'outline',
  },
  'bicycle': {
    id: 'bicycle',
    name: 'Bicycle',
    category: 'adventure',
    // Bicycle
    path: 'M30 60 A12 12 0 1 1 30 61 M70 60 A12 12 0 1 1 70 61 M30 60 L45 45 L55 45 L70 60 M55 45 L60 35 L68 35 M45 45 L45 35 L40 30 L50 30',
    fillMode: 'outline',
  },
  'feather': {
    id: 'feather',
    name: 'Feather',
    category: 'adventure',
    // Quill feather
    path: 'M70 20 C60 30 50 45 45 60 C42 70 40 78 38 80 L40 78 C45 72 50 60 55 48 L50 55 C55 45 62 35 70 25 L65 35 C68 28 70 22 70 20 Z',
    fillMode: 'solid',
  },
  'ring': {
    id: 'ring',
    name: 'Ring',
    category: 'adventure',
    // Wedding/engagement ring
    path: 'M50 25 C65 25 75 35 75 50 C75 65 65 75 50 75 C35 75 25 65 25 50 C25 35 35 25 50 25 M50 35 C58 35 65 42 65 50 C65 58 58 65 50 65 C42 65 35 58 35 50 C35 42 42 35 50 35 M50 20 L45 28 L50 25 L55 28 Z',
    fillMode: 'outline',
  },
}

/**
 * Get the motif path for a shape type
 */
export function getMotifPath(shapeType: ShapeType): string {
  const motif = MOTIF_PATHS[shapeType]
  return motif?.path || 'M50 50 m-20 0 a20 20 0 1 0 40 0 a20 20 0 1 0 -40 0' // fallback circle
}

/**
 * Get fill mode for a motif
 */
export function getMotifFillMode(shapeType: ShapeType): 'solid' | 'outline' {
  const motif = MOTIF_PATHS[shapeType]
  return motif?.fillMode || 'outline'
}

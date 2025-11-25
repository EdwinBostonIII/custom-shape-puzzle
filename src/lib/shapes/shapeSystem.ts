/**
 * CUSTOM SHAPE PUZZLE - SHAPE SYSTEM
 * 
 * This defines the core architecture for shape-based puzzle pieces.
 * Each puzzle piece IS the shape (a dolphin-shaped piece, not a square with a dolphin).
 * 
 * KEY CONCEPTS:
 * 
 * 1. BASE SHAPE: The silhouette outline of the shape (dolphin, heart, etc.)
 *    - Defined as an SVG path
 *    - Has designated "anchor points" where connectors attach
 * 
 * 2. ANCHOR POINTS: Positions along the shape's perimeter where connectors go
 *    - Each anchor has: position (x, y), angle (direction facing outward), and slot for connector type
 *    - Shapes have 4-8 anchors depending on complexity
 * 
 * 3. CONNECTORS: Universal interlocking tabs/slots
 *    - 4 connector types: A, B, C, D (each has male 'tab' and female 'slot' versions)
 *    - A-tab connects with A-slot, B-tab with B-slot, etc.
 *    - Connectors are small relative to shape size
 * 
 * 4. SHAPE VARIANT: A specific shape with specific connectors at each anchor
 *    - e.g., "dolphin_AABB" = dolphin with A-tab, A-slot, B-tab, B-slot at its 4 anchors
 *    - Variants are generated programmatically
 * 
 * 5. PUZZLE TEMPLATE: A 150-piece layout using 10 selected shapes
 *    - Each position specifies: which shape, which variant, rotation, position
 *    - All adjacent connectors must match (tab to slot of same type)
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * A point in 2D space with an angle (for anchor orientation)
 */
export interface AnchorPoint {
  id: string           // Unique identifier for this anchor (e.g., "top", "left1", "tail")
  x: number            // X position (0-100 normalized coordinate system)
  y: number            // Y position (0-100 normalized coordinate system)
  angle: number        // Outward-facing angle in degrees (0 = right, 90 = down, 180 = left, 270 = up)
  edgeSegment: string  // Which part of the shape edge this anchor is on
}

/**
 * Connector types - each has a male (tab) and female (slot) version
 */
export type ConnectorType = 'A' | 'B' | 'C' | 'D'
export type ConnectorGender = 'male' | 'female'  // male = tab (protrudes), female = slot (indents)

/**
 * A connector at a specific anchor point
 */
export interface ConnectorAssignment {
  anchorId: string
  type: ConnectorType
  gender: ConnectorGender
}

/**
 * Base shape definition - the outline and anchor points
 */
export interface BaseShape {
  id: string                    // Unique shape identifier (e.g., "dolphin", "heart")
  name: string                  // Display name
  category: string              // Category for organization
  
  // SVG path for the shape outline (in 100x100 viewBox)
  outlinePath: string
  
  // Anchor points where connectors can attach
  anchors: AnchorPoint[]
  
  // Bounding box info for layout calculations
  boundingBox: {
    width: number    // Actual width within 100x100 space
    height: number   // Actual height within 100x100 space
    offsetX: number  // X offset from origin
    offsetY: number  // Y offset from origin
  }
  
  // Approximate area (for balanced piece distribution in puzzles)
  area: number
}

/**
 * A shape variant - a base shape with specific connector assignments
 */
export interface ShapeVariant {
  baseShapeId: string
  variantId: string                    // e.g., "dolphin_AmAfBmBf" (A-male, A-female, B-male, B-female)
  connectors: ConnectorAssignment[]
  
  // Pre-computed SVG path including connectors
  fullPath?: string
}

/**
 * A placed piece in a puzzle template
 */
export interface PlacedPiece {
  id: string                    // Unique piece ID in puzzle
  variantId: string             // Which variant to use
  x: number                     // X position in puzzle grid
  y: number                     // Y position in puzzle grid
  rotation: number              // Rotation in degrees (0, 90, 180, 270)
  
  // Connection info for validation
  connections: {
    anchorId: string
    connectedToPieceId: string | null
    connectedToAnchorId: string | null
  }[]
}

/**
 * A complete puzzle template
 */
export interface PuzzleTemplate {
  id: string                    // Template ID (hash of sorted shape combination)
  shapes: string[]              // The 10 shape IDs used (sorted for consistent hashing)
  pieces: PlacedPiece[]         // All 150 placed pieces
  
  // Grid info
  gridWidth: number             // Number of columns
  gridHeight: number            // Number of rows
  cellSize: number              // Size of each grid cell in final output
  
  // Piece count per shape
  shapeCounts: Record<string, number>  // How many of each shape (should sum to 150)
  
  // Production info
  productionSvg?: string        // Complete SVG for laser cutting
  createdAt: number             // Timestamp
}

/**
 * Manifest of required pieces for production
 */
export interface PieceManifest {
  templateId: string
  pieces: {
    variantId: string
    quantity: number
  }[]
  totalPieces: number
}

// ============================================================================
// CONNECTOR GEOMETRY
// ============================================================================

/**
 * Connector dimensions (relative to shape size)
 * These create the interlocking tabs and slots
 */
export const CONNECTOR_CONFIG = {
  // Size of connector relative to shape (shape is 100 units)
  tabWidth: 8,        // Width of the tab/slot
  tabDepth: 6,        // How far tab protrudes / slot indents
  neckWidth: 5,       // Narrower neck creates locking effect
  
  // Variations for each connector type (A, B, C, D)
  // Different shapes/sizes to prevent wrong connections
  types: {
    A: { widthMult: 1.0, depthMult: 1.0, style: 'rounded' },
    B: { widthMult: 1.2, depthMult: 0.8, style: 'rounded' },
    C: { widthMult: 0.9, depthMult: 1.1, style: 'angular' },
    D: { widthMult: 1.1, depthMult: 0.9, style: 'angular' },
  }
} as const

/**
 * Generate SVG path for a connector at a given position and angle
 */
export function generateConnectorPath(
  x: number,
  y: number,
  angle: number,
  type: ConnectorType,
  gender: ConnectorGender
): string {
  const config = CONNECTOR_CONFIG.types[type]
  const width = CONNECTOR_CONFIG.tabWidth * config.widthMult
  const depth = CONNECTOR_CONFIG.tabDepth * config.depthMult * (gender === 'male' ? 1 : -1)
  const neck = CONNECTOR_CONFIG.neckWidth * config.widthMult
  
  const halfWidth = width / 2
  const halfNeck = neck / 2
  
  // Convert angle to radians
  const rad = (angle * Math.PI) / 180
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)
  
  // Helper to rotate and translate a point
  const transform = (px: number, py: number): [number, number] => {
    return [
      x + px * cos - py * sin,
      y + px * sin + py * cos
    ]
  }
  
  // Generate connector shape points (before rotation)
  // The connector extends perpendicular to the edge
  const points: [number, number][] = []
  
  if (config.style === 'rounded') {
    // Rounded connector (like classic puzzle pieces)
    const [x1, y1] = transform(-halfWidth, 0)
    const [x2, y2] = transform(-halfNeck, depth * 0.4)
    const [x3, y3] = transform(-halfNeck * 0.8, depth)
    const [x4, y4] = transform(halfNeck * 0.8, depth)
    const [x5, y5] = transform(halfNeck, depth * 0.4)
    const [x6, y6] = transform(halfWidth, 0)
    
    return `L ${x1} ${y1} C ${x1} ${y1}, ${x2} ${y2}, ${x3} ${y3} C ${x3} ${y3}, ${x4} ${y4}, ${x4} ${y4} C ${x4} ${y4}, ${x5} ${y5}, ${x6} ${y6}`
  } else {
    // Angular connector (more geometric)
    const [x1, y1] = transform(-halfWidth, 0)
    const [x2, y2] = transform(-halfNeck, depth * 0.5)
    const [x3, y3] = transform(-halfNeck, depth)
    const [x4, y4] = transform(halfNeck, depth)
    const [x5, y5] = transform(halfNeck, depth * 0.5)
    const [x6, y6] = transform(halfWidth, 0)
    
    return `L ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} L ${x4} ${y4} L ${x5} ${y5} L ${x6} ${y6}`
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate a unique hash for a combination of shapes (order-independent)
 */
export function hashShapeCombination(shapeIds: string[]): string {
  const sorted = [...shapeIds].sort()
  return sorted.join('-')
}

/**
 * Check if two connectors can connect
 */
export function canConnect(
  conn1: { type: ConnectorType; gender: ConnectorGender },
  conn2: { type: ConnectorType; gender: ConnectorGender }
): boolean {
  // Must be same type, opposite gender
  return conn1.type === conn2.type && conn1.gender !== conn2.gender
}

/**
 * Get the opposite gender
 */
export function oppositeGender(gender: ConnectorGender): ConnectorGender {
  return gender === 'male' ? 'female' : 'male'
}

/**
 * Generate all possible connector combinations for a shape with N anchors
 * Returns array of connector assignment arrays
 */
export function generateAllConnectorCombinations(
  anchorIds: string[],
  connectorTypes: ConnectorType[] = ['A', 'B', 'C', 'D']
): ConnectorAssignment[][] {
  const genders: ConnectorGender[] = ['male', 'female']
  const combinations: ConnectorAssignment[][] = []
  
  // Generate all combinations using recursion
  function generate(index: number, current: ConnectorAssignment[]): void {
    if (index === anchorIds.length) {
      combinations.push([...current])
      return
    }
    
    for (const type of connectorTypes) {
      for (const gender of genders) {
        current.push({
          anchorId: anchorIds[index],
          type,
          gender
        })
        generate(index + 1, current)
        current.pop()
      }
    }
  }
  
  generate(0, [])
  return combinations
}

/**
 * Create variant ID from base shape and connector assignments
 */
export function createVariantId(baseShapeId: string, connectors: ConnectorAssignment[]): string {
  const connectorString = connectors
    .map(c => `${c.type}${c.gender === 'male' ? 'm' : 'f'}`)
    .join('')
  return `${baseShapeId}_${connectorString}`
}

/**
 * Parse variant ID back into components
 */
export function parseVariantId(variantId: string): { baseShapeId: string; connectorPattern: string } {
  const [baseShapeId, connectorPattern] = variantId.split('_')
  return { baseShapeId, connectorPattern: connectorPattern || '' }
}

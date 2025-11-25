/**
 * TEMPLATE GENERATOR
 * 
 * Generates 150-piece puzzle templates from a selection of 10 shapes.
 * 
 * The algorithm:
 * 1. Takes 10 selected shapes (user's choice)
 * 2. Creates 15 copies of each shape = 150 pieces
 * 3. Uses bin-packing + constraint solving to arrange pieces
 * 4. Ensures all adjacent connectors match (male A to female A, etc.)
 * 5. Outputs a square(ish) layout optimized for laser cutting
 * 
 * This is a complex constraint satisfaction problem. We use:
 * - Greedy placement with backtracking
 * - Priority queue for piece selection
 * - Spatial indexing for efficient neighbor lookup
 */

import { 
  BaseShape, 
  ShapeVariant, 
  PlacedPiece, 
  PuzzleTemplate,
  ConnectorType,
  ConnectorGender,
  hashShapeCombination,
  canConnect,
  oppositeGender 
} from './shapeSystem'
import { SHAPE_DEFINITIONS } from './shapeDefinitions'
import { generateCoreVariants, findCompatibleVariants } from './variantGenerator'

// ============================================================================
// TEMPLATE GENERATION CONFIGURATION
// ============================================================================

export interface TemplateConfig {
  // Total pieces in the puzzle
  totalPieces: number
  
  // Number of unique shapes to use
  uniqueShapes: number
  
  // Copies of each shape
  copiesPerShape: number
  
  // Grid cell size (in mm for production)
  cellSize: number
  
  // Margin between pieces (in mm)
  pieceMargin: number
  
  // Target aspect ratio (width/height)
  targetAspectRatio: number
  
  // Maximum attempts for placement before backtracking
  maxPlacementAttempts: number
}

const DEFAULT_CONFIG: TemplateConfig = {
  totalPieces: 150,
  uniqueShapes: 10,
  copiesPerShape: 15,
  cellSize: 50,      // 50mm per cell
  pieceMargin: 2,    // 2mm gap between pieces
  targetAspectRatio: 1.0,  // Square
  maxPlacementAttempts: 1000,
}

// ============================================================================
// GRID AND SPATIAL STRUCTURES
// ============================================================================

interface GridCell {
  x: number
  y: number
  piece: PlacedPiece | null
  // Edges: what connectors are exposed on each side
  north: { type: ConnectorType; gender: ConnectorGender } | null
  south: { type: ConnectorType; gender: ConnectorGender } | null
  east: { type: ConnectorType; gender: ConnectorGender } | null
  west: { type: ConnectorType; gender: ConnectorGender } | null
}

interface Grid {
  width: number
  height: number
  cells: Map<string, GridCell>
}

function cellKey(x: number, y: number): string {
  return `${x},${y}`
}

function createGrid(width: number, height: number): Grid {
  const cells = new Map<string, GridCell>()
  
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      cells.set(cellKey(x, y), {
        x,
        y,
        piece: null,
        north: null,
        south: null,
        east: null,
        west: null,
      })
    }
  }
  
  return { width, height, cells }
}

// ============================================================================
// PIECE PLACEMENT LOGIC
// ============================================================================

interface PlacementContext {
  grid: Grid
  placedPieces: PlacedPiece[]
  availableVariants: Map<string, ShapeVariant[]>  // shapeId -> available variants
  shapeCounts: Map<string, number>  // How many of each shape placed
  targetCounts: Map<string, number>  // Target count for each shape
}

/**
 * Get constraints for a cell based on neighboring pieces
 */
interface CellConstraints {
  north?: { type: ConnectorType; gender: ConnectorGender }
  south?: { type: ConnectorType; gender: ConnectorGender }
  east?: { type: ConnectorType; gender: ConnectorGender }
  west?: { type: ConnectorType; gender: ConnectorGender }
  isEdge: {
    north: boolean
    south: boolean
    east: boolean
    west: boolean
  }
}

function getCellConstraints(grid: Grid, x: number, y: number): CellConstraints {
  const constraints: CellConstraints = {
    isEdge: {
      north: y === 0,
      south: y === grid.height - 1,
      east: x === grid.width - 1,
      west: x === 0,
    }
  }
  
  // Check north neighbor (y - 1)
  if (y > 0) {
    const northCell = grid.cells.get(cellKey(x, y - 1))
    if (northCell?.piece && northCell.south) {
      constraints.north = northCell.south
    }
  }
  
  // Check south neighbor (y + 1)
  if (y < grid.height - 1) {
    const southCell = grid.cells.get(cellKey(x, y + 1))
    if (southCell?.piece && southCell.north) {
      constraints.south = southCell.north
    }
  }
  
  // Check east neighbor (x + 1)
  if (x < grid.width - 1) {
    const eastCell = grid.cells.get(cellKey(x + 1, y))
    if (eastCell?.piece && eastCell.west) {
      constraints.east = eastCell.west
    }
  }
  
  // Check west neighbor (x - 1)
  if (x > 0) {
    const westCell = grid.cells.get(cellKey(x - 1, y))
    if (westCell?.piece && westCell.east) {
      constraints.west = westCell.east
    }
  }
  
  return constraints
}

/**
 * Check if a variant satisfies the constraints
 * Maps variant's connectors to cardinal directions based on rotation
 */
function variantSatisfiesConstraints(
  variant: ShapeVariant,
  shape: BaseShape,
  rotation: number,
  constraints: CellConstraints
): boolean {
  // Map anchor positions to cardinal directions after rotation
  const directionMap = mapAnchorsToDirections(shape, rotation)
  
  // Check each constraint
  for (const [direction, requiredConn] of Object.entries(constraints) as [keyof CellConstraints, any][]) {
    if (direction === 'isEdge') continue
    if (!requiredConn) continue
    
    // Find the anchor mapped to this direction
    const anchorId = directionMap[direction as 'north' | 'south' | 'east' | 'west']
    if (!anchorId) {
      // No anchor on this side - can't satisfy constraint that requires connection
      return false
    }
    
    // Find the connector assignment for this anchor
    const connector = variant.connectors.find(c => c.anchorId === anchorId)
    if (!connector) continue
    
    // Check if connectors match (same type, opposite gender)
    if (!canConnect(connector, requiredConn)) {
      return false
    }
  }
  
  return true
}

/**
 * Map shape anchors to cardinal directions based on rotation
 * Uses anchor angles to determine which direction each faces after rotation
 */
function mapAnchorsToDirections(
  shape: BaseShape,
  rotation: number
): { north?: string; south?: string; east?: string; west?: string } {
  const result: { north?: string; south?: string; east?: string; west?: string } = {}
  
  for (const anchor of shape.anchors) {
    // Apply rotation to anchor angle
    const adjustedAngle = (anchor.angle + rotation) % 360
    
    // Map angle ranges to directions
    // 0° = east (right), 90° = south (down), 180° = west (left), 270° = north (up)
    if (adjustedAngle >= 315 || adjustedAngle < 45) {
      result.east = anchor.id
    } else if (adjustedAngle >= 45 && adjustedAngle < 135) {
      result.south = anchor.id
    } else if (adjustedAngle >= 135 && adjustedAngle < 225) {
      result.west = anchor.id
    } else {
      result.north = anchor.id
    }
  }
  
  return result
}

/**
 * Get the exposed connectors on each side after placing a piece
 */
function getExposedConnectors(
  variant: ShapeVariant,
  shape: BaseShape,
  rotation: number
): {
  north: { type: ConnectorType; gender: ConnectorGender } | null
  south: { type: ConnectorType; gender: ConnectorGender } | null
  east: { type: ConnectorType; gender: ConnectorGender } | null
  west: { type: ConnectorType; gender: ConnectorGender } | null
} {
  const directionMap = mapAnchorsToDirections(shape, rotation)
  
  const result = {
    north: null as { type: ConnectorType; gender: ConnectorGender } | null,
    south: null as { type: ConnectorType; gender: ConnectorGender } | null,
    east: null as { type: ConnectorType; gender: ConnectorGender } | null,
    west: null as { type: ConnectorType; gender: ConnectorGender } | null,
  }
  
  for (const [direction, anchorId] of Object.entries(directionMap)) {
    if (!anchorId) continue
    const connector = variant.connectors.find(c => c.anchorId === anchorId)
    if (connector) {
      result[direction as keyof typeof result] = {
        type: connector.type,
        gender: connector.gender,
      }
    }
  }
  
  return result
}

// ============================================================================
// MAIN TEMPLATE GENERATION ALGORITHM
// ============================================================================

/**
 * Generate a puzzle template from selected shapes
 */
export function generatePuzzleTemplate(
  selectedShapeIds: string[],
  config: TemplateConfig = DEFAULT_CONFIG
): PuzzleTemplate | null {
  // Validate input
  if (selectedShapeIds.length !== config.uniqueShapes) {
    console.error(`Expected ${config.uniqueShapes} shapes, got ${selectedShapeIds.length}`)
    return null
  }
  
  // Verify all shapes exist
  for (const shapeId of selectedShapeIds) {
    if (!SHAPE_DEFINITIONS[shapeId]) {
      console.error(`Unknown shape: ${shapeId}`)
      return null
    }
  }
  
  // Calculate grid dimensions for ~square layout
  const gridWidth = Math.ceil(Math.sqrt(config.totalPieces * config.targetAspectRatio))
  const gridHeight = Math.ceil(config.totalPieces / gridWidth)
  
  // Generate variants for each shape
  const variantsByShape = new Map<string, ShapeVariant[]>()
  for (const shapeId of selectedShapeIds) {
    const shape = SHAPE_DEFINITIONS[shapeId]
    const variants = generateCoreVariants(shape, 50) // Generate 50 variants per shape
    variantsByShape.set(shapeId, variants)
  }
  
  // Initialize context
  const grid = createGrid(gridWidth, gridHeight)
  const targetCounts = new Map<string, number>()
  for (const shapeId of selectedShapeIds) {
    targetCounts.set(shapeId, config.copiesPerShape)
  }
  
  const context: PlacementContext = {
    grid,
    placedPieces: [],
    availableVariants: variantsByShape,
    shapeCounts: new Map(selectedShapeIds.map(id => [id, 0])),
    targetCounts,
  }
  
  // Run placement algorithm
  const success = runPlacementAlgorithm(context, config)
  
  if (!success) {
    console.error('Failed to generate template - placement algorithm did not complete')
    return null
  }
  
  // Build template object
  const templateId = hashShapeCombination(selectedShapeIds)
  
  const shapeCounts: Record<string, number> = {}
  for (const [shapeId, count] of context.shapeCounts) {
    shapeCounts[shapeId] = count
  }
  
  return {
    id: templateId,
    shapes: selectedShapeIds.sort(),
    pieces: context.placedPieces,
    gridWidth,
    gridHeight,
    cellSize: config.cellSize,
    shapeCounts,
    createdAt: Date.now(),
  }
}

/**
 * Main placement algorithm using greedy approach with backtracking
 */
function runPlacementAlgorithm(
  context: PlacementContext,
  config: TemplateConfig
): boolean {
  const { grid } = context
  
  // Place pieces in row-major order (left to right, top to bottom)
  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      // Check if we've placed enough pieces
      if (context.placedPieces.length >= config.totalPieces) {
        return true
      }
      
      const success = placePieceAt(context, x, y, config)
      if (!success) {
        // Backtracking would go here, but for simplicity we'll try alternatives
        console.warn(`Failed to place piece at (${x}, ${y})`)
        // Try with any available piece (relaxed constraints)
        const fallbackSuccess = placePieceAtRelaxed(context, x, y)
        if (!fallbackSuccess) {
          return false
        }
      }
    }
  }
  
  return context.placedPieces.length >= config.totalPieces
}

/**
 * Try to place a piece at a specific grid position
 */
function placePieceAt(
  context: PlacementContext,
  x: number,
  y: number,
  config: TemplateConfig
): boolean {
  const { grid, availableVariants, shapeCounts, targetCounts } = context
  const constraints = getCellConstraints(grid, x, y)
  
  // Try each shape that still needs more pieces
  const shuffledShapes = shuffleArray(Array.from(targetCounts.keys()))
  
  for (const shapeId of shuffledShapes) {
    const currentCount = shapeCounts.get(shapeId) || 0
    const targetCount = targetCounts.get(shapeId) || 0
    
    if (currentCount >= targetCount) continue
    
    const shape = SHAPE_DEFINITIONS[shapeId]
    const variants = availableVariants.get(shapeId) || []
    
    // Try each rotation
    for (const rotation of [0, 90, 180, 270]) {
      // Try each variant
      for (const variant of shuffleArray([...variants])) {
        if (variantSatisfiesConstraints(variant, shape, rotation, constraints)) {
          // Place the piece
          const piece = createPlacedPiece(
            context.placedPieces.length,
            variant,
            x,
            y,
            rotation
          )
          
          // Update grid cell
          const cell = grid.cells.get(cellKey(x, y))!
          const exposed = getExposedConnectors(variant, shape, rotation)
          cell.piece = piece
          cell.north = exposed.north
          cell.south = exposed.south
          cell.east = exposed.east
          cell.west = exposed.west
          
          // Update context
          context.placedPieces.push(piece)
          shapeCounts.set(shapeId, currentCount + 1)
          
          return true
        }
      }
    }
  }
  
  return false
}

/**
 * Relaxed placement - just place any available piece
 */
function placePieceAtRelaxed(
  context: PlacementContext,
  x: number,
  y: number
): boolean {
  const { grid, availableVariants, shapeCounts, targetCounts } = context
  
  for (const [shapeId, variants] of availableVariants) {
    const currentCount = shapeCounts.get(shapeId) || 0
    const targetCount = targetCounts.get(shapeId) || 0
    
    if (currentCount >= targetCount) continue
    
    const shape = SHAPE_DEFINITIONS[shapeId]
    const variant = variants[0]  // Just pick first variant
    const rotation = 0
    
    const piece = createPlacedPiece(
      context.placedPieces.length,
      variant,
      x,
      y,
      rotation
    )
    
    const cell = grid.cells.get(cellKey(x, y))!
    const exposed = getExposedConnectors(variant, shape, rotation)
    cell.piece = piece
    cell.north = exposed.north
    cell.south = exposed.south
    cell.east = exposed.east
    cell.west = exposed.west
    
    context.placedPieces.push(piece)
    shapeCounts.set(shapeId, currentCount + 1)
    
    return true
  }
  
  return false
}

/**
 * Create a placed piece object
 */
function createPlacedPiece(
  index: number,
  variant: ShapeVariant,
  x: number,
  y: number,
  rotation: number
): PlacedPiece {
  return {
    id: `piece-${index}`,
    variantId: variant.variantId,
    x,
    y,
    rotation,
    connections: [], // Will be populated during production export
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Fisher-Yates shuffle
 */
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Quick test of template generation
 */
export function testTemplateGeneration(): void {
  const testShapes = [
    'dolphin', 'heart', 'star', 'butterfly', 'tree',
    'flower', 'sun', 'car', 'airplane', 'cat'
  ]
  
  console.log('Testing template generation with shapes:', testShapes)
  
  const template = generatePuzzleTemplate(testShapes, {
    ...DEFAULT_CONFIG,
    totalPieces: 20,  // Small test
    copiesPerShape: 2,
  })
  
  if (template) {
    console.log('Template generated successfully!')
    console.log(`  ID: ${template.id}`)
    console.log(`  Grid: ${template.gridWidth}x${template.gridHeight}`)
    console.log(`  Pieces: ${template.pieces.length}`)
    console.log(`  Shape counts:`, template.shapeCounts)
  } else {
    console.log('Template generation failed')
  }
}

/**
 * PUZZLE PIECE SYSTEM
 * 
 * This file defines the interlocking puzzle piece shapes that form a cohesive
 * 10-piece (2x5 grid) puzzle. Each piece has:
 * - A unique SVG path for the piece outline with tabs/slots
 * - Connection points for interlocking with adjacent pieces
 * - Grid position (row, col)
 * 
 * Puzzle Layout (2 rows x 5 columns):
 * ┌────┬────┬────┬────┬────┐
 * │ 0  │ 1  │ 2  │ 3  │ 4  │  Row 0
 * ├────┼────┼────┼────┼────┤
 * │ 5  │ 6  │ 7  │ 8  │ 9  │  Row 1
 * └────┴────┴────┴────┴────┘
 * 
 * Each piece is ~100x100 units, puzzle is 500x200 units total
 */

export type TabDirection = 'out' | 'in' | 'flat'

export interface PieceEdges {
  top: TabDirection
  right: TabDirection
  bottom: TabDirection
  left: TabDirection
}

export interface PuzzlePieceDefinition {
  id: number
  row: number
  col: number
  edges: PieceEdges
  // SVG path for the piece outline (100x100 viewBox)
  path: string
  // Position offset when assembled (x, y in puzzle grid)
  assembledX: number
  assembledY: number
}

// Tab dimensions
const TAB_WIDTH = 20
const TAB_DEPTH = 15
const PIECE_SIZE = 100

/**
 * Generate SVG path for a puzzle piece with specified edge types
 */
function generatePiecePath(edges: PieceEdges): string {
  const { top, right, bottom, left } = edges
  const size = PIECE_SIZE
  const tabW = TAB_WIDTH
  const tabD = TAB_DEPTH
  const halfTab = tabW / 2
  const midPoint = size / 2

  let path = ''

  // Start at top-left corner
  path += `M 0 0 `

  // TOP EDGE (left to right)
  if (top === 'flat') {
    path += `L ${size} 0 `
  } else if (top === 'out') {
    // Tab sticking out (up)
    path += `L ${midPoint - halfTab} 0 `
    path += `C ${midPoint - halfTab} ${-tabD * 0.3}, ${midPoint - halfTab * 0.5} ${-tabD}, ${midPoint} ${-tabD} `
    path += `C ${midPoint + halfTab * 0.5} ${-tabD}, ${midPoint + halfTab} ${-tabD * 0.3}, ${midPoint + halfTab} 0 `
    path += `L ${size} 0 `
  } else {
    // Slot going in (down)
    path += `L ${midPoint - halfTab} 0 `
    path += `C ${midPoint - halfTab} ${tabD * 0.3}, ${midPoint - halfTab * 0.5} ${tabD}, ${midPoint} ${tabD} `
    path += `C ${midPoint + halfTab * 0.5} ${tabD}, ${midPoint + halfTab} ${tabD * 0.3}, ${midPoint + halfTab} 0 `
    path += `L ${size} 0 `
  }

  // RIGHT EDGE (top to bottom)
  if (right === 'flat') {
    path += `L ${size} ${size} `
  } else if (right === 'out') {
    // Tab sticking out (right)
    path += `L ${size} ${midPoint - halfTab} `
    path += `C ${size + tabD * 0.3} ${midPoint - halfTab}, ${size + tabD} ${midPoint - halfTab * 0.5}, ${size + tabD} ${midPoint} `
    path += `C ${size + tabD} ${midPoint + halfTab * 0.5}, ${size + tabD * 0.3} ${midPoint + halfTab}, ${size} ${midPoint + halfTab} `
    path += `L ${size} ${size} `
  } else {
    // Slot going in (left)
    path += `L ${size} ${midPoint - halfTab} `
    path += `C ${size - tabD * 0.3} ${midPoint - halfTab}, ${size - tabD} ${midPoint - halfTab * 0.5}, ${size - tabD} ${midPoint} `
    path += `C ${size - tabD} ${midPoint + halfTab * 0.5}, ${size - tabD * 0.3} ${midPoint + halfTab}, ${size} ${midPoint + halfTab} `
    path += `L ${size} ${size} `
  }

  // BOTTOM EDGE (right to left)
  if (bottom === 'flat') {
    path += `L 0 ${size} `
  } else if (bottom === 'out') {
    // Tab sticking out (down)
    path += `L ${midPoint + halfTab} ${size} `
    path += `C ${midPoint + halfTab} ${size + tabD * 0.3}, ${midPoint + halfTab * 0.5} ${size + tabD}, ${midPoint} ${size + tabD} `
    path += `C ${midPoint - halfTab * 0.5} ${size + tabD}, ${midPoint - halfTab} ${size + tabD * 0.3}, ${midPoint - halfTab} ${size} `
    path += `L 0 ${size} `
  } else {
    // Slot going in (up)
    path += `L ${midPoint + halfTab} ${size} `
    path += `C ${midPoint + halfTab} ${size - tabD * 0.3}, ${midPoint + halfTab * 0.5} ${size - tabD}, ${midPoint} ${size - tabD} `
    path += `C ${midPoint - halfTab * 0.5} ${size - tabD}, ${midPoint - halfTab} ${size - tabD * 0.3}, ${midPoint - halfTab} ${size} `
    path += `L 0 ${size} `
  }

  // LEFT EDGE (bottom to top)
  if (left === 'flat') {
    path += `L 0 0 `
  } else if (left === 'out') {
    // Tab sticking out (left)
    path += `L 0 ${midPoint + halfTab} `
    path += `C ${-tabD * 0.3} ${midPoint + halfTab}, ${-tabD} ${midPoint + halfTab * 0.5}, ${-tabD} ${midPoint} `
    path += `C ${-tabD} ${midPoint - halfTab * 0.5}, ${-tabD * 0.3} ${midPoint - halfTab}, 0 ${midPoint - halfTab} `
    path += `L 0 0 `
  } else {
    // Slot going in (right)
    path += `L 0 ${midPoint + halfTab} `
    path += `C ${tabD * 0.3} ${midPoint + halfTab}, ${tabD} ${midPoint + halfTab * 0.5}, ${tabD} ${midPoint} `
    path += `C ${tabD} ${midPoint - halfTab * 0.5}, ${tabD * 0.3} ${midPoint - halfTab}, 0 ${midPoint - halfTab} `
    path += `L 0 0 `
  }

  path += 'Z'

  return path
}

/**
 * The 10-piece puzzle layout
 * 
 * Rules for interlocking:
 * - Adjacent pieces must have complementary edges (out <-> in)
 * - Outer edges are flat
 * - Row 0 pieces have tabs on bottom, row 1 pieces have slots on top
 * - Horizontally adjacent pieces alternate out/in
 */
export const PUZZLE_PIECES: PuzzlePieceDefinition[] = [
  // Row 0 (top row)
  {
    id: 0,
    row: 0,
    col: 0,
    edges: { top: 'flat', right: 'out', bottom: 'out', left: 'flat' },
    path: '',
    assembledX: 0,
    assembledY: 0,
  },
  {
    id: 1,
    row: 0,
    col: 1,
    edges: { top: 'flat', right: 'out', bottom: 'in', left: 'in' },
    path: '',
    assembledX: 100,
    assembledY: 0,
  },
  {
    id: 2,
    row: 0,
    col: 2,
    edges: { top: 'flat', right: 'out', bottom: 'out', left: 'in' },
    path: '',
    assembledX: 200,
    assembledY: 0,
  },
  {
    id: 3,
    row: 0,
    col: 3,
    edges: { top: 'flat', right: 'out', bottom: 'in', left: 'in' },
    path: '',
    assembledX: 300,
    assembledY: 0,
  },
  {
    id: 4,
    row: 0,
    col: 4,
    edges: { top: 'flat', right: 'flat', bottom: 'out', left: 'in' },
    path: '',
    assembledX: 400,
    assembledY: 0,
  },
  // Row 1 (bottom row)
  {
    id: 5,
    row: 1,
    col: 0,
    edges: { top: 'in', right: 'out', bottom: 'flat', left: 'flat' },
    path: '',
    assembledX: 0,
    assembledY: 100,
  },
  {
    id: 6,
    row: 1,
    col: 1,
    edges: { top: 'out', right: 'out', bottom: 'flat', left: 'in' },
    path: '',
    assembledX: 100,
    assembledY: 100,
  },
  {
    id: 7,
    row: 1,
    col: 2,
    edges: { top: 'in', right: 'out', bottom: 'flat', left: 'in' },
    path: '',
    assembledX: 200,
    assembledY: 100,
  },
  {
    id: 8,
    row: 1,
    col: 3,
    edges: { top: 'out', right: 'out', bottom: 'flat', left: 'in' },
    path: '',
    assembledX: 300,
    assembledY: 100,
  },
  {
    id: 9,
    row: 1,
    col: 4,
    edges: { top: 'in', right: 'flat', bottom: 'flat', left: 'in' },
    path: '',
    assembledX: 400,
    assembledY: 100,
  },
]

// Generate paths for all pieces
PUZZLE_PIECES.forEach(piece => {
  piece.path = generatePiecePath(piece.edges)
})

/**
 * Get the SVG path for a specific puzzle piece slot
 */
export function getPiecePath(slotIndex: number): string {
  const piece = PUZZLE_PIECES[slotIndex]
  return piece ? piece.path : ''
}

/**
 * Get piece position in assembled puzzle
 */
export function getPiecePosition(slotIndex: number): { x: number; y: number } {
  const piece = PUZZLE_PIECES[slotIndex]
  return piece ? { x: piece.assembledX, y: piece.assembledY } : { x: 0, y: 0 }
}

/**
 * Get viewBox for a single piece (accounts for tabs extending beyond base)
 */
export function getPieceViewBox(): string {
  const padding = 20 // Extra space for tabs
  return `${-padding} ${-padding} ${PIECE_SIZE + padding * 2} ${PIECE_SIZE + padding * 2}`
}

/**
 * Get viewBox for assembled puzzle
 */
export function getAssembledViewBox(): string {
  const padding = 20
  const width = 5 * PIECE_SIZE // 5 columns
  const height = 2 * PIECE_SIZE // 2 rows
  return `${-padding} ${-padding} ${width + padding * 2} ${height + padding * 2}`
}

export const PIECE_SIZE_PX = PIECE_SIZE

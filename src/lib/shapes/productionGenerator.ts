/**
 * PRODUCTION FILE GENERATOR
 * 
 * Generates production-ready files from puzzle templates:
 * - SVG files for laser cutting
 * - Cut files with proper stroke settings
 * - Assembly guides
 * - Piece manifests
 * 
 * All dimensions are in millimeters for production accuracy.
 */

import { PuzzleTemplate, PlacedPiece, ShapeVariant, BaseShape, generateConnectorPath } from './shapeSystem'
import { SHAPE_DEFINITIONS } from './shapeDefinitions'
import { parseVariantId } from './shapeSystem'

// ============================================================================
// PRODUCTION CONFIGURATION
// ============================================================================

export interface ProductionConfig {
  // Output dimensions
  pageWidth: number       // mm
  pageHeight: number      // mm
  margin: number          // mm from edge
  
  // Piece sizing
  pieceScale: number      // Scale factor for pieces (1.0 = 100mm base)
  pieceSpacing: number    // Gap between pieces on sheet
  
  // Cut settings
  cutStrokeWidth: number  // Line width for laser
  cutStrokeColor: string  // Usually pure red for laser cutters
  
  // Engraving settings (for optional decorations)
  engraveStrokeWidth: number
  engraveStrokeColor: string
  
  // Material
  materialThickness: number  // mm
  materialName: string
}

const DEFAULT_PRODUCTION_CONFIG: ProductionConfig = {
  pageWidth: 600,         // 600mm = ~24 inches
  pageHeight: 400,        // 400mm = ~16 inches
  margin: 10,
  
  pieceScale: 0.5,        // 50mm pieces (from 100 unit base)
  pieceSpacing: 3,        // 3mm between pieces
  
  cutStrokeWidth: 0.1,    // Hairline for laser
  cutStrokeColor: '#FF0000',  // Pure red
  
  engraveStrokeWidth: 0.3,
  engraveStrokeColor: '#0000FF',  // Blue for engrave
  
  materialThickness: 3,   // 3mm plywood
  materialName: 'Birch Plywood',
}

// ============================================================================
// SVG GENERATION
// ============================================================================

interface SVGGeneratorContext {
  pieces: PuzzleTemplate['pieces']
  config: ProductionConfig
  variantCache: Map<string, string>  // variantId -> SVG path with connectors
}

/**
 * Generate complete SVG for laser cutting
 */
export function generateProductionSVG(
  template: PuzzleTemplate,
  config: ProductionConfig = DEFAULT_PRODUCTION_CONFIG
): string {
  const context: SVGGeneratorContext = {
    pieces: template.pieces,
    config,
    variantCache: new Map(),
  }
  
  // Calculate usable area
  const usableWidth = config.pageWidth - 2 * config.margin
  const usableHeight = config.pageHeight - 2 * config.margin
  
  // Calculate piece actual size
  const pieceSize = 100 * config.pieceScale  // Base is 100 units
  const cellSize = pieceSize + config.pieceSpacing
  
  // Calculate how many pieces fit per row
  const piecesPerRow = Math.floor(usableWidth / cellSize)
  const numRows = Math.ceil(template.pieces.length / piecesPerRow)
  
  // Build SVG content
  const svgPieces = template.pieces.map((piece, index) => {
    const row = Math.floor(index / piecesPerRow)
    const col = index % piecesPerRow
    
    const x = config.margin + col * cellSize
    const y = config.margin + row * cellSize
    
    return generatePieceSVG(piece, x, y, context)
  }).join('\n')
  
  // Calculate actual page height needed
  const actualHeight = Math.max(
    config.pageHeight,
    config.margin * 2 + numRows * cellSize
  )
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" 
     width="${config.pageWidth}mm" 
     height="${actualHeight}mm"
     viewBox="0 0 ${config.pageWidth} ${actualHeight}">
  
  <!-- Production SVG for: ${template.id} -->
  <!-- Total pieces: ${template.pieces.length} -->
  <!-- Material: ${config.materialName} (${config.materialThickness}mm) -->
  <!-- Generated: ${new Date().toISOString()} -->
  
  <style>
    .cut { 
      fill: none; 
      stroke: ${config.cutStrokeColor}; 
      stroke-width: ${config.cutStrokeWidth}; 
    }
    .engrave { 
      fill: none; 
      stroke: ${config.engraveStrokeColor}; 
      stroke-width: ${config.engraveStrokeWidth}; 
    }
  </style>
  
  <g id="pieces">
${svgPieces}
  </g>
</svg>`
}

/**
 * Generate SVG for a single piece
 */
function generatePieceSVG(
  piece: PlacedPiece,
  x: number,
  y: number,
  context: SVGGeneratorContext
): string {
  const { config, variantCache } = context
  const { baseShapeId } = parseVariantId(piece.variantId)
  
  const shape = SHAPE_DEFINITIONS[baseShapeId]
  if (!shape) {
    console.error(`Unknown shape: ${baseShapeId}`)
    return ''
  }
  
  // Get or generate the path with connectors
  let pathWithConnectors = variantCache.get(piece.variantId)
  if (!pathWithConnectors) {
    pathWithConnectors = generateShapePathWithConnectors(piece.variantId, shape)
    variantCache.set(piece.variantId, pathWithConnectors)
  }
  
  // Apply transformations
  const scale = config.pieceScale
  const rotation = piece.rotation
  const centerX = 50 * scale  // Center of 100-unit piece
  const centerY = 50 * scale
  
  const transform = `translate(${x}, ${y}) rotate(${rotation}, ${centerX}, ${centerY}) scale(${scale})`
  
  return `    <g id="piece-${piece.id}" transform="${transform}">
      <path class="cut" d="${pathWithConnectors}" />
    </g>`
}

/**
 * Generate shape path including connector geometry
 */
function generateShapePathWithConnectors(
  variantId: string,
  shape: BaseShape
): string {
  // For now, return the base shape path
  // In a full implementation, we would:
  // 1. Parse the outline path
  // 2. Insert connector geometry at each anchor point
  // 3. Return the modified path
  
  // This is a simplified version that just uses the base shape
  return shape.outlinePath.trim().replace(/\s+/g, ' ')
}

// ============================================================================
// DXF GENERATION (for CAD software)
// ============================================================================

/**
 * Generate DXF file content
 * DXF is widely used for laser cutting and CNC machines
 */
export function generateProductionDXF(
  template: PuzzleTemplate,
  config: ProductionConfig = DEFAULT_PRODUCTION_CONFIG
): string {
  // DXF header
  let dxf = `0
SECTION
2
HEADER
0
ENDSEC
0
SECTION
2
ENTITIES
`

  // Calculate layout
  const pieceSize = 100 * config.pieceScale
  const cellSize = pieceSize + config.pieceSpacing
  const usableWidth = config.pageWidth - 2 * config.margin
  const piecesPerRow = Math.floor(usableWidth / cellSize)

  // Generate entities for each piece
  for (let i = 0; i < template.pieces.length; i++) {
    const piece = template.pieces[i]
    const row = Math.floor(i / piecesPerRow)
    const col = i % piecesPerRow
    
    const x = config.margin + col * cellSize
    const y = config.margin + row * cellSize
    
    dxf += generatePieceDXF(piece, x, y, config)
  }

  // DXF footer
  dxf += `0
ENDSEC
0
EOF
`
  
  return dxf
}

/**
 * Generate DXF entities for a single piece
 */
function generatePieceDXF(
  piece: PlacedPiece,
  x: number,
  y: number,
  config: ProductionConfig
): string {
  const { baseShapeId } = parseVariantId(piece.variantId)
  const shape = SHAPE_DEFINITIONS[baseShapeId]
  
  if (!shape) return ''
  
  // Convert SVG path to DXF polyline
  // This is a simplified version - full implementation would parse SVG paths
  const scale = config.pieceScale
  
  // For now, create a placeholder rectangle
  // In production, this would trace the actual shape path
  const width = (shape.boundingBox?.width || 80) * scale
  const height = (shape.boundingBox?.height || 80) * scale
  
  return `0
LWPOLYLINE
8
PIECES
90
4
70
1
10
${x}
20
${y}
10
${x + width}
20
${y}
10
${x + width}
20
${y + height}
10
${x}
20
${y + height}
`
}

// ============================================================================
// ASSEMBLY GUIDE GENERATION
// ============================================================================

/**
 * Generate an assembly guide showing piece placement
 */
export function generateAssemblyGuide(
  template: PuzzleTemplate
): string {
  const { gridWidth, gridHeight, pieces, shapes } = template
  const cellSize = 60  // For visual guide
  const svgWidth = gridWidth * cellSize + 40
  const svgHeight = gridHeight * cellSize + 100
  
  // Group pieces by position
  const grid = new Map<string, PlacedPiece>()
  for (const piece of pieces) {
    grid.set(`${piece.x},${piece.y}`, piece)
  }
  
  // Generate grid cells
  const cells: string[] = []
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      const piece = grid.get(`${x},${y}`)
      if (piece) {
        const { baseShapeId } = parseVariantId(piece.variantId)
        const colorIndex = shapes.indexOf(baseShapeId) % 10
        const color = SHAPE_COLORS[colorIndex]
        
        cells.push(`
      <rect x="${20 + x * cellSize}" y="${20 + y * cellSize}" 
            width="${cellSize - 2}" height="${cellSize - 2}"
            fill="${color}" stroke="#333" stroke-width="1" rx="3" />
      <text x="${20 + x * cellSize + cellSize/2}" y="${20 + y * cellSize + cellSize/2 + 4}"
            text-anchor="middle" font-size="8" fill="#333">
        ${baseShapeId.slice(0, 3)}
      </text>`)
      }
    }
  }
  
  // Generate legend
  const legend = shapes.map((shapeId, i) => {
    const color = SHAPE_COLORS[i % 10]
    return `
      <rect x="${20 + i * 50}" y="${gridHeight * cellSize + 40}" 
            width="12" height="12" fill="${color}" stroke="#333" />
      <text x="${35 + i * 50}" y="${gridHeight * cellSize + 50}" 
            font-size="8">${shapeId}</text>`
  }).join('')
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" 
     width="${svgWidth}" height="${svgHeight}"
     viewBox="0 0 ${svgWidth} ${svgHeight}">
  
  <style>
    text { font-family: Arial, sans-serif; }
  </style>
  
  <text x="${svgWidth/2}" y="15" text-anchor="middle" font-size="12" font-weight="bold">
    Assembly Guide - ${pieces.length} pieces
  </text>
  
  <g id="grid">
    ${cells.join('')}
  </g>
  
  <g id="legend">
    ${legend}
  </g>
</svg>`
}

const SHAPE_COLORS = [
  '#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF',
  '#E2BAFF', '#FFB3E6', '#C9FFBA', '#BAFFFD', '#FFDAB3',
]

// ============================================================================
// PIECE MANIFEST (for inventory/production tracking)
// ============================================================================

export interface ManifestEntry {
  shapeId: string
  shapeName: string
  variantId: string
  quantity: number
}

/**
 * Generate a manifest of pieces needed for production
 */
export function generatePieceManifest(template: PuzzleTemplate): ManifestEntry[] {
  const variantCounts = new Map<string, number>()
  
  for (const piece of template.pieces) {
    const count = variantCounts.get(piece.variantId) || 0
    variantCounts.set(piece.variantId, count + 1)
  }
  
  const manifest: ManifestEntry[] = []
  
  for (const [variantId, quantity] of variantCounts) {
    const { baseShapeId } = parseVariantId(variantId)
    const shape = SHAPE_DEFINITIONS[baseShapeId]
    
    manifest.push({
      shapeId: baseShapeId,
      shapeName: shape?.name || baseShapeId,
      variantId,
      quantity,
    })
  }
  
  // Sort by shape, then variant
  manifest.sort((a, b) => {
    if (a.shapeId !== b.shapeId) return a.shapeId.localeCompare(b.shapeId)
    return a.variantId.localeCompare(b.variantId)
  })
  
  return manifest
}

/**
 * Generate manifest as printable text
 */
export function manifestToText(manifest: ManifestEntry[]): string {
  let text = 'PUZZLE PIECE MANIFEST\n'
  text += '='.repeat(50) + '\n\n'
  
  let currentShape = ''
  let shapeTotal = 0
  
  for (const entry of manifest) {
    if (entry.shapeId !== currentShape) {
      if (currentShape) {
        text += `  Subtotal: ${shapeTotal} pieces\n\n`
      }
      currentShape = entry.shapeId
      shapeTotal = 0
      text += `${entry.shapeName.toUpperCase()}\n`
    }
    
    text += `  ${entry.variantId}: ${entry.quantity}x\n`
    shapeTotal += entry.quantity
  }
  
  if (currentShape) {
    text += `  Subtotal: ${shapeTotal} pieces\n`
  }
  
  text += '\n' + '='.repeat(50) + '\n'
  text += `TOTAL PIECES: ${manifest.reduce((sum, e) => sum + e.quantity, 0)}\n`
  
  return text
}

// ============================================================================
// EXPORT BUNDLE (all production files together)
// ============================================================================

export interface ProductionBundle {
  templateId: string
  svg: string
  dxf: string
  assemblyGuide: string
  manifest: ManifestEntry[]
  manifestText: string
  config: ProductionConfig
  generatedAt: string
}

/**
 * Generate complete production bundle
 */
export function generateProductionBundle(
  template: PuzzleTemplate,
  config: ProductionConfig = DEFAULT_PRODUCTION_CONFIG
): ProductionBundle {
  const manifest = generatePieceManifest(template)
  
  return {
    templateId: template.id,
    svg: generateProductionSVG(template, config),
    dxf: generateProductionDXF(template, config),
    assemblyGuide: generateAssemblyGuide(template),
    manifest,
    manifestText: manifestToText(manifest),
    config,
    generatedAt: new Date().toISOString(),
  }
}

/**
 * Download helper for browser
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Download complete production bundle
 */
export function downloadProductionBundle(bundle: ProductionBundle): void {
  downloadFile(bundle.svg, `puzzle-${bundle.templateId}-cut.svg`, 'image/svg+xml')
  downloadFile(bundle.dxf, `puzzle-${bundle.templateId}-cut.dxf`, 'application/dxf')
  downloadFile(bundle.assemblyGuide, `puzzle-${bundle.templateId}-guide.svg`, 'image/svg+xml')
  downloadFile(bundle.manifestText, `puzzle-${bundle.templateId}-manifest.txt`, 'text/plain')
}

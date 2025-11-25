/**
 * Shape System - Main Export
 * 
 * This module provides the complete puzzle piece shape system:
 * - Shape definitions with SVG outlines and anchor points
 * - Universal connector system (A/B/C/D types)
 * - Variant generation (different connector combinations)
 * - Template generation (150-piece puzzle layouts)
 * - Template caching for performance
 * - Production file generation (SVG/DXF for laser cutting)
 */

// Core system types and utilities
export {
  // Types
  type AnchorPoint,
  type ConnectorType,
  type ConnectorGender,
  type ConnectorAssignment,
  type BaseShape,
  type ShapeVariant,
  type PlacedPiece,
  type PuzzleTemplate,
  type PieceManifest,
  
  // Constants
  CONNECTOR_CONFIG,
  
  // Functions
  generateConnectorPath,
  hashShapeCombination,
  canConnect,
  oppositeGender,
  generateAllConnectorCombinations,
  createVariantId,
  parseVariantId,
} from './shapeSystem'

// Shape definitions (the 40 shape silhouettes)
export {
  SHAPE_DEFINITIONS,
  ALL_SHAPE_IDS,
  getShapesByCategory,
  
  // Individual shapes (if needed for direct access)
  dolphinShape,
  butterflyShape,
  heartShape,
  starShape,
  // ... etc
} from './shapeDefinitions'

// Variant generation
export {
  type VariantGenerationConfig,
  type ConnectorSignature,
  type EdgeVariant,
  
  generateShapeVariants,
  generateAllVariants,
  generateCoreVariants,
  generateEdgeVariants,
  
  getConnectorSignature,
  findCompatibleVariants,
  getVariantStats,
  printVariantStats,
} from './variantGenerator'

// Template generation
export {
  type TemplateConfig,
  
  generatePuzzleTemplate,
  testTemplateGeneration,
} from './templateGenerator'

// Template caching
export {
  type TemplateCache,
  type CacheStats,
  type CacheType,
  
  templateCache,
  POPULAR_COMBINATIONS,
  pregeneratePopular,
} from './templateCache'

// Production file generation
export {
  type ProductionConfig,
  type ManifestEntry,
  type ProductionBundle,
  
  generateProductionSVG,
  generateProductionDXF,
  generateAssemblyGuide,
  generatePieceManifest,
  manifestToText,
  generateProductionBundle,
  downloadFile,
  downloadProductionBundle,
} from './productionGenerator'

/**
 * VARIANT GENERATOR
 * 
 * Generates all possible connector combinations for each shape.
 * 
 * With 4 connector types (A, B, C, D) and 2 genders (male, female),
 * each anchor point has 8 possible states.
 * 
 * For a shape with N anchor points:
 * - Total possible variants = 8^N
 * - 4 anchors = 4,096 variants
 * - 5 anchors = 32,768 variants
 * - 6 anchors = 262,144 variants
 * 
 * In practice, we filter to only useful variants based on:
 * 1. Edge compatibility (certain positions need male vs female)
 * 2. Connection diversity (we want variety in connector types)
 * 3. Production optimization (reduce unique pieces needed)
 */

import { BaseShape, ShapeVariant, ConnectorAssignment, ConnectorType, ConnectorGender, createVariantId } from './shapeSystem'
import { SHAPE_DEFINITIONS } from './shapeDefinitions'

// ============================================================================
// VARIANT GENERATION CONFIGURATION
// ============================================================================

export interface VariantGenerationConfig {
  // Maximum variants per shape (limits combinatorial explosion)
  maxVariantsPerShape: number
  
  // Whether to require balanced connector types
  requireBalancedTypes: boolean
  
  // Minimum different connector types required
  minConnectorTypes: number
  
  // Whether to include edge variants (for puzzle border pieces)
  includeEdgeVariants: boolean
}

const DEFAULT_CONFIG: VariantGenerationConfig = {
  maxVariantsPerShape: 500,
  requireBalancedTypes: false,
  minConnectorTypes: 2,
  includeEdgeVariants: true,
}

// ============================================================================
// CORE GENERATOR FUNCTIONS
// ============================================================================

/**
 * Generate all possible connector combinations for given anchors
 */
function* generateAllCombinations(
  anchorIds: string[],
  connectorTypes: ConnectorType[] = ['A', 'B', 'C', 'D']
): Generator<ConnectorAssignment[]> {
  const genders: ConnectorGender[] = ['male', 'female']
  const numAnchors = anchorIds.length
  
  // Total combinations = (types * genders) ^ anchors
  const optionsPerAnchor = connectorTypes.length * genders.length
  const totalCombinations = Math.pow(optionsPerAnchor, numAnchors)
  
  for (let i = 0; i < totalCombinations; i++) {
    const assignments: ConnectorAssignment[] = []
    let remaining = i
    
    for (let j = 0; j < numAnchors; j++) {
      const optionIndex = remaining % optionsPerAnchor
      remaining = Math.floor(remaining / optionsPerAnchor)
      
      const typeIndex = Math.floor(optionIndex / genders.length)
      const genderIndex = optionIndex % genders.length
      
      assignments.push({
        anchorId: anchorIds[j],
        type: connectorTypes[typeIndex],
        gender: genders[genderIndex],
      })
    }
    
    yield assignments
  }
}

/**
 * Check if a combination meets the requirements
 */
function isValidCombination(
  assignments: ConnectorAssignment[],
  config: VariantGenerationConfig
): boolean {
  // Check minimum connector types
  const usedTypes = new Set(assignments.map(a => a.type))
  if (usedTypes.size < config.minConnectorTypes) {
    return false
  }
  
  // Check balanced types if required
  if (config.requireBalancedTypes) {
    const typeCounts: Record<string, number> = {}
    for (const a of assignments) {
      typeCounts[a.type] = (typeCounts[a.type] || 0) + 1
    }
    const counts = Object.values(typeCounts)
    const maxCount = Math.max(...counts)
    const minCount = Math.min(...counts)
    if (maxCount - minCount > 2) {
      return false
    }
  }
  
  return true
}

/**
 * Generate variants for a single shape
 */
export function generateShapeVariants(
  shape: BaseShape,
  config: VariantGenerationConfig = DEFAULT_CONFIG
): ShapeVariant[] {
  const variants: ShapeVariant[] = []
  const anchorIds = shape.anchors.map(a => a.id)
  
  const generator = generateAllCombinations(anchorIds)
  
  for (const assignments of generator) {
    if (variants.length >= config.maxVariantsPerShape) {
      break
    }
    
    if (!isValidCombination(assignments, config)) {
      continue
    }
    
    const variantId = createVariantId(shape.id, assignments)
    
    variants.push({
      baseShapeId: shape.id,
      variantId,
      connectors: assignments,
    })
  }
  
  return variants
}

/**
 * Generate all variants for all shapes
 */
export function generateAllVariants(
  config: VariantGenerationConfig = DEFAULT_CONFIG
): Map<string, ShapeVariant[]> {
  const allVariants = new Map<string, ShapeVariant[]>()
  
  for (const [shapeId, shape] of Object.entries(SHAPE_DEFINITIONS)) {
    const variants = generateShapeVariants(shape, config)
    allVariants.set(shapeId, variants)
  }
  
  return allVariants
}

// ============================================================================
// STRATEGIC VARIANT SELECTION
// ============================================================================

/**
 * Connector signature for a variant (useful for matching)
 */
export interface ConnectorSignature {
  maleTypes: ConnectorType[]
  femaleTypes: ConnectorType[]
}

/**
 * Get the connector signature for a variant
 */
export function getConnectorSignature(variant: ShapeVariant): ConnectorSignature {
  const maleTypes: ConnectorType[] = []
  const femaleTypes: ConnectorType[] = []
  
  for (const conn of variant.connectors) {
    if (conn.gender === 'male') {
      maleTypes.push(conn.type)
    } else {
      femaleTypes.push(conn.type)
    }
  }
  
  return {
    maleTypes: maleTypes.sort(),
    femaleTypes: femaleTypes.sort(),
  }
}

/**
 * Find variants that can connect to a given connector
 */
export function findCompatibleVariants(
  allVariants: ShapeVariant[],
  targetType: ConnectorType,
  targetGender: ConnectorGender
): ShapeVariant[] {
  const oppositeGender = targetGender === 'male' ? 'female' : 'male'
  
  return allVariants.filter(variant =>
    variant.connectors.some(
      conn => conn.type === targetType && conn.gender === oppositeGender
    )
  )
}

/**
 * Generate a "core" set of variants optimized for puzzle assembly
 * This reduces the total variant count while maintaining flexibility
 */
export function generateCoreVariants(
  shape: BaseShape,
  count: number = 20
): ShapeVariant[] {
  const anchorIds = shape.anchors.map(a => a.id)
  const numAnchors = anchorIds.length
  const variants: ShapeVariant[] = []
  const seenPatterns = new Set<string>()
  
  // Strategy: Generate variants with good diversity
  const patterns: Array<{ types: ConnectorType[]; genderPattern: ('male' | 'female')[] }> = []
  
  // Pattern 1: Alternating genders with single type
  for (const type of ['A', 'B', 'C', 'D'] as ConnectorType[]) {
    const genderPattern = anchorIds.map((_, i) => i % 2 === 0 ? 'male' : 'female') as ConnectorGender[]
    patterns.push({ types: Array(numAnchors).fill(type), genderPattern })
  }
  
  // Pattern 2: Mixed types with consistent gender
  for (const gender of ['male', 'female'] as ConnectorGender[]) {
    const types = anchorIds.map((_, i) => ['A', 'B', 'C', 'D'][i % 4] as ConnectorType)
    patterns.push({ types, genderPattern: Array(numAnchors).fill(gender) })
  }
  
  // Pattern 3: All combinations of 2 types
  const typePairs: [ConnectorType, ConnectorType][] = [
    ['A', 'B'], ['A', 'C'], ['A', 'D'], ['B', 'C'], ['B', 'D'], ['C', 'D']
  ]
  for (const [t1, t2] of typePairs) {
    const types = anchorIds.map((_, i) => i % 2 === 0 ? t1 : t2)
    patterns.push({
      types,
      genderPattern: anchorIds.map((_, i) => i % 2 === 0 ? 'male' : 'female') as ConnectorGender[]
    })
  }
  
  // Generate variants from patterns
  for (const pattern of patterns) {
    if (variants.length >= count) break
    
    const assignments: ConnectorAssignment[] = anchorIds.map((id, i) => ({
      anchorId: id,
      type: pattern.types[i],
      gender: pattern.genderPattern[i],
    }))
    
    const patternKey = assignments.map(a => `${a.type}${a.gender[0]}`).join('')
    if (seenPatterns.has(patternKey)) continue
    seenPatterns.add(patternKey)
    
    const variantId = createVariantId(shape.id, assignments)
    variants.push({
      baseShapeId: shape.id,
      variantId,
      connectors: assignments,
    })
  }
  
  return variants
}

// ============================================================================
// VARIANT STATISTICS
// ============================================================================

export interface VariantStats {
  shapeId: string
  totalPossible: number
  generated: number
  anchorCount: number
  typeDistribution: Record<ConnectorType, number>
  genderDistribution: { male: number; female: number }
}

/**
 * Get statistics about variants for a shape
 */
export function getVariantStats(
  shape: BaseShape,
  variants: ShapeVariant[]
): VariantStats {
  const anchorCount = shape.anchors.length
  const totalPossible = Math.pow(8, anchorCount) // 4 types * 2 genders
  
  const typeDistribution: Record<ConnectorType, number> = { A: 0, B: 0, C: 0, D: 0 }
  const genderDistribution = { male: 0, female: 0 }
  
  for (const variant of variants) {
    for (const conn of variant.connectors) {
      typeDistribution[conn.type]++
      genderDistribution[conn.gender]++
    }
  }
  
  return {
    shapeId: shape.id,
    totalPossible,
    generated: variants.length,
    anchorCount,
    typeDistribution,
    genderDistribution,
  }
}

/**
 * Print variant statistics (for debugging/development)
 */
export function printVariantStats(stats: VariantStats): void {
  console.log(`\nShape: ${stats.shapeId}`)
  console.log(`  Anchors: ${stats.anchorCount}`)
  console.log(`  Total possible: ${stats.totalPossible.toLocaleString()}`)
  console.log(`  Generated: ${stats.generated}`)
  console.log(`  Types: A=${stats.typeDistribution.A}, B=${stats.typeDistribution.B}, C=${stats.typeDistribution.C}, D=${stats.typeDistribution.D}`)
  console.log(`  Genders: male=${stats.genderDistribution.male}, female=${stats.genderDistribution.female}`)
}

// ============================================================================
// EDGE VARIANT HELPERS (for puzzle border pieces)
// ============================================================================

/**
 * Mark specific anchors as "edge" (no connector - flat edge)
 * Useful for border pieces that don't connect on one side
 */
export interface EdgeVariant extends ShapeVariant {
  edgeAnchors: string[]  // Anchors that have flat edges instead of connectors
}

/**
 * Generate variants with one or more edge sides (for border pieces)
 */
export function generateEdgeVariants(
  shape: BaseShape,
  maxEdgeAnchors: number = 2
): EdgeVariant[] {
  const variants: EdgeVariant[] = []
  const anchorIds = shape.anchors.map(a => a.id)
  
  // Generate combinations of edge anchors
  for (let numEdges = 1; numEdges <= Math.min(maxEdgeAnchors, anchorIds.length - 1); numEdges++) {
    const edgeCombinations = getCombinations(anchorIds, numEdges)
    
    for (const edgeAnchors of edgeCombinations) {
      const activeAnchors = anchorIds.filter(id => !edgeAnchors.includes(id))
      
      // Generate a few variants for each edge configuration
      const coreVariants = generateCoreVariants({ ...shape, anchors: shape.anchors.filter(a => activeAnchors.includes(a.id)) }, 5)
      
      for (const baseVariant of coreVariants) {
        variants.push({
          ...baseVariant,
          variantId: `${baseVariant.variantId}_edge${edgeAnchors.join('')}`,
          edgeAnchors,
        })
      }
    }
  }
  
  return variants
}

/**
 * Helper: Get all combinations of size k from array
 */
function getCombinations<T>(arr: T[], k: number): T[][] {
  if (k === 0) return [[]]
  if (k > arr.length) return []
  
  const result: T[][] = []
  
  function backtrack(start: number, current: T[]): void {
    if (current.length === k) {
      result.push([...current])
      return
    }
    
    for (let i = start; i < arr.length; i++) {
      current.push(arr[i])
      backtrack(i + 1, current)
      current.pop()
    }
  }
  
  backtrack(0, [])
  return result
}

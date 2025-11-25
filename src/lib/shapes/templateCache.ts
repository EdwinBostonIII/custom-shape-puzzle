/**
 * TEMPLATE CACHE
 * 
 * Caches generated puzzle templates for reuse.
 * When a customer selects the same 10-shape combination that was previously generated,
 * we can reuse the existing template instead of regenerating.
 * 
 * Cache key: Sorted combination of shape IDs (order-independent)
 * 
 * Storage strategies:
 * 1. In-memory cache (for development/demo)
 * 2. LocalStorage/IndexedDB (for client-side persistence)
 * 3. Server-side (for production - would use database)
 */

import { PuzzleTemplate, hashShapeCombination } from './shapeSystem'
import { generatePuzzleTemplate, TemplateConfig } from './templateGenerator'

// ============================================================================
// CACHE INTERFACE
// ============================================================================

export interface TemplateCache {
  get(shapeIds: string[]): PuzzleTemplate | null
  set(template: PuzzleTemplate): void
  has(shapeIds: string[]): boolean
  delete(shapeIds: string[]): boolean
  clear(): void
  getAll(): PuzzleTemplate[]
  getStats(): CacheStats
}

export interface CacheStats {
  totalTemplates: number
  totalPieces: number
  hitCount: number
  missCount: number
  hitRate: number
}

// ============================================================================
// IN-MEMORY CACHE IMPLEMENTATION
// ============================================================================

class InMemoryTemplateCache implements TemplateCache {
  private cache: Map<string, PuzzleTemplate> = new Map()
  private hitCount: number = 0
  private missCount: number = 0
  
  get(shapeIds: string[]): PuzzleTemplate | null {
    const key = hashShapeCombination(shapeIds)
    const template = this.cache.get(key)
    
    if (template) {
      this.hitCount++
      return template
    }
    
    this.missCount++
    return null
  }
  
  set(template: PuzzleTemplate): void {
    this.cache.set(template.id, template)
  }
  
  has(shapeIds: string[]): boolean {
    const key = hashShapeCombination(shapeIds)
    return this.cache.has(key)
  }
  
  delete(shapeIds: string[]): boolean {
    const key = hashShapeCombination(shapeIds)
    return this.cache.delete(key)
  }
  
  clear(): void {
    this.cache.clear()
    this.hitCount = 0
    this.missCount = 0
  }
  
  getAll(): PuzzleTemplate[] {
    return Array.from(this.cache.values())
  }
  
  getStats(): CacheStats {
    const totalTemplates = this.cache.size
    const totalPieces = Array.from(this.cache.values()).reduce(
      (sum, t) => sum + t.pieces.length,
      0
    )
    const total = this.hitCount + this.missCount
    
    return {
      totalTemplates,
      totalPieces,
      hitCount: this.hitCount,
      missCount: this.missCount,
      hitRate: total > 0 ? this.hitCount / total : 0,
    }
  }
}

// ============================================================================
// LOCALSTORAGE CACHE IMPLEMENTATION
// ============================================================================

const STORAGE_KEY_PREFIX = 'puzzle-template-'
const STORAGE_INDEX_KEY = 'puzzle-template-index'

class LocalStorageTemplateCache implements TemplateCache {
  private hitCount: number = 0
  private missCount: number = 0
  
  private getIndex(): string[] {
    try {
      const indexJson = localStorage.getItem(STORAGE_INDEX_KEY)
      return indexJson ? JSON.parse(indexJson) : []
    } catch {
      return []
    }
  }
  
  private setIndex(index: string[]): void {
    localStorage.setItem(STORAGE_INDEX_KEY, JSON.stringify(index))
  }
  
  get(shapeIds: string[]): PuzzleTemplate | null {
    const key = hashShapeCombination(shapeIds)
    try {
      const json = localStorage.getItem(STORAGE_KEY_PREFIX + key)
      if (json) {
        this.hitCount++
        return JSON.parse(json)
      }
    } catch (e) {
      console.error('Error reading template from localStorage:', e)
    }
    
    this.missCount++
    return null
  }
  
  set(template: PuzzleTemplate): void {
    try {
      const key = template.id
      localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(template))
      
      // Update index
      const index = this.getIndex()
      if (!index.includes(key)) {
        index.push(key)
        this.setIndex(index)
      }
    } catch (e) {
      console.error('Error saving template to localStorage:', e)
      // May be storage full - try to clear old templates
      this.evictOldest()
    }
  }
  
  has(shapeIds: string[]): boolean {
    const key = hashShapeCombination(shapeIds)
    return localStorage.getItem(STORAGE_KEY_PREFIX + key) !== null
  }
  
  delete(shapeIds: string[]): boolean {
    const key = hashShapeCombination(shapeIds)
    const existed = localStorage.getItem(STORAGE_KEY_PREFIX + key) !== null
    localStorage.removeItem(STORAGE_KEY_PREFIX + key)
    
    // Update index
    const index = this.getIndex().filter(k => k !== key)
    this.setIndex(index)
    
    return existed
  }
  
  clear(): void {
    const index = this.getIndex()
    for (const key of index) {
      localStorage.removeItem(STORAGE_KEY_PREFIX + key)
    }
    localStorage.removeItem(STORAGE_INDEX_KEY)
    this.hitCount = 0
    this.missCount = 0
  }
  
  getAll(): PuzzleTemplate[] {
    const templates: PuzzleTemplate[] = []
    const index = this.getIndex()
    
    for (const key of index) {
      try {
        const json = localStorage.getItem(STORAGE_KEY_PREFIX + key)
        if (json) {
          templates.push(JSON.parse(json))
        }
      } catch {
        // Skip corrupt entries
      }
    }
    
    return templates
  }
  
  getStats(): CacheStats {
    const templates = this.getAll()
    const totalTemplates = templates.length
    const totalPieces = templates.reduce((sum, t) => sum + t.pieces.length, 0)
    const total = this.hitCount + this.missCount
    
    return {
      totalTemplates,
      totalPieces,
      hitCount: this.hitCount,
      missCount: this.missCount,
      hitRate: total > 0 ? this.hitCount / total : 0,
    }
  }
  
  private evictOldest(): void {
    const templates = this.getAll()
    if (templates.length === 0) return
    
    // Sort by createdAt and remove oldest
    templates.sort((a, b) => a.createdAt - b.createdAt)
    const oldest = templates[0]
    this.delete(oldest.shapes)
  }
}

// ============================================================================
// CACHE MANAGER
// ============================================================================

export type CacheType = 'memory' | 'localStorage'

class CacheManager {
  private cache: TemplateCache
  private config: TemplateConfig | null = null
  
  constructor(type: CacheType = 'memory') {
    this.cache = type === 'memory' 
      ? new InMemoryTemplateCache()
      : new LocalStorageTemplateCache()
  }
  
  /**
   * Set the template generation config
   */
  setConfig(config: TemplateConfig): void {
    this.config = config
  }
  
  /**
   * Get or generate a template for the given shapes
   */
  async getOrCreateTemplate(shapeIds: string[]): Promise<PuzzleTemplate | null> {
    // Check cache first
    const cached = this.cache.get(shapeIds)
    if (cached) {
      console.log('Template cache hit!')
      return cached
    }
    
    console.log('Template cache miss - generating new template...')
    
    // Generate new template
    const template = generatePuzzleTemplate(
      shapeIds,
      this.config || undefined
    )
    
    if (template) {
      this.cache.set(template)
    }
    
    return template
  }
  
  /**
   * Pre-generate templates for popular combinations
   */
  async pregenerateTemplates(combinations: string[][]): Promise<number> {
    let generated = 0
    
    for (const shapeIds of combinations) {
      if (!this.cache.has(shapeIds)) {
        const template = await this.getOrCreateTemplate(shapeIds)
        if (template) generated++
      }
    }
    
    return generated
  }
  
  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return this.cache.getStats()
  }
  
  /**
   * Clear the cache
   */
  clear(): void {
    this.cache.clear()
  }
  
  /**
   * Get all cached templates
   */
  getAllTemplates(): PuzzleTemplate[] {
    return this.cache.getAll()
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

// Use localStorage in browser, memory in Node
const isServer = typeof window === 'undefined'
export const templateCache = new CacheManager(isServer ? 'memory' : 'localStorage')

// ============================================================================
// POPULAR COMBINATIONS (for pre-generation)
// ============================================================================

/**
 * Some commonly selected shape combinations (for occasion packs)
 * These could be pre-generated at build time or on first load
 */
export const POPULAR_COMBINATIONS = [
  // Birthday Pack
  ['balloon', 'gift', 'cake', 'star', 'heart', 'confetti', 'crown', 'ribbon', 'candle', 'party'],
  
  // Wedding Pack
  ['heart', 'ring', 'dove', 'flower', 'bell', 'champagne', 'cake', 'bow', 'star', 'butterfly'],
  
  // Nature Pack
  ['tree', 'flower', 'sun', 'leaf', 'mountain', 'butterfly', 'bird', 'cloud', 'rainbow', 'mushroom'],
  
  // Travel Pack
  ['airplane', 'car', 'compass', 'anchor', 'globe', 'camera', 'suitcase', 'map', 'palm', 'lighthouse'],
  
  // Kids Pack
  ['dolphin', 'cat', 'butterfly', 'star', 'heart', 'sun', 'balloon', 'car', 'airplane', 'fish'],
]

/**
 * Pre-generate popular templates
 */
export async function pregeneratePopular(): Promise<void> {
  console.log('Pre-generating popular template combinations...')
  const count = await templateCache.pregenerateTemplates(POPULAR_COMBINATIONS)
  console.log(`Generated ${count} new templates`)
}

/**
 * usePuzzleGeneration Hook
 * 
 * Wires the shape selection to the template generation pipeline.
 * Handles variant generation, template creation, and caching.
 */

import { useState, useCallback } from 'react'
import { ShapeType } from '@/lib/types'
import {
  templateCache,
  type PuzzleTemplate,
  type TemplateConfig,
  type CacheStats,
} from '@/lib/shapes'

export interface PuzzleGenerationState {
  status: 'idle' | 'generating' | 'complete' | 'error'
  progress: number
  template: PuzzleTemplate | null
  error: string | null
  cacheHit: boolean
}

export interface UsePuzzleGenerationReturn {
  state: PuzzleGenerationState
  generatePuzzle: (shapes: ShapeType[], config?: Partial<TemplateConfig>) => Promise<PuzzleTemplate | null>
  clearTemplate: () => void
  getCacheStats: () => CacheStats
}

const DEFAULT_CONFIG: Partial<TemplateConfig> = {
  totalPieces: 150,
  uniqueShapes: 10,
  copiesPerShape: 15,
  cellSize: 50,
  pieceMargin: 2,
  targetAspectRatio: 1.0,
}

export function usePuzzleGeneration(): UsePuzzleGenerationReturn {
  const [state, setState] = useState<PuzzleGenerationState>({
    status: 'idle',
    progress: 0,
    template: null,
    error: null,
    cacheHit: false,
  })

  const generatePuzzle = useCallback(async (
    shapes: ShapeType[],
    customConfig?: Partial<TemplateConfig>
  ): Promise<PuzzleTemplate | null> => {
    if (shapes.length !== 10) {
      setState(prev => ({
        ...prev,
        status: 'error',
        error: 'Exactly 10 shapes are required for puzzle generation',
      }))
      return null
    }

    setState({
      status: 'generating',
      progress: 0,
      template: null,
      error: null,
      cacheHit: false,
    })

    try {
      // Step 1: Progress update (10%)
      setState(prev => ({ ...prev, progress: 10 }))
      const shapeIds = shapes.map(s => s.toString())
      
      // Step 2: Get or create template (handles caching internally)
      setState(prev => ({ ...prev, progress: 25 }))
      
      const template = await templateCache.getOrCreateTemplate(shapeIds)
      
      if (!template) {
        throw new Error('Failed to generate puzzle template')
      }
      
      setState({
        status: 'complete',
        progress: 100,
        template,
        error: null,
        cacheHit: false, // CacheManager handles this internally
      })

      return template
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during generation'
      setState({
        status: 'error',
        progress: 0,
        template: null,
        error: errorMessage,
        cacheHit: false,
      })
      return null
    }
  }, [])

  const clearTemplate = useCallback(() => {
    setState({
      status: 'idle',
      progress: 0,
      template: null,
      error: null,
      cacheHit: false,
    })
  }, [])

  const getCacheStats = useCallback((): CacheStats => {
    return templateCache.getStats()
  }, [])

  return {
    state,
    generatePuzzle,
    clearTemplate,
    getCacheStats,
  }
}

/**
 * Preload hook for warming up the template cache with popular combinations
 */
export function usePreloadTemplates() {
  const [isPreloading, setIsPreloading] = useState(false)
  const [preloadProgress, setPreloadProgress] = useState(0)

  const preloadPopularCombinations = useCallback(async () => {
    setIsPreloading(true)
    setPreloadProgress(0)

    try {
      // Import popular combinations from cache module
      const { pregeneratePopular, POPULAR_COMBINATIONS } = await import('@/lib/shapes')
      
      const total = POPULAR_COMBINATIONS.length
      
      await pregeneratePopular()
      setPreloadProgress(100)
    } catch (error) {
      console.error('Error preloading templates:', error)
    } finally {
      setIsPreloading(false)
      setPreloadProgress(100)
    }
  }, [])

  return {
    isPreloading,
    preloadProgress,
    preloadPopularCombinations,
  }
}

/**
 * ShapeSilhouette Component
 * 
 * Renders a shape as its actual silhouette outline (not an icon).
 * These are the shapes that will become physical puzzle pieces.
 * 
 * The shape fills the entire container and shows the actual cut outline.
 */

import { memo, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { SHAPE_DEFINITIONS, getShapeById } from '@/lib/shapes/shapeDefinitions'
import { BaseShape } from '@/lib/shapes/shapeSystem'
import { ShapeType } from '@/lib/types'

interface ShapeSilhouetteProps {
  /** Shape ID to render */
  shapeId: ShapeType
  /** CSS class for the container */
  className?: string
  /** Fill color for the shape */
  fill?: string
  /** Stroke color for the outline */
  stroke?: string
  /** Stroke width */
  strokeWidth?: number
  /** Whether to show anchor points (for debugging) */
  showAnchors?: boolean
  /** Optional scale factor */
  scale?: number
  /** Click handler */
  onClick?: () => void
}

export const ShapeSilhouette = memo(function ShapeSilhouette({
  shapeId,
  className,
  fill = 'currentColor',
  stroke = 'none',
  strokeWidth = 1,
  showAnchors = false,
  scale = 1,
  onClick,
}: ShapeSilhouetteProps) {
  // Get shape definition (using alias resolver)
  const shape = getShapeById(shapeId)
  
  if (!shape) {
    // Fallback for shapes not yet defined
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <span className="text-xs text-gray-400">{shapeId}</span>
      </div>
    )
  }
  
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn('w-full h-full', onClick && 'cursor-pointer', className)}
      onClick={onClick}
    >
      {/* Main shape path */}
      <path
        d={shape.outlinePath}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Anchor points (for debugging/visualization) */}
      {showAnchors && shape.anchors.map((anchor) => (
        <g key={anchor.id}>
          {/* Anchor circle */}
          <circle
            cx={anchor.x}
            cy={anchor.y}
            r={3}
            fill="#FF6B6B"
            stroke="#fff"
            strokeWidth={0.5}
          />
          {/* Direction indicator */}
          <line
            x1={anchor.x}
            y1={anchor.y}
            x2={anchor.x + Math.cos(anchor.angle * Math.PI / 180) * 8}
            y2={anchor.y + Math.sin(anchor.angle * Math.PI / 180) * 8}
            stroke="#FF6B6B"
            strokeWidth={1}
            markerEnd="url(#arrowhead)"
          />
        </g>
      ))}
      
      {showAnchors && (
        <defs>
          <marker
            id="arrowhead"
            markerWidth="4"
            markerHeight="4"
            refX="2"
            refY="2"
            orient="auto"
          >
            <polygon points="0 0, 4 2, 0 4" fill="#FF6B6B" />
          </marker>
        </defs>
      )}
    </svg>
  )
})

/**
 * ShapeSilhouetteCard Component
 * 
 * A clickable card showing a shape silhouette with selection state.
 */
interface ShapeSilhouetteCardProps {
  shapeId: ShapeType
  selected?: boolean
  disabled?: boolean
  onClick?: () => void
  className?: string
  showLabel?: boolean
}

export const ShapeSilhouetteCard = memo(function ShapeSilhouetteCard({
  shapeId,
  selected = false,
  disabled = false,
  onClick,
  className,
  showLabel = true,
}: ShapeSilhouetteCardProps) {
  const shape = getShapeById(shapeId)
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative group flex flex-col items-center justify-center p-3 rounded-xl',
        'border-2 transition-all duration-200',
        selected
          ? 'border-terracotta bg-terracotta/10 shadow-lg scale-105'
          : 'border-stone bg-white hover:border-terracotta/50 hover:shadow-md',
        disabled && !selected && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {/* Selection indicator */}
      {selected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-terracotta rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md z-10">
          ✓
        </div>
      )}
      
      {/* Shape silhouette */}
      <div className={cn(
        'w-16 h-16 md:w-20 md:h-20 transition-colors',
        selected ? 'text-terracotta' : 'text-charcoal group-hover:text-terracotta'
      )}>
        <ShapeSilhouette shapeId={shapeId} />
      </div>
      
      {/* Label */}
      {showLabel && shape && (
        <span className={cn(
          'mt-2 text-xs font-medium text-center',
          selected ? 'text-terracotta' : 'text-charcoal/70'
        )}>
          {shape.name}
        </span>
      )}
    </button>
  )
})

/**
 * ShapeGrid Component
 * 
 * A grid of shape silhouettes for selection.
 */
interface ShapeGridProps {
  shapes: ShapeType[]
  selected: ShapeType[]
  maxSelection?: number
  onSelect: (shapeId: ShapeType) => void
  className?: string
}

export const ShapeGrid = memo(function ShapeGrid({
  shapes,
  selected,
  maxSelection = 10,
  onSelect,
  className,
}: ShapeGridProps) {
  const isMaxReached = selected.length >= maxSelection
  
  return (
    <div className={cn(
      'grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3',
      className
    )}>
      {shapes.map((shapeId) => {
        const isSelected = selected.includes(shapeId)
        const isDisabled = isMaxReached && !isSelected
        
        return (
          <ShapeSilhouetteCard
            key={shapeId}
            shapeId={shapeId}
            selected={isSelected}
            disabled={isDisabled}
            onClick={() => onSelect(shapeId)}
          />
        )
      })}
    </div>
  )
})

/**
 * PuzzlePreview Component
 * 
 * Shows a preview of the 10 selected shapes as they'll appear in the puzzle.
 */
interface PuzzlePreviewProps {
  selectedShapes: ShapeType[]
  className?: string
}

export const PuzzlePreview = memo(function PuzzlePreview({
  selectedShapes,
  className,
}: PuzzlePreviewProps) {
  // Arrange shapes in a visually pleasing grid
  const gridLayout = useMemo(() => {
    // For 10 shapes, use 2 rows of 5
    const rows: ShapeType[][] = [
      selectedShapes.slice(0, 5),
      selectedShapes.slice(5, 10),
    ]
    return rows
  }, [selectedShapes])
  
  return (
    <div className={cn(
      'bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-terracotta/20',
      className
    )}>
      <h3 className="text-center text-lg font-semibold text-charcoal mb-4 font-display">
        Your Puzzle Preview
      </h3>
      
      <div className="space-y-3">
        {gridLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-3">
            {row.map((shapeId, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="w-14 h-14 bg-white rounded-lg shadow-sm border border-stone/50 p-2"
              >
                <ShapeSilhouette
                  shapeId={shapeId}
                  fill="#D97757"
                  stroke="#8B7355"
                  strokeWidth={0.5}
                />
              </div>
            ))}
            {/* Fill empty slots with placeholders */}
            {Array.from({ length: 5 - row.length }).map((_, i) => (
              <div
                key={`empty-${rowIndex}-${i}`}
                className="w-14 h-14 bg-gray-100 rounded-lg border border-dashed border-gray-300 flex items-center justify-center"
              >
                <span className="text-gray-400 text-lg">?</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      
      <p className="text-center text-xs text-charcoal/60 mt-4">
        {selectedShapes.length}/10 shapes selected
        {selectedShapes.length === 10 && ' ✓ Complete!'}
      </p>
    </div>
  )
})

/**
 * SelectedShapeTray Component
 * 
 * Shows the currently selected shapes in a horizontal tray.
 */
interface SelectedShapeTrayProps {
  selectedShapes: ShapeType[]
  onRemove: (shapeId: ShapeType) => void
  maxShapes?: number
  className?: string
}

export const SelectedShapeTray = memo(function SelectedShapeTray({
  selectedShapes,
  onRemove,
  maxShapes = 10,
  className,
}: SelectedShapeTrayProps) {
  return (
    <div className={cn(
      'flex items-center gap-2 p-4 bg-white rounded-xl border-2 border-stone overflow-x-auto',
      className
    )}>
      {selectedShapes.map((shapeId, index) => (
        <div
          key={shapeId}
          className="relative flex-shrink-0 group"
        >
          <div className="w-12 h-12 bg-cream rounded-lg p-1.5 border border-stone">
            <ShapeSilhouette shapeId={shapeId} fill="#D97757" />
          </div>
          {/* Remove button */}
          <button
            onClick={() => onRemove(shapeId)}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label={`Remove ${getShapeById(shapeId)?.name || shapeId}`}
          >
            ×
          </button>
          {/* Index number */}
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold text-charcoal/50">
            {index + 1}
          </span>
        </div>
      ))}
      
      {/* Empty slots */}
      {Array.from({ length: maxShapes - selectedShapes.length }).map((_, i) => (
        <div
          key={`empty-${i}`}
          className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg border border-dashed border-gray-300 flex items-center justify-center"
        >
          <span className="text-gray-300 text-lg">+</span>
        </div>
      ))}
    </div>
  )
})

// Re-export shape definitions for convenience
export { SHAPE_DEFINITIONS }
export type { BaseShape }

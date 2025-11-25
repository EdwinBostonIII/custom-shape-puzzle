/**
 * PUZZLE PIECE RENDERER
 * 
 * Renders a single puzzle piece with:
 * 1. Interlocking jigsaw shape (the actual piece outline)
 * 2. Decorative motif engraved on top
 * 3. Wood grain texture and realistic shadow effects
 */

import { useMemo } from 'react'
import { ShapeType } from '@/lib/types'
import { getPiecePath, getPieceViewBox, PUZZLE_PIECES } from '@/lib/puzzlePieces'
import { getMotifPath, getMotifFillMode } from '@/lib/motifs'
import { cn } from '@/lib/utils'

// Wood grain SVG pattern (will be defined inline)
const WOOD_GRAIN_PATTERN = `
  <pattern id="woodGrain" patternUnits="userSpaceOnUse" width="100" height="100">
    <rect width="100" height="100" fill="#DEB887"/>
    <g opacity="0.3" stroke="#8B7355" stroke-width="0.5">
      <path d="M0 10 Q25 12 50 8 T100 12"/>
      <path d="M0 25 Q30 28 60 22 T100 27"/>
      <path d="M0 40 Q20 38 45 42 T100 38"/>
      <path d="M0 55 Q35 58 65 52 T100 57"/>
      <path d="M0 70 Q25 68 55 73 T100 70"/>
      <path d="M0 85 Q30 88 55 82 T100 87"/>
    </g>
    <g opacity="0.15" fill="#5D4037">
      <ellipse cx="25" cy="35" rx="3" ry="1.5"/>
      <ellipse cx="70" cy="60" rx="2" ry="1"/>
      <ellipse cx="45" cy="80" rx="2.5" ry="1"/>
    </g>
  </pattern>
`

// Wood stain colors with their grain overlay adjustments
const WOOD_STAIN_STYLES: Record<string, { base: string; grain: string; shadow: string }> = {
  'natural': { base: '#DEB887', grain: '#8B7355', shadow: 'rgba(101, 67, 33, 0.3)' },
  'honey': { base: '#CD853F', grain: '#8B6914', shadow: 'rgba(139, 90, 43, 0.35)' },
  'walnut': { base: '#5D4037', grain: '#3E2723', shadow: 'rgba(30, 20, 15, 0.4)' },
  'ebony': { base: '#2C2416', grain: '#1A1510', shadow: 'rgba(0, 0, 0, 0.45)' },
  'gray-wash': { base: '#8B8B83', grain: '#6B6B63', shadow: 'rgba(50, 50, 45, 0.35)' },
  'white-wash': { base: '#F5F5DC', grain: '#D4D4B8', shadow: 'rgba(100, 100, 80, 0.25)' },
}

interface PuzzlePieceRendererProps {
  /** The slot index (0-9) for the puzzle piece shape */
  slotIndex: number
  /** The decorative motif to engrave on the piece */
  motif?: ShapeType
  /** Wood stain color */
  stain?: string
  /** Additional CSS classes */
  className?: string
  /** Whether to show hover effects */
  interactive?: boolean
  /** Whether this piece is selected */
  selected?: boolean
  /** Click handler */
  onClick?: () => void
  /** Size in pixels */
  size?: number
  /** Show wood texture */
  showTexture?: boolean
}

export function PuzzlePieceRenderer({
  slotIndex,
  motif,
  stain = 'natural',
  className,
  interactive = false,
  selected = false,
  onClick,
  size = 100,
  showTexture = true,
}: PuzzlePieceRendererProps) {
  const piecePath = useMemo(() => getPiecePath(slotIndex), [slotIndex])
  const motifPath = useMemo(() => motif ? getMotifPath(motif) : '', [motif])
  const motifFillMode = useMemo(() => motif ? getMotifFillMode(motif) : 'outline', [motif])
  
  const stainStyle = WOOD_STAIN_STYLES[stain] || WOOD_STAIN_STYLES['natural']
  const uniqueId = useMemo(() => `piece-${slotIndex}-${Math.random().toString(36).substr(2, 9)}`, [slotIndex])

  return (
    <svg
      viewBox={getPieceViewBox()}
      className={cn(
        'transition-all duration-300',
        interactive && 'cursor-pointer hover:scale-105',
        selected && 'ring-2 ring-terracotta ring-offset-2',
        className
      )}
      style={{ width: size, height: size }}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      aria-label={motif ? `Puzzle piece with ${motif} design` : 'Empty puzzle piece'}
    >
      <defs>
        {/* Wood grain pattern specific to this stain */}
        <pattern id={`woodGrain-${uniqueId}`} patternUnits="userSpaceOnUse" width="100" height="100">
          <rect width="100" height="100" fill={stainStyle.base}/>
          {showTexture && (
            <>
              <g opacity="0.25" stroke={stainStyle.grain} strokeWidth="0.8" fill="none">
                <path d="M0 8 Q25 10 50 6 T100 10"/>
                <path d="M0 20 Q30 23 60 18 T100 22"/>
                <path d="M0 32 Q20 30 45 34 T100 30"/>
                <path d="M0 44 Q35 47 65 42 T100 46"/>
                <path d="M0 56 Q25 54 55 58 T100 55"/>
                <path d="M0 68 Q30 71 55 66 T100 70"/>
                <path d="M0 80 Q20 78 50 82 T100 79"/>
                <path d="M0 92 Q35 95 60 90 T100 94"/>
              </g>
              <g opacity="0.1" fill={stainStyle.grain}>
                <ellipse cx="22" cy="28" rx="4" ry="2"/>
                <ellipse cx="68" cy="52" rx="3" ry="1.5"/>
                <ellipse cx="42" cy="76" rx="3.5" ry="1.5"/>
                <ellipse cx="78" cy="18" rx="2.5" ry="1"/>
              </g>
            </>
          )}
        </pattern>

        {/* Drop shadow filter */}
        <filter id={`shadow-${uniqueId}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor={stainStyle.shadow} floodOpacity="0.5"/>
        </filter>

        {/* Clip path for the piece shape */}
        <clipPath id={`pieceClip-${uniqueId}`}>
          <path d={piecePath} />
        </clipPath>

        {/* Inner shadow for depth */}
        <filter id={`innerShadow-${uniqueId}`}>
          <feOffset dx="0" dy="1"/>
          <feGaussianBlur stdDeviation="1.5"/>
          <feComposite operator="out" in="SourceGraphic" result="shadow"/>
          <feFlood floodColor="#000000" floodOpacity="0.15"/>
          <feComposite in2="shadow" operator="in"/>
          <feComposite in2="SourceGraphic" operator="over"/>
        </filter>
      </defs>

      {/* Main piece with wood texture */}
      <g filter={`url(#shadow-${uniqueId})`}>
        {/* Base piece shape with wood grain fill */}
        <path
          d={piecePath}
          fill={`url(#woodGrain-${uniqueId})`}
          stroke={stainStyle.grain}
          strokeWidth="1.5"
        />

        {/* Subtle bevel/highlight on top edge */}
        <path
          d={piecePath}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
          clipPath={`url(#pieceClip-${uniqueId})`}
          transform="translate(-1, -1)"
        />
      </g>

      {/* Engraved motif */}
      {motifPath && (
        <g clipPath={`url(#pieceClip-${uniqueId})`}>
          <path
            d={motifPath}
            fill={motifFillMode === 'solid' ? stainStyle.grain : 'none'}
            stroke={stainStyle.grain}
            strokeWidth={motifFillMode === 'solid' ? '0' : '2'}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.7"
            style={{
              filter: 'url(#innerShadow-' + uniqueId + ')',
            }}
          />
        </g>
      )}

      {/* Hover highlight for interactive pieces */}
      {interactive && (
        <path
          d={piecePath}
          fill="transparent"
          stroke="transparent"
          strokeWidth="3"
          className="transition-all duration-200 hover:stroke-terracotta/50"
        />
      )}
    </svg>
  )
}

/**
 * Renders the complete assembled puzzle with all 10 pieces
 */
interface AssembledPuzzleProps {
  /** Array of 10 motifs for each piece slot */
  motifs: (ShapeType | null)[]
  /** Wood stain color */
  stain?: string
  /** Additional CSS classes */
  className?: string
  /** Width of the assembled puzzle */
  width?: number
}

export function AssembledPuzzle({
  motifs,
  stain = 'natural',
  className,
  width = 500,
}: AssembledPuzzleProps) {
  const height = width * 0.4 // 2:5 aspect ratio

  return (
    <div 
      className={cn('relative', className)}
      style={{ width, height }}
      role="img"
      aria-label="Assembled puzzle preview"
    >
      {PUZZLE_PIECES.map((piece, index) => (
        <div
          key={piece.id}
          className="absolute transition-transform duration-500"
          style={{
            left: `${(piece.col / 5) * 100}%`,
            top: `${(piece.row / 2) * 100}%`,
            width: `${100 / 5}%`,
            height: `${100 / 2}%`,
          }}
        >
          <PuzzlePieceRenderer
            slotIndex={index}
            motif={motifs[index] || undefined}
            stain={stain}
            size={width / 5}
            showTexture={true}
          />
        </div>
      ))}
    </div>
  )
}

/**
 * Single motif preview (without puzzle piece shape) for selection grid
 */
interface MotifPreviewProps {
  motif: ShapeType
  stain?: string
  className?: string
  size?: number
  selected?: boolean
  onClick?: () => void
}

export function MotifPreview({
  motif,
  stain = 'natural',
  className,
  size = 60,
  selected = false,
  onClick,
}: MotifPreviewProps) {
  const motifPath = getMotifPath(motif)
  const fillMode = getMotifFillMode(motif)
  const stainStyle = WOOD_STAIN_STYLES[stain] || WOOD_STAIN_STYLES['natural']

  return (
    <svg
      viewBox="20 20 60 60"
      className={cn(
        'transition-all duration-200 cursor-pointer',
        selected && 'ring-2 ring-terracotta rounded-lg',
        className
      )}
      style={{ width: size, height: size }}
      onClick={onClick}
      role="button"
      aria-label={`Select ${motif} design`}
      aria-pressed={selected}
    >
      <defs>
        <filter id={`motifShadow-${motif}`}>
          <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.2"/>
        </filter>
      </defs>
      <path
        d={motifPath}
        fill={fillMode === 'solid' ? stainStyle.grain : 'none'}
        stroke={stainStyle.grain}
        strokeWidth={fillMode === 'solid' ? '0.5' : '2.5'}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#motifShadow-${motif})`}
      />
    </svg>
  )
}

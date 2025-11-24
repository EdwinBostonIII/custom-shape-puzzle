import { ShapeType } from '@/lib/types'
import { ShapeIcon } from './ShapeIcon'

interface PuzzlePieceProps {
  shape: ShapeType
  className?: string
  color?: string
}

const PASTEL_COLORS = [
  'oklch(0.82 0.10 25)',
  'oklch(0.85 0.06 145)',
  'oklch(0.82 0.08 285)',
  'oklch(0.85 0.08 220)',
  'oklch(0.85 0.10 55)',
  'oklch(0.88 0.06 165)',
  'oklch(0.82 0.09 10)',
  'oklch(0.80 0.09 240)',
]

function getShapeColor(shape: ShapeType): string {
  const index = shape.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % PASTEL_COLORS.length
  return PASTEL_COLORS[index]
}

function getPuzzleVariant(shape: ShapeType): number {
  return shape.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 4
}

export function PuzzlePiece({ shape, className = "w-16 h-16", color }: PuzzlePieceProps) {
  const shapeColor = color || getShapeColor(shape)
  const variant = getPuzzleVariant(shape)
  
  let piecePath = ""
  switch(variant) {
    case 0:
      piecePath = "M10,0 L45,0 Q47,0 47,3 Q47,7 50,7 Q53,7 53,3 Q53,0 55,0 L90,0 Q100,0 100,10 L100,90 Q100,100 90,100 L55,100 Q53,100 53,97 Q53,93 50,93 Q47,93 47,97 Q47,100 45,100 L10,100 Q0,100 0,90 L0,10 Q0,0 10,0 Z"
      break
    case 1:
      piecePath = "M10,0 L90,0 Q100,0 100,10 L100,45 Q100,47 97,47 Q93,47 93,50 Q93,53 97,53 Q100,53 100,55 L100,90 Q100,100 90,100 L10,100 Q0,100 0,90 L0,10 Q0,0 10,0 Z"
      break
    case 2:
      piecePath = "M10,0 L90,0 Q100,0 100,10 L100,45 Q100,47 103,47 Q107,47 107,50 Q107,53 103,53 Q100,53 100,55 L100,90 Q100,100 90,100 L55,100 Q53,100 53,103 Q53,107 50,107 Q47,107 47,103 Q47,100 45,100 L10,100 Q0,100 0,90 L0,10 Q0,0 10,0 Z"
      break
    default:
      piecePath = "M10,0 L45,0 Q47,0 47,3 Q47,7 50,7 Q53,7 53,3 Q53,0 55,0 L90,0 Q100,0 100,10 L100,45 Q100,47 103,47 Q107,47 107,50 Q107,53 103,53 Q100,53 100,55 L100,90 Q100,100 90,100 L10,100 Q0,100 0,90 L0,55 Q0,53 -3,53 Q-7,53 -7,50 Q-7,47 -3,47 Q0,47 0,45 L0,10 Q0,0 10,0 Z"
  }

  return (
    <svg
      viewBox="-10 -10 120 120"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}
    >
      <path d={piecePath} fill={shapeColor} stroke="none" />
      <g transform="translate(50, 50) scale(0.5) translate(-12, -12)">
        <ShapeIcon shape={shape} className="w-6 h-6" color="oklch(0.98 0.01 0)" />
      </g>
    </svg>
  )
}

import { ShapeType } from '@/lib/types'
import { ShapeIcon } from './ShapeIcon'

interface PuzzlePieceProps {
  shape: ShapeType
  className?: string
  color?: string
  edges?: {
    top?: 'tab' | 'blank' | 'flat'
    right?: 'tab' | 'blank' | 'flat'
    bottom?: 'tab' | 'blank' | 'flat'
    left?: 'tab' | 'blank' | 'flat'
  }
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

function generatePuzzlePiecePath(edges: {
  top?: 'tab' | 'blank' | 'flat'
  right?: 'tab' | 'blank' | 'flat'
  bottom?: 'tab' | 'blank' | 'flat'
  left?: 'tab' | 'blank' | 'flat'
}): string {
  const baseSize = 100
  const cornerRadius = 8
  const tabSize = 15
  const tabNeckWidth = 8
  
  const paths: string[] = []
  
  paths.push(`M ${cornerRadius} 0`)
  
  if (edges.top === 'tab') {
    paths.push(`L ${baseSize * 0.5 - tabNeckWidth} 0`)
    paths.push(`C ${baseSize * 0.5 - tabNeckWidth + 2} 0, ${baseSize * 0.5 - tabNeckWidth + 2} -2, ${baseSize * 0.5 - tabSize} -${tabSize * 0.6}`)
    paths.push(`C ${baseSize * 0.5 - tabSize - 2} -${tabSize}, ${baseSize * 0.5 - tabSize - 2} -${tabSize}, ${baseSize * 0.5} -${tabSize}`)
    paths.push(`C ${baseSize * 0.5 + tabSize + 2} -${tabSize}, ${baseSize * 0.5 + tabSize + 2} -${tabSize}, ${baseSize * 0.5 + tabSize} -${tabSize * 0.6}`)
    paths.push(`C ${baseSize * 0.5 + tabNeckWidth - 2} -2, ${baseSize * 0.5 + tabNeckWidth - 2} 0, ${baseSize * 0.5 + tabNeckWidth} 0`)
  } else if (edges.top === 'blank') {
    paths.push(`L ${baseSize * 0.5 - tabNeckWidth} 0`)
    paths.push(`C ${baseSize * 0.5 - tabNeckWidth - 2} 0, ${baseSize * 0.5 - tabNeckWidth - 2} 2, ${baseSize * 0.5 - tabSize} ${tabSize * 0.6}`)
    paths.push(`C ${baseSize * 0.5 - tabSize - 2} ${tabSize}, ${baseSize * 0.5 - tabSize - 2} ${tabSize}, ${baseSize * 0.5} ${tabSize}`)
    paths.push(`C ${baseSize * 0.5 + tabSize + 2} ${tabSize}, ${baseSize * 0.5 + tabSize + 2} ${tabSize}, ${baseSize * 0.5 + tabSize} ${tabSize * 0.6}`)
    paths.push(`C ${baseSize * 0.5 + tabNeckWidth + 2} 2, ${baseSize * 0.5 + tabNeckWidth + 2} 0, ${baseSize * 0.5 + tabNeckWidth} 0`)
  }
  
  paths.push(`L ${baseSize - cornerRadius} 0`)
  paths.push(`Q ${baseSize} 0 ${baseSize} ${cornerRadius}`)
  
  if (edges.right === 'tab') {
    paths.push(`L ${baseSize} ${baseSize * 0.5 - tabNeckWidth}`)
    paths.push(`C ${baseSize} ${baseSize * 0.5 - tabNeckWidth + 2}, ${baseSize + 2} ${baseSize * 0.5 - tabNeckWidth + 2}, ${baseSize + tabSize * 0.6} ${baseSize * 0.5 - tabSize}`)
    paths.push(`C ${baseSize + tabSize} ${baseSize * 0.5 - tabSize - 2}, ${baseSize + tabSize} ${baseSize * 0.5 - tabSize - 2}, ${baseSize + tabSize} ${baseSize * 0.5}`)
    paths.push(`C ${baseSize + tabSize} ${baseSize * 0.5 + tabSize + 2}, ${baseSize + tabSize} ${baseSize * 0.5 + tabSize + 2}, ${baseSize + tabSize * 0.6} ${baseSize * 0.5 + tabSize}`)
    paths.push(`C ${baseSize + 2} ${baseSize * 0.5 + tabNeckWidth - 2}, ${baseSize} ${baseSize * 0.5 + tabNeckWidth - 2}, ${baseSize} ${baseSize * 0.5 + tabNeckWidth}`)
  } else if (edges.right === 'blank') {
    paths.push(`L ${baseSize} ${baseSize * 0.5 - tabNeckWidth}`)
    paths.push(`C ${baseSize} ${baseSize * 0.5 - tabNeckWidth - 2}, ${baseSize - 2} ${baseSize * 0.5 - tabNeckWidth - 2}, ${baseSize - tabSize * 0.6} ${baseSize * 0.5 - tabSize}`)
    paths.push(`C ${baseSize - tabSize} ${baseSize * 0.5 - tabSize - 2}, ${baseSize - tabSize} ${baseSize * 0.5 - tabSize - 2}, ${baseSize - tabSize} ${baseSize * 0.5}`)
    paths.push(`C ${baseSize - tabSize} ${baseSize * 0.5 + tabSize + 2}, ${baseSize - tabSize} ${baseSize * 0.5 + tabSize + 2}, ${baseSize - tabSize * 0.6} ${baseSize * 0.5 + tabSize}`)
    paths.push(`C ${baseSize - 2} ${baseSize * 0.5 + tabNeckWidth + 2}, ${baseSize} ${baseSize * 0.5 + tabNeckWidth + 2}, ${baseSize} ${baseSize * 0.5 + tabNeckWidth}`)
  }
  
  paths.push(`L ${baseSize} ${baseSize - cornerRadius}`)
  paths.push(`Q ${baseSize} ${baseSize} ${baseSize - cornerRadius} ${baseSize}`)
  
  if (edges.bottom === 'tab') {
    paths.push(`L ${baseSize * 0.5 + tabNeckWidth} ${baseSize}`)
    paths.push(`C ${baseSize * 0.5 + tabNeckWidth - 2} ${baseSize}, ${baseSize * 0.5 + tabNeckWidth - 2} ${baseSize + 2}, ${baseSize * 0.5 + tabSize} ${baseSize + tabSize * 0.6}`)
    paths.push(`C ${baseSize * 0.5 + tabSize + 2} ${baseSize + tabSize}, ${baseSize * 0.5 + tabSize + 2} ${baseSize + tabSize}, ${baseSize * 0.5} ${baseSize + tabSize}`)
    paths.push(`C ${baseSize * 0.5 - tabSize - 2} ${baseSize + tabSize}, ${baseSize * 0.5 - tabSize - 2} ${baseSize + tabSize}, ${baseSize * 0.5 - tabSize} ${baseSize + tabSize * 0.6}`)
    paths.push(`C ${baseSize * 0.5 - tabNeckWidth + 2} ${baseSize + 2}, ${baseSize * 0.5 - tabNeckWidth + 2} ${baseSize}, ${baseSize * 0.5 - tabNeckWidth} ${baseSize}`)
  } else if (edges.bottom === 'blank') {
    paths.push(`L ${baseSize * 0.5 + tabNeckWidth} ${baseSize}`)
    paths.push(`C ${baseSize * 0.5 + tabNeckWidth + 2} ${baseSize}, ${baseSize * 0.5 + tabNeckWidth + 2} ${baseSize - 2}, ${baseSize * 0.5 + tabSize} ${baseSize - tabSize * 0.6}`)
    paths.push(`C ${baseSize * 0.5 + tabSize + 2} ${baseSize - tabSize}, ${baseSize * 0.5 + tabSize + 2} ${baseSize - tabSize}, ${baseSize * 0.5} ${baseSize - tabSize}`)
    paths.push(`C ${baseSize * 0.5 - tabSize - 2} ${baseSize - tabSize}, ${baseSize * 0.5 - tabSize - 2} ${baseSize - tabSize}, ${baseSize * 0.5 - tabSize} ${baseSize - tabSize * 0.6}`)
    paths.push(`C ${baseSize * 0.5 - tabNeckWidth - 2} ${baseSize - 2}, ${baseSize * 0.5 - tabNeckWidth - 2} ${baseSize}, ${baseSize * 0.5 - tabNeckWidth} ${baseSize}`)
  }
  
  paths.push(`L ${cornerRadius} ${baseSize}`)
  paths.push(`Q 0 ${baseSize} 0 ${baseSize - cornerRadius}`)
  
  if (edges.left === 'tab') {
    paths.push(`L 0 ${baseSize * 0.5 + tabNeckWidth}`)
    paths.push(`C 0 ${baseSize * 0.5 + tabNeckWidth - 2}, -2 ${baseSize * 0.5 + tabNeckWidth - 2}, -${tabSize * 0.6} ${baseSize * 0.5 + tabSize}`)
    paths.push(`C -${tabSize} ${baseSize * 0.5 + tabSize + 2}, -${tabSize} ${baseSize * 0.5 + tabSize + 2}, -${tabSize} ${baseSize * 0.5}`)
    paths.push(`C -${tabSize} ${baseSize * 0.5 - tabSize - 2}, -${tabSize} ${baseSize * 0.5 - tabSize - 2}, -${tabSize * 0.6} ${baseSize * 0.5 - tabSize}`)
    paths.push(`C -2 ${baseSize * 0.5 - tabNeckWidth + 2}, 0 ${baseSize * 0.5 - tabNeckWidth + 2}, 0 ${baseSize * 0.5 - tabNeckWidth}`)
  } else if (edges.left === 'blank') {
    paths.push(`L 0 ${baseSize * 0.5 + tabNeckWidth}`)
    paths.push(`C 0 ${baseSize * 0.5 + tabNeckWidth + 2}, 2 ${baseSize * 0.5 + tabNeckWidth + 2}, ${tabSize * 0.6} ${baseSize * 0.5 + tabSize}`)
    paths.push(`C ${tabSize} ${baseSize * 0.5 + tabSize + 2}, ${tabSize} ${baseSize * 0.5 + tabSize + 2}, ${tabSize} ${baseSize * 0.5}`)
    paths.push(`C ${tabSize} ${baseSize * 0.5 - tabSize - 2}, ${tabSize} ${baseSize * 0.5 - tabSize - 2}, ${tabSize * 0.6} ${baseSize * 0.5 - tabSize}`)
    paths.push(`C 2 ${baseSize * 0.5 - tabNeckWidth - 2}, 0 ${baseSize * 0.5 - tabNeckWidth - 2}, 0 ${baseSize * 0.5 - tabNeckWidth}`)
  }
  
  paths.push(`L 0 ${cornerRadius}`)
  paths.push(`Q 0 0 ${cornerRadius} 0`)
  paths.push('Z')
  
  return paths.join(' ')
}

function getEdgeConfiguration(shape: ShapeType): {
  top?: 'tab' | 'blank' | 'flat'
  right?: 'tab' | 'blank' | 'flat'
  bottom?: 'tab' | 'blank' | 'flat'
  left?: 'tab' | 'blank' | 'flat'
} {
  const hash = shape.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  
  return {
    top: hash % 3 === 0 ? 'tab' : hash % 3 === 1 ? 'blank' : 'flat',
    right: (hash + 1) % 3 === 0 ? 'tab' : (hash + 1) % 3 === 1 ? 'blank' : 'flat',
    bottom: (hash + 2) % 3 === 0 ? 'tab' : (hash + 2) % 3 === 1 ? 'blank' : 'flat',
    left: (hash + 3) % 3 === 0 ? 'tab' : (hash + 3) % 3 === 1 ? 'blank' : 'flat',
  }
}

export function PuzzlePiece({ shape, className = "w-16 h-16", color, edges }: PuzzlePieceProps) {
  const shapeColor = color || getShapeColor(shape)
  const edgeConfig = edges || getEdgeConfiguration(shape)
  const piecePath = generatePuzzlePiecePath(edgeConfig)

  return (
    <svg
      viewBox="-20 -20 140 140"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}
    >
      <defs>
        <linearGradient id={`grad-${shape}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: shapeColor, stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: shapeColor, stopOpacity: 0.85 }} />
        </linearGradient>
      </defs>
      <path 
        d={piecePath} 
        fill={`url(#grad-${shape})`} 
        stroke="oklch(0.3 0.01 0)" 
        strokeWidth="0.5"
        strokeOpacity="0.3"
      />
      <g transform="translate(50, 50) scale(0.5) translate(-12, -12)">
        <ShapeIcon shape={shape} className="w-6 h-6" color="oklch(0.98 0.01 0)" />
      </g>
    </svg>
  )
}

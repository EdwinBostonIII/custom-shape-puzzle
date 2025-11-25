import { ShapeType } from '@/lib/types'
import { ReactElement, CSSProperties } from 'react'

export interface ShapeIconProps {
  shape: ShapeType
  className?: string
  color?: string
  style?: CSSProperties
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

export function ShapeIcon({ shape, className = "w-12 h-12", color, style }: ShapeIconProps) {
  const shapeColor = color || getShapeColor(shape)
  
  const shapes: Record<ShapeType, ReactElement> = {
    'rose': <><circle cx="12" cy="12" r="3"/><path d="M12 9c-1.5 0-3 1.5-3 3s1.5 3 3 3 3-1.5 3-3-1.5-3-3-3zm0-4c-1 0-2 .5-2.5 1.5m5 0C14 5.5 13 5 12 5m-4 9l-2 3m8-3l2 3" stroke="currentColor" strokeWidth="1.5" fill="none"/></>,
    'sunflower': <><circle cx="12" cy="12" r="4"/><circle cx="12" cy="5" r="2.5"/><circle cx="12" cy="19" r="2.5"/><circle cx="5" cy="12" r="2.5"/><circle cx="19" cy="12" r="2.5"/><circle cx="7" cy="7" r="2"/><circle cx="17" cy="7" r="2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></>,
    'lotus': <><circle cx="12" cy="14" r="2"/><path d="M12 12c-3 0-5-2-5-5h2c0 2 1 3 3 3s3-1 3-3h2c0 3-2 5-5 5z"/><path d="M8 14c-1 1-2 3-2 5h2c0-1 .5-2 1-3m6 0c1 1 2 3 2 5h-2c0-1-.5-2-1-3"/></>,
    'tree': <><path d="M12 3l-6 8h4v9h4v-9h4z"/></>,
    'leaf-simple': <path d="M20 12c0 5-4 10-8 10-2 0-4-1-5-3 3-1 5-3 6-6 1-2 2-5 2-8 5 1 5 4 5 7z" />,
    'butterfly': <><path d="M12 12c-2-2-4-3-6-3-2 0-3 2-3 4s1 4 3 4c2 0 4-1 6-3zm0 0c2-2 4-3 6-3 2 0 3 2 3 4s-1 4-3 4c-2 0-4-1-6-3z"/><path d="M12 12v8m0-8V6" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="6" r="1.5"/></>,
    'fox': <><path d="M12 4l-6 8c0 3 2 6 6 6s6-3 6-6l-6-8z"/><circle cx="10" cy="11" r="1"/><circle cx="14" cy="11" r="1"/><path d="M12 13v2l-1 1m1-3l1 3"/></>,
    'dog': <><circle cx="12" cy="13" r="6"/><circle cx="10" cy="12" r="1"/><circle cx="14" cy="12" r="1"/><path d="M12 14v2m-2 0c0 1 1 2 2 2s2-1 2-2m-8-10l1-4 2 4m8 0l1-4 2 4" stroke="currentColor" fill="none" strokeWidth="1.5"/></>,
    'cat': <><circle cx="12" cy="13" r="6"/><circle cx="10" cy="12" r="1"/><circle cx="14" cy="12" r="1"/><path d="M9 15c0 1.5 1.5 2 3 2s3-.5 3-2m-6-9l1-4 1 4m6 0l1-4 1 4" stroke="currentColor" fill="none" strokeWidth="1.5"/></>,
    'owl': <><circle cx="12" cy="12" r="8"/><circle cx="10" cy="11" r="2" fill="white"/><circle cx="14" cy="11" r="2" fill="white"/><circle cx="10" cy="11" r="1"/><circle cx="14" cy="11" r="1"/><path d="M12 13v2m-2 0l2 1 2-1" stroke="currentColor" fill="none" strokeWidth="1.5"/><path d="M6 8l2-3m10 3l-2-3"/></>,
    'whale': <path d="M20 12c0-3-2-5-5-5-2 0-3 1-4 2-1-1-2-2-4-2-3 0-5 2-5 5 0 2 1 3 2 4v2l3-1 3 1 3-1 3 1v-2c1-1 4-2 4-4zm-8-3c1 0 2 1 2 2s-1 2-2 2-2-1-2-2 1-2 2-2z" />,
    'turtle': <><ellipse cx="12" cy="12" rx="8" ry="5"/><circle cx="12" cy="12" r="3"/><circle cx="7" cy="10" r="1.5"/><circle cx="17" cy="10" r="1.5"/><circle cx="7" cy="14" r="1.5"/><circle cx="17" cy="14" r="1.5"/></>,
    'penguin': <><ellipse cx="12" cy="14" rx="5" ry="7"/><ellipse cx="12" cy="14" rx="3" ry="5" fill="white"/><circle cx="10" cy="11" r="1"/><circle cx="14" cy="11" r="1"/><path d="M12 13v3m-2-1l2 1 2-1" stroke="currentColor" fill="none" strokeWidth="1"/></>,
    'deer': <><circle cx="12" cy="14" r="5"/><circle cx="11" cy="13" r="1"/><circle cx="13" cy="13" r="1"/><path d="M12 15v3m-4-12l-2-4m2 4l1-4m5 4l2-4m-2 4l-1-4" stroke="currentColor" fill="none" strokeWidth="1.5"/></>,
    'rabbit': <><circle cx="12" cy="14" r="5"/><circle cx="10" cy="13" r="1"/><circle cx="14" cy="13" r="1"/><path d="M12 15v2m-1 0h2m-4-12c0-2 1-3 2-3s2 1 2 3v7m3-7c0-2 1-3 2-3s2 1 2 3v7" stroke="currentColor" fill="none" strokeWidth="1.5"/></>,
    'bear': <><circle cx="7" cy="7" r="3"/><circle cx="17" cy="7" r="3"/><circle cx="12" cy="14" r="7"/><circle cx="10" cy="13" r="1"/><circle cx="14" cy="13" r="1"/><path d="M12 15v2m-2 0c0 1 1 2 2 2s2-1 2-2" stroke="currentColor" fill="none" strokeWidth="1.5"/></>,
    'elephant': <><ellipse cx="12" cy="11" rx="7" ry="5"/><circle cx="10" cy="10" r="1"/><circle cx="14" cy="10" r="1"/><path d="M10 16c-2 0-3 2-3 4v2h2v-2c0-1 .5-2 1-2" stroke="currentColor" fill="none" strokeWidth="1.5"/></>,
    'moon': <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />,
    'sun': <><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="20" x2="12" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="4.2" y1="4.2" x2="5.6" y2="5.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="18.4" y1="18.4" x2="19.8" y2="19.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="2" y1="12" x2="4" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="20" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="4.2" y1="19.8" x2="5.6" y2="18.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="18.4" y1="5.6" x2="19.8" y2="4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
    'star': <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
    'cloud': <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />,
    'mountain': <path d="M3 20l6-12 5 8 7-14 3 18H3z" />,
    'wave': <path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0 4 2 6 0" fill="none" stroke="currentColor" strokeWidth="2" />,
    'heart': <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />,
    'infinity': <path d="M8 12c0-2 1-4 3-4s3 2 3 4-1 4-3 4-3-2-3-4zm8 0c0-2 1-4 3-4s3 2 3 4-1 4-3 4-3-2-3-4z" fill="none" stroke="currentColor" strokeWidth="2" />,
    'diamond': <path d="M12 2l10 10-10 10L2 12 12 2z" />,
    'key': <><circle cx="8" cy="8" r="5"/><circle cx="8" cy="8" r="2"/><path d="M12 11l8 8m0-4v4h-4" stroke="currentColor" strokeWidth="2" fill="none"/></>,
    'anchor': <><path d="M12 3v18m-6-4c0 3 2.7 5 6 5s6-2 6-5"/><circle cx="12" cy="5" r="2"/><path d="M6 11h12"/></>,
    'compass': <><circle cx="12" cy="12" r="9"/><path d="M12 6l-3 9 9-3-9-3z" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="1"/></>,
    'camera': <><rect x="3" y="6" width="18" height="13" rx="2"/><circle cx="12" cy="12" r="4"/><line x1="7" y1="3" x2="10" y2="6" stroke="currentColor" strokeWidth="2"/></>,
    'music-note': <><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/><line x1="9" y1="18" x2="9" y2="7" stroke="currentColor" strokeWidth="2"/><line x1="21" y1="16" x2="21" y2="5" stroke="currentColor" strokeWidth="2"/><line x1="9" y1="7" x2="21" y2="5" stroke="currentColor" strokeWidth="2"/></>,
    'book': <><path d="M4 3h16v18H4z"/><path d="M8 3v18m8-18v18" stroke="currentColor" strokeWidth="1.5" fill="none"/><rect x="5" y="4" width="14" height="16" fill="none" stroke="currentColor" strokeWidth="2"/></>,
    'coffee': <><path d="M18 8h2c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2h-2"/><path d="M4 8h12v7c0 2.2-1.8 4-4 4s-4-1.8-4-4V8z" fill="none" stroke="currentColor" strokeWidth="2"/><line x1="6" y1="4" x2="6" y2="8" stroke="currentColor" strokeWidth="1.5"/><line x1="10" y1="4" x2="10" y2="8" stroke="currentColor" strokeWidth="1.5"/><line x1="14" y1="4" x2="14" y2="8" stroke="currentColor" strokeWidth="1.5"/></>,
    'airplane': <path d="M12 2v10m0 0l-8 4v4l8-2 8 2v-4l-8-4zm-6-4l6 4 6-4" />,
    'hot-air-balloon': <><ellipse cx="12" cy="10" rx="6" ry="8"/><path d="M6 10c0-3.3 2.7-6 6-6s6 2.7 6 6" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M10 18v2h4v-2m-7-8h10"/><rect x="9" y="16" width="6" height="2"/></>,
    'house': <><path d="M3 10l9-7 9 7v11H3V10z"/><rect x="9" y="14" width="6" height="7"/><rect x="14" y="11" width="3" height="3"/></>,
    'lighthouse': <><path d="M10 3h4v18h-4z"/><path d="M8 21h8l1 2H7l1-2z"/><circle cx="12" cy="6" r="2"/><line x1="6" y1="10" x2="9" y2="10" stroke="currentColor" strokeWidth="1.5"/><line x1="15" y1="10" x2="18" y2="10" stroke="currentColor" strokeWidth="1.5"/></>,
    'bicycle': <><circle cx="6" cy="16" r="4"/><circle cx="18" cy="16" r="4"/><path d="M14 8h4l-2 8m-4-8l-4 8m0 0l-2-4m6-4l2-4" stroke="currentColor" fill="none" strokeWidth="1.5"/></>,
    'feather': <path d="M20 4c-3 0-5 1-7 3-1 1-2 3-2 5v8l-3-3 1-4c0-2 1-4 2-5 2-2 4-3 7-3l2-1z" fill="none" stroke="currentColor" strokeWidth="1.5" />,
    'ring': <><circle cx="12" cy="14" r="7"/><path d="M12 7l-3 4h6l-3-4z"/><circle cx="12" cy="14" r="2"/></>,
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill={shapeColor}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))', ...style }}
    >
      {shapes[shape] || <circle cx="12" cy="12" r="8" />}
    </svg>
  )
}

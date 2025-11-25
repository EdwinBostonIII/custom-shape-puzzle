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
    // Flora
    'rose': <><circle cx="12" cy="12" r="3"/><path d="M12 9c-1.5 0-3 1.5-3 3s1.5 3 3 3 3-1.5 3-3-1.5-3-3-3zm0-4c-1 0-2 .5-2.5 1.5m5 0C14 5.5 13 5 12 5m-4 9l-2 3m8-3l2 3" stroke="currentColor" strokeWidth="1.5" fill="none"/></>,
    'sunflower': <><circle cx="12" cy="12" r="4"/><circle cx="12" cy="5" r="2.5"/><circle cx="12" cy="19" r="2.5"/><circle cx="5" cy="12" r="2.5"/><circle cx="19" cy="12" r="2.5"/><circle cx="7" cy="7" r="2"/><circle cx="17" cy="7" r="2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></>,
    'lotus': <><circle cx="12" cy="14" r="2"/><path d="M12 12c-3 0-5-2-5-5h2c0 2 1 3 3 3s3-1 3-3h2c0 3-2 5-5 5z"/><path d="M8 14c-1 1-2 3-2 5h2c0-1 .5-2 1-3m6 0c1 1 2 3 2 5h-2c0-1-.5-2-1-3"/></>,
    'tree': <><path d="M12 3l-6 8h4v9h4v-9h4z"/></>,
    'leaf-simple': <path d="M20 12c0 5-4 10-8 10-2 0-4-1-5-3 3-1 5-3 6-6 1-2 2-5 2-8 5 1 5 4 5 7z" />,
    'tulip': <><path d="M12 3c-2 0-4 3-4 6 0 2 2 4 4 4s4-2 4-4c0-3-2-6-4-6z"/><path d="M12 13v8m-2-4l2-2 2 2" stroke="currentColor" strokeWidth="1.5" fill="none"/></>,
    'daisy': <><circle cx="12" cy="12" r="3"/>{[0,45,90,135,180,225,270,315].map(a => <ellipse key={a} cx={12 + 5*Math.cos(a*Math.PI/180)} cy={12 + 5*Math.sin(a*Math.PI/180)} rx="2" ry="3" transform={`rotate(${a} ${12 + 5*Math.cos(a*Math.PI/180)} ${12 + 5*Math.sin(a*Math.PI/180)})`}/>)}</>,
    'cactus': <><path d="M10 21V10c0-3 1-5 2-5s2 2 2 5v11"/><path d="M6 15c0-2 2-3 4-3m8 3c0-2-2-3-4-3" stroke="currentColor" strokeWidth="2" fill="none"/></>,
    
    // Fauna
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
    'lion': <><circle cx="12" cy="12" r="5"/><circle cx="10" cy="11" r="1"/><circle cx="14" cy="11" r="1"/><path d="M12 13v2m-2 0l2 1 2-1" stroke="currentColor" fill="none"/>{[0,30,60,90,120,150,180,210,240,270,300,330].map(a => <path key={a} d={`M${12+7*Math.cos(a*Math.PI/180)} ${12+7*Math.sin(a*Math.PI/180)}L${12+9*Math.cos(a*Math.PI/180)} ${12+9*Math.sin(a*Math.PI/180)}`} stroke="currentColor" strokeWidth="2"/>)}</>,
    'giraffe': <><ellipse cx="12" cy="16" rx="4" ry="5"/><path d="M12 11V4m-2 2l2-2 2 2" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="12" cy="4" r="2"/><circle cx="11" cy="3.5" r="0.5"/><circle cx="13" cy="3.5" r="0.5"/></>,
    'panda': <><circle cx="12" cy="12" r="7"/><ellipse cx="8" cy="9" rx="3" ry="2" fill="currentColor"/><ellipse cx="16" cy="9" rx="3" ry="2" fill="currentColor"/><circle cx="8" cy="9" r="1" fill="white"/><circle cx="16" cy="9" r="1" fill="white"/><ellipse cx="12" cy="14" rx="2" ry="1.5" fill="currentColor"/></>,
    'koala': <><circle cx="6" cy="10" r="4"/><circle cx="18" cy="10" r="4"/><circle cx="12" cy="14" r="6"/><circle cx="10" cy="13" r="1.5"/><circle cx="14" cy="13" r="1.5"/><ellipse cx="12" cy="16" rx="2" ry="1.5"/></>,
    
    // Celestial
    'moon': <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />,
    'sun': <><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="20" x2="12" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="4.2" y1="4.2" x2="5.6" y2="5.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="18.4" y1="18.4" x2="19.8" y2="19.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="2" y1="12" x2="4" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="20" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="4.2" y1="19.8" x2="5.6" y2="18.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="18.4" y1="5.6" x2="19.8" y2="4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
    'star': <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
    'cloud': <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />,
    'mountain': <path d="M3 20l6-12 5 8 7-14 3 18H3z" />,
    'wave': <path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0 4 2 6 0" fill="none" stroke="currentColor" strokeWidth="2" />,
    'rainbow': <><path d="M3 18c0-5 4-9 9-9s9 4 9 9" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M5 18c0-4 3-7 7-7s7 3 7 7" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M7 18c0-3 2-5 5-5s5 2 5 5" fill="none" stroke="currentColor" strokeWidth="2"/></>,
    'snowflake': <><path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.5" fill="none"/><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="19" r="1.5"/><circle cx="5" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></>,
    
    // Symbols
    'heart': <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />,
    'infinity': <path d="M8 12c0-2 1-4 3-4s3 2 3 4-1 4-3 4-3-2-3-4zm8 0c0-2 1-4 3-4s3 2 3 4-1 4-3 4-3-2-3-4z" fill="none" stroke="currentColor" strokeWidth="2" />,
    'diamond': <path d="M12 2l10 10-10 10L2 12 12 2z" />,
    'key': <><circle cx="8" cy="8" r="5"/><circle cx="8" cy="8" r="2"/><path d="M12 11l8 8m0-4v4h-4" stroke="currentColor" strokeWidth="2" fill="none"/></>,
    'anchor': <><path d="M12 3v18m-6-4c0 3 2.7 5 6 5s6-2 6-5"/><circle cx="12" cy="5" r="2"/><path d="M6 11h12"/></>,
    'compass': <><circle cx="12" cy="12" r="9"/><path d="M12 6l-3 9 9-3-9-3z" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="1"/></>,
    'crown': <><path d="M3 18l2-8 4 4 3-10 3 10 4-4 2 8H3z"/><path d="M3 18h18v3H3z"/></>,
    'clover': <><circle cx="12" cy="7" r="4"/><circle cx="7" cy="12" r="4"/><circle cx="17" cy="12" r="4"/><circle cx="12" cy="17" r="4"/><path d="M12 17v5" stroke="currentColor" strokeWidth="2"/></>,
    'peace': <><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M12 3v18M12 12l-6 6M12 12l6 6" stroke="currentColor" strokeWidth="2"/></>,
    'yin-yang': <><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M12 3a9 9 0 000 18 4.5 4.5 0 110-9 4.5 4.5 0 100-9z"/><circle cx="12" cy="7.5" r="1.5" fill="white"/><circle cx="12" cy="16.5" r="1.5"/></>,
    
    // Celebration
    'gift': <><rect x="5" y="10" width="14" height="10" rx="1"/><rect x="4" y="7" width="16" height="4" rx="1"/><path d="M12 7v13M8 7c0-2 1.5-4 4-4s4 2 4 4" stroke="currentColor" strokeWidth="1.5" fill="none"/></>,
    'balloon': <><ellipse cx="12" cy="9" rx="6" ry="7"/><path d="M12 16v6m-2-3l2 3 2-3" stroke="currentColor" strokeWidth="1.5" fill="none"/></>,
    'cake': <><rect x="4" y="12" width="16" height="8" rx="1"/><path d="M4 15h16M8 12v-2c0-1 1-2 2-2h4c1 0 2 1 2 2v2" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M12 8V6m-4 6V6m8 6V6" stroke="currentColor" strokeWidth="1.5"/></>,
    'champagne': <><path d="M8 2h8l-1 8H9L8 2z"/><path d="M12 10v8m-3 0h6" stroke="currentColor" strokeWidth="2"/><path d="M7 2h10" stroke="currentColor" strokeWidth="1.5"/><circle cx="16" cy="6" r="1" fill="white"/><circle cx="14" cy="4" r="0.5" fill="white"/></>,
    'ribbon': <><path d="M12 8c-3 0-6-2-6-4s3-2 6-2 6 0 6 2-3 4-6 4z"/><path d="M12 8v6m-4 0l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M8 14l-2 6m10-6l2 6" stroke="currentColor" strokeWidth="2"/></>,
    'confetti': <>{[[6,4],[18,6],[4,14],[20,16],[10,18]].map(([x,y],i) => <rect key={i} x={x} y={y} width="3" height="3" rx="0.5" transform={`rotate(${i*30} ${x+1.5} ${y+1.5})`}/>)}<circle cx="12" cy="10" r="2"/><circle cx="8" cy="8" r="1.5"/><circle cx="16" cy="12" r="1.5"/></>,
    'candle': <><rect x="9" y="8" width="6" height="12" rx="1"/><path d="M12 8V5" stroke="currentColor" strokeWidth="2"/><path d="M12 5c-1-1-1-2 0-3s1 2 0 3z" fill="orange"/></>,
    'party-hat': <><path d="M12 2l8 18H4L12 2z"/><path d="M6 16c2-1 4-1 6-1s4 0 6 1" stroke="currentColor" strokeWidth="1.5" fill="none"/><circle cx="12" cy="2" r="2"/></>,
    
    // Family & Life
    'baby': <><circle cx="12" cy="8" r="5"/><circle cx="10" cy="7" r="1"/><circle cx="14" cy="7" r="1"/><path d="M10 10c0 1 1 2 2 2s2-1 2-2"/><ellipse cx="12" cy="16" rx="4" ry="5"/></>,
    'paw-print': <><ellipse cx="12" cy="14" rx="5" ry="4"/><circle cx="8" cy="8" r="2.5"/><circle cx="16" cy="8" r="2.5"/><circle cx="5" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></>,
    'handprint': <><path d="M12 20v-8m-4 2V7c0-1 .5-2 1.5-2S11 6 11 7v7m-5-3V8c0-1 .5-2 1.5-2S9 7 9 8v5m8 1V8c0-1-.5-2-1.5-2S14 7 14 8v6m4 0V9c0-1-.5-2-1.5-2S15 8 15 9v5" stroke="currentColor" strokeWidth="1.5" fill="none"/></>,
    'family-tree': <><circle cx="12" cy="4" r="2"/><path d="M12 6v4m-6 1a6 6 0 0112 0" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="6" cy="14" r="2"/><circle cx="18" cy="14" r="2"/><circle cx="12" cy="16" r="2"/><path d="M6 16v4m12-4v4m-6-2v4" stroke="currentColor" strokeWidth="2"/></>,
    'home-heart': <><path d="M3 12l9-9 9 9v9H3V12z" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M12 18l-1-1c-2-1.5-3-2.5-3-4 0-1 1-2 2-2 .6 0 1.2.3 2 1 .8-.7 1.4-1 2-1 1 0 2 1 2 2 0 1.5-1 2.5-3 4l-1 1z"/></>,
    'cradle': <><path d="M4 14c0-4 4-6 8-6s8 2 8 6" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M4 14v4c0 1 2 2 8 2s8-1 8-2v-4" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M2 14h2m16 0h2" stroke="currentColor" strokeWidth="2"/></>,
    'stroller': <><circle cx="7" cy="19" r="2"/><circle cx="17" cy="19" r="2"/><path d="M5 17h10l2-10H8c-2 0-3 2-3 4v6" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M19 3v4" stroke="currentColor" strokeWidth="2"/></>,
    'rattle': <><circle cx="8" cy="8" r="5"/><path d="M12 11l6 6" stroke="currentColor" strokeWidth="3"/><circle cx="8" cy="8" r="2" fill="white"/><circle cx="6" cy="6" r="1"/><circle cx="10" cy="6" r="1"/><circle cx="6" cy="10" r="1"/><circle cx="10" cy="10" r="1"/></>,
    
    // Adventure
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
    'guitar': <><ellipse cx="12" cy="16" rx="6" ry="5"/><path d="M12 11V3m-2 0h4" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="12" cy="16" r="2" fill="white"/><circle cx="10" cy="5" r="1"/><circle cx="14" cy="5" r="1"/></>,
    'palette': <><ellipse cx="12" cy="12" rx="9" ry="8"/><circle cx="8" cy="9" r="1.5"/><circle cx="12" cy="7" r="1.5"/><circle cx="16" cy="9" r="1.5"/><circle cx="8" cy="14" r="1.5"/><ellipse cx="16" cy="14" rx="2" ry="3" fill="white"/></>,
    'globe': <><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2"/><ellipse cx="12" cy="12" rx="4" ry="9" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M3 12h18M5 7h14M5 17h14" stroke="currentColor" strokeWidth="1.5" fill="none"/></>,
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

import { ShapeType } from '@/lib/types'
import { ReactElement } from 'react'

interface ShapeIconProps {
  shape: ShapeType
  className?: string
}

export function ShapeIcon({ shape, className = "w-12 h-12" }: ShapeIconProps) {
  const shapes: Record<ShapeType, ReactElement> = {
    'heart': <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />,
    'star': <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
    'rose': <><circle cx="12" cy="12" r="3"/><path d="M12 9c-1.5 0-3 1.5-3 3s1.5 3 3 3 3-1.5 3-3-1.5-3-3-3zm0-4c-1 0-2 .5-2.5 1.5m5 0C14 5.5 13 5 12 5m-4 9l-2 3m8-3l2 3" stroke="currentColor" strokeWidth="1.5" fill="none"/></>,
    'tulip': <path d="M12 3C9 3 7 6 7 9c0 2 1 3 2 4v7h6v-7c1-1 2-2 2-4 0-3-2-6-5-6zm0 2c1.5 0 2.5 1.5 2.5 4 0 1-.5 2-1 2.5V18h-3v-6.5c-.5-.5-1-1.5-1-2.5C9.5 6.5 10.5 5 12 5z" />,
    'lily': <><path d="M12 4l3 6h3l-4 4v6h-4v-6l-4-4h3z"/><ellipse cx="12" cy="8" rx="6" ry="3" fill="none" stroke="currentColor" strokeWidth="1.5"/></>,
    'lotus': <><circle cx="12" cy="14" r="2"/><path d="M12 12c-3 0-5-2-5-5h2c0 2 1 3 3 3s3-1 3-3h2c0 3-2 5-5 5z"/><path d="M8 14c-1 1-2 3-2 5h2c0-1 .5-2 1-3m6 0c1 1 2 3 2 5h-2c0-1-.5-2-1-3"/></>,
    'sunflower': <><circle cx="12" cy="12" r="4"/><circle cx="12" cy="5" r="2.5"/><circle cx="12" cy="19" r="2.5"/><circle cx="5" cy="12" r="2.5"/><circle cx="19" cy="12" r="2.5"/><circle cx="7" cy="7" r="2"/><circle cx="17" cy="7" r="2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></>,
    'daisy': <><circle cx="12" cy="12" r="2.5"/><ellipse cx="12" cy="6" rx="1.5" ry="3"/><ellipse cx="12" cy="18" rx="1.5" ry="3"/><ellipse cx="6" cy="12" rx="3" ry="1.5"/><ellipse cx="18" cy="12" rx="3" ry="1.5"/></>,
    'flower': <><circle cx="12" cy="12" r="3"/><circle cx="12" cy="5" r="2.5"/><circle cx="12" cy="19" r="2.5"/><circle cx="5" cy="12" r="2.5"/><circle cx="19" cy="12" r="2.5"/><circle cx="7.5" cy="7.5" r="2"/><circle cx="16.5" cy="7.5" r="2"/><circle cx="7.5" cy="16.5" r="2"/><circle cx="16.5" cy="16.5" r="2"/></>,
    'maple-leaf': <path d="M12 2l2 5h3l-2 3 2 3h-3l-2 6-2-6H7l2-3-2-3h3l2-5z" />,
    'oak-leaf': <path d="M12 3c-2 2-3 4-3 6 0 1 0 2 1 3-1 0-2 0-2 1 0 2 1 3 2 4-1 0-1 1-1 2 0 2 2 3 3 3s3-1 3-3c0-1 0-2-1-2 1-1 2-2 2-4 0-1-1-1-2-1 1-1 1-2 1-3 0-2-1-4-3-6z" />,
    'leaf-simple': <path d="M20 12c0 5-4 10-8 10-2 0-4-1-5-3 3-1 5-3 6-6 1-2 2-5 2-8 5 1 5 4 5 7z" />,
    'tree': <><path d="M12 3l-6 8h4v9h4v-9h4z"/></>,
    'pine': <><path d="M12 2l-5 7h3l-3 5h3l-3 6h12l-3-6h3l-3-5h3z"/></>,
    'palm': <><path d="M12 20v-8m0-4V4m-4 4c-2-2-4-1-4 1s2 3 4 3m4-4c2-2 4-1 4 1s-2 3-4 3m-4 4c-2-1-4 0-4 2s2 3 4 2m4-4c2-1 4 0 4 2s-2 3-4 2"/></>,
    'cactus': <><rect x="10" y="8" width="4" height="12" rx="2"/><circle cx="12" cy="8" r="2"/><path d="M7 12v4c0 1 1 2 2 2m6-6v4c0 1-1 2-2 2" stroke="currentColor" fill="none" strokeWidth="1.5"/></>,
    'mushroom': <><path d="M12 10c-4 0-7 2-7 5h14c0-3-3-5-7-5z"/><rect x="10" y="15" width="4" height="7" rx="1"/><ellipse cx="12" cy="10" rx="7" ry="4"/></>,
    
    'whale': <path d="M20 12c0-3-2-5-5-5-2 0-3 1-4 2-1-1-2-2-4-2-3 0-5 2-5 5 0 2 1 3 2 4v2l3-1 3 1 3-1 3 1v-2c1-1 4-2 4-4zm-8-3c1 0 2 1 2 2s-1 2-2 2-2-1-2-2 1-2 2-2z" />,
    'dolphin': <path d="M4 12c0-3 2-5 5-5 2 0 3 1 4 2 1-1 2-2 4-2 3 0 5 2 5 5s-2 5-5 5c-2 0-3-1-4-2-1 1-2 2-4 2-3 0-5-2-5-5zm8 0c1 1 2 2 3 2 2 0 3-1 3-3s-1-3-3-3c-1 0-2 1-3 2z" />,
    'octopus': <><circle cx="12" cy="9" r="5"/><path d="M8 14c-1 2-2 4-2 6m4-6c0 2 0 4 0 6m4-6c0 2 0 4 0 6m4-6c1 2 2 4 2 6" stroke="currentColor" strokeWidth="1.5" fill="none"/><circle cx="10" cy="8" r="1"/><circle cx="14" cy="8" r="1"/></>,
    'fish': <path d="M2 12h8c0-3 2-5 5-5s5 2 5 5h2l-2 2-2-2c0 3-2 5-5 5s-5-2-5-5H2zm13-2c.5 0 1 .5 1 1s-.5 1-1 1-1-.5-1-1 .5-1 1-1z" />,
    'seahorse': <path d="M14 3c-2 0-3 1-3 3v2c-1 0-2 1-2 2v3c0 2 1 3 2 4v5h2v-5c1-1 2-2 2-4V8c0-1-1-2-2-2V6c0-1 0-2 1-2s2 1 2 2v1h1V6c0-2-1-3-3-3zm-1 9c-.5 0-1-.5-1-1s.5-1 1-1 1 .5 1 1-.5 1-1 1z" />,
    'turtle': <><ellipse cx="12" cy="12" rx="8" ry="5"/><circle cx="12" cy="12" r="3"/><circle cx="7" cy="10" r="1.5"/><circle cx="17" cy="10" r="1.5"/><circle cx="7" cy="14" r="1.5"/><circle cx="17" cy="14" r="1.5"/></>,
    'starfish': <><path d="M12 2l1.5 6L20 9l-5 4 1.5 6-4.5-3.5L7.5 19 9 13 4 9l6.5-.5z"/></>,
    'shell': <path d="M12 3C8 3 5 6 5 10c0 3 2 5 4 6l3 5 3-5c2-1 4-3 4-6 0-4-3-7-7-7zm0 2c3 0 5 2 5 5 0 2-1 3-2 4l-3 4-3-4c-1-1-2-2-2-4 0-3 2-5 5-5z" />,
    
    'owl': <><circle cx="12" cy="12" r="8"/><circle cx="10" cy="11" r="2" fill="white"/><circle cx="14" cy="11" r="2" fill="white"/><circle cx="10" cy="11" r="1"/><circle cx="14" cy="11" r="1"/><path d="M12 13v2m-2 0l2 1 2-1" stroke="currentColor" fill="none" strokeWidth="1.5"/><path d="M6 8l2-3m10 3l-2-3"/></>,
    'eagle': <><path d="M12 4l-8 6v4l8-3 8 3v-4z"/><path d="M12 11v9m-3-5l3 2 3-2" stroke="currentColor" fill="none" strokeWidth="1.5"/></>,
    'hummingbird': <><ellipse cx="8" cy="10" rx="5" ry="3" transform="rotate(-20 8 10)"/><circle cx="7" cy="9" r="1"/><path d="M13 10l8-2m-8 2l8 2m-16 0l3 5" stroke="currentColor" fill="none" strokeWidth="1.5"/></>,
    'peacock': <><circle cx="12" cy="14" r="4"/><path d="M8 10c-2-3-3-5-3-7h2c0 1 .5 3 1.5 5m5.5-5c2-3 3-5 3-7h-2c0 1-.5 3-1.5 5m-2 1c0-3 0-5 0-7h-2c0 2 0 4 0 7" stroke="currentColor" fill="none" strokeWidth="1.5"/></>,
    'swan': <><path d="M6 15c0-3 2-5 4-6 1-1 2-3 2-5 0 2 1 4 2 5 2 1 4 3 4 6 0 3-3 5-6 5s-6-2-6-5z"/><circle cx="12" cy="7" r="1.5"/></>,
    'penguin': <><ellipse cx="12" cy="14" rx="5" ry="7"/><ellipse cx="12" cy="14" rx="3" ry="5" fill="white"/><circle cx="10" cy="11" r="1"/><circle cx="14" cy="11" r="1"/><path d="M12 13v3m-2-1l2 1 2-1" stroke="currentColor" fill="none" strokeWidth="1"/></>,
    'butterfly': <><path d="M12 12c-2-2-4-3-6-3-2 0-3 2-3 4s1 4 3 4c2 0 4-1 6-3zm0 0c2-2 4-3 6-3 2 0 3 2 3 4s-1 4-3 4c-2 0-4-1-6-3z"/><path d="M12 12v8m0-8V6" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="6" r="1.5"/></>,
    
    'cat': <><circle cx="12" cy="13" r="6"/><circle cx="10" cy="12" r="1"/><circle cx="14" cy="12" r="1"/><path d="M9 15c0 1.5 1.5 2 3 2s3-.5 3-2m-6-9l1-4 1 4m6 0l1-4 1 4" stroke="currentColor" fill="none" strokeWidth="1.5"/></>,
    'dog': <><circle cx="12" cy="13" r="6"/><circle cx="10" cy="12" r="1"/><circle cx="14" cy="12" r="1"/><path d="M12 14v2m-2 0c0 1 1 2 2 2s2-1 2-2m-8-10l1-4 2 4m8 0l1-4 2 4" stroke="currentColor" fill="none" strokeWidth="1.5"/></>,
    'fox': <><path d="M12 4l-6 8c0 3 2 6 6 6s6-3 6-6l-6-8z"/><circle cx="10" cy="11" r="1"/><circle cx="14" cy="11" r="1"/><path d="M12 13v2l-1 1m1-3l1 3"/></>,
    'rabbit': <><circle cx="12" cy="14" r="5"/><circle cx="10" cy="13" r="1"/><circle cx="14" cy="13" r="1"/><path d="M12 15v2m-1 0h2m-4-12c0-2 1-3 2-3s2 1 2 3v7m3-7c0-2 1-3 2-3s2 1 2 3v7" stroke="currentColor" fill="none" strokeWidth="1.5"/></>,
    'deer': <><circle cx="12" cy="14" r="5"/><circle cx="11" cy="13" r="1"/><circle cx="13" cy="13" r="1"/><path d="M12 15v3m-4-12l-2-4m2 4l1-4m5 4l2-4m-2 4l-1-4" stroke="currentColor" fill="none" strokeWidth="1.5"/></>,
    'bear': <><circle cx="7" cy="7" r="3"/><circle cx="17" cy="7" r="3"/><circle cx="12" cy="14" r="7"/><circle cx="10" cy="13" r="1"/><circle cx="14" cy="13" r="1"/><path d="M12 15v2m-2 0c0 1 1 2 2 2s2-1 2-2" stroke="currentColor" fill="none" strokeWidth="1.5"/></>,
    'hedgehog': <><ellipse cx="13" cy="14" rx="6" ry="5"/><circle cx="11" cy="13" r="1"/><path d="M10 10l-1-3m3 3l0-3m3 3l1-3m2 3l2-3m-10 6l-2 1m2 2l-2 1" stroke="currentColor" fill="none" strokeWidth="1.5"/></>,
    'squirrel': <><circle cx="10" cy="12" r="5"/><circle cx="8" cy="11" r="1"/><path d="M14 10c2-2 4-2 6-1-1 2-3 3-5 3m-10 4c0 3 2 5 5 5l3-2" stroke="currentColor" fill="none" strokeWidth="1.5"/></>,
    'elephant': <><ellipse cx="12" cy="11" rx="7" ry="5"/><circle cx="10" cy="10" r="1"/><circle cx="14" cy="10" r="1"/><path d="M10 16c-2 0-3 2-3 4v2h2v-2c0-1 .5-2 1-2" stroke="currentColor" fill="none" strokeWidth="1.5"/></>,
    'giraffe': <><rect x="10" y="6" width="4" height="12" rx="1"/><circle cx="12" cy="5" r="2.5"/><circle cx="10" cy="4" r="0.5"/><circle cx="14" cy="4" r="0.5"/><circle cx="10" cy="9" r="1"/><circle cx="14" cy="9" r="1"/><circle cx="12" cy="12" r="1"/></>,
    'koala': <><circle cx="7" cy="8" r="3"/><circle cx="17" cy="8" r="3"/><circle cx="12" cy="14" r="6"/><circle cx="10" cy="13" r="1"/><circle cx="14" cy="13" r="1"/><ellipse cx="12" cy="16" rx="2" ry="1.5"/></>,
    'paw': <><circle cx="12" cy="14" r="4"/><circle cx="8" cy="10" r="2"/><circle cx="12" cy="9" r="2"/><circle cx="16" cy="10" r="2"/></>,
    
    'moon': <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />,
    'crescent': <path d="M18 12c0 3.3-2.7 6-6 6-1.5 0-2.8-.5-4-1.5 2-.5 3.5-2.5 3.5-5s-1.5-4.5-3.5-5c1.2-1 2.5-1.5 4-1.5 3.3 0 6 2.7 6 6z" />,
    'sun': <><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="20" x2="12" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="4.2" y1="4.2" x2="5.6" y2="5.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="18.4" y1="18.4" x2="19.8" y2="19.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="2" y1="12" x2="4" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="20" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="4.2" y1="19.8" x2="5.6" y2="18.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="18.4" y1="5.6" x2="19.8" y2="4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
    'cloud': <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />,
    'rainbow': <><path d="M3 17c0-7.18 5.82-13 13-13s13 5.82 13 13" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M6 17c0-5.52 4.48-10 10-10s10 4.48 10 10" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M9 17c0-3.87 3.13-7 7-7s7 3.13 7 7" fill="none" stroke="currentColor" strokeWidth="2"/></>,
    'lightning': <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />,
    'snowflake': <><line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="2"/><line x1="4.2" y1="7" x2="19.8" y2="17" stroke="currentColor" strokeWidth="2"/><line x1="4.2" y1="17" x2="19.8" y2="7" stroke="currentColor" strokeWidth="2"/><line x1="9" y1="4" x2="15" y2="4" stroke="currentColor" strokeWidth="1.5"/><line x1="9" y1="20" x2="15" y2="20" stroke="currentColor" strokeWidth="1.5"/></>,
    'flame': <path d="M12 2c-2 4-3 7-3 9 0 3 1.5 6 3 6s3-3 3-6c0-2-1-5-3-9zm0 7c-1 2-1.5 3-1.5 4 0 1.5.7 3 1.5 3s1.5-1.5 1.5-3c0-1-.5-2-1.5-4z" />,
    'raindrop': <path d="M12 2c-3 5-5 8-5 11 0 2.8 2.2 5 5 5s5-2.2 5-5c0-3-2-6-5-11z" />,
    'wind': <><path d="M9 10h10c1.7 0 3-1.3 3-3s-1.3-3-3-3c-1 0-2 .5-2.5 1.5M3 14h13c2.2 0 4 1.8 4 4s-1.8 4-4 4c-1.4 0-2.6-.7-3.3-1.8M5 18h8c1.1 0 2-.9 2-2s-.9-2-2-2" stroke="currentColor" fill="none" strokeWidth="1.5"/></>,
    'mountain': <path d="M3 20l6-12 5 8 7-14 3 18H3z" />,
    'wave': <path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0 4 2 6 0" fill="none" stroke="currentColor" strokeWidth="2" />,
    
    'circle': <circle cx="12" cy="12" r="8" />,
    'hexagon': <path d="M12 2l8 5v10l-8 5-8-5V7l8-5z" />,
    'triangle': <path d="M12 3L2 21h20L12 3z" />,
    'square': <rect x="4" y="4" width="16" height="16" rx="1" />,
    'diamond': <path d="M12 2l10 10-10 10L2 12 12 2z" />,
    'spiral': <path d="M12 12c0-1 1-2 2-2s2 1 2 2-1 3-3 3-4-1-4-4 2-5 5-5 6 2 6 6-3 7-7 7-8-3-8-8" fill="none" stroke="currentColor" strokeWidth="2" />,
    'infinity': <path d="M8 12c0-2 1-4 3-4s3 2 3 4-1 4-3 4-3-2-3-4zm8 0c0-2 1-4 3-4s3 2 3 4-1 4-3 4-3-2-3-4z" fill="none" stroke="currentColor" strokeWidth="2" />,
    
    'guitar': <><ellipse cx="8" cy="15" rx="3" ry="6"/><rect x="11" y="5" width="2" height="14"/><circle cx="12" cy="6" r="3"/><line x1="11" y1="10" x2="13" y2="10" stroke="currentColor" strokeWidth="1"/><line x1="11" y1="13" x2="13" y2="13" stroke="currentColor" strokeWidth="1"/><line x1="11" y1="16" x2="13" y2="16" stroke="currentColor" strokeWidth="1"/></>,
    'piano': <><rect x="4" y="8" width="16" height="10" rx="1"/><line x1="8" y1="8" x2="8" y2="18" stroke="currentColor" strokeWidth="1.5"/><line x1="12" y1="8" x2="12" y2="18" stroke="currentColor" strokeWidth="1.5"/><line x1="16" y1="8" x2="16" y2="18" stroke="currentColor" strokeWidth="1.5"/><rect x="6" y="8" width="2" height="6" fill="currentColor"/><rect x="14" y="8" width="2" height="6" fill="currentColor"/></>,
    'music-note': <><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/><line x1="9" y1="18" x2="9" y2="7" stroke="currentColor" strokeWidth="2"/><line x1="21" y1="16" x2="21" y2="5" stroke="currentColor" strokeWidth="2"/><line x1="9" y1="7" x2="21" y2="5" stroke="currentColor" strokeWidth="2"/></>,
    'microphone': <><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10c0 3.9 3.1 7 7 7s7-3.1 7-7m-7 7v5m-3 0h6" stroke="currentColor" fill="none" strokeWidth="2"/></>,
    'headphones': <><path d="M3 13v4c0 1.7 1.3 3 3 3h1v-7H4c-.6 0-1 .4-1 1zm18 0v4c0 1.7-1.3 3-3 3h-1v-7h3c.6 0 1 .4 1 1z"/><path d="M4 13c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="none" stroke="currentColor" strokeWidth="2"/></>,
    'book': <><path d="M4 3h16v18H4z"/><path d="M8 3v18m8-18v18" stroke="currentColor" strokeWidth="1.5" fill="none"/><rect x="5" y="4" width="14" height="16" fill="none" stroke="currentColor" strokeWidth="2"/></>,
    'pencil': <><path d="M17 3l4 4L8 20H4v-4L17 3z"/><line x1="14" y1="6" x2="18" y2="10" stroke="currentColor" strokeWidth="1.5"/></>,
    'palette': <><circle cx="12" cy="12" r="9"/><circle cx="9" cy="9" r="1.5"/><circle cx="15" cy="9" r="1.5"/><circle cx="9" cy="15" r="1.5"/><circle cx="15" cy="15" r="1.5"/><circle cx="12" cy="12" r="1.5"/></>,
    'camera': <><rect x="3" y="6" width="18" height="13" rx="2"/><circle cx="12" cy="12" r="4"/><line x1="7" y1="3" x2="10" y2="6" stroke="currentColor" strokeWidth="2"/></>,
    'telescope': <><path d="M4 14l4-8 12 6-4 8-12-6z"/><circle cx="16" cy="18" r="1"/><line x1="16" y1="18" x2="18" y2="22" stroke="currentColor" strokeWidth="2"/></>,
    
    'coffee': <><path d="M18 8h2c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2h-2"/><path d="M4 8h12v7c0 2.2-1.8 4-4 4s-4-1.8-4-4V8z" fill="none" stroke="currentColor" strokeWidth="2"/><line x1="6" y1="4" x2="6" y2="8" stroke="currentColor" strokeWidth="1.5"/><line x1="10" y1="4" x2="10" y2="8" stroke="currentColor" strokeWidth="1.5"/><line x1="14" y1="4" x2="14" y2="8" stroke="currentColor" strokeWidth="1.5"/></>,
    'cupcake': <><path d="M5 13l2-5h10l2 5z"/><path d="M5 13h14v4c0 2.2-1.8 4-4 4H9c-2.2 0-4-1.8-4-4v-4z"/><circle cx="12" cy="7" r="2"/></>,
    'ice-cream': <><path d="M12 3l-4 9h8l-4-9z"/><path d="M8 12v2c0 2.2 1.8 4 4 4s4-1.8 4-4v-2"/><circle cx="12" cy="6" r="1"/></>,
    'pizza': <><circle cx="12" cy="12" r="9"/><path d="M12 12l-9 0m9 0l6.4-6.4m-6.4 6.4l6.4 6.4" stroke="currentColor" strokeWidth="2"/><circle cx="8" cy="10" r="1.5"/><circle cx="14" cy="8" r="1.5"/><circle cx="16" cy="14" r="1.5"/></>,
    'cookie': <><circle cx="12" cy="12" r="9"/><circle cx="9" cy="9" r="1.5"/><circle cx="15" cy="9" r="1.5"/><circle cx="9" cy="15" r="1.5"/><circle cx="15" cy="15" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="6" cy="12" r="1"/><circle cx="18" cy="12" r="1"/></>,
    
    'house': <><path d="M3 10l9-7 9 7v11H3V10z"/><rect x="9" y="14" width="6" height="7"/><rect x="14" y="11" width="3" height="3"/></>,
    'castle': <><path d="M3 21V11l3-3h3V5h2V3h2v2h2V5h3l3 3v10"/><rect x="7" y="13" width="3" height="8"/><rect x="14" y="13" width="3" height="8"/><rect x="3" y="8" width="2" height="3"/><rect x="19" y="8" width="2" height="3"/></>,
    'lighthouse': <><path d="M10 3h4v18h-4z"/><path d="M8 21h8l1 2H7l1-2z"/><circle cx="12" cy="6" r="2"/><line x1="6" y1="10" x2="9" y2="10" stroke="currentColor" strokeWidth="1.5"/><line x1="15" y1="10" x2="18" y2="10" stroke="currentColor" strokeWidth="1.5"/></>,
    'tent': <><path d="M3 20l9-16 9 16H3z"/><line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" strokeWidth="1.5"/><line x1="3" y1="20" x2="21" y2="20" stroke="currentColor" strokeWidth="2"/></>,
    'windmill': <><circle cx="12" cy="12" r="2"/><path d="M12 10V2l-4 8h4zm0 4v8l4-8h-4zm-2 0H2l8-4v4zm4 0h8l-8 4v-4" fill="none" stroke="currentColor" strokeWidth="1.5"/></>,
    
    'car': <><rect x="3" y="11" width="18" height="6" rx="2"/><path d="M5 11l2-5h10l2 5"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></>,
    'train': <><rect x="4" y="6" width="16" height="12" rx="2"/><line x1="4" y1="10" x2="20" y2="10" stroke="currentColor" strokeWidth="2"/><circle cx="9" cy="14" r="1.5"/><circle cx="15" cy="14" r="1.5"/><path d="M2 18l2 2m16-2l2 2" stroke="currentColor" strokeWidth="2"/></>,
    'airplane': <path d="M12 2v10m0 0l-8 4v4l8-2 8 2v-4l-8-4zm-6-4l6 4 6-4" />,
    'boat': <><path d="M3 18l3-3 3 3 3-3 3 3 3-3 3 3"/><path d="M4 14l8-8 8 8"/><line x1="12" y1="2" x2="12" y2="6" stroke="currentColor" strokeWidth="2"/></>,
    'rocket': <><path d="M12 2c3 0 6 3 6 8 0 2-1 4-2 5l-1 7h-6l-1-7c-1-1-2-3-2-5 0-5 3-8 6-8z"/><circle cx="12" cy="8" r="2"/><path d="M7 12l-4 2v4l4-2m10 0l4 2v4l-4-2"/></>,
    'anchor': <><path d="M12 3v18m-6-4c0 3 2.7 5 6 5s6-2 6-5"/><circle cx="12" cy="5" r="2"/><path d="M6 11h12"/></>,
    'compass': <><circle cx="12" cy="12" r="9"/><path d="M12 6l-3 9 9-3-9-3z" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="1"/></>,
    'hot-air-balloon': <><ellipse cx="12" cy="10" rx="6" ry="8"/><path d="M6 10c0-3.3 2.7-6 6-6s6 2.7 6 6" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M10 18v2h4v-2m-7-8h10"/><rect x="9" y="16" width="6" height="2"/></>,
    'bicycle': <><circle cx="6" cy="16" r="4"/><circle cx="18" cy="16" r="4"/><path d="M14 8h4l-2 8m-4-8l-4 8m0 0l-2-4m6-4l2-4" stroke="currentColor" fill="none" strokeWidth="1.5"/></>,
    'skateboard': <><rect x="4" y="10" width="16" height="2" rx="1"/><circle cx="7" cy="15" r="2"/><circle cx="17" cy="15" r="2"/></>,
    
    'crown': <path d="M2 12l3-6 5 3 2-6 2 6 5-3 3 6v6H2v-6z" />,
    'gem': <><path d="M6 3l-4 8 10 10 10-10-4-8H6z"/><path d="M2 11h20M12 3v18" stroke="currentColor" strokeWidth="1.5"/></>,
    'ring': <><circle cx="12" cy="14" r="7"/><path d="M12 7l-3 4h6l-3-4z"/><circle cx="12" cy="14" r="2"/></>,
    'key': <><circle cx="8" cy="8" r="5"/><circle cx="8" cy="8" r="2"/><path d="M12 11l8 8m0-4v4h-4" stroke="currentColor" strokeWidth="2" fill="none"/></>,
    'lock': <><rect x="6" y="10" width="12" height="10" rx="2"/><path d="M8 10V7c0-2.2 1.8-4 4-4s4 1.8 4 4v3"/><circle cx="12" cy="15" r="1.5"/></>,
    'hourglass': <><path d="M6 3h12v6l-6 3 6 3v6H6v-6l6-3-6-3V3z"/><line x1="6" y1="3" x2="18" y2="3" stroke="currentColor" strokeWidth="2"/><line x1="6" y1="21" x2="18" y2="21" stroke="currentColor" strokeWidth="2"/></>,
    'clover': <><path d="M12 12c-2-2-3-4-3-6 0-1.7 1.3-3 3-3s3 1.3 3 3c0 2-1 4-3 6zm0 0c2-2 4-3 6-3 1.7 0 3 1.3 3 3s-1.3 3-3 3c-2 0-4-1-6-3zm0 0c2 2 3 4 3 6 0 1.7-1.3 3-3 3s-3-1.3-3-3c0-2 1-4 3-6zm0 0c-2 2-4 3-6 3-1.7 0-3-1.3-3-3s1.3-3 3-3c2 0 4 1 6 3z"/></>,
    'feather': <path d="M20 4c-3 0-5 1-7 3-1 1-2 3-2 5v8l-3-3 1-4c0-2 1-4 2-5 2-2 4-3 7-3l2-1z" fill="none" stroke="currentColor" strokeWidth="1.5" />,
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {shapes[shape] || <circle cx="12" cy="12" r="8" />}
    </svg>
  )
}

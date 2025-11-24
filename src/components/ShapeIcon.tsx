import { ShapeType } from '@/lib/types'

interface ShapeIconProps {
  shape: ShapeType
  className?: string
}

export function ShapeIcon({ shape, className = "w-12 h-12" }: ShapeIconProps) {
  const getShapePath = (shape: ShapeType) => {
    switch (shape) {
      case 'heart':
        return <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      case 'star':
        return <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      case 'flower':
        return (
          <>
            <circle cx="12" cy="12" r="3" />
            <circle cx="12" cy="5" r="2.5" />
            <circle cx="12" cy="19" r="2.5" />
            <circle cx="5" cy="12" r="2.5" />
            <circle cx="19" cy="12" r="2.5" />
            <circle cx="7.5" cy="7.5" r="2" />
            <circle cx="16.5" cy="7.5" r="2" />
            <circle cx="7.5" cy="16.5" r="2" />
            <circle cx="16.5" cy="16.5" r="2" />
          </>
        )
      case 'butterfly':
        return <path d="M12 3c-2.5 0-4 2-4 4 0 1 .5 2 1 3-1.5 0-3 1-3 3s1.5 3 3 3c-.5 1-1 2-1 3 0 2 1.5 4 4 4s4-2 4-4c0-1-.5-2-1-3 1.5 0 3-1 3-3s-1.5-3-3-3c.5-1 1-2 1-3 0-2-1.5-4-4-4z" />
      case 'moon':
        return <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      case 'sun':
        return (
          <>
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="21" x2="12" y2="23" strokeWidth="2" strokeLinecap="round" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" strokeWidth="2" strokeLinecap="round" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" strokeWidth="2" strokeLinecap="round" />
            <line x1="1" y1="12" x2="3" y2="12" strokeWidth="2" strokeLinecap="round" />
            <line x1="21" y1="12" x2="23" y2="12" strokeWidth="2" strokeLinecap="round" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" strokeWidth="2" strokeLinecap="round" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" strokeWidth="2" strokeLinecap="round" />
          </>
        )
      case 'cloud':
        return <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
      case 'rainbow':
        return (
          <>
            <path d="M3 17c0-7.18 5.82-13 13-13s13 5.82 13 13" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M6 17c0-5.52 4.48-10 10-10s10 4.48 10 10" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M9 17c0-3.87 3.13-7 7-7s7 3.13 7 7" fill="none" stroke="currentColor" strokeWidth="2" />
          </>
        )
      case 'tree':
        return (
          <>
            <path d="M12 3l-6 8h4v9h4v-9h4z" />
          </>
        )
      case 'dolphin':
        return <path d="M4 12c0-3 2-5 5-5 2 0 3 1 4 2 1-1 2-2 4-2 3 0 5 2 5 5s-2 5-5 5c-2 0-3-1-4-2-1 1-2 2-4 2-3 0-5-2-5-5zm8 0c1 1 2 2 3 2 2 0 3-1 3-3s-1-3-3-3c-1 0-2 1-3 2z" />
      case 'turtle':
        return (
          <>
            <ellipse cx="12" cy="12" rx="8" ry="5" />
            <circle cx="12" cy="12" r="3" />
            <circle cx="7" cy="10" r="1.5" />
            <circle cx="17" cy="10" r="1.5" />
            <circle cx="7" cy="14" r="1.5" />
            <circle cx="17" cy="14" r="1.5" />
          </>
        )
      case 'cat':
        return (
          <>
            <path d="M12 2l2 4-2 1-2-1 2-4z" />
            <path d="M18 6l2 4-2 1-2-1 2-4z" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="10" cy="11" r="1" />
            <circle cx="14" cy="11" r="1" />
            <path d="M9 14c0 1.5 1.5 2 3 2s3-.5 3-2" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </>
        )
      case 'dog':
        return (
          <>
            <path d="M4 6l2-4 2 4v2H4V6z" />
            <path d="M16 6l2-4 2 4v2h-4V6z" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="10" cy="11" r="1" />
            <circle cx="14" cy="11" r="1" />
            <path d="M12 13v2m-2 0c0 1 1 2 2 2s2-1 2-2" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </>
        )
      case 'bear':
        return (
          <>
            <circle cx="7" cy="7" r="3" />
            <circle cx="17" cy="7" r="3" />
            <circle cx="12" cy="14" r="7" />
            <circle cx="10" cy="13" r="1" />
            <circle cx="14" cy="13" r="1" />
            <path d="M12 15v2m-2 0c0 1 1 2 2 2s2-1 2-2" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </>
        )
      case 'elephant':
        return (
          <>
            <ellipse cx="12" cy="10" rx="7" ry="5" />
            <path d="M10 15c-2 0-3 2-3 4h2c0-1 .5-2 1-2z" />
            <circle cx="10" cy="9" r="1" />
            <circle cx="14" cy="9" r="1" />
          </>
        )
      case 'giraffe':
        return (
          <>
            <rect x="10" y="4" width="4" height="12" />
            <circle cx="12" cy="4" r="2" />
            <circle cx="10" cy="3" r="0.5" />
            <circle cx="14" cy="3" r="0.5" />
            <circle cx="10" cy="8" r="1" />
            <circle cx="14" cy="8" r="1" />
            <circle cx="12" cy="11" r="1" />
          </>
        )
      case 'circle':
        return <circle cx="12" cy="12" r="8" />
      case 'hexagon':
        return <path d="M12 2l8 5v10l-8 5-8-5V7l8-5z" />
      case 'triangle':
        return <path d="M12 2L2 20h20L12 2z" />
      case 'square':
        return <rect x="4" y="4" width="16" height="16" />
      case 'diamond':
        return <path d="M12 2l10 10-10 10L2 12 12 2z" />
      case 'spiral':
        return <path d="M12 12c0-1 1-2 2-2s2 1 2 2-1 3-3 3-4-1-4-4 2-5 5-5 6 2 6 6-3 7-7 7-8-3-8-8" fill="none" stroke="currentColor" strokeWidth="2" />
      case 'car':
        return (
          <>
            <rect x="3" y="11" width="18" height="6" rx="2" />
            <path d="M5 11l2-5h10l2 5" />
            <circle cx="7" cy="17" r="2" />
            <circle cx="17" cy="17" r="2" />
          </>
        )
      case 'train':
        return (
          <>
            <rect x="4" y="6" width="16" height="12" rx="2" />
            <line x1="4" y1="10" x2="20" y2="10" strokeWidth="2" />
            <circle cx="9" cy="14" r="1.5" />
            <circle cx="15" cy="14" r="1.5" />
            <path d="M2 18l2 2m16-2l2 2" strokeWidth="2" />
          </>
        )
      case 'airplane':
        return <path d="M12 2v10m0 0l-8 4v4l8-2 8 2v-4l-8-4zm-6-4l6 4 6-4" />
      case 'boat':
        return (
          <>
            <path d="M3 18l3-3 3 3 3-3 3 3 3-3 3 3" />
            <path d="M4 14l8-8 8 8" />
            <line x1="12" y1="2" x2="12" y2="6" strokeWidth="2" />
          </>
        )
      case 'rocket':
        return (
          <>
            <path d="M12 2c3 0 6 3 6 8 0 2-1 4-2 5l-1 7h-6l-1-7c-1-1-2-3-2-5 0-5 3-8 6-8z" />
            <circle cx="12" cy="8" r="2" />
            <path d="M7 12l-4 2v4l4-2" />
            <path d="M17 12l4 2v4l-4-2" />
          </>
        )
      case 'mountain':
        return <path d="M3 20l6-12 5 8 7-14 3 18H3z" />
      case 'wave':
        return <path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0 4 2 6 0" fill="none" stroke="currentColor" strokeWidth="2" />
      default:
        return <circle cx="12" cy="12" r="8" />
    }
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {getShapePath(shape)}
    </svg>
  )
}

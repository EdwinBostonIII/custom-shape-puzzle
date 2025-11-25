/**
 * LIVE PUZZLE ASSEMBLY
 * 
 * A real-time preview that shows puzzle pieces snapping together
 * as the user selects motifs. Pieces animate into place with
 * satisfying visual feedback.
 */

import { motion, AnimatePresence } from 'framer-motion'
import { ShapeType } from '@/lib/types'
import { PuzzlePieceRenderer } from './PuzzlePieceRenderer'
import { PUZZLE_PIECES } from '@/lib/puzzlePieces'
import { cn } from '@/lib/utils'

interface LivePuzzleAssemblyProps {
  /** Array of selected motifs (up to 10) */
  selectedMotifs: (ShapeType | null)[]
  /** Wood stain color */
  stain?: string
  /** Additional CSS classes */
  className?: string
  /** Compact mode for smaller displays */
  compact?: boolean
}

export function LivePuzzleAssembly({
  selectedMotifs,
  stain = 'natural',
  className,
  compact = false,
}: LivePuzzleAssemblyProps) {
  // Ensure we always have 10 slots
  const motifs = [...selectedMotifs, ...Array(10 - selectedMotifs.length).fill(null)].slice(0, 10)
  
  const filledCount = selectedMotifs.filter(Boolean).length
  const pieceSize = compact ? 60 : 80

  return (
    <div 
      className={cn(
        'relative',
        className
      )}
      role="img"
      aria-label={`Puzzle assembly preview: ${filledCount} of 10 pieces placed`}
    >
      {/* Background puzzle outline */}
      <div 
        className="relative"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gridTemplateRows: 'repeat(2, 1fr)',
          gap: '2px',
          width: pieceSize * 5 + 8,
          height: pieceSize * 2 + 4,
        }}
      >
        {PUZZLE_PIECES.map((piece, index) => {
          const hasMotif = motifs[index] !== null
          
          return (
            <div
              key={piece.id}
              className="relative"
              style={{
                width: pieceSize,
                height: pieceSize,
              }}
            >
              {/* Empty slot indicator */}
              {!hasMotif && (
                <div 
                  className="absolute inset-0 flex items-center justify-center opacity-30"
                  aria-hidden="true"
                >
                  <PuzzlePieceRenderer
                    slotIndex={index}
                    stain="gray-wash"
                    size={pieceSize}
                    showTexture={false}
                  />
                  <span className="absolute text-charcoal/50 font-semibold text-sm">
                    {index + 1}
                  </span>
                </div>
              )}

              {/* Animated piece placement */}
              <AnimatePresence mode="wait">
                {hasMotif && (
                  <motion.div
                    key={`piece-${index}-${motifs[index]}`}
                    initial={{ 
                      scale: 1.5, 
                      opacity: 0,
                      y: -30,
                      rotate: Math.random() * 20 - 10
                    }}
                    animate={{ 
                      scale: 1, 
                      opacity: 1,
                      y: 0,
                      rotate: 0
                    }}
                    exit={{ 
                      scale: 0.8, 
                      opacity: 0,
                      y: 20
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 20,
                      delay: 0.05
                    }}
                    className="absolute inset-0"
                  >
                    <PuzzlePieceRenderer
                      slotIndex={index}
                      motif={motifs[index]!}
                      stain={stain}
                      size={pieceSize}
                      showTexture={true}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* Progress indicator */}
      <div className="mt-3 text-center">
        <div className="flex items-center justify-center gap-1 mb-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              className={cn(
                'w-2 h-2 rounded-full transition-colors duration-300',
                i < filledCount ? 'bg-terracotta' : 'bg-stone'
              )}
              animate={i === filledCount - 1 ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
        <p className="font-body text-xs text-charcoal/60">
          {filledCount === 0 && 'Start selecting shapes to build your puzzle'}
          {filledCount > 0 && filledCount < 10 && `${10 - filledCount} more pieces to go`}
          {filledCount === 10 && '🎉 Your puzzle is complete!'}
        </p>
      </div>
    </div>
  )
}

/**
 * Floating preview that sticks to the corner of the screen
 */
interface FloatingPuzzlePreviewProps {
  selectedMotifs: (ShapeType | null)[]
  stain?: string
  visible?: boolean
}

export function FloatingPuzzlePreview({
  selectedMotifs,
  stain = 'natural',
  visible = true,
}: FloatingPuzzlePreviewProps) {
  const filledCount = selectedMotifs.filter(Boolean).length

  return (
    <AnimatePresence>
      {visible && filledCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 100 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: 100 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="fixed bottom-32 right-6 z-40 bg-cream/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 border-2 border-stone"
        >
          <div className="font-display text-sm font-semibold text-charcoal mb-2 text-center">
            Live Preview
          </div>
          <LivePuzzleAssembly
            selectedMotifs={selectedMotifs}
            stain={stain}
            compact={true}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

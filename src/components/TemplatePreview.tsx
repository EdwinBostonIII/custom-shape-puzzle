import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ArrowLeft, Info } from '@phosphor-icons/react'
import { ShapeIcon } from './ShapeIcon'
import { ShapeType } from '@/lib/types'

interface TemplatePreviewProps {
  shapes: ShapeType[]
  photoData?: string
  onBack: () => void
  onContinue: () => void
}

export function TemplatePreview({ shapes, photoData, onBack, onContinue }: TemplatePreviewProps) {
  const [animatedPositions, setAnimatedPositions] = useState<{ x: number; y: number; rotation: number }[]>([])

  useEffect(() => {
    // Generate random starting positions and animate to final positions
    const positions = shapes.map(() => ({
      x: Math.random() * 80 - 40,
      y: Math.random() * 80 - 40,
      rotation: Math.random() * 360
    }))
    setAnimatedPositions(positions)

    // Animate to locked positions after a delay
    const timer = setTimeout(() => {
      setAnimatedPositions(shapes.map((_, index) => ({
        x: (index % 5) * 20 - 40,
        y: Math.floor(index / 5) * 30 - 30,
        rotation: 0
      })))
    }, 500)

    return () => clearTimeout(timer)
  }, [shapes])
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="px-6 py-12 md:px-12 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="mr-2" size={20} />
              Back
            </Button>
          </div>

          <div className="mb-16 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl" style={{ fontFamily: 'var(--font-outfit)', letterSpacing: '-0.02em', lineHeight: '1.1' }}>
              Here Are Your Pieces
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground font-light leading-relaxed mb-4">
              Each shape tells part of your story. Together, they create something beautiful.
            </p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <Info size={16} weight="fill" />
                    <span>How does the AI position my shapes?</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Our Story-Lock™ system ensures these shapes interlock perfectly with the surrounding pieces.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* X-Ray Preview with Photo and Shapes */}
          {photoData ? (
            <Card className="mx-auto mb-16 max-w-5xl overflow-hidden border-2 shadow-2xl relative">
              <div className="relative aspect-video">
                {/* Photo background at 80% opacity */}
                <img 
                  src={photoData} 
                  alt="Your photo" 
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                
                {/* Overlay with animated shapes */}
                <div className="absolute inset-0 flex items-center justify-center p-16">
                  {shapes.map((shape, index) => (
                    <div
                      key={`${shape}-${index}`}
                      className="absolute transition-all duration-2000 ease-out"
                      style={{
                        transform: animatedPositions[index]
                          ? `translate(${animatedPositions[index].x}px, ${animatedPositions[index].y}px) rotate(${animatedPositions[index].rotation}deg)`
                          : 'translate(0, 0) rotate(0deg)',
                        transitionDuration: '2s',
                      }}
                    >
                      <div className="relative">
                        <ShapeIcon 
                          shape={shape} 
                          className="h-16 w-16 md:h-20 md:w-20"
                          style={{
                            filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.6)) drop-shadow(0 0 4px rgba(255, 255, 255, 0.4))',
                            fill: 'white',
                            stroke: 'gold',
                            strokeWidth: '2px'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Gradient overlay for better contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
              </div>
            </Card>
          ) : (
            <Card className="mx-auto mb-16 max-w-5xl overflow-hidden border-2 shadow-2xl p-10 md:p-16 bg-gradient-to-br from-card to-muted/10">
              <div className="grid grid-cols-5 gap-8">
                {shapes.map((shape, index) => (
                  <div
                    key={`${shape}-${index}`}
                    className="flex aspect-square items-center justify-center rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:-rotate-2"
                    style={{
                      animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                    }}
                  >
                    <ShapeIcon shape={shape} className="h-full w-full" />
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div className="flex justify-center gap-6">
            <Button variant="outline" size="lg" onClick={onBack} className="px-8 py-6 text-base">
              Modify Shapes
            </Button>
            <Button size="lg" onClick={onContinue} className="px-8 py-6 text-base">
              Continue to Design
            </Button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

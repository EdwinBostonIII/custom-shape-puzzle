import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, ArrowLeft, Link as LinkIcon } from '@phosphor-icons/react'
import { ShapeIcon } from './ShapeIcon'
import { PuzzleType, ShapeType } from '@/lib/types'
import { PUZZLE_SHAPES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface ShapeSelectionProps {
  type: PuzzleType
  sessionId: string
  selectedShapes: ShapeType[]
  onShapesSelected: (shapes: ShapeType[]) => void
  onBack: () => void
  onContinue: () => void
  isPartnerMode?: boolean
}

export function ShapeSelection({
  type,
  sessionId,
  selectedShapes,
  onShapesSelected,
  onBack,
  onContinue,
  isPartnerMode = false,
}: ShapeSelectionProps) {
  const [selected, setSelected] = useState<ShapeType[]>(selectedShapes)
  
  const requiredCount = type === 'couple' && !isPartnerMode ? 5 : 10
  const availableShapes = PUZZLE_SHAPES.filter(shape => shape.availableFor.includes(type))
  
  const handleShapeClick = (shapeId: ShapeType) => {
    if (selected.includes(shapeId)) {
      setSelected(selected.filter(id => id !== shapeId))
    } else if (selected.length < requiredCount) {
      setSelected([...selected, shapeId])
    }
  }

  const handleContinue = () => {
    if (selected.length === requiredCount) {
      onShapesSelected(selected)
      onContinue()
    }
  }

  const handleGenerateLink = () => {
    if (selected.length === 5) {
      onShapesSelected(selected)
      const partnerUrl = `${window.location.origin}?partner=${sessionId}`
      navigator.clipboard.writeText(partnerUrl)
      toast.success('Link copied to clipboard! Share it with your partner.')
    }
  }

  const groupedByCategory = availableShapes.reduce((acc, shape) => {
    if (!acc[shape.category]) {
      acc[shape.category] = []
    }
    acc[shape.category].push(shape)
    return acc
  }, {} as Record<string, typeof availableShapes>)

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-12 md:px-12 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="mr-2" size={20} />
              Back
            </Button>
            <Badge variant="secondary" className="text-base">
              {selected.length} / {requiredCount} selected
            </Badge>
          </div>

          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl" style={{ fontFamily: 'var(--font-outfit)', letterSpacing: '-0.02em', lineHeight: '1.1' }}>
              {isPartnerMode ? "Pick Your Special Shapes" : "Choose What Matters"}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground font-light leading-relaxed">
              {type === 'couple' && !isPartnerMode
                ? `Select ${requiredCount} shapes that remind you of your time together. Each one tells part of your story.`
                : `Pick ${requiredCount} shapes that mean something to you. They can represent memories, dreams, or the things you love most.`}
            </p>
          </div>

          {Object.entries(groupedByCategory).map(([category, shapes]) => {
            const categoryTitles: Record<string, string> = {
              'flora': 'Flowers & Plants',
              'fauna-sea': 'Ocean Life',
              'fauna-sky': 'Birds & Wings',
              'fauna-land': 'Land Animals',
              'geometric': 'Geometric Shapes',
              'celestial': 'Nature & Sky',
              'creative': 'Arts & Music',
              'culinary': 'Food & Treats',
              'structures': 'Buildings',
              'adventure': 'Travel & Adventure',
              'treasures': 'Treasures',
              'symbols': 'Symbols',
            }
            
            return (
              <div key={category} className="mb-16">
                <h2 className="mb-8 text-2xl font-semibold tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
                  {categoryTitles[category] || category}
                </h2>
                <div className="grid grid-cols-3 gap-4 md:grid-cols-5 lg:grid-cols-7">
                  {shapes.map(shape => (
                    <Card
                      key={shape.id}
                      className={cn(
                        "group relative cursor-pointer overflow-hidden transition-all duration-300",
                        selected.includes(shape.id)
                          ? "border-2 border-accent shadow-xl ring-2 ring-accent/20 scale-105"
                          : "border border-border hover:border-primary/30 hover:shadow-lg hover:scale-102",
                        selected.length >= requiredCount && !selected.includes(shape.id) && "cursor-not-allowed opacity-40"
                      )}
                      onClick={() => handleShapeClick(shape.id)}
                    >
                      <div className="flex aspect-square flex-col items-center justify-center p-3 bg-gradient-to-br from-background to-muted/30">
                        <ShapeIcon shape={shape.id} className="h-10 w-10 md:h-12 md:w-12 transition-transform duration-300 group-hover:scale-110" />
                        <p className="mt-2 text-center text-xs font-medium leading-tight">{shape.name}</p>
                        <p className="mt-1 text-center text-[10px] text-muted-foreground leading-tight px-1">{shape.description}</p>
                      </div>
                      {selected.includes(shape.id) && (
                        <div className="absolute right-1.5 top-1.5 rounded-full bg-accent p-1 shadow-lg">
                          <Check size={14} weight="bold" className="text-accent-foreground" />
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}

          <div className="sticky bottom-6 mt-12 flex justify-center">
            <div className="rounded-2xl border border-border bg-card/95 backdrop-blur-sm p-6 shadow-2xl">
              {type === 'couple' && !isPartnerMode ? (
                <Button
                  size="lg"
                  disabled={selected.length !== 5}
                  onClick={handleGenerateLink}
                  className="gap-2 text-base px-8 py-6"
                >
                  <LinkIcon size={20} weight="bold" />
                  Generate Partner Link
                </Button>
              ) : (
                <Button
                  size="lg"
                  disabled={selected.length !== requiredCount}
                  onClick={handleContinue}
                  className="text-base px-8 py-6"
                >
                  Continue to Preview
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

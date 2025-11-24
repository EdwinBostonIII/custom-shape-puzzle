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
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl" style={{ letterSpacing: '-0.02em', lineHeight: '1.1' }}>
              {isPartnerMode ? "Choose Your Shapes" : "Select Your Puzzle Shapes"}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {type === 'couple' && !isPartnerMode
                ? `Pick ${requiredCount} shapes that remind you of your special someone`
                : `Choose ${requiredCount} unique shapes for your puzzle pieces`}
            </p>
          </div>

          {Object.entries(groupedByCategory).map(([category, shapes]) => (
            <div key={category} className="mb-12">
              <h2 className="mb-6 text-2xl font-semibold capitalize">{category}</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                {shapes.map(shape => (
                  <Card
                    key={shape.id}
                    className={cn(
                      "group relative cursor-pointer overflow-hidden transition-all duration-300 hover:scale-105",
                      selected.includes(shape.id)
                        ? "border-2 border-accent shadow-lg"
                        : "border-2 border-transparent hover:border-secondary",
                      selected.length >= requiredCount && !selected.includes(shape.id) && "cursor-not-allowed opacity-50"
                    )}
                    onClick={() => handleShapeClick(shape.id)}
                  >
                    <div className="flex aspect-square flex-col items-center justify-center p-6">
                      <ShapeIcon shape={shape.id} className="mb-2 h-16 w-16 transition-colors duration-300" />
                      <p className="text-center text-sm font-medium">{shape.name}</p>
                    </div>
                    {selected.includes(shape.id) && (
                      <div className="absolute right-2 top-2 rounded-full bg-accent p-1">
                        <Check size={16} weight="bold" className="text-accent-foreground" />
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          ))}

          <div className="sticky bottom-6 mt-12 flex justify-center">
            <div className="rounded-lg border-2 border-border bg-card p-4 shadow-xl">
              {type === 'couple' && !isPartnerMode ? (
                <Button
                  size="lg"
                  disabled={selected.length !== 5}
                  onClick={handleGenerateLink}
                  className="gap-2"
                >
                  <LinkIcon size={20} weight="bold" />
                  Generate Partner Link
                </Button>
              ) : (
                <Button
                  size="lg"
                  disabled={selected.length !== requiredCount}
                  onClick={handleContinue}
                >
                  Continue to Template
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

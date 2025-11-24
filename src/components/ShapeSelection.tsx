import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Check, ArrowLeft, Link as LinkIcon, X } from '@phosphor-icons/react'
import { ShapeIcon } from './ShapeIcon'
import { PuzzleType, ShapeType } from '@/lib/types'
import { PUZZLE_SHAPES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface ShapeSelectionProps {
  type: PuzzleType
  sessionId: string
  selectedShapes: ShapeType[]
  shapeMeanings?: Partial<Record<ShapeType, string>>
  onShapesSelected: (shapes: ShapeType[], meanings?: Partial<Record<ShapeType, string>>) => void
  onBack: () => void
  onContinue: () => void
  isPartnerMode?: boolean
}

export function ShapeSelection({
  type,
  sessionId,
  selectedShapes,
  shapeMeanings = {},
  onShapesSelected,
  onBack,
  onContinue,
  isPartnerMode = false,
}: ShapeSelectionProps) {
  const [selected, setSelected] = useState<ShapeType[]>(selectedShapes)
  const [meanings, setMeanings] = useState<Partial<Record<ShapeType, string>>>(shapeMeanings)
  const [meaningDialogOpen, setMeaningDialogOpen] = useState(false)
  const [currentShape, setCurrentShape] = useState<ShapeType | null>(null)
  const [currentMeaning, setCurrentMeaning] = useState('')
  
  const requiredCount = type === 'couple' && !isPartnerMode ? 5 : 10
  const availableShapes = PUZZLE_SHAPES.filter(shape => shape.availableFor.includes(type))
  
  const handleShapeClick = (shapeId: ShapeType) => {
    if (selected.includes(shapeId)) {
      // Remove shape from selection
      setSelected(selected.filter(id => id !== shapeId))
      // Also remove meaning
      const newMeanings = { ...meanings }
      delete newMeanings[shapeId]
      setMeanings(newMeanings)
    } else if (selected.length < requiredCount) {
      // Open dialog to get meaning
      setCurrentShape(shapeId)
      setCurrentMeaning(meanings[shapeId] || '')
      setMeaningDialogOpen(true)
    }
  }

  const handleSaveMeaning = () => {
    if (currentShape) {
      setSelected([...selected, currentShape])
      setMeanings({ ...meanings, [currentShape]: currentMeaning })
      setMeaningDialogOpen(false)
      setCurrentShape(null)
      setCurrentMeaning('')
    }
  }

  const handleSkipMeaning = () => {
    if (currentShape) {
      setSelected([...selected, currentShape])
      setMeaningDialogOpen(false)
      setCurrentShape(null)
      setCurrentMeaning('')
    }
  }

  const handleRemoveFromTray = (shapeId: ShapeType) => {
    setSelected(selected.filter(id => id !== shapeId))
    const newMeanings = { ...meanings }
    delete newMeanings[shapeId]
    setMeanings(newMeanings)
  }

  const handleContinue = () => {
    if (selected.length === requiredCount) {
      onShapesSelected(selected, meanings)
      onContinue()
    }
  }

  const handleGenerateLink = () => {
    if (selected.length === 5) {
      onShapesSelected(selected, meanings)
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
    <div className="min-h-screen bg-background pb-32">
      <div className="px-6 py-12 md:px-12 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="mr-2" size={20} />
              Back
            </Button>
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
        </div>
      </div>

      {/* Inventory Tray - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background to-background/95 backdrop-blur-sm border-t-2 border-border shadow-2xl z-50">
        <div className="px-6 py-6 md:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-outfit)' }}>
                Your Tray
              </h3>
              <Badge variant="secondary" className="text-sm">
                {selected.length} / {requiredCount} filled
              </Badge>
            </div>
            
            {/* Tray slots */}
            <div className="grid grid-cols-5 md:grid-cols-10 gap-3 mb-4">
              {Array.from({ length: requiredCount }).map((_, index) => {
                const shape = selected[index]
                return (
                  <div
                    key={index}
                    className={cn(
                      "aspect-square rounded-xl border-2 border-dashed flex items-center justify-center relative transition-all",
                      shape 
                        ? "bg-accent/10 border-accent shadow-md" 
                        : "bg-muted/30 border-muted-foreground/30"
                    )}
                  >
                    {shape ? (
                      <>
                        <ShapeIcon shape={shape} className="h-8 w-8 md:h-12 md:w-12" />
                        <button
                          onClick={() => handleRemoveFromTray(shape)}
                          className="absolute -top-2 -right-2 rounded-full bg-destructive p-1 shadow-lg hover:scale-110 transition-transform"
                        >
                          <X size={12} weight="bold" className="text-destructive-foreground" />
                        </button>
                      </>
                    ) : (
                      <span className="text-muted-foreground/40 text-xs md:text-sm">{index + 1}</span>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Action buttons */}
            <div className="flex justify-center">
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

      {/* Meaning Dialog */}
      <Dialog open={meaningDialogOpen} onOpenChange={setMeaningDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Why this shape?</DialogTitle>
            <DialogDescription>
              Write a short note about this memory. We will include these notes on the 'Story Card' inside the box.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="meaning">Your Note (optional, max 140 characters)</Label>
              <Textarea
                id="meaning"
                value={currentMeaning}
                onChange={(e) => setCurrentMeaning(e.target.value.slice(0, 140))}
                placeholder="E.g., 'The beach where we first met...'"
                className="min-h-[100px]"
                maxLength={140}
              />
              <p className="text-xs text-muted-foreground text-right">
                {currentMeaning.length} / 140
              </p>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={handleSkipMeaning}>
              Skip
            </Button>
            <Button onClick={handleSaveMeaning}>
              Add to Tray
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

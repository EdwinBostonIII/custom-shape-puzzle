import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
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
  const [showNotesPhase, setShowNotesPhase] = useState(false)
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)

  const requiredCount = type === 'couple' && !isPartnerMode ? 5 : 10
  const availableShapes = PUZZLE_SHAPES.filter(shape => shape.availableFor.includes(type))

  // Shop First, Write Later: Quick selection without interruption
  const handleShapeClick = (shapeId: ShapeType) => {
    if (selected.includes(shapeId)) {
      // Remove shape from selection
      setSelected(selected.filter(id => id !== shapeId))
      // Also remove meaning
      const newMeanings = { ...meanings }
      delete newMeanings[shapeId]
      setMeanings(newMeanings)
    } else if (selected.length < requiredCount) {
      // Add shape immediately - no dialog popup
      setSelected([...selected, shapeId])
    }
  }

  const handleProceedToNotes = () => {
    setShowNotesPhase(true)
  }

  const handleUpdateMeaning = (shapeId: ShapeType, meaning: string) => {
    setMeanings({ ...meanings, [shapeId]: meaning })
  }

  const handleRemoveFromTray = (shapeId: ShapeType) => {
    setSelected(selected.filter(id => id !== shapeId))
    const newMeanings = { ...meanings }
    delete newMeanings[shapeId]
    setMeanings(newMeanings)
  }

  const handleFinishNotes = () => {
    onShapesSelected(selected, meanings)
    onContinue()
  }

  const handleSkipNotes = () => {
    onShapesSelected(selected, meanings)
    onContinue()
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

  const categories = Object.keys(groupedByCategory)

  // Scroll to category when tab is clicked
  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(`category-${categoryId}`)
    if (element) {
      const offset = 120 // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
      setActiveCategoryId(categoryId)
    }
  }

  // If in notes phase, show the batch note-writing interface
  if (showNotesPhase) {
    return (
      <div className="min-h-screen bg-cream px-6 py-12 md:px-12 lg:px-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center justify-between">
            <Button variant="ghost" onClick={() => setShowNotesPhase(false)}>
              <ArrowLeft className="mr-2" size={20} />
              Back to Selection
            </Button>
          </div>

          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl text-charcoal" style={{ fontFamily: 'var(--font-fraunces)', letterSpacing: '-0.02em', lineHeight: '1.1' }}>
              Tell Their Stories (Optional)
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-charcoal/70 font-light leading-relaxed">
              Add a short note for each piece. These will appear on your printed Story Card inside the box.
            </p>
          </div>

          <div className="space-y-6 mb-24">
            {selected.map((shapeId, index) => {
              const shape = PUZZLE_SHAPES.find(s => s.id === shapeId)
              if (!shape) return null

              return (
                <Card key={shapeId} className="p-6 border-2 border-stone">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-white rounded-xl border-2 border-stone flex items-center justify-center">
                        <ShapeIcon shape={shapeId} className="h-12 w-12" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-xl font-semibold text-charcoal" style={{ fontFamily: 'var(--font-fraunces)' }}>
                          {index + 1}. {shape.name}
                        </h3>
                        <p className="text-sm text-charcoal/60">{shape.description}</p>
                      </div>
                      <div>
                        <Textarea
                          value={meanings[shapeId] || ''}
                          onChange={(e) => handleUpdateMeaning(shapeId, e.target.value.slice(0, 140))}
                          placeholder={`Why did you choose ${shape.name}? (e.g., "The beach where we first met...")`}
                          className="min-h-[80px] bg-white"
                          maxLength={140}
                        />
                        <p className="text-xs text-charcoal/50 text-right mt-1">
                          {(meanings[shapeId] || '').length} / 140
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          <div className="fixed bottom-0 left-0 right-0 bg-stone/95 backdrop-blur-md border-t-2 border-stone shadow-2xl py-6 px-6">
            <div className="mx-auto max-w-4xl flex gap-4 justify-center">
              <Button
                size="lg"
                variant="outline"
                onClick={handleSkipNotes}
                className="px-8 py-6 text-base"
              >
                Skip Notes
              </Button>
              <Button
                size="lg"
                onClick={handleFinishNotes}
                className="px-8 py-6 text-base"
              >
                Continue to Preview
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream pb-32">
      {/* Sticky Category Navigation */}
      <div className="sticky top-0 z-40 bg-cream/95 backdrop-blur-md border-b-2 border-stone shadow-sm">
        <div className="px-6 py-4 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => scrollToCategory(category)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                  activeCategoryId === category
                    ? "bg-terracotta text-white shadow-md"
                    : "bg-stone text-charcoal hover:bg-stone/70"
                )}
              >
                {categoryTitles[category] || category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-12 md:px-12 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="mr-2" size={20} />
              Back
            </Button>
          </div>

          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-charcoal" style={{ fontFamily: 'var(--font-fraunces)', letterSpacing: '-0.02em', lineHeight: '1.1' }}>
              {isPartnerMode ? "Pick Your Special Shapes" : "Choose What Matters"}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-charcoal/70 font-light leading-relaxed">
              {type === 'couple' && !isPartnerMode
                ? `Select ${requiredCount} shapes that remind you of your time together. Each one tells part of your story.`
                : `Pick ${requiredCount} shapes that mean something to you. They can represent memories, dreams, or the things you love most.`}
            </p>
          </div>

          {Object.entries(groupedByCategory).map(([category, shapes]) => {
            return (
              <div key={category} id={`category-${category}`} className="mb-16 scroll-mt-32">
                <h2 className="mb-8 text-2xl font-semibold tracking-tight text-charcoal" style={{ fontFamily: 'var(--font-fraunces)' }}>
                  {categoryTitles[category] || category}
                </h2>
                <div className="grid grid-cols-3 gap-4 md:grid-cols-5 lg:grid-cols-7">
                  {shapes.map(shape => (
                    <Card
                      key={shape.id}
                      className={cn(
                        "group relative cursor-pointer overflow-hidden transition-all duration-300",
                        selected.includes(shape.id)
                          ? "border-2 border-terracotta shadow-terracotta scale-105"
                          : "border border-stone hover:border-terracotta/30 hover:shadow-md hover:scale-102",
                        selected.length >= requiredCount && !selected.includes(shape.id) && "cursor-not-allowed opacity-40"
                      )}
                      onClick={() => handleShapeClick(shape.id)}
                    >
                      <div className="flex aspect-square flex-col items-center justify-center p-3 bg-white wood-texture-hover">
                        <ShapeIcon shape={shape.id} className="h-10 w-10 md:h-12 md:w-12 transition-transform duration-300 group-hover:scale-110 relative z-10" />
                        <p className="mt-2 text-center text-xs font-medium leading-tight text-charcoal relative z-10">{shape.name}</p>
                        <p className="mt-1 text-center text-[10px] text-charcoal/60 leading-tight px-1 relative z-10">{shape.description}</p>
                      </div>
                      {selected.includes(shape.id) && (
                        <div className="absolute right-1.5 top-1.5 rounded-full bg-terracotta p-1 shadow-lg">
                          <Check size={14} weight="bold" className="text-white" />
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

      {/* Inventory Tray - Fixed at bottom with corkboard styling */}
      <div
        className="fixed bottom-0 left-0 right-0 backdrop-blur-md border-t-2 border-stone shadow-2xl z-50"
        style={{
          background: 'linear-gradient(180deg, rgba(232, 227, 220, 0.95) 0%, rgba(232, 227, 220, 0.98) 100%)',
          backgroundImage: `repeating-linear-gradient(90deg, rgba(60, 54, 51, 0.02) 0px, transparent 1px, transparent 2px, rgba(60, 54, 51, 0.02) 3px)`,
        }}
      >
        <div className="px-6 py-6 md:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-charcoal" style={{ fontFamily: 'var(--font-fraunces)' }}>
                Your Tray
              </h3>
              <Badge className="text-sm bg-stone text-charcoal">
                {selected.length} / {requiredCount} filled
              </Badge>
            </div>

            {/* Tray slots with live puzzle assembly */}
            <div className="grid grid-cols-5 md:grid-cols-10 gap-3 mb-4">
              {Array.from({ length: requiredCount }).map((_, index) => {
                const shape = selected[index]
                return (
                  <div
                    key={index}
                    className={cn(
                      "puzzle-piece-slot aspect-square rounded-xl border-2 border-dashed flex items-center justify-center relative transition-all",
                      shape
                        ? "bg-white border-terracotta shadow-md filled"
                        : "bg-stone/50 border-stone shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1)]"
                    )}
                    style={!shape ? { boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.1)' } : undefined}
                  >
                    {shape ? (
                      <>
                        <ShapeIcon shape={shape} className="h-8 w-8 md:h-12 md:w-12" />
                        <button
                          onClick={() => handleRemoveFromTray(shape)}
                          className="absolute -top-2 -right-2 rounded-full bg-destructive p-1 shadow-lg hover:scale-110 transition-transform z-10"
                        >
                          <X size={12} weight="bold" className="text-white" />
                        </button>
                      </>
                    ) : (
                      <span className="text-charcoal/30 text-xs md:text-sm font-semibold">{index + 1}</span>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Action buttons */}
            <div className="flex justify-center gap-3">
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
                <>
                  {selected.length === requiredCount && (
                    <>
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={handleSkipNotes}
                        className="text-base px-8 py-6"
                      >
                        Skip to Preview
                      </Button>
                      <Button
                        size="lg"
                        onClick={handleProceedToNotes}
                        className="text-base px-8 py-6"
                      >
                        Add Notes (Optional)
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

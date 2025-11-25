import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Check, ArrowLeft, X, Sparkle } from '@phosphor-icons/react'
import { ShapeSilhouette } from './ShapeSilhouette'
import { MotifPreview } from './PuzzlePieceRenderer'
import { FloatingPuzzlePreview } from './LivePuzzleAssembly'
import { ShapeType, PuzzleTier } from '@/lib/types'
import { PUZZLE_SHAPES, OCCASION_PACKS, SHAPE_CATEGORIES, getTierConfig } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import confetti from 'canvas-confetti'

interface ShapeSelectionProps {
  selectedShapes: ShapeType[]
  shapeMeanings?: Partial<Record<ShapeType, string>>
  tier?: PuzzleTier
  onComplete: (shapes: ShapeType[], meanings?: Partial<Record<ShapeType, string>>) => void
  onBack: () => void
}

export function ShapeSelection({
  selectedShapes,
  shapeMeanings = {},
  tier = 'classic',
  onComplete,
  onBack,
}: ShapeSelectionProps) {
  const tierConfig = getTierConfig(tier)
  const REQUIRED_COUNT = tierConfig.shapes

  const [selected, setSelected] = useState<ShapeType[]>(selectedShapes)
  const [meanings, setMeanings] = useState<Partial<Record<ShapeType, string>>>(shapeMeanings)
  const [showNotesPhase, setShowNotesPhase] = useState(false)
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)
  const [showOccasionPacks, setShowOccasionPacks] = useState(selected.length === 0)
  const hasTriggeredConfetti = useRef(false)

  // Undo/Redo history management
  const [history, setHistory] = useState<Array<{ selected: ShapeType[], meanings: Partial<Record<ShapeType, string>> }>>([
    { selected: selectedShapes, meanings: shapeMeanings }
  ])
  const [historyIndex, setHistoryIndex] = useState(0)

  const onBackRef = useRef(onBack)
  const historyRef = useRef(history)
  const historyIndexRef = useRef(historyIndex)

  useEffect(() => {
    onBackRef.current = onBack
  }, [onBack])

  useEffect(() => {
    historyRef.current = history
    historyIndexRef.current = historyIndex
  }, [history, historyIndex])

  // Celebrate when tray is complete
  useEffect(() => {
    if (selected.length === REQUIRED_COUNT && !hasTriggeredConfetti.current && !showNotesPhase) {
      hasTriggeredConfetti.current = true
      const duration = 2000
      const end = Date.now() + duration
      const colors = ['#D97757', '#8B9D77', '#E8DCC4']

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: colors,
        })
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: colors,
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }

      frame()
      toast.success('Your tray is complete! 🎉')
    }
  }, [selected.length, showNotesPhase])

  const addToHistory = (newSelected: ShapeType[], newMeanings: Partial<Record<ShapeType, string>>) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push({ selected: newSelected, meanings: newMeanings })
    if (newHistory.length > 50) {
      newHistory.shift()
    }
    setHistoryIndex(newHistory.length - 1)
    setHistory(newHistory)
  }

  const undo = useCallback(() => {
    const currentHistoryIndex = historyIndexRef.current
    const currentHistory = historyRef.current
    if (currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1
      setHistoryIndex(newIndex)
      const previousState = currentHistory[newIndex]
      setSelected(previousState.selected)
      setMeanings(previousState.meanings)
      hasTriggeredConfetti.current = false
      toast.success('Undid last action')
    }
  }, [])

  const redo = useCallback(() => {
    const currentHistoryIndex = historyIndexRef.current
    const currentHistory = historyRef.current
    if (currentHistoryIndex < currentHistory.length - 1) {
      const newIndex = currentHistoryIndex + 1
      setHistoryIndex(newIndex)
      const nextState = currentHistory[newIndex]
      setSelected(nextState.selected)
      setMeanings(nextState.meanings)
      hasTriggeredConfetti.current = false
      toast.success('Redid action')
    }
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'TEXTAREA' || (e.target as HTMLElement).tagName === 'INPUT') {
        return
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
        return
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault()
        redo()
        return
      }

      if (e.key === 'Escape') {
        e.preventDefault()
        if (showNotesPhase) {
          setShowNotesPhase(false)
        } else {
          onBackRef.current()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showNotesPhase, undo, redo])

  // Apply an occasion pack
  const handleApplyOccasionPack = (packId: string) => {
    const pack = OCCASION_PACKS.find(p => p.id === packId)
    if (pack) {
      setSelected(pack.shapes)
      addToHistory(pack.shapes, {})
      setShowOccasionPacks(false)
      toast.success(`Applied "${pack.name}" starter pack!`)
    }
  }

  const handleShapeClick = (shapeId: ShapeType) => {
    if (selected.includes(shapeId)) {
      const newSelected = selected.filter(id => id !== shapeId)
      const newMeanings = { ...meanings }
      delete newMeanings[shapeId]
      setSelected(newSelected)
      setMeanings(newMeanings)
      addToHistory(newSelected, newMeanings)
      hasTriggeredConfetti.current = false
    } else if (selected.length < REQUIRED_COUNT) {
      const newSelected = [...selected, shapeId]
      setSelected(newSelected)
      addToHistory(newSelected, meanings)
    }
  }

  const handleRemoveFromTray = (shapeId: ShapeType) => {
    const newSelected = selected.filter(id => id !== shapeId)
    const newMeanings = { ...meanings }
    delete newMeanings[shapeId]
    setSelected(newSelected)
    setMeanings(newMeanings)
    addToHistory(newSelected, newMeanings)
    hasTriggeredConfetti.current = false
  }

  const handleUpdateMeaning = (shapeId: ShapeType, meaning: string) => {
    const newMeanings = { ...meanings, [shapeId]: meaning }
    setMeanings(newMeanings)
    addToHistory(selected, newMeanings)
  }

  const handleProceedToNotes = () => {
    setShowNotesPhase(true)
  }

  const handleFinishNotes = () => {
    onComplete(selected, meanings)
  }

  const handleSkipNotes = () => {
    onComplete(selected, meanings)
  }

  const groupedByCategory = useMemo(() => PUZZLE_SHAPES.reduce((acc, shape) => {
    if (!acc[shape.category]) {
      acc[shape.category] = []
    }
    acc[shape.category].push(shape)
    return acc
  }, {} as Record<string, typeof PUZZLE_SHAPES>), [])

  const categories = Object.keys(groupedByCategory)

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(`category-${categoryId}`)
    if (element) {
      const offset = 120
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
      setActiveCategoryId(categoryId)
    }
  }

  // Notes phase UI
  if (showNotesPhase) {
    return (
      <div className="min-h-screen bg-cream px-6 py-12 md:px-12 lg:px-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center justify-between">
            <Button variant="ghost" onClick={() => setShowNotesPhase(false)} aria-label="Go back to shape selection">
              <ArrowLeft className="mr-2" size={20} aria-hidden="true" />
              Back to Selection
            </Button>
          </div>

          <div className="mb-12 text-center" role="region" aria-labelledby="notes-heading">
            <h1 id="notes-heading" className="font-display mb-4 text-4xl font-bold tracking-tight md:text-5xl text-charcoal tracking-display leading-display">
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
                      <div className="w-20 h-20 bg-white rounded-xl border-2 border-stone flex items-center justify-center p-2">
                        <ShapeSilhouette shapeId={shapeId} className="w-14 h-14 text-terracotta" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-display text-xl font-semibold text-charcoal">
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
                          aria-label={`Add a personal note for ${shape.name}. Maximum 140 characters.`}
                          aria-describedby={`char-count-${shapeId}`}
                        />
                        <p id={`char-count-${shapeId}`} className="text-xs text-charcoal/50 text-right mt-1" aria-live="polite">
                          {(meanings[shapeId] || '').length} / 140 characters
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          <div className="fixed bottom-0 left-0 right-0 bg-stone/95 backdrop-blur-md border-t-2 border-stone shadow-2xl py-6 px-6" role="navigation" aria-label="Notes phase navigation">
            <div className="mx-auto max-w-4xl flex gap-4 justify-center">
              <Button
                size="lg"
                variant="outline"
                onClick={handleSkipNotes}
                className="px-8 py-6 text-base"
                aria-label="Skip adding notes and continue to wood stain selection"
              >
                Skip Notes
              </Button>
              <Button
                size="lg"
                onClick={handleFinishNotes}
                className="px-8 py-6 text-base"
                aria-label="Finish adding notes and continue to wood stain selection"
              >
                Continue to Wood Stain
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream pb-32">
      {/* Floating Puzzle Preview - shows puzzle being assembled */}
      <FloatingPuzzlePreview 
        selectedMotifs={selected}
        visible={selected.length > 0 && !showNotesPhase}
      />

      {/* Occasion Packs Quick Start (shown for first-time visitors) */}
      {showOccasionPacks && selected.length === 0 && (
        <div className="bg-sage/20 border-b-2 border-stone px-6 py-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkle size={24} className="text-terracotta" weight="fill" />
                <h2 className="font-display text-xl font-semibold text-charcoal">
                  Quick Start Packs
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOccasionPacks(false)}
                aria-label="Dismiss quick start packs"
              >
                <X size={20} />
              </Button>
            </div>
            <p className="text-charcoal/70 mb-6">
              Start with a curated pack for your occasion, then customize as you like:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {OCCASION_PACKS.map((pack) => (
                <Card
                  key={pack.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleApplyOccasionPack(pack.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleApplyOccasionPack(pack.id)
                    }
                  }}
                  className="p-4 cursor-pointer hover:border-terracotta hover:shadow-md transition-all"
                  aria-label={`Apply ${pack.name} starter pack with ${pack.shapes.length} shapes`}
                >
                  <div className="text-3xl mb-2">{pack.icon}</div>
                  <h3 className="font-display font-semibold text-charcoal">
                    {pack.name}
                  </h3>
                  <p className="text-xs text-charcoal/60 mt-1">{pack.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sticky Category Navigation - positioned below ProgressIndicator */}
      <nav className="sticky top-[72px] z-40 bg-cream/95 backdrop-blur-md border-b-2 border-stone shadow-sm" aria-label="Shape categories navigation">
        <div className="px-6 py-4 overflow-x-auto">
          <div className="flex gap-2 min-w-max" role="tablist" aria-label="Shape categories">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => scrollToCategory(category)}
                role="tab"
                aria-selected={activeCategoryId === category}
                aria-controls={`category-${category}`}
                aria-label={`Navigate to ${SHAPE_CATEGORIES[category] || category} category`}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                  activeCategoryId === category
                    ? "bg-terracotta text-white shadow-md"
                    : "bg-stone text-charcoal hover:bg-stone/70"
                )}
              >
                {SHAPE_CATEGORIES[category] || category}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="px-6 py-12 md:px-12 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <Button variant="ghost" onClick={onBack} aria-label="Go back to previous screen">
              <ArrowLeft className="mr-2" size={20} aria-hidden="true" />
              Back
            </Button>
          </div>

          <div className="mb-12 text-center" role="region" aria-labelledby="selection-heading">
            <h1 id="selection-heading" className="font-display mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-charcoal tracking-display leading-display">
              Choose What Matters
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-charcoal/70 font-light leading-relaxed">
              Pick {REQUIRED_COUNT} shapes that mean something to you. They can represent memories, dreams, or the things you love most.
            </p>
          </div>

          {Object.entries(groupedByCategory).map(([category, shapes]) => (
            <section key={category} id={`category-${category}`} className="mb-16 scroll-mt-32" role="region" aria-labelledby={`category-heading-${category}`}>
              <h2 id={`category-heading-${category}`} className="font-display mb-8 text-2xl font-semibold tracking-tight text-charcoal">
                {SHAPE_CATEGORIES[category] || category}
              </h2>
              <div className="grid grid-cols-3 gap-4 md:grid-cols-5 lg:grid-cols-7" role="group" aria-label={`${SHAPE_CATEGORIES[category] || category} shapes`}>
                {shapes.map(shape => {
                  const isSelected = selected.includes(shape.id)
                  const isTrayFull = selected.length >= REQUIRED_COUNT
                  const canSelect = !isTrayFull || isSelected

                  return (
                    <Card
                      key={shape.id}
                      role="button"
                      aria-pressed={isSelected}
                      aria-label={`${shape.name}: ${shape.description}. ${isSelected ? 'Currently selected. Click to deselect.' : canSelect ? 'Click to select.' : 'Tray is full. Remove a shape first.'}`}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          handleShapeClick(shape.id)
                        }
                      }}
                      className={cn(
                        "group relative cursor-pointer overflow-hidden transition-all duration-300",
                        isSelected
                          ? "border-2 border-terracotta shadow-terracotta scale-105"
                          : "border border-stone hover:border-terracotta/30 hover:shadow-md hover:scale-102",
                        !canSelect && "cursor-not-allowed opacity-40"
                      )}
                      onClick={() => handleShapeClick(shape.id)}
                    >
                      <div className="flex aspect-square flex-col items-center justify-center p-3 bg-white wood-texture-hover">
                        <div className={cn(
                          "h-10 w-10 md:h-12 md:w-12 transition-transform duration-300 group-hover:scale-110 relative z-10",
                          isSelected ? "text-terracotta" : "text-charcoal/80 group-hover:text-terracotta"
                        )}>
                          <ShapeSilhouette shapeId={shape.id} />
                        </div>
                        <p className="mt-2 text-center text-xs font-medium leading-tight text-charcoal relative z-10">{shape.name}</p>
                        <p className="mt-1 text-center text-[10px] text-charcoal/60 leading-tight px-1 relative z-10">{shape.description}</p>
                      </div>
                      {isSelected && (
                        <div className="absolute right-1.5 top-1.5 rounded-full bg-terracotta p-1 shadow-lg">
                          <Check size={14} weight="bold" className="text-white" />
                        </div>
                      )}
                    </Card>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* Inventory Tray - Fixed at bottom */}
      <aside
        role="complementary"
        aria-labelledby="tray-heading"
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-0 left-0 right-0 backdrop-blur-md border-t-2 border-stone shadow-2xl z-50"
        style={{
          background: 'linear-gradient(180deg, rgba(232, 227, 220, 0.95) 0%, rgba(232, 227, 220, 0.98) 100%)',
        }}
      >
        <div className="px-6 py-6 md:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 id="tray-heading" className="font-display text-lg font-semibold text-charcoal">
                Your Tray
              </h3>
              <Badge className="text-sm bg-stone text-charcoal" aria-label={`${selected.length} of ${REQUIRED_COUNT} shapes selected`}>
                {selected.length} / {REQUIRED_COUNT} filled
              </Badge>
            </div>

            {/* Tray slots - Show puzzle pieces being assembled */}
            <div className="grid grid-cols-5 md:grid-cols-10 gap-3 mb-4" role="list" aria-label="Selected shapes tray">
              {Array.from({ length: REQUIRED_COUNT }).map((_, index) => {
                const shape = selected[index]
                const shapeName = shape ? PUZZLE_SHAPES.find(s => s.id === shape)?.name : null
                return (
                  <div
                    key={index}
                    role="listitem"
                    aria-label={shape ? `Slot ${index + 1}: ${shapeName}` : `Slot ${index + 1}: Empty`}
                    className={cn(
                      "puzzle-piece-slot aspect-square rounded-xl border-2 border-dashed flex items-center justify-center relative transition-all overflow-hidden",
                      shape
                        ? "bg-white border-terracotta shadow-md filled"
                        : "bg-stone/50 border-stone"
                    )}
                  >
                    {shape ? (
                      <>
                        {/* Use MotifPreview for a cleaner look in the tray */}
                        <MotifPreview 
                          motif={shape} 
                          stain="walnut" 
                          size={48}
                          className="transition-transform hover:scale-110"
                        />
                        <button
                          onClick={() => handleRemoveFromTray(shape)}
                          aria-label={`Remove ${shapeName} from tray`}
                          className="absolute -top-2 -right-2 rounded-full bg-destructive p-1 shadow-lg hover:scale-110 transition-transform z-10"
                        >
                          <X size={12} weight="bold" className="text-white" aria-hidden="true" />
                        </button>
                      </>
                    ) : (
                      <span className="text-charcoal/30 text-xs md:text-sm font-semibold" aria-hidden="true">{index + 1}</span>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Action buttons */}
            <div className="flex justify-center gap-3" role="group" aria-label="Continue actions">
              {selected.length === REQUIRED_COUNT && (
                <>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleSkipNotes}
                    className="text-base px-8 py-6"
                    aria-label="Skip adding notes and proceed to wood stain selection"
                  >
                    Skip to Wood Stain
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleProceedToNotes}
                    className="text-base px-8 py-6"
                    aria-label="Add optional personal notes to your shapes"
                  >
                    Add Notes (Optional)
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}

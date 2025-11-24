import { useState, useEffect, useRef } from 'react'
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
import confetti from 'canvas-confetti'

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
  const hasTriggeredConfetti = useRef(false)

  // Undo/Redo history management
  const [history, setHistory] = useState<Array<{ selected: ShapeType[], meanings: Partial<Record<ShapeType, string>> }>>([
    { selected: selectedShapes, meanings: shapeMeanings }
  ])
  const [historyIndex, setHistoryIndex] = useState(0)

  const requiredCount = type === 'couple' && !isPartnerMode ? 5 : 10
  const availableShapes = PUZZLE_SHAPES.filter(shape => shape.availableFor.includes(type))

  // Auto-save to localStorage as user works (safety net for accidental tab close)
  useEffect(() => {
    if (sessionId) {
      const autosaveKey = `autosave-${sessionId}`
      const autosaveData = {
        selected,
        meanings,
        timestamp: Date.now(),
      }
      localStorage.setItem(autosaveKey, JSON.stringify(autosaveData))
    }
  }, [selected, meanings, sessionId])

  // Restore from localStorage on mount if available
  useEffect(() => {
    if (sessionId && selectedShapes.length === 0) {
      const autosaveKey = `autosave-${sessionId}`
      const saved = localStorage.getItem(autosaveKey)
      if (saved) {
        try {
          const { selected: savedSelected, meanings: savedMeanings, timestamp } = JSON.parse(saved)
          // Only restore if less than 24 hours old
          const hoursSinceAutosave = (Date.now() - timestamp) / (1000 * 60 * 60)
          if (hoursSinceAutosave < 24 && savedSelected.length > 0) {
            setSelected(savedSelected)
            setMeanings(savedMeanings)
            toast.success('Your previous work was restored!')
          }
        } catch (e) {
          // Invalid saved data, ignore
        }
      }
    }
  }, [sessionId]) // Only run on mount

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't interfere with typing in textareas
      if ((e.target as HTMLElement).tagName === 'TEXTAREA' || (e.target as HTMLElement).tagName === 'INPUT') {
        return
      }

      // Undo with Ctrl+Z or Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
        return
      }

      // Redo with Ctrl+Shift+Z or Cmd+Shift+Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault()
        redo()
        return
      }

      // Escape to go back
      if (e.key === 'Escape') {
        e.preventDefault()
        if (showNotesPhase) {
          setShowNotesPhase(false)
        } else {
          onBack()
        }
      }

      // Enter to proceed when tray is complete
      if (e.key === 'Enter' && !showNotesPhase && selected.length === requiredCount) {
        e.preventDefault()
        handleProceedToNotes()
      }

      // Number keys 1-6 to jump to categories
      if (!showNotesPhase && e.key >= '1' && e.key <= '6') {
        e.preventDefault()
        const categoryKeys = Object.keys(groupedByCategory)
        const categoryIndex = parseInt(e.key) - 1
        if (categoryIndex < categoryKeys.length) {
          const categoryId = categoryKeys[categoryIndex]
          scrollToCategory(categoryId)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showNotesPhase, selected.length, requiredCount, onBack, groupedByCategory, historyIndex, history])

  // Celebrate when tray is complete!
  useEffect(() => {
    if (selected.length === requiredCount && !hasTriggeredConfetti.current && !showNotesPhase) {
      hasTriggeredConfetti.current = true

      // Fire confetti from both sides
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
  }, [selected.length, requiredCount, showNotesPhase])

  // Helper function to add current state to history
  const addToHistory = (newSelected: ShapeType[], newMeanings: Partial<Record<ShapeType, string>>) => {
    // Remove any future history if we're not at the end
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push({ selected: newSelected, meanings: newMeanings })
    // Keep history limited to last 50 actions
    if (newHistory.length > 50) {
      newHistory.shift()
    }
    setHistoryIndex(newHistory.length - 1)
    setHistory(newHistory)
  }

  // Undo function
  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      const previousState = history[newIndex]
      setSelected(previousState.selected)
      setMeanings(previousState.meanings)
      hasTriggeredConfetti.current = false
      toast.success('Undid last action')
    }
  }

  // Redo function
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      const nextState = history[newIndex]
      setSelected(nextState.selected)
      setMeanings(nextState.meanings)
      hasTriggeredConfetti.current = false
      toast.success('Redid action')
    }
  }

  // Shop First, Write Later: Quick selection without interruption
  const handleShapeClick = (shapeId: ShapeType) => {
    if (selected.includes(shapeId)) {
      // Remove shape from selection
      const newSelected = selected.filter(id => id !== shapeId)
      const newMeanings = { ...meanings }
      delete newMeanings[shapeId]
      setSelected(newSelected)
      setMeanings(newMeanings)
      addToHistory(newSelected, newMeanings)
      // Reset confetti flag so it can trigger again
      hasTriggeredConfetti.current = false
    } else if (selected.length < requiredCount) {
      // Add shape immediately - no dialog popup
      const newSelected = [...selected, shapeId]
      setSelected(newSelected)
      addToHistory(newSelected, meanings)
    }
  }

  const handleProceedToNotes = () => {
    setShowNotesPhase(true)
  }

  const handleUpdateMeaning = (shapeId: ShapeType, meaning: string) => {
    const newMeanings = { ...meanings, [shapeId]: meaning }
    setMeanings(newMeanings)
    addToHistory(selected, newMeanings)
  }

  const handleRemoveFromTray = (shapeId: ShapeType) => {
    const newSelected = selected.filter(id => id !== shapeId)
    const newMeanings = { ...meanings }
    delete newMeanings[shapeId]
    setSelected(newSelected)
    setMeanings(newMeanings)
    addToHistory(newSelected, newMeanings)
    // Reset confetti flag so it can trigger again
    hasTriggeredConfetti.current = false
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
            <Button variant="ghost" onClick={() => setShowNotesPhase(false)} aria-label="Go back to shape selection">
              <ArrowLeft className="mr-2" size={20} aria-hidden="true" />
              Back to Selection
            </Button>
          </div>

          <div className="mb-12 text-center" role="region" aria-labelledby="notes-heading">
            <h1 id="notes-heading" className="mb-4 text-4xl font-bold tracking-tight md:text-5xl text-charcoal" style={{ fontFamily: 'var(--font-fraunces)', letterSpacing: '-0.02em', lineHeight: '1.1' }}>
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
                aria-label="Skip adding notes and continue to preview"
              >
                Skip Notes
              </Button>
              <Button
                size="lg"
                onClick={handleFinishNotes}
                className="px-8 py-6 text-base"
                aria-label="Finish adding notes and continue to preview"
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
      <nav className="sticky top-0 z-40 bg-cream/95 backdrop-blur-md border-b-2 border-stone shadow-sm" aria-label="Shape categories navigation">
        <div className="px-6 py-4 overflow-x-auto">
          <div className="flex gap-2 min-w-max" role="tablist" aria-label="Shape categories">
            {categories.map((category, index) => (
              <button
                key={category}
                onClick={() => scrollToCategory(category)}
                role="tab"
                aria-selected={activeCategoryId === category}
                aria-controls={`category-${category}`}
                aria-label={`Navigate to ${categoryTitles[category] || category} category. Press ${index + 1} key to jump here.`}
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
            <h1 id="selection-heading" className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-charcoal" style={{ fontFamily: 'var(--font-fraunces)', letterSpacing: '-0.02em', lineHeight: '1.1' }}>
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
              <section key={category} id={`category-${category}`} className="mb-16 scroll-mt-32" role="region" aria-labelledby={`category-heading-${category}`}>
                <h2 id={`category-heading-${category}`} className="mb-8 text-2xl font-semibold tracking-tight text-charcoal" style={{ fontFamily: 'var(--font-fraunces)' }}>
                  {categoryTitles[category] || category}
                </h2>
                <div className="grid grid-cols-3 gap-4 md:grid-cols-5 lg:grid-cols-7" role="group" aria-label={`${categoryTitles[category] || category} shapes`}>
                  {shapes.map(shape => {
                    const isSelected = selected.includes(shape.id)
                    const isTrayFull = selected.length >= requiredCount
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
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      </main>

      {/* Inventory Tray - Fixed at bottom with corkboard styling */}
      <aside
        role="complementary"
        aria-labelledby="tray-heading"
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-0 left-0 right-0 backdrop-blur-md border-t-2 border-stone shadow-2xl z-50"
        style={{
          background: 'linear-gradient(180deg, rgba(232, 227, 220, 0.95) 0%, rgba(232, 227, 220, 0.98) 100%)',
          backgroundImage: `repeating-linear-gradient(90deg, rgba(60, 54, 51, 0.02) 0px, transparent 1px, transparent 2px, rgba(60, 54, 51, 0.02) 3px)`,
        }}
      >
        <div className="px-6 py-6 md:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 id="tray-heading" className="text-lg font-semibold text-charcoal" style={{ fontFamily: 'var(--font-fraunces)' }}>
                Your Tray
              </h3>
              <Badge className="text-sm bg-stone text-charcoal" aria-label={`${selected.length} of ${requiredCount} shapes selected`}>
                {selected.length} / {requiredCount} filled
              </Badge>
            </div>

            {/* Tray slots with live puzzle assembly */}
            <div className="grid grid-cols-5 md:grid-cols-10 gap-3 mb-4" role="list" aria-label="Selected shapes tray">
              {Array.from({ length: requiredCount }).map((_, index) => {
                const shape = selected[index]
                const shapeName = shape ? PUZZLE_SHAPES.find(s => s.id === shape)?.name : null
                return (
                  <div
                    key={index}
                    role="listitem"
                    aria-label={shape ? `Slot ${index + 1}: ${shapeName}` : `Slot ${index + 1}: Empty`}
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
                        <ShapeIcon shape={shape} className="h-8 w-8 md:h-12 md:w-12" aria-hidden="true" />
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
              {type === 'couple' && !isPartnerMode ? (
                <Button
                  size="lg"
                  disabled={selected.length !== 5}
                  onClick={handleGenerateLink}
                  className="gap-2 text-base px-8 py-6"
                  aria-label="Generate a unique link to share with your partner"
                  aria-disabled={selected.length !== 5}
                >
                  <LinkIcon size={20} weight="bold" aria-hidden="true" />
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
                        aria-label="Skip adding notes and proceed directly to preview"
                      >
                        Skip to Preview
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
                </>
              )}
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}

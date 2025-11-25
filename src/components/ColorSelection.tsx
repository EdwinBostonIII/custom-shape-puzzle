import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Check } from '@phosphor-icons/react'
import { AssembledPuzzle } from './PuzzlePieceRenderer'
import { ShapeType, WoodStainColor } from '@/lib/types'
import { WOOD_STAINS } from '@/lib/constants'
import { cn } from '@/lib/utils'

// Type for the full stain object (with id, name, hex, description)
type WoodStainOption = (typeof WOOD_STAINS)[number]

interface ColorSelectionProps {
  selectedShapes: ShapeType[]
  shapeMeanings?: Partial<Record<ShapeType, string>>
  selectedColor: WoodStainColor | null
  onComplete: (color: WoodStainColor) => void
  onBack: () => void
}

export function ColorSelection({
  selectedShapes,
  shapeMeanings = {},
  selectedColor: initialColor,
  onComplete,
  onBack,
}: ColorSelectionProps) {
  const [selectedStain, setSelectedStain] = useState<WoodStainOption | null>(
    initialColor ? WOOD_STAINS.find(s => s.id === initialColor) || null : null
  )

  const handleColorSelect = (stain: WoodStainOption) => {
    setSelectedStain(stain)
  }

  const handleContinue = () => {
    if (selectedStain) {
      onComplete(selectedStain.id)
    }
  }

  return (
    <div className="min-h-screen bg-cream px-6 py-12 md:px-12 lg:px-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} aria-label="Go back to shape selection">
            <ArrowLeft className="mr-2" size={20} aria-hidden="true" />
            Back
          </Button>
        </div>

        <div className="mb-12 text-center" role="region" aria-labelledby="color-heading">
          <h1 
            id="color-heading" 
            className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-charcoal font-display"
          >
            Choose Your Wood Stain
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-charcoal/70 font-light leading-relaxed">
            Each puzzle is handcrafted from premium basswood. Select a stain color that complements your style.
          </p>
        </div>

        {/* Puzzle Preview with selected color */}
        <div className="mb-12">
          <Card className="p-8 bg-white border-2 border-stone">
            <h2 className="text-xl font-semibold text-charcoal mb-6 text-center font-display">
              Your Puzzle Preview
            </h2>
            <div className="flex justify-center">
              <AssembledPuzzle
                motifs={[
                  ...selectedShapes.slice(0, 10),
                  ...Array(10 - Math.min(selectedShapes.length, 10)).fill(null)
                ]}
                stain={selectedStain?.id || 'natural'}
                width={450}
                className="drop-shadow-lg"
              />
            </div>
            {shapeMeanings && Object.keys(shapeMeanings).length > 0 && (
              <p className="text-center text-sm text-charcoal/60 mt-6">
                Your personal story notes will appear on the included Story Card.
              </p>
            )}
          </Card>
        </div>

        {/* Wood Stain Color Selection */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-charcoal mb-6 text-center font-display">
            Select a Wood Stain
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" role="radiogroup" aria-label="Wood stain color options">
            {WOOD_STAINS.map((stain) => {
              const isSelected = selectedStain?.id === stain.id
              return (
                <Card
                  key={stain.id}
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`${stain.name}: ${stain.description}`}
                  tabIndex={0}
                  onClick={() => handleColorSelect(stain)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleColorSelect(stain)
                    }
                  }}
                  className={cn(
                    "group cursor-pointer overflow-hidden transition-all duration-300 p-4",
                    isSelected
                      ? "border-2 border-terracotta shadow-lg scale-105 ring-2 ring-terracotta/30"
                      : "border border-stone hover:border-terracotta/30 hover:shadow-md"
                  )}
                >
                  <div 
                    className="aspect-square rounded-xl mb-3 transition-transform group-hover:scale-105"
                    style={{ 
                      backgroundColor: stain.hex,
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.05)'
                    }}
                  />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-charcoal text-sm">{stain.name}</p>
                      <p className="text-xs text-charcoal/60">{stain.description}</p>
                    </div>
                    {isSelected && (
                      <div className="rounded-full bg-terracotta p-1">
                        <Check size={14} weight="bold" className="text-white" />
                      </div>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Product Details */}
        <div className="mb-12">
          <Card className="p-6 bg-sage/10 border-2 border-sage/30">
            <h3 className="font-semibold text-charcoal mb-4 font-display">What's Included</h3>
            <ul className="space-y-2 text-charcoal/80">
              <li className="flex items-start gap-2">
                <Check size={18} weight="bold" className="text-sage mt-0.5 flex-shrink-0" />
                <span>10-piece handcrafted basswood puzzle (5" × 7")</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={18} weight="bold" className="text-sage mt-0.5 flex-shrink-0" />
                <span>Custom laser-engraved shapes based on your selection</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={18} weight="bold" className="text-sage mt-0.5 flex-shrink-0" />
                <span>Personalized Story Card with your notes</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={18} weight="bold" className="text-sage mt-0.5 flex-shrink-0" />
                <span>Premium gift-ready packaging</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={18} weight="bold" className="text-sage mt-0.5 flex-shrink-0" />
                <span>Free shipping within the US</span>
              </li>
            </ul>
          </Card>
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!selectedStain}
            className="px-12 py-6 text-lg"
            aria-disabled={!selectedStain}
          >
            Continue to Checkout — $65
          </Button>
          {!selectedStain && (
            <p className="mt-3 text-sm text-charcoal/60">
              Please select a wood stain color to continue
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

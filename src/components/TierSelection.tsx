import { motion } from 'framer-motion'
import { Check, Sparkles, Gift, Shield } from 'lucide-react'
import { PuzzleTier, TierConfig } from '@/lib/types'
import { PUZZLE_TIERS, CAPSULE_CONFIG, QUALITY_GUARANTEE } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface TierSelectionProps {
  selectedTier: PuzzleTier
  onSelectTier: (tier: PuzzleTier) => void
  onContinue: () => void
  onBack: () => void
}

export function TierSelection({ selectedTier, onSelectTier, onContinue, onBack }: TierSelectionProps) {
  const selectedTierConfig = PUZZLE_TIERS.find(t => t.id === selectedTier)
  const qualifiesForFreeCapsule = selectedTierConfig && selectedTierConfig.price >= CAPSULE_CONFIG.freeThreshold

  return (
    <div className="min-h-screen bg-cream pt-4">
      <main className="container mx-auto px-4 py-8 max-w-4xl" role="main">
        {/* Back button */}
        <button
          onClick={onBack}
          className="mb-6 text-charcoal/60 hover:text-charcoal transition-colors flex items-center gap-1"
          aria-label="Go back to home page"
        >
          ← Start Over
        </button>
        
        {/* Intro text */}
        <div className="text-center mb-10">
          <h1 id="tier-selection-heading" className="font-display text-3xl md:text-4xl text-charcoal mb-4 tracking-display">
            How much of your story will you tell?
          </h1>
          <p className="text-charcoal/70 max-w-xl mx-auto">
            Each tier lets you select more shapes, creating a richer puzzle that captures 
            more of what makes your relationship unique.
          </p>
        </div>

        {/* Tier Cards */}
        <div 
          className="grid md:grid-cols-2 gap-6 mb-8"
          role="radiogroup"
          aria-labelledby="tier-selection-heading"
          aria-describedby="tier-description"
        >
          <span id="tier-description" className="sr-only">
            Select a puzzle tier. Use arrow keys to navigate between options.
          </span>
          {PUZZLE_TIERS.map((tier, index) => (
            <TierCard
              key={tier.id}
              tier={tier}
              isSelected={selectedTier === tier.id}
              onSelect={() => onSelectTier(tier.id)}
              index={index}
            />
          ))}
        </div>

        {/* Free Capsule Callout - shows when $149+ tier selected */}
        {qualifiesForFreeCapsule && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-xl bg-sage/10 border border-sage/20 flex items-center gap-4"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center">
              <Gift className="w-5 h-5 text-sage" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-charcoal text-sm">
                🎁 Free first Anniversary Capsule included
              </p>
              <p className="text-xs text-charcoal/60">
                Orders ${CAPSULE_CONFIG.freeThreshold}+ get a free year of our $79 annual memory subscription
              </p>
            </div>
          </motion.div>
        )}

        {/* Quality Promise */}
        <div className="mb-8 p-4 rounded-xl bg-charcoal/[0.02] border border-charcoal/10 flex items-center gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-charcoal/5 flex items-center justify-center">
            <Shield className="w-5 h-5 text-charcoal/60" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-charcoal text-sm">{QUALITY_GUARANTEE.headline}</p>
            <p className="text-xs text-charcoal/60">{QUALITY_GUARANTEE.promise}</p>
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onContinue}
            className="bg-terracotta text-white px-8 py-4 rounded-full font-medium text-lg shadow-lg hover:shadow-xl transition-shadow"
            aria-label={`Continue with ${selectedTierConfig?.name} tier at $${selectedTierConfig?.price}`}
          >
            Continue with {selectedTierConfig?.name} →
          </motion.button>
        </div>
      </main>
    </div>
  )
}

interface TierCardProps {
  tier: TierConfig
  isSelected: boolean
  onSelect: () => void
  index: number
}

function TierCard({ tier, isSelected, onSelect, index }: TierCardProps) {
  const qualifiesForFreeCapsule = tier.price >= CAPSULE_CONFIG.freeThreshold

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onSelect}
      role="radio"
      aria-checked={isSelected}
      aria-label={`${tier.name}: $${tier.price}, ${tier.pieces} pieces, ${tier.shapes} shapes${tier.isHero ? ', Most Popular' : ''}${qualifiesForFreeCapsule ? ', includes free Anniversary Capsule' : ''}`}
      className={cn(
        'relative p-6 rounded-2xl border-2 text-left transition-all',
        'hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-terracotta/50 focus:ring-offset-2',
        isSelected
          ? 'border-terracotta bg-terracotta/5 shadow-md'
          : 'border-charcoal/10 bg-white hover:border-charcoal/20'
      )}
    >
      {/* Hero Badge */}
      {tier.isHero && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-terracotta text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Most Popular
        </div>
      )}

      {/* Selected Checkmark */}
      {isSelected && (
        <div className="absolute top-4 right-4 w-6 h-6 bg-terracotta rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Tier Info */}
      <div className="mb-4">
        <h3 className="font-display text-2xl text-charcoal mb-1">{tier.name}</h3>
        <p className="text-charcoal/60 text-sm">{tier.description}</p>
      </div>

      {/* Stats */}
      <div className="flex items-baseline gap-4 mb-4">
        <div>
          <span className="text-3xl font-display text-charcoal">${tier.price}</span>
        </div>
        <div className="text-sm text-charcoal/60">
          {tier.pieces.toLocaleString()} pieces · {tier.shapes} shapes
        </div>
      </div>

      {/* Features */}
      <ul className="space-y-2 text-sm text-charcoal/70">
        <li className="flex items-center gap-2">
          <Check className="w-4 h-4 text-sage" />
          {tier.hintCards} hint cards included
        </li>
        <li className="flex items-center gap-2">
          <Check className="w-4 h-4 text-sage" />
          Premium Baltic birch wood
        </li>
        <li className="flex items-center gap-2">
          <Check className="w-4 h-4 text-sage" />
          Free shipping + 30-day guarantee
        </li>
        {qualifiesForFreeCapsule && (
          <li className="flex items-center gap-2 text-sage font-medium">
            <Gift className="w-4 h-4 text-sage" />
            Free first Anniversary Capsule
          </li>
        )}
      </ul>
    </motion.button>
  )
}

export default TierSelection

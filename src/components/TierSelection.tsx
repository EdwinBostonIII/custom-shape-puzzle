import { motion } from 'framer-motion'
import { Check, Sparkles } from 'lucide-react'
import { PuzzleTier, TierConfig } from '@/lib/types'
import { PUZZLE_TIERS } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface TierSelectionProps {
  selectedTier: PuzzleTier
  onSelectTier: (tier: PuzzleTier) => void
  onContinue: () => void
  onBack: () => void
}

export function TierSelection({ selectedTier, onSelectTier, onContinue, onBack }: TierSelectionProps) {
  return (
    <div className="min-h-screen bg-cream pt-4">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back button */}
        <button
          onClick={onBack}
          className="mb-6 text-charcoal/60 hover:text-charcoal transition-colors flex items-center gap-1"
        >
          ← Start Over
        </button>
        {/* Intro text */}
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
            How much of your story will you tell?
          </h2>
          <p className="text-charcoal/70 max-w-xl mx-auto">
            Each tier lets you select more shapes, creating a richer puzzle that captures 
            more of what makes your relationship unique.
          </p>
        </div>

        {/* Tier Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
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

        {/* Continue Button */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onContinue}
            className="bg-terracotta text-white px-8 py-4 rounded-full font-medium text-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            Continue with {PUZZLE_TIERS.find(t => t.id === selectedTier)?.name}
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
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onSelect}
      className={cn(
        'relative p-6 rounded-2xl border-2 text-left transition-all',
        'hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-terracotta/50',
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
        <h3 className="font-serif text-2xl text-charcoal mb-1">{tier.name}</h3>
        <p className="text-charcoal/60 text-sm">{tier.description}</p>
      </div>

      {/* Stats */}
      <div className="flex items-baseline gap-4 mb-4">
        <div>
          <span className="text-3xl font-serif text-charcoal">${tier.price}</span>
        </div>
        <div className="text-sm text-charcoal/60">
          {tier.pieces} pieces · {tier.shapes} shapes
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
          Premium kraft packaging
        </li>
        <li className="flex items-center gap-2">
          <Check className="w-4 h-4 text-sage" />
          Free shipping
        </li>
      </ul>
    </motion.button>
  )
}

export default TierSelection

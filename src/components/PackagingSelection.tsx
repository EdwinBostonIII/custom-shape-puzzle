import { motion } from 'framer-motion'
import { Check, Package, Stamp, Grid3X3 } from 'lucide-react'
import { BoxType, WaxSealColor, BoxPattern, PackagingOptions, PuzzleTier } from '@/lib/types'
import { PRICING, calculateTotal } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface PackagingSelectionProps {
  packaging: PackagingOptions
  tier: PuzzleTier
  hasWoodStain: boolean
  onPackagingChange: (packaging: PackagingOptions) => void
  onContinue: () => void
  onBack: () => void
}

const BOX_OPTIONS: { id: BoxType; name: string; description: string; price: number }[] = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'Kraft box with protective sleeve',
    price: 0,
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Magnetic closure box with velvet lining',
    price: PRICING.premiumBox,
  },
]

const WAX_COLORS: { id: WaxSealColor; name: string; hex: string }[] = [
  { id: 'gold', name: 'Gold', hex: '#D4AF37' },
  { id: 'burgundy', name: 'Burgundy', hex: '#722F37' },
  { id: 'forest', name: 'Forest', hex: '#228B22' },
  { id: 'navy', name: 'Navy', hex: '#000080' },
]

const PATTERN_OPTIONS: { id: BoxPattern; name: string; description: string }[] = [
  { id: 'solid', name: 'Solid', description: 'Clean and minimal' },
  { id: 'constellation', name: 'Constellation', description: 'Celestial star pattern' },
  { id: 'botanical', name: 'Botanical', description: 'Delicate line art florals' },
  { id: 'geometric', name: 'Geometric', description: 'Modern minimal shapes' },
]

export function PackagingSelection({
  packaging,
  tier,
  hasWoodStain,
  onPackagingChange,
  onContinue,
  onBack,
}: PackagingSelectionProps) {
  const pricing = calculateTotal(tier, {
    hasWoodStain,
    premiumBox: packaging.box === 'premium',
    waxSeal: packaging.waxSeal,
  })

  const updatePackaging = (updates: Partial<PackagingOptions>) => {
    onPackagingChange({ ...packaging, ...updates })
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-cream/95 backdrop-blur-sm border-b border-charcoal/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-charcoal/60 hover:text-charcoal transition-colors"
          >
            ← Back
          </button>
          <h1 className="font-serif text-xl text-charcoal">Packaging</h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Intro */}
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
            Finish with care
          </h2>
          <p className="text-charcoal/70 max-w-xl mx-auto">
            Choose how your puzzle arrives. Every detail matters when 
            you're giving something meaningful.
          </p>
        </div>

        {/* Box Type */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-terracotta" />
            <h3 className="font-medium text-charcoal">Box Style</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {BOX_OPTIONS.map((box) => (
              <button
                key={box.id}
                onClick={() => updatePackaging({ box: box.id })}
                className={cn(
                  'p-4 rounded-xl border-2 text-left transition-all',
                  packaging.box === box.id
                    ? 'border-terracotta bg-terracotta/5'
                    : 'border-charcoal/10 bg-white hover:border-charcoal/20'
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="font-medium text-charcoal">{box.name}</span>
                  {box.price > 0 ? (
                    <span className="text-sm text-terracotta">+${box.price}</span>
                  ) : (
                    <span className="text-sm text-charcoal/50">Included</span>
                  )}
                </div>
                <p className="text-sm text-charcoal/60">{box.description}</p>
                {packaging.box === box.id && (
                  <Check className="w-5 h-5 text-terracotta mt-2" />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Wax Seal */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Stamp className="w-5 h-5 text-terracotta" />
            <h3 className="font-medium text-charcoal">Wax Seal</h3>
            <span className="text-sm text-charcoal/50">+${PRICING.waxSeal}</span>
          </div>
          
          <div className="bg-white rounded-xl border border-charcoal/10 p-4">
            {/* Toggle */}
            <label className="flex items-center justify-between cursor-pointer mb-4">
              <span className="text-charcoal">Add hand-stamped wax seal</span>
              <div
                className={cn(
                  'w-12 h-6 rounded-full transition-colors relative',
                  packaging.waxSeal ? 'bg-terracotta' : 'bg-charcoal/20'
                )}
                onClick={() => updatePackaging({ waxSeal: !packaging.waxSeal })}
              >
                <div
                  className={cn(
                    'w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform',
                    packaging.waxSeal ? 'translate-x-6' : 'translate-x-0.5'
                  )}
                />
              </div>
            </label>

            {/* Color Selection */}
            {packaging.waxSeal && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pt-4 border-t border-charcoal/10"
              >
                <p className="text-sm text-charcoal/60 mb-3">Choose seal color</p>
                <div className="flex gap-3">
                  {WAX_COLORS.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => updatePackaging({ waxColor: color.id })}
                      className={cn(
                        'w-10 h-10 rounded-full transition-all flex items-center justify-center',
                        packaging.waxColor === color.id && 'ring-2 ring-offset-2 ring-terracotta'
                      )}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                      aria-label={`Select ${color.name} wax seal color`}
                    >
                      {packaging.waxColor === color.id && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Box Pattern */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Grid3X3 className="w-5 h-5 text-terracotta" />
            <h3 className="font-medium text-charcoal">Box Pattern</h3>
            <span className="text-sm text-charcoal/50">Free</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PATTERN_OPTIONS.map((pattern) => (
              <button
                key={pattern.id}
                onClick={() => updatePackaging({ pattern: pattern.id })}
                className={cn(
                  'p-3 rounded-xl border-2 text-center transition-all',
                  packaging.pattern === pattern.id
                    ? 'border-terracotta bg-terracotta/5'
                    : 'border-charcoal/10 bg-white hover:border-charcoal/20'
                )}
              >
                <span className="block text-sm font-medium text-charcoal mb-1">
                  {pattern.name}
                </span>
                <span className="block text-xs text-charcoal/50">
                  {pattern.description}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Price Summary */}
        <div className="bg-white rounded-xl border border-charcoal/10 p-4 mb-8">
          <h3 className="font-medium text-charcoal mb-3">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-charcoal/70">Puzzle ({tier})</span>
              <span className="text-charcoal">${pricing.base}</span>
            </div>
            {pricing.woodStain > 0 && (
              <div className="flex justify-between">
                <span className="text-charcoal/70">Wood stain upgrade</span>
                <span className="text-charcoal">+${pricing.woodStain}</span>
              </div>
            )}
            {pricing.premiumBox > 0 && (
              <div className="flex justify-between">
                <span className="text-charcoal/70">Premium box</span>
                <span className="text-charcoal">+${pricing.premiumBox}</span>
              </div>
            )}
            {pricing.waxSeal > 0 && (
              <div className="flex justify-between">
                <span className="text-charcoal/70">Wax seal</span>
                <span className="text-charcoal">+${pricing.waxSeal}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-charcoal/70">Shipping</span>
              <span className="text-sage">Free</span>
            </div>
            <div className="pt-2 border-t border-charcoal/10 flex justify-between">
              <span className="font-medium text-charcoal">Total</span>
              <span className="font-serif text-xl text-charcoal">${pricing.total}</span>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onContinue}
            className="bg-terracotta text-white px-8 py-4 rounded-full font-medium text-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            Continue to Checkout
          </motion.button>
        </div>
      </main>
    </div>
  )
}

export default PackagingSelection

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, X } from '@phosphor-icons/react'

interface EditionComparisonModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  basePrice: number
  upgradePrice: number
}

export function EditionComparisonModal({ open, onOpenChange, basePrice, upgradePrice }: EditionComparisonModalProps) {
  const features = [
    { name: 'Ten custom wooden puzzle pieces', standard: true, keepsake: true },
    { name: 'Laser-engraved with your chosen shapes', standard: true, keepsake: true },
    { name: 'Printed "Story Card" with meanings', standard: true, keepsake: true },
    { name: 'Cardboard storage box', standard: true, keepsake: false },
    { name: 'Solid walnut storage box', standard: false, keepsake: true },
    { name: 'Custom dedication engraved inside lid', standard: false, keepsake: true },
    { name: 'Linen "Our Story" card (premium)', standard: false, keepsake: true },
    { name: 'Premium gift wrapping', standard: false, keepsake: true },
    { name: 'Handwritten note included', standard: false, keepsake: true },
    { name: 'Magnetic lid closure', standard: false, keepsake: true },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl text-center mb-2" style={{ fontFamily: 'var(--font-fraunces)' }}>
            Compare Editions
          </DialogTitle>
          <p className="text-center text-charcoal/70 leading-relaxed">
            Choose the edition that's right for your special moment
          </p>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Standard Edition */}
          <Card className="border-2 border-stone">
            <CardContent className="p-6 space-y-4">
              <div className="text-center pb-4 border-b border-stone">
                <h3 className="text-2xl font-bold text-charcoal mb-2" style={{ fontFamily: 'var(--font-fraunces)' }}>
                  Standard Edition
                </h3>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-bold text-charcoal">${basePrice}</span>
                </div>
                <p className="text-sm text-charcoal/60 mt-2">Perfect for everyday memories</p>
              </div>

              <ul className="space-y-3">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    {feature.standard ? (
                      <Check size={20} weight="bold" className="text-sage flex-shrink-0 mt-0.5" />
                    ) : (
                      <X size={20} weight="bold" className="text-charcoal/20 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={feature.standard ? 'text-charcoal' : 'text-charcoal/30'}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Keepsake Edition */}
          <Card className="border-2 border-terracotta bg-terracotta/5 relative overflow-visible">
            <Badge
              className="absolute -top-3 left-1/2 -translate-x-1/2 bg-terracotta text-white px-4 py-1 shadow-md"
              style={{ fontFamily: 'var(--font-caveat)', fontSize: '1rem' }}
            >
              Most Popular
            </Badge>

            <CardContent className="p-6 space-y-4">
              <div className="text-center pb-4 border-b border-terracotta/30">
                <h3 className="text-2xl font-bold text-charcoal mb-2" style={{ fontFamily: 'var(--font-fraunces)' }}>
                  Keepsake Edition
                </h3>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-bold text-terracotta">${basePrice + upgradePrice}</span>
                </div>
                <p className="text-sm text-charcoal/70 mt-2">
                  <span className="font-semibold">+${upgradePrice}</span> · For milestone moments
                </p>
              </div>

              <ul className="space-y-3">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    {feature.keepsake ? (
                      <Check size={20} weight="bold" className="text-terracotta flex-shrink-0 mt-0.5" />
                    ) : (
                      <X size={20} weight="bold" className="text-charcoal/20 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={feature.keepsake ? 'text-charcoal font-medium' : 'text-charcoal/30'}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t border-terracotta/30">
                <p className="text-xs text-center text-charcoal/60" style={{ fontFamily: 'var(--font-caveat)', fontSize: '0.95rem' }}>
                  Chosen by 68% of anniversary couples
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-charcoal/60 leading-relaxed max-w-2xl mx-auto">
            Both editions include free shipping in the US and arrive within 2 weeks. The Keepsake Edition transforms your puzzle into a true heirloom piece.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

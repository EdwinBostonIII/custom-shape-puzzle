import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { LockKey } from '@phosphor-icons/react'

interface PartnerHandoffScreenProps {
  onContinue: () => void
}

export function PartnerHandoffScreen({ onContinue }: PartnerHandoffScreenProps) {
  return (
    <div className="min-h-screen bg-terracotta flex items-center justify-center px-6">
      <Card className="max-w-2xl w-full border-4 border-white shadow-2xl">
        <CardContent className="p-12 md:p-16 text-center space-y-8">
          {/* Lock Icon */}
          <div className="flex justify-center">
            <div className="rounded-full bg-white/20 p-8">
              <LockKey size={80} weight="fill" className="text-white" />
            </div>
          </div>

          {/* Main Message */}
          <div>
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
              style={{ fontFamily: 'var(--font-fraunces)', letterSpacing: '-0.02em' }}
            >
              Great picks!
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Now, pass the device to Partner 2
            </p>
          </div>

          {/* Privacy Notice */}
          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <p className="text-white/90 text-sm leading-relaxed">
              Partner 1's selections are now locked and hidden. Partner 2 won't see them until the puzzle arrives—keeping the surprise intact!
            </p>
          </div>

          {/* Continue Button */}
          <Button
            size="lg"
            onClick={onContinue}
            className="w-full px-12 py-8 text-xl bg-white text-terracotta hover:bg-white/95 shadow-xl"
            style={{ fontFamily: 'var(--font-fraunces)', fontWeight: '600' }}
          >
            I am Partner 2 →
          </Button>

          {/* Helper Text */}
          <p className="text-white/70 text-xs" style={{ fontFamily: 'var(--font-caveat)', fontSize: '1rem' }}>
            Make sure Partner 1 has handed you the device before continuing
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

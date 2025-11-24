import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle } from '@phosphor-icons/react'

interface OrderConfirmationProps {
  orderNumber: string
  onCreateAnother: () => void
}

export function OrderConfirmation({ orderNumber, onCreateAnother }: OrderConfirmationProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-6">
      <Card className="w-full max-w-2xl border-2 border-stone shadow-2xl">
        <CardContent className="space-y-10 p-12 md:p-16 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-terracotta/10 p-8 shadow-xl">
              <CheckCircle size={96} weight="fill" className="text-terracotta" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-charcoal" style={{ fontFamily: 'var(--font-fraunces)', letterSpacing: '-0.02em', lineHeight: '1.1' }}>
              Your Puzzle Awaits
            </h1>
            <p className="text-xl text-charcoal/70 font-light leading-relaxed">
              Thank you for creating with Interlock
            </p>
          </div>

          <Card className="border-2 border-stone bg-sage/5 shadow-lg">
            <CardContent className="p-8">
              <p className="mb-3 text-sm font-medium text-charcoal/60 uppercase tracking-wider">Order Number</p>
              <p className="text-3xl font-bold tracking-wider text-terracotta">{orderNumber}</p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <p className="text-base text-charcoal/70 font-light leading-relaxed max-w-lg mx-auto">
              We'll send you a confirmation email with all the details. Your puzzle will be handcrafted with love and arrive within two weeks.
            </p>
          </div>

          <div className="space-y-4 max-w-md mx-auto pt-4">
            <Button size="lg" onClick={onCreateAnother} className="w-full px-8 py-6 text-base">
              Create Another Puzzle
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full px-8 py-6 text-base border-2 border-terracotta text-terracotta hover:bg-terracotta/5 flex flex-col h-auto py-4"
              onClick={() => {
                const shareText = encodeURIComponent('Create a custom wooden puzzle from your memories with Interlock – Get 15% off with my referral link!');
                const shareUrl = encodeURIComponent(window.location.origin);
                alert(`Share this: ${shareText}\n\nIn a real app, this would open a share dialog with a referral link!`);
              }}
            >
              <span>Gift Interlock to Someone Else</span>
              <span className="text-xs mt-1 opacity-75">15% off for both of you</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

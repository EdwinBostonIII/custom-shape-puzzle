import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Truck, Calendar, Gift } from '@phosphor-icons/react'
import { ReferralProgram } from './ReferralProgram'

interface OrderConfirmationProps {
  orderNumber: string
  onCreateAnother: () => void
  customerName?: string
}

// Generate a referral code from the order number
function generateReferralCode(orderNumber: string): string {
  // Take last 6 characters and uppercase
  const base = orderNumber.replace(/-/g, '').slice(-6).toUpperCase()
  return `SHARE${base}`
}

// Calculate estimated delivery date
function getEstimatedDeliveryDate(): Date {
  const date = new Date()
  // Add 14 business days for production + 5 for shipping
  let daysToAdd = 19
  while (daysToAdd > 0) {
    date.setDate(date.getDate() + 1)
    const day = date.getDay()
    if (day !== 0 && day !== 6) {
      daysToAdd--
    }
  }
  return date
}

export function OrderConfirmation({ orderNumber, onCreateAnother, customerName }: OrderConfirmationProps) {
  const isPartnerComplete = orderNumber === 'PARTNER-COMPLETE'
  
  const referralCode = useMemo(() => generateReferralCode(orderNumber), [orderNumber])
  const estimatedDelivery = useMemo(() => getEstimatedDeliveryDate(), [])

  return (
    <div className="min-h-screen bg-cream py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Success Card */}
        <Card className="border-2 border-stone shadow-2xl">
          <CardContent className="space-y-8 p-10 md:p-12 text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-terracotta/10 p-6 shadow-xl">
                <CheckCircle size={72} weight="fill" className="text-terracotta" />
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl text-charcoal leading-display">
                {isPartnerComplete ? 'Your Shapes Are In!' : 'Your Puzzle Awaits'}
              </h1>
              <p className="text-lg text-charcoal/70 font-light leading-relaxed">
                {isPartnerComplete
                  ? 'Thank you! Your partner will complete the puzzle and place the order.'
                  : 'Thank you for creating with Interlock'}
              </p>
            </div>

            {!isPartnerComplete && (
              <>
                {/* Order Number */}
                <Card className="border border-stone bg-sage/5 shadow-md">
                  <CardContent className="p-6">
                    <p className="mb-2 text-xs font-medium text-charcoal/60 uppercase tracking-wider">Order Number</p>
                    <p className="text-2xl font-bold tracking-wider text-terracotta">{orderNumber}</p>
                  </CardContent>
                </Card>

                {/* Delivery Timeline */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl border border-stone p-4 text-center">
                    <Truck size={28} weight="duotone" className="text-sage mx-auto mb-2" />
                    <p className="text-xs text-charcoal/60 mb-1">Estimated Delivery</p>
                    <p className="font-semibold text-charcoal">
                      {estimatedDelivery.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl border border-stone p-4 text-center">
                    <Calendar size={28} weight="duotone" className="text-sage mx-auto mb-2" />
                    <p className="text-xs text-charcoal/60 mb-1">Production Time</p>
                    <p className="font-semibold text-charcoal">2-3 weeks</p>
                  </div>
                </div>

                {/* What's Next */}
                <div className="text-left bg-stone/10 rounded-xl p-5 space-y-3">
                  <h3 className="font-semibold text-charcoal flex items-center gap-2">
                    <Gift size={20} weight="duotone" className="text-terracotta" />
                    What happens next?
                  </h3>
                  <ol className="space-y-2 text-sm text-charcoal/70">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-terracotta/20 text-terracotta text-xs flex items-center justify-center font-medium">1</span>
                      <span>You'll receive a confirmation email with your order details</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-terracotta/20 text-terracotta text-xs flex items-center justify-center font-medium">2</span>
                      <span>Your puzzle will be handcrafted with care (about 2 weeks)</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-terracotta/20 text-terracotta text-xs flex items-center justify-center font-medium">3</span>
                      <span>We'll send a shipping notification when it's on its way!</span>
                    </li>
                  </ol>
                </div>
              </>
            )}

            <Button 
              size="lg" 
              onClick={onCreateAnother} 
              className="w-full px-8 py-5 text-base"
            >
              Create Another Puzzle
            </Button>
          </CardContent>
        </Card>

        {/* Referral Program - Post-purchase */}
        {!isPartnerComplete && (
          <ReferralProgram
            customerName={customerName}
            referralCode={referralCode}
            giveAmount={10}
            getAmount={10}
            variant="card"
            onShare={(channel) => {
              console.log(`Referral shared via ${channel}`)
              // In production: track analytics
            }}
          />
        )}
      </div>
    </div>
  )
}

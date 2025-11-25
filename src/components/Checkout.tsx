import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Check, Truck, Shield, Clock, Lock, Heart, AppleLogo, GoogleLogo, CreditCard } from '@phosphor-icons/react'
import { PuzzleSession, ShippingInfo } from '@/lib/types'
import { PUZZLE_TIERS, WOOD_STAINS, calculateTotal, getEstimatedDeliveryDate } from '@/lib/constants'
import { toast } from 'sonner'
import { ShapeIcon } from './ShapeIcon'
import { RiskReversal, OrderValueProgress, DeliveryCountdown, CheckoutTrustStrip } from './TrustSignals'
import { CheckoutGuarantee, MiniGuarantee } from './ReturnPolicyModal'
import { CheckoutUrgencyStrip } from './UrgencyBanner'
import { BNPLInfoCard, PriceWithBNPL } from './PaymentOptions'
import { SocialProofBanner } from './SocialProofNotifications'
import { cn } from '@/lib/utils'

export interface CheckoutProps {
  session: PuzzleSession
  onBack: () => void
  onComplete: (shippingInfo: ShippingInfo) => void
}

export function Checkout({ session, onBack, onComplete }: CheckoutProps) {
  const [formData, setFormData] = useState<Partial<ShippingInfo>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showManualForm, setShowManualForm] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const tierConfig = PUZZLE_TIERS.find(t => t.id === session.tier)
  const pricing = calculateTotal(session.tier, {
    hasWoodStain: session.hasWoodStain,
    premiumBox: session.packaging?.box === 'premium',
    waxSeal: session.packaging?.waxSeal
  })
  const selectedStain = WOOD_STAINS.find(s => s.id === session.woodStain)
  const estimatedDelivery = getEstimatedDeliveryDate()

  // Check if device supports touch for mobile optimization
  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)

  const handleInputChange = (field: keyof ShippingInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Express checkout handlers (placeholders for payment integration)
  const handleApplePay = async () => {
    toast.info('Apple Pay integration coming soon!')
    // In production: integrate with Stripe/Apple Pay
  }

  const handleGooglePay = async () => {
    toast.info('Google Pay integration coming soon!')
    // In production: integrate with Stripe/Google Pay
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const requiredFields: (keyof ShippingInfo)[] = [
      'fullName', 'email', 'address', 'city', 'state', 'zipCode'
    ]
    
    const missingFields = requiredFields.filter(field => !formData[field])
    
    if (missingFields.length > 0) {
      toast.error('Please fill in all required fields')
      return
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email || '')) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)
    
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    onComplete(formData as ShippingInfo)
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Checkout urgency strip - priority processing countdown */}
      <CheckoutUrgencyStrip />
      
      <div className="px-6 py-12 md:px-12 lg:px-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <Button variant="ghost" onClick={onBack} aria-label="Go back to color selection">
              <ArrowLeft className="mr-2" size={20} aria-hidden="true" />
              Back
            </Button>
          </div>

          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-charcoal font-display">
              Almost There
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-charcoal/70 font-light leading-relaxed">
              Your custom puzzle will be handcrafted with care and shipped to you within two weeks.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* Form Section */}
            <div className="space-y-6">
              {/* Express Checkout - Mobile Commerce Best Practice */}
              <Card className="border-2 border-terracotta/30 bg-terracotta/5">
                <CardHeader className="pb-3">
                  <CardTitle className="font-display text-lg flex items-center gap-2">
                    <span className="text-terracotta">⚡</span> Express Checkout
                  </CardTitle>
                  <p className="text-sm text-charcoal/60">Complete your order in one tap</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleApplePay}
                      className={cn(
                        "h-14 bg-black text-white hover:bg-black/90 border-black flex items-center justify-center gap-2",
                        isTouchDevice ? "min-h-[56px]" : "" // 44px+ touch target per Apple HIG
                      )}
                      aria-label="Pay with Apple Pay"
                    >
                      <AppleLogo size={24} weight="fill" aria-hidden="true" />
                      <span className="font-medium">Pay</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGooglePay}
                      className={cn(
                        "h-14 bg-white hover:bg-gray-50 border-stone flex items-center justify-center gap-2",
                        isTouchDevice ? "min-h-[56px]" : ""
                      )}
                      aria-label="Pay with Google Pay"
                    >
                      <GoogleLogo size={24} weight="bold" className="text-[#4285F4]" aria-hidden="true" />
                      <span className="font-medium text-charcoal">Pay</span>
                    </Button>
                  </div>
                  <p className="text-xs text-center text-charcoal/50">
                    Shipping address saved in your wallet
                  </p>
                </CardContent>
              </Card>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-stone" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-cream px-4 text-charcoal/50">or continue with details</span>
                </div>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <Card className="border-2 border-stone">
                <CardHeader>
                  <CardTitle className="font-display">Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      required
                      autoComplete="name"
                      value={formData.fullName || ''}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="h-11 bg-white"
                      aria-required="true"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={formData.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="h-11 bg-white"
                      aria-required="true"
                      aria-describedby="email-hint"
                    />
                    <p id="email-hint" className="text-xs text-charcoal/60">
                      We'll send your order confirmation here
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      required
                      autoComplete="street-address"
                      value={formData.address || ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="h-11 bg-white"
                      aria-required="true"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        required
                        autoComplete="address-level2"
                        value={formData.city || ''}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="h-11 bg-white"
                        aria-required="true"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        required
                        autoComplete="address-level1"
                        value={formData.state || ''}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className="h-11 bg-white"
                        aria-required="true"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Zip Code *</Label>
                      <Input
                        id="zipCode"
                        required
                        autoComplete="postal-code"
                        value={formData.zipCode || ''}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        className="h-11 bg-white"
                        aria-required="true"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Indicators - Enhanced with research-backed elements */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-xl border border-stone">
                  <Lock size={24} className="mx-auto mb-2 text-sage" weight="duotone" />
                  <p className="text-xs font-medium text-charcoal">Secure Checkout</p>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-stone">
                  <Shield size={24} className="mx-auto mb-2 text-sage" weight="duotone" />
                  <p className="text-xs font-medium text-charcoal">30-Day Guarantee</p>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-stone">
                  <Truck size={24} className="mx-auto mb-2 text-sage" weight="duotone" />
                  <p className="text-xs font-medium text-charcoal">Free Shipping</p>
                </div>
              </div>

              {/* Order Value Progress - Encourage upgrade */}
              <OrderValueProgress currentValue={pricing.total} />

              {/* Risk Reversal - Reduce purchase anxiety */}
              <RiskReversal />

              {/* Checkout Guarantee with details modal - Research: 67% check policy */}
              <CheckoutGuarantee />

              <Button 
                type="submit" 
                size="lg" 
                disabled={isSubmitting}
                className="w-full px-8 py-6 text-lg"
              >
                {isSubmitting ? 'Processing...' : `Complete Order — $${pricing.total}`}
              </Button>

              <p className="text-xs text-center text-charcoal/50">
                By placing your order, you agree to our Terms of Service and Privacy Policy.
                Your data is encrypted and never shared. <a href="/privacy" className="underline">Learn more</a>
              </p>
              </form>
            </div>

            {/* Order Summary Sidebar */}
            <div className="space-y-6">
              <Card className="border-2 border-stone sticky top-24">
                <CardHeader>
                  <CardTitle className="font-display">Your Order</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Puzzle Preview */}
                  <div className="grid grid-cols-5 gap-2 p-4 rounded-xl bg-burlywood">
                    {session.selectedShapes.slice(0, 10).map((shapeId, index) => (
                      <div 
                        key={index}
                        className="aspect-square rounded-lg bg-white/90 flex items-center justify-center shadow-sm"
                      >
                        <ShapeIcon shape={shapeId} className="h-6 w-6" />
                      </div>
                    ))}
                  </div>

                  {/* Order Details */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-charcoal">
                      <span>{tierConfig?.name || 'Classic'} Puzzle ({tierConfig?.pieces.toLocaleString() || '250'} pieces)</span>
                      <span className="font-medium">${pricing.base}</span>
                    </div>
                    {pricing.premiumBox > 0 && (
                      <div className="flex justify-between text-charcoal/70">
                        <span>Premium Box</span>
                        <span>+${pricing.premiumBox}</span>
                      </div>
                    )}
                    {pricing.waxSeal > 0 && (
                      <div className="flex justify-between text-charcoal/70">
                        <span>Wax Seal</span>
                        <span>+${pricing.waxSeal}</span>
                      </div>
                    )}
                    {pricing.woodStain > 0 && (
                      <div className="flex justify-between text-charcoal/70">
                        <span>Wood Stain: {selectedStain?.name || 'Natural'}</span>
                        <span>+${pricing.woodStain}</span>
                      </div>
                    )}
                    {pricing.capsule > 0 && (
                      <div className="flex justify-between text-charcoal/70">
                        <span>Anniversary Capsule (1 year)</span>
                        <span>+${pricing.capsule}</span>
                      </div>
                    )}
                    {pricing.capsuleDiscount > 0 && (
                      <div className="flex justify-between text-sage">
                        <span>First Capsule Free</span>
                        <span>-${pricing.capsuleDiscount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-charcoal/70">
                      <span>Shipping</span>
                      <span className="text-sage font-medium">Free</span>
                    </div>
                    <hr className="border-stone" />
                    <div className="flex justify-between text-lg font-bold text-charcoal">
                      <span>Total</span>
                      <span>${pricing.total}</span>
                    </div>
                    
                    {/* BNPL Option - Research: 40% higher AOV, 20% conversion increase */}
                    <PriceWithBNPL price={pricing.total} size="sm" showProvider />
                  </div>

                  {/* Buy Now Pay Later Info */}
                  <BNPLInfoCard price={pricing.total} defaultExpanded={false} />

                  {/* Estimated Delivery */}
                  <div className="bg-sage/10 rounded-xl p-4">
                    <p className="text-sm text-charcoal/70 mb-1">Estimated Delivery</p>
                    <p className="font-semibold text-charcoal">{estimatedDelivery}</p>
                  </div>

                  {/* What's Included */}
                  <div className="space-y-2">
                    <p className="font-medium text-charcoal text-sm">What's Included:</p>
                    <ul className="space-y-1.5 text-sm text-charcoal/70">
                      <li className="flex items-start gap-2">
                        <Check size={16} weight="bold" className="text-sage mt-0.5 flex-shrink-0" />
                        <span>{tierConfig?.pieces.toLocaleString()}-piece Baltic birch puzzle</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={16} weight="bold" className="text-sage mt-0.5 flex-shrink-0" />
                        <span>{tierConfig?.hintCards} personalized hint cards</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={16} weight="bold" className="text-sage mt-0.5 flex-shrink-0" />
                        <span>Gift-ready packaging</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={16} weight="bold" className="text-sage mt-0.5 flex-shrink-0" />
                        <span>30-day happiness guarantee</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

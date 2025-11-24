import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Check, Truck, Shield, Clock } from '@phosphor-icons/react'
import { PuzzleSession, ShippingInfo } from '@/lib/types'
import { PRICING, PUZZLE_SHAPES, WOOD_STAINS, getEstimatedDeliveryDate } from '@/lib/constants'
import { toast } from 'sonner'
import { ShapeIcon } from './ShapeIcon'

export interface CheckoutProps {
  session: PuzzleSession
  onBack: () => void
  onComplete: (shippingInfo: ShippingInfo) => void
}

export function Checkout({ session, onBack, onComplete }: CheckoutProps) {
  const [formData, setFormData] = useState<Partial<ShippingInfo>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const price = PRICING.base
  const selectedStain = WOOD_STAINS.find(s => s.id === session.woodStain)
  const estimatedDelivery = getEstimatedDeliveryDate()

  const handleInputChange = (field: keyof ShippingInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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
            <form onSubmit={handleSubmit} className="space-y-6">
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

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-xl border border-stone">
                  <Truck size={24} className="mx-auto mb-2 text-sage" weight="duotone" />
                  <p className="text-xs font-medium text-charcoal">Free Shipping</p>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-stone">
                  <Shield size={24} className="mx-auto mb-2 text-sage" weight="duotone" />
                  <p className="text-xs font-medium text-charcoal">30-Day Guarantee</p>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-stone">
                  <Clock size={24} className="mx-auto mb-2 text-sage" weight="duotone" />
                  <p className="text-xs font-medium text-charcoal">Ships in 2 Weeks</p>
                </div>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                disabled={isSubmitting}
                className="w-full px-8 py-6 text-lg"
              >
                {isSubmitting ? 'Processing...' : `Complete Order — $${price}`}
              </Button>

              <p className="text-xs text-center text-charcoal/50">
                By placing your order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>

            {/* Order Summary Sidebar */}
            <div className="space-y-6">
              <Card className="border-2 border-stone sticky top-24">
                <CardHeader>
                  <CardTitle className="font-display">Your Order</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Puzzle Preview */}
                  <div 
                    className="grid grid-cols-5 gap-2 p-4 rounded-xl"
                    style={{ backgroundColor: selectedStain?.hex || '#DEB887' }}
                  >
                    {session.selectedShapes.slice(0, 10).map((shapeId, index) => {
                      return (
                        <div 
                          key={index}
                          className="aspect-square rounded-lg bg-white/90 flex items-center justify-center shadow-sm"
                        >
                          <ShapeIcon shape={shapeId} className="h-6 w-6" />
                        </div>
                      )
                    })}
                  </div>

                  {/* Order Details */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-charcoal">
                      <span>Custom 10-Piece Puzzle</span>
                      <span className="font-medium">${price}</span>
                    </div>
                    <div className="flex justify-between text-charcoal/70">
                      <span>Wood Stain</span>
                      <span>{selectedStain?.name || 'Natural'}</span>
                    </div>
                    <div className="flex justify-between text-charcoal/70">
                      <span>Shipping</span>
                      <span className="text-sage font-medium">Free</span>
                    </div>
                    <hr className="border-stone" />
                    <div className="flex justify-between text-lg font-bold text-charcoal">
                      <span>Total</span>
                      <span>${price}</span>
                    </div>
                  </div>

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
                        <span>10-piece basswood puzzle (5" × 7")</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={16} weight="bold" className="text-sage mt-0.5 flex-shrink-0" />
                        <span>Personalized Story Card</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={16} weight="bold" className="text-sage mt-0.5 flex-shrink-0" />
                        <span>Gift-ready packaging</span>
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

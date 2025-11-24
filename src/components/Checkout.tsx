import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from '@phosphor-icons/react'
import { PuzzleType, ShippingInfo } from '@/lib/types'
import { PRICING } from '@/lib/constants'
import { toast } from 'sonner'

interface CheckoutProps {
  type: PuzzleType
  onBack: () => void
  onComplete: (shippingInfo: ShippingInfo) => void
}

export function Checkout({ type, onBack, onComplete }: CheckoutProps) {
  const [formData, setFormData] = useState<Partial<ShippingInfo>>({})
  const [keepsakeUpgrade, setKeepsakeUpgrade] = useState(false)

  const basePrice = PRICING[type]
  const upgradePrice = 74
  const price = keepsakeUpgrade ? basePrice + upgradePrice : basePrice

  const handleInputChange = (field: keyof ShippingInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const requiredFields: (keyof ShippingInfo)[] = [
      'fullName', 'email', 'address', 'city', 'state', 'zipCode', 
      'cardNumber', 'expiryDate', 'cvv'
    ]
    
    const missingFields = requiredFields.filter(field => !formData[field])
    
    if (missingFields.length > 0) {
      toast.error('Please fill in all required fields')
      return
    }

    onComplete(formData as ShippingInfo)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="px-6 py-12 md:px-12 lg:px-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="mr-2" size={20} />
              Back
            </Button>
          </div>

          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-charcoal" style={{ fontFamily: 'var(--font-fraunces)', letterSpacing: '-0.02em', lineHeight: '1.1' }}>
              Almost There
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-charcoal/70 font-light leading-relaxed">
              Your custom puzzle will be handcrafted with care and shipped to you within two weeks.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'var(--font-outfit)' }}>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    required
                    value={formData.fullName || ''}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    required
                    value={formData.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      required
                      value={formData.city || ''}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      required
                      value={formData.state || ''}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip Code *</Label>
                    <Input
                      id="zipCode"
                      required
                      value={formData.zipCode || ''}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      className="h-11"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'var(--font-outfit)' }}>Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number *</Label>
                  <Input
                    id="cardNumber"
                    required
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber || ''}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date *</Label>
                    <Input
                      id="expiryDate"
                      required
                      placeholder="MM/YY"
                      value={formData.expiryDate || ''}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV *</Label>
                    <Input
                      id="cvv"
                      required
                      placeholder="123"
                      value={formData.cvv || ''}
                      onChange={(e) => handleInputChange('cvv', e.target.value)}
                      className="h-11"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Keepsake Edition Upsell */}
            <Card className={`border-2 shadow-xl transition-all ${keepsakeUpgrade ? 'border-terracotta bg-terracotta/5' : 'border-stone'}`}>
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-charcoal mb-2" style={{ fontFamily: 'var(--font-fraunces)' }}>
                      Upgrade to Keepsake Edition
                    </h3>
                    <p className="text-lg text-charcoal/80">
                      +${upgradePrice} <span className="text-sm text-charcoal/60">(${basePrice + upgradePrice} total)</span>
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant={keepsakeUpgrade ? "default" : "outline"}
                    onClick={() => setKeepsakeUpgrade(!keepsakeUpgrade)}
                    className="min-w-[140px]"
                  >
                    {keepsakeUpgrade ? 'Added ✓' : 'Upgrade Now'}
                  </Button>
                </div>

                <div className="grid md:grid-cols-[200px_1fr] gap-6 items-center">
                  {/* Placeholder for walnut box image */}
                  <div className="bg-stone/30 rounded-xl aspect-square flex items-center justify-center border-2 border-stone">
                    <p className="text-xs text-charcoal/50 text-center px-4">Walnut Box<br/>Illustration</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-terracotta mt-0.5">✓</span>
                      <span className="text-charcoal/80">Solid walnut storage box with your custom dedication engraved inside the lid</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-terracotta mt-0.5">✓</span>
                      <span className="text-charcoal/80">Printed linen "Our Story" card explaining the meaning of all ten pieces</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-terracotta mt-0.5">✓</span>
                      <span className="text-charcoal/80">Premium gift wrapping + handwritten note</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-center text-charcoal/50 mt-6" style={{ fontFamily: 'var(--font-caveat)', fontSize: '0.95rem' }}>
                  Chosen by 68% of anniversary couples
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 shadow-lg bg-sage/5">
              <CardHeader>
                <CardTitle className="text-charcoal" style={{ fontFamily: 'var(--font-fraunces)' }}>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-lg text-charcoal">
                    <span>Custom Puzzle ({type === 'couple' ? 'Together' : 'For Someone Special'})</span>
                    <span className="font-semibold">${basePrice}</span>
                  </div>
                  {keepsakeUpgrade && (
                    <div className="flex justify-between text-lg text-charcoal">
                      <span>Keepsake Edition Upgrade</span>
                      <span className="font-semibold">+${upgradePrice}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-stone pt-3 text-2xl font-bold text-charcoal">
                    <span>Total</span>
                    <span>${price}</span>
                  </div>
                  <p className="text-xs text-charcoal/60 pt-2">Free shipping included</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center pt-4">
              <Button type="submit" size="lg" className="min-w-[240px] px-8 py-6 text-base">
                Place Order - ${price}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

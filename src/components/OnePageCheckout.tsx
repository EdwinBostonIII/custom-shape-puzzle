/**
 * One-Page Checkout (Express Checkout)
 * 
 * Research-backed implementation based on:
 * - White Stuff: 3-page to 1-page checkout = 37% conversion increase, 26% AOV increase
 * - Wreaths Across America: 63% revenue increase with streamlined checkout
 * - BigCommerce: Single-page checkout prevents cart abandonment
 * - 70% checkout abandonment rate industry average
 * - 63% abandon if no guest checkout option
 * - 40% abandon when mobile wallet unavailable
 * 
 * Key features implemented:
 * 1. Single scrollable page with all fields visible
 * 2. Progress indicator showing completion status
 * 3. Smart form validation with autocomplete
 * 4. Express checkout options (Apple Pay, Google Pay, PayPal)
 * 5. Guest checkout prominent
 * 6. Real-time order summary
 * 7. Trust signals throughout
 * 8. Mobile-optimized with large touch targets
 */

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CreditCard,
  ShieldCheck,
  Package,
  Gift,
  MapPin,
  User,
  EnvelopeSimple,
  Phone,
  Check,
  CaretDown,
  Lock,
  Truck,
  Clock,
  Star,
  CheckCircle,
  WarningCircle,
  ArrowRight,
  Lightning,
  AppleLogo,
  GoogleLogo,
  PaypalLogo,
  Sparkle,
  Heart,
  Certificate
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import { trackEvent } from '@/lib/analytics'
import type { PuzzleTier, PackagingOptions, WoodStainColor } from '@/lib/types'
import { getTierConfig, PUZZLE_TIERS, PRICING } from '@/lib/constants'

// ============================================================================
// Types
// ============================================================================

interface OrderItem {
  id: string
  name: string
  tier: PuzzleTier
  image?: string
  price: number
  quantity: number
  customizations?: {
    woodStain?: WoodStainColor
    packaging?: PackagingOptions
    hintCards?: number
    shapes?: string[]
  }
}

interface ShippingAddress {
  firstName: string
  lastName: string
  email: string
  phone: string
  address1: string
  address2: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface PaymentInfo {
  method: 'card' | 'paypal' | 'apple-pay' | 'google-pay'
  cardNumber?: string
  expiry?: string
  cvv?: string
  nameOnCard?: string
  savePaymentInfo?: boolean
}

interface OnePageCheckoutProps {
  items: OrderItem[]
  onComplete: (orderData: {
    shipping: ShippingAddress
    payment: PaymentInfo
    items: OrderItem[]
    totals: OrderTotals
  }) => void
  onBack?: () => void
  discountCode?: string
  discountPercentage?: number
}

interface OrderTotals {
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
}

type CheckoutSection = 'shipping' | 'payment' | 'review'

// ============================================================================
// Constants
// ============================================================================

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
]

const SHIPPING_OPTIONS = [
  { id: 'standard', name: 'Standard Shipping', price: 0, days: '5-7 business days', icon: Package },
  { id: 'express', name: 'Express Shipping', price: 12.99, days: '2-3 business days', icon: Truck },
  { id: 'priority', name: 'Priority Overnight', price: 24.99, days: 'Next business day', icon: Lightning },
]

const TAX_RATE = 0.0825 // 8.25% average US tax rate

// ============================================================================
// Progress Indicator
// ============================================================================

interface ProgressIndicatorProps {
  currentSection: CheckoutSection
  sections: { id: CheckoutSection; label: string; isComplete: boolean }[]
}

function CheckoutProgressIndicator({ currentSection, sections }: ProgressIndicatorProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      {sections.map((section, index) => {
        const isCurrent = section.id === currentSection
        const isComplete = section.isComplete
        const isPast = sections.findIndex(s => s.id === currentSection) > index

        return (
          <React.Fragment key={section.id}>
            <div className="flex flex-col items-center">
              <motion.div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                  transition-colors duration-300
                  ${isComplete || isPast
                    ? 'bg-sage-600 text-white'
                    : isCurrent
                      ? 'bg-sage-100 text-sage-800 ring-2 ring-sage-600'
                      : 'bg-sage-100 text-sage-400'
                  }
                `}
                animate={isCurrent ? { scale: [1, 1.05, 1] } : {}}
                transition={{ repeat: isCurrent ? Infinity : 0, duration: 2 }}
              >
                {isComplete ? (
                  <Check weight="bold" className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </motion.div>
              <span className={`
                text-xs mt-2 font-medium
                ${isCurrent ? 'text-sage-800' : 'text-sage-500'}
              `}>
                {section.label}
              </span>
            </div>
            
            {index < sections.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 -mt-6">
                <div className={`
                  h-full transition-colors duration-300
                  ${isPast || isComplete ? 'bg-sage-600' : 'bg-sage-200'}
                `} />
              </div>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

// ============================================================================
// Express Checkout Buttons
// ============================================================================

interface ExpressCheckoutProps {
  onSelect: (method: PaymentInfo['method']) => void
  totalAmount: number
}

function ExpressCheckoutButtons({ onSelect, totalAmount }: ExpressCheckoutProps) {
  return (
    <div className="space-y-3 mb-6">
      <p className="text-sm text-center text-sage-600 font-medium">Express Checkout</p>
      
      <div className="grid grid-cols-3 gap-3">
        <Button
          variant="outline"
          onClick={() => onSelect('apple-pay')}
          className="h-12 hover:bg-black hover:text-white transition-colors"
        >
          <AppleLogo weight="fill" className="w-5 h-5 mr-1" />
          Pay
        </Button>
        
        <Button
          variant="outline"
          onClick={() => onSelect('google-pay')}
          className="h-12 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-colors"
        >
          <GoogleLogo weight="bold" className="w-5 h-5 mr-1" />
          Pay
        </Button>
        
        <Button
          variant="outline"
          onClick={() => onSelect('paypal')}
          className="h-12 hover:bg-[#0070ba] hover:text-white hover:border-[#0070ba] transition-colors"
        >
          <PaypalLogo weight="fill" className="w-5 h-5 mr-1" />
          PayPal
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-sage-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-4 text-sage-500">or continue with details</span>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Form Input with Validation
// ============================================================================

interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  icon?: React.ElementType
}

function ValidatedInput({ 
  label, 
  error, 
  icon: Icon, 
  className,
  ...props 
}: ValidatedInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const hasValue = props.value && String(props.value).length > 0

  return (
    <div className="space-y-1">
      <Label 
        htmlFor={props.id} 
        className={`text-sm font-medium ${error ? 'text-red-600' : 'text-sage-700'}`}
      >
        {label}
        {props.required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      <div className="relative">
        {Icon && (
          <Icon 
            className={`
              absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none
              ${isFocused ? 'text-sage-600' : 'text-sage-400'}
              transition-colors
            `}
          />
        )}
        <Input
          {...props}
          className={`
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-red-300 focus:ring-red-500' : ''}
            h-12 text-base
            ${className}
          `}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur?.(e)
          }}
        />
        {hasValue && !error && (
          <CheckCircle 
            weight="fill" 
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" 
          />
        )}
        {error && (
          <WarningCircle 
            weight="fill" 
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" 
          />
        )}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-600"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}

// ============================================================================
// Order Summary Component
// ============================================================================

interface OrderSummaryProps {
  items: OrderItem[]
  totals: OrderTotals
  discountCode?: string
  discountPercentage?: number
  shippingOption: string
  isCollapsible?: boolean
}

function OrderSummary({ 
  items, 
  totals, 
  discountCode, 
  discountPercentage,
  shippingOption,
  isCollapsible = false 
}: OrderSummaryProps) {
  const [isOpen, setIsOpen] = useState(!isCollapsible)
  const selectedShipping = SHIPPING_OPTIONS.find(s => s.id === shippingOption) || SHIPPING_OPTIONS[0]

  const content = (
    <div className="space-y-4">
      {/* Items */}
      <div className="space-y-3">
        {items.map((item) => {
          const tierConfig = getTierConfig(item.tier)
          return (
            <div key={item.id} className="flex gap-3">
              <div className="w-16 h-16 bg-sage-100 rounded-lg flex items-center justify-center flex-shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <Gift weight="duotone" className="w-8 h-8 text-sage-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sage-800 truncate">{item.name}</p>
                <p className="text-sm text-sage-500">{tierConfig.name} • {tierConfig.pieces} pieces</p>
                {item.customizations?.woodStain && (
                  <p className="text-xs text-sage-400">+ Premium wood stain</p>
                )}
              </div>
              <p className="font-medium text-sage-800">${item.price.toFixed(2)}</p>
            </div>
          )
        })}
      </div>

      <div className="border-t border-sage-200 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-sage-600">Subtotal</span>
          <span className="text-sage-800">${totals.subtotal.toFixed(2)}</span>
        </div>
        
        {discountCode && discountPercentage && totals.discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span className="flex items-center gap-1">
              <Tag weight="fill" className="w-4 h-4" />
              {discountCode} ({discountPercentage}% off)
            </span>
            <span>-${totals.discount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between text-sm">
          <span className="text-sage-600">Shipping ({selectedShipping.name})</span>
          <span className="text-sage-800">
            {totals.shipping === 0 ? (
              <span className="text-green-600 font-medium">FREE</span>
            ) : (
              `$${totals.shipping.toFixed(2)}`
            )}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-sage-600">Tax</span>
          <span className="text-sage-800">${totals.tax.toFixed(2)}</span>
        </div>
      </div>

      <div className="border-t border-sage-200 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-sage-900">Total</span>
          <span className="text-2xl font-bold text-sage-900">${totals.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Delivery estimate */}
      <div className="bg-sage-50 rounded-lg p-3 flex items-center gap-3">
        <Clock weight="fill" className="w-5 h-5 text-sage-600" />
        <div className="text-sm">
          <span className="font-medium text-sage-800">Estimated Delivery: </span>
          <span className="text-sage-600">{selectedShipping.days}</span>
        </div>
      </div>
    </div>
  )

  if (isCollapsible) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-4 bg-sage-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Package weight="duotone" className="w-5 h-5 text-sage-600" />
              <span className="font-medium text-sage-800">Order Summary</span>
              <span className="text-sage-500">({items.length} items)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sage-900">${totals.total.toFixed(2)}</span>
              <CaretDown className={`w-4 h-4 text-sage-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="p-4">{content}</div>
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return content
}

// We need Tag for the discount display
import { Tag } from '@phosphor-icons/react'

// ============================================================================
// Trust Signals Bar
// ============================================================================

function TrustSignalsBar() {
  return (
    <div className="bg-sage-50 rounded-lg p-4">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="space-y-1">
          <ShieldCheck weight="fill" className="w-6 h-6 mx-auto text-green-600" />
          <p className="text-xs font-medium text-sage-800">Secure Checkout</p>
          <p className="text-xs text-sage-500">256-bit SSL</p>
        </div>
        <div className="space-y-1">
          <Truck weight="fill" className="w-6 h-6 mx-auto text-sage-600" />
          <p className="text-xs font-medium text-sage-800">Free Shipping</p>
          <p className="text-xs text-sage-500">Orders $99+</p>
        </div>
        <div className="space-y-1">
          <Certificate weight="fill" className="w-6 h-6 mx-auto text-amber-600" />
          <p className="text-xs font-medium text-sage-800">100% Guarantee</p>
          <p className="text-xs text-sage-500">30-day returns</p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Main One-Page Checkout Component
// ============================================================================

export function OnePageCheckout({
  items,
  onComplete,
  onBack,
  discountCode,
  discountPercentage = 0
}: OnePageCheckoutProps) {
  // Form state
  const [shipping, setShipping] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  })

  const [payment, setPayment] = useState<PaymentInfo>({
    method: 'card',
    cardNumber: '',
    expiry: '',
    cvv: '',
    nameOnCard: '',
    savePaymentInfo: false
  })

  const [shippingOption, setShippingOption] = useState('standard')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentSection, setCurrentSection] = useState<CheckoutSection>('shipping')
  const [giftMessage, setGiftMessage] = useState('')
  const [isGift, setIsGift] = useState(false)
  const [createAccount, setCreateAccount] = useState(false)
  
  const shippingRef = useRef<HTMLDivElement>(null)
  const paymentRef = useRef<HTMLDivElement>(null)
  const reviewRef = useRef<HTMLDivElement>(null)

  // Calculate totals
  const calculateTotals = useCallback((): OrderTotals => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shippingCost = SHIPPING_OPTIONS.find(s => s.id === shippingOption)?.price || 0
    const discountAmount = discountPercentage > 0 ? subtotal * (discountPercentage / 100) : 0
    const afterDiscount = subtotal - discountAmount
    const tax = afterDiscount * TAX_RATE
    const total = afterDiscount + shippingCost + tax

    return {
      subtotal,
      shipping: shippingCost,
      tax,
      discount: discountAmount,
      total
    }
  }, [items, shippingOption, discountPercentage])

  const totals = calculateTotals()

  // Check section completion
  const isShippingComplete = useCallback((): boolean => {
    const required = ['firstName', 'lastName', 'email', 'address1', 'city', 'state', 'zipCode']
    return required.every(field => Boolean(shipping[field as keyof ShippingAddress]?.toString().trim()))
  }, [shipping])

  const isPaymentComplete = useCallback((): boolean => {
    if (payment.method !== 'card') return true
    return Boolean(payment.cardNumber && payment.expiry && payment.cvv && payment.nameOnCard)
  }, [payment])

  const sections = [
    { id: 'shipping' as CheckoutSection, label: 'Shipping', isComplete: isShippingComplete() },
    { id: 'payment' as CheckoutSection, label: 'Payment', isComplete: isPaymentComplete() },
    { id: 'review' as CheckoutSection, label: 'Review', isComplete: false },
  ]

  // Handle shipping field change
  const handleShippingChange = (field: keyof ShippingAddress, value: string) => {
    setShipping(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // Handle payment field change
  const handlePaymentChange = (field: keyof PaymentInfo, value: string | boolean) => {
    setPayment(prev => ({ ...prev, [field]: value }))
  }

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    const groups = cleaned.match(/.{1,4}/g) || []
    return groups.join(' ').substr(0, 19)
  }

  // Format expiry date
  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length >= 2) {
      return `${cleaned.substr(0, 2)}/${cleaned.substr(2, 2)}`
    }
    return cleaned
  }

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Shipping validation
    if (!shipping.firstName) newErrors.firstName = 'First name is required'
    if (!shipping.lastName) newErrors.lastName = 'Last name is required'
    if (!shipping.email) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shipping.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!shipping.address1) newErrors.address1 = 'Address is required'
    if (!shipping.city) newErrors.city = 'City is required'
    if (!shipping.state) newErrors.state = 'State is required'
    if (!shipping.zipCode) newErrors.zipCode = 'ZIP code is required'
    else if (!/^\d{5}(-\d{4})?$/.test(shipping.zipCode)) {
      newErrors.zipCode = 'Please enter a valid ZIP code'
    }

    // Payment validation (only for card)
    if (payment.method === 'card') {
      if (!payment.cardNumber) newErrors.cardNumber = 'Card number is required'
      else if (payment.cardNumber.replace(/\s/g, '').length < 15) {
        newErrors.cardNumber = 'Please enter a valid card number'
      }
      if (!payment.expiry) newErrors.expiry = 'Expiry date is required'
      if (!payment.cvv) newErrors.cvv = 'CVV is required'
      if (!payment.nameOnCard) newErrors.nameOnCard = 'Name on card is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle express payment selection
  const handleExpressCheckout = (method: PaymentInfo['method']) => {
    setPayment(prev => ({ ...prev, method }))
    trackEvent('express_checkout_selected', { method })
    
    // In a real implementation, this would open the payment provider's flow
    // For now, scroll to payment section
    paymentRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      // Scroll to first error
      const firstError = Object.keys(errors)[0]
      if (firstError) {
        const element = document.getElementById(firstError)
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    setIsSubmitting(true)
    trackEvent('checkout_submitted', {
      paymentMethod: payment.method,
      shippingOption,
      total: totals.total,
      itemCount: items.length,
      hasDiscount: !!discountCode
    })

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    onComplete({
      shipping,
      payment,
      items,
      totals
    })
  }

  // Track section views for progress
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-section') as CheckoutSection
            if (sectionId) {
              setCurrentSection(sectionId)
            }
          }
        })
      },
      { threshold: 0.5 }
    )

    const refs = [shippingRef, paymentRef, reviewRef]
    refs.forEach(ref => {
      if (ref.current) observer.observe(ref.current)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-sage-900 mb-2">Secure Checkout</h1>
          <p className="text-sage-600">Complete your order in just a few steps</p>
        </div>

        {/* Progress Indicator */}
        <CheckoutProgressIndicator currentSection={currentSection} sections={sections} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Column */}
          <div className="lg:col-span-2 space-y-8">
            <form onSubmit={handleSubmit}>
              {/* Express Checkout */}
              <div className="bg-white rounded-xl shadow-sm border border-sage-200 p-6 mb-6">
                <ExpressCheckoutButtons 
                  onSelect={handleExpressCheckout} 
                  totalAmount={totals.total} 
                />
              </div>

              {/* Shipping Section */}
              <div 
                ref={shippingRef}
                data-section="shipping"
                className="bg-white rounded-xl shadow-sm border border-sage-200 p-6"
              >
                <h2 className="text-xl font-semibold text-sage-900 mb-6 flex items-center gap-2">
                  <MapPin weight="duotone" className="w-6 h-6 text-sage-600" />
                  Shipping Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ValidatedInput
                    id="firstName"
                    label="First Name"
                    value={shipping.firstName}
                    onChange={(e) => handleShippingChange('firstName', e.target.value)}
                    error={errors.firstName}
                    icon={User}
                    required
                    autoComplete="given-name"
                  />
                  
                  <ValidatedInput
                    id="lastName"
                    label="Last Name"
                    value={shipping.lastName}
                    onChange={(e) => handleShippingChange('lastName', e.target.value)}
                    error={errors.lastName}
                    icon={User}
                    required
                    autoComplete="family-name"
                  />

                  <ValidatedInput
                    id="email"
                    label="Email"
                    type="email"
                    value={shipping.email}
                    onChange={(e) => handleShippingChange('email', e.target.value)}
                    error={errors.email}
                    icon={EnvelopeSimple}
                    required
                    autoComplete="email"
                    className="md:col-span-2"
                  />

                  <ValidatedInput
                    id="phone"
                    label="Phone (optional)"
                    type="tel"
                    value={shipping.phone}
                    onChange={(e) => handleShippingChange('phone', e.target.value)}
                    icon={Phone}
                    autoComplete="tel"
                    className="md:col-span-2"
                  />

                  <ValidatedInput
                    id="address1"
                    label="Address"
                    value={shipping.address1}
                    onChange={(e) => handleShippingChange('address1', e.target.value)}
                    error={errors.address1}
                    icon={MapPin}
                    required
                    autoComplete="address-line1"
                    className="md:col-span-2"
                    placeholder="Street address"
                  />

                  <ValidatedInput
                    id="address2"
                    label="Apartment, suite, etc. (optional)"
                    value={shipping.address2}
                    onChange={(e) => handleShippingChange('address2', e.target.value)}
                    autoComplete="address-line2"
                    className="md:col-span-2"
                  />

                  <ValidatedInput
                    id="city"
                    label="City"
                    value={shipping.city}
                    onChange={(e) => handleShippingChange('city', e.target.value)}
                    error={errors.city}
                    required
                    autoComplete="address-level2"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="state" className="text-sm font-medium text-sage-700">
                        State <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={shipping.state}
                        onValueChange={(value) => handleShippingChange('state', value)}
                      >
                        <SelectTrigger className={`h-12 ${errors.state ? 'border-red-300' : ''}`}>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {US_STATES.map(state => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.state && (
                        <p className="text-xs text-red-600">{errors.state}</p>
                      )}
                    </div>

                    <ValidatedInput
                      id="zipCode"
                      label="ZIP Code"
                      value={shipping.zipCode}
                      onChange={(e) => handleShippingChange('zipCode', e.target.value)}
                      error={errors.zipCode}
                      required
                      autoComplete="postal-code"
                      maxLength={10}
                    />
                  </div>
                </div>

                {/* Shipping Options */}
                <div className="mt-6">
                  <Label className="text-sm font-medium text-sage-700 mb-3 block">
                    Shipping Method
                  </Label>
                  <RadioGroup
                    value={shippingOption}
                    onValueChange={setShippingOption}
                    className="space-y-3"
                  >
                    {SHIPPING_OPTIONS.map((option) => {
                      const Icon = option.icon
                      return (
                        <label
                          key={option.id}
                          htmlFor={option.id}
                          className={`
                            flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all
                            ${shippingOption === option.id
                              ? 'border-sage-600 bg-sage-50'
                              : 'border-sage-200 hover:border-sage-300'
                            }
                          `}
                        >
                          <RadioGroupItem value={option.id} id={option.id} />
                          <Icon weight="duotone" className="w-6 h-6 text-sage-600" />
                          <div className="flex-1">
                            <p className="font-medium text-sage-800">{option.name}</p>
                            <p className="text-sm text-sage-500">{option.days}</p>
                          </div>
                          <span className="font-semibold text-sage-800">
                            {option.price === 0 ? 'FREE' : `$${option.price.toFixed(2)}`}
                          </span>
                        </label>
                      )
                    })}
                  </RadioGroup>
                </div>

                {/* Gift Option */}
                <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="isGift"
                      checked={isGift}
                      onCheckedChange={(checked) => setIsGift(checked as boolean)}
                    />
                    <div className="flex-1">
                      <label htmlFor="isGift" className="font-medium text-sage-800 cursor-pointer flex items-center gap-2">
                        <Gift weight="fill" className="w-5 h-5 text-amber-600" />
                        This is a gift
                      </label>
                      <p className="text-sm text-sage-600">Include a personalized message and hide prices</p>
                    </div>
                  </div>
                  
                  {isGift && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="mt-4"
                    >
                      <Label htmlFor="giftMessage" className="text-sm font-medium text-sage-700">
                        Gift Message (optional)
                      </Label>
                      <textarea
                        id="giftMessage"
                        value={giftMessage}
                        onChange={(e) => setGiftMessage(e.target.value)}
                        placeholder="Write a heartfelt message for the recipient..."
                        className="w-full mt-1 p-3 border border-sage-200 rounded-lg resize-none h-24 text-sm"
                        maxLength={200}
                      />
                      <p className="text-xs text-sage-500 mt-1 text-right">
                        {giftMessage.length}/200 characters
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Payment Section */}
              <div 
                ref={paymentRef}
                data-section="payment"
                className="bg-white rounded-xl shadow-sm border border-sage-200 p-6 mt-6"
              >
                <h2 className="text-xl font-semibold text-sage-900 mb-6 flex items-center gap-2">
                  <CreditCard weight="duotone" className="w-6 h-6 text-sage-600" />
                  Payment Details
                </h2>

                {payment.method === 'card' ? (
                  <div className="space-y-4">
                    <ValidatedInput
                      id="nameOnCard"
                      label="Name on Card"
                      value={payment.nameOnCard || ''}
                      onChange={(e) => handlePaymentChange('nameOnCard', e.target.value)}
                      error={errors.nameOnCard}
                      required
                      autoComplete="cc-name"
                    />

                    <ValidatedInput
                      id="cardNumber"
                      label="Card Number"
                      value={payment.cardNumber || ''}
                      onChange={(e) => handlePaymentChange('cardNumber', formatCardNumber(e.target.value))}
                      error={errors.cardNumber}
                      icon={CreditCard}
                      required
                      autoComplete="cc-number"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <ValidatedInput
                        id="expiry"
                        label="Expiry Date"
                        value={payment.expiry || ''}
                        onChange={(e) => handlePaymentChange('expiry', formatExpiry(e.target.value))}
                        error={errors.expiry}
                        required
                        autoComplete="cc-exp"
                        placeholder="MM/YY"
                        maxLength={5}
                      />

                      <ValidatedInput
                        id="cvv"
                        label="CVV"
                        value={payment.cvv || ''}
                        onChange={(e) => handlePaymentChange('cvv', e.target.value.replace(/\D/g, '').substr(0, 4))}
                        error={errors.cvv}
                        required
                        autoComplete="cc-csc"
                        placeholder="123"
                        maxLength={4}
                        type="password"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="saveCard"
                        checked={payment.savePaymentInfo}
                        onCheckedChange={(checked) => handlePaymentChange('savePaymentInfo', checked as boolean)}
                      />
                      <label htmlFor="saveCard" className="text-sm text-sage-600 cursor-pointer">
                        Save card for future purchases
                      </label>
                    </div>

                    {/* Security assurance */}
                    <div className="flex items-center gap-2 text-sm text-sage-500 mt-4">
                      <Lock weight="fill" className="w-4 h-4 text-green-600" />
                      Your payment info is encrypted with 256-bit SSL
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-sage-50 rounded-lg">
                    <CheckCircle weight="fill" className="w-12 h-12 mx-auto text-green-600 mb-3" />
                    <p className="font-medium text-sage-800 mb-2">
                      {payment.method === 'paypal' && 'PayPal selected'}
                      {payment.method === 'apple-pay' && 'Apple Pay selected'}
                      {payment.method === 'google-pay' && 'Google Pay selected'}
                    </p>
                    <p className="text-sm text-sage-600">
                      You'll be redirected to complete payment after review
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setPayment(prev => ({ ...prev, method: 'card' }))}
                      className="mt-4"
                    >
                      Use credit card instead
                    </Button>
                  </div>
                )}
              </div>

              {/* Review Section */}
              <div 
                ref={reviewRef}
                data-section="review"
                className="bg-white rounded-xl shadow-sm border border-sage-200 p-6 mt-6"
              >
                <h2 className="text-xl font-semibold text-sage-900 mb-6 flex items-center gap-2">
                  <CheckCircle weight="duotone" className="w-6 h-6 text-sage-600" />
                  Review & Complete
                </h2>

                {/* Create Account Option */}
                <div className="p-4 bg-sage-50 rounded-lg border border-sage-200 mb-6">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="createAccount"
                      checked={createAccount}
                      onCheckedChange={(checked) => setCreateAccount(checked as boolean)}
                    />
                    <div>
                      <label htmlFor="createAccount" className="font-medium text-sage-800 cursor-pointer">
                        Create an account for faster checkout
                      </label>
                      <p className="text-sm text-sage-600">
                        Track your order, save favorites, and check out faster next time
                      </p>
                    </div>
                  </div>
                </div>

                {/* Trust Signals */}
                <TrustSignalsBar />

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full mt-6 h-14 text-lg font-semibold bg-sage-600 hover:bg-sage-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Lock weight="fill" />
                      Complete Order • ${totals.total.toFixed(2)}
                      <ArrowRight />
                    </span>
                  )}
                </Button>

                <p className="text-xs text-center text-sage-500 mt-4">
                  By completing this order, you agree to our{' '}
                  <a href="#" className="underline hover:text-sage-700">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="underline hover:text-sage-700">Privacy Policy</a>
                </p>
              </div>
            </form>
          </div>

          {/* Order Summary Sidebar (Desktop) */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Mobile: Collapsible */}
              <div className="lg:hidden">
                <OrderSummary
                  items={items}
                  totals={totals}
                  discountCode={discountCode}
                  discountPercentage={discountPercentage}
                  shippingOption={shippingOption}
                  isCollapsible
                />
              </div>

              {/* Desktop: Always visible */}
              <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-sage-200 p-6">
                <h2 className="text-lg font-semibold text-sage-900 mb-4">Order Summary</h2>
                <OrderSummary
                  items={items}
                  totals={totals}
                  discountCode={discountCode}
                  discountPercentage={discountPercentage}
                  shippingOption={shippingOption}
                />
              </div>

              {/* Desktop Trust Signals */}
              <div className="hidden lg:block">
                <TrustSignalsBar />
              </div>

              {/* Customer Support */}
              <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-sage-200 p-4">
                <div className="flex items-center gap-3">
                  <Heart weight="fill" className="w-8 h-8 text-sage-600" />
                  <div>
                    <p className="font-medium text-sage-800">Need Help?</p>
                    <p className="text-sm text-sage-600">support@interlock.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OnePageCheckout

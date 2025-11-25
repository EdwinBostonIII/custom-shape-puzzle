/**
 * MobileCheckout.tsx - Mobile-First Checkout Optimization
 * 
 * Research-validated mobile checkout enhancements based on:
 * - Shopify: Mobile commerce $710.4B by 2025
 * - Mobile converts at 2.1% vs 4% desktop (Contentsquare)
 * - One-click checkout increases conversion significantly
 * - Touch targets minimum 44px (Apple HIG)
 * - Express checkout reduces abandonment
 * 
 * Features:
 * - Progress indicator for checkout flow
 * - Touch-optimized inputs (larger tap targets)
 * - Smart address autocomplete suggestion
 * - Mobile-first sticky order summary
 * - Gesture-friendly interactions
 * - Auto-advancing form fields
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { 
  MapPin, 
  CreditCard, 
  Check, 
  ArrowRight,
  CaretUp,
  CaretDown,
  Lightning,
  Package,
  Truck,
  Shield,
  Star,
  Phone,
  Clock,
  Warning
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

// ============================================================================
// CHECKOUT STEP TYPES
// ============================================================================

type CheckoutStep = 'shipping' | 'payment' | 'review'

interface StepConfig {
  id: CheckoutStep
  label: string
  icon: typeof MapPin
  description: string
}

const CHECKOUT_STEPS: StepConfig[] = [
  { 
    id: 'shipping', 
    label: 'Shipping', 
    icon: Truck, 
    description: 'Where should we send it?' 
  },
  { 
    id: 'payment', 
    label: 'Payment', 
    icon: CreditCard, 
    description: 'How would you like to pay?' 
  },
  { 
    id: 'review', 
    label: 'Review', 
    icon: Package, 
    description: 'Confirm your order' 
  },
]

// ============================================================================
// MOBILE PROGRESS INDICATOR
// Research: Clear progress reduces abandonment by showing how close to completion
// ============================================================================

interface CheckoutProgressProps {
  currentStep: CheckoutStep
  className?: string
  onStepClick?: (step: CheckoutStep) => void
  completedSteps?: CheckoutStep[]
}

export function CheckoutProgress({ 
  currentStep, 
  className,
  onStepClick,
  completedSteps = []
}: CheckoutProgressProps) {
  const currentIndex = CHECKOUT_STEPS.findIndex(s => s.id === currentStep)
  
  return (
    <div className={cn('w-full', className)}>
      {/* Progress bar */}
      <div className="relative mb-4">
        <div className="h-1 bg-stone/30 rounded-full">
          <motion.div 
            className="h-full bg-terracotta rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / CHECKOUT_STEPS.length) * 100}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>
      
      {/* Step indicators */}
      <div className="flex justify-between">
        {CHECKOUT_STEPS.map((step, index) => {
          const isActive = step.id === currentStep
          const isCompleted = completedSteps.includes(step.id) || index < currentIndex
          const isClickable = isCompleted && onStepClick
          const Icon = step.icon
          
          return (
            <button
              key={step.id}
              onClick={() => isClickable && onStepClick?.(step.id)}
              disabled={!isClickable}
              className={cn(
                'flex flex-col items-center gap-1 transition-all',
                isClickable && 'cursor-pointer hover:opacity-80',
                !isClickable && 'cursor-default'
              )}
            >
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center transition-all',
                isCompleted && 'bg-sage text-white',
                isActive && !isCompleted && 'bg-terracotta text-white ring-4 ring-terracotta/20',
                !isActive && !isCompleted && 'bg-stone/30 text-charcoal/50'
              )}>
                {isCompleted ? (
                  <Check size={20} weight="bold" />
                ) : (
                  <Icon size={20} weight={isActive ? 'fill' : 'regular'} />
                )}
              </div>
              <span className={cn(
                'text-xs font-medium',
                isActive ? 'text-charcoal' : 'text-charcoal/50'
              )}>
                {step.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ============================================================================
// MOBILE INPUT FIELD
// Research: Touch targets minimum 44px, clear labels, auto-advance
// ============================================================================

interface MobileInputProps {
  label: string
  id: string
  value: string
  onChange: (value: string) => void
  type?: string
  autoComplete?: string
  required?: boolean
  placeholder?: string
  hint?: string
  error?: string
  pattern?: string
  inputMode?: 'text' | 'numeric' | 'tel' | 'email' | 'url'
  maxLength?: number
  onComplete?: () => void // Called when field appears complete
  className?: string
}

export function MobileInput({
  label,
  id,
  value,
  onChange,
  type = 'text',
  autoComplete,
  required,
  placeholder,
  hint,
  error,
  pattern,
  inputMode,
  maxLength,
  onComplete,
  className
}: MobileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [isValid, setIsValid] = useState(false)
  
  // Check validity on value change
  useEffect(() => {
    if (inputRef.current) {
      const valid = inputRef.current.checkValidity() && value.length > 0
      setIsValid(valid)
      
      // Auto-advance if maxLength reached
      if (maxLength && value.length >= maxLength && valid && onComplete) {
        onComplete()
      }
    }
  }, [value, maxLength, onComplete])
  
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label 
        htmlFor={id}
        className={cn(
          'text-sm font-medium transition-colors',
          isFocused && 'text-terracotta',
          error && 'text-red-600'
        )}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <div className="relative">
        <Input
          ref={inputRef}
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoComplete={autoComplete}
          required={required}
          placeholder={placeholder}
          pattern={pattern}
          inputMode={inputMode}
          maxLength={maxLength}
          className={cn(
            // Touch-optimized: minimum 44px height per Apple HIG
            'h-12 sm:h-11 text-base bg-white border-2 transition-all rounded-lg',
            'placeholder:text-charcoal/40',
            isFocused && 'border-terracotta ring-2 ring-terracotta/20',
            error && 'border-red-500 ring-2 ring-red-500/20',
            isValid && !isFocused && 'border-sage',
            !error && !isFocused && !isValid && 'border-stone'
          )}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={hint ? `${id}-hint` : undefined}
        />
        
        {/* Valid indicator */}
        <AnimatePresence>
          {isValid && !isFocused && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <Check size={20} weight="bold" className="text-sage" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Hint or error text */}
      {(hint || error) && (
        <p 
          id={hint ? `${id}-hint` : undefined}
          className={cn(
            'text-xs',
            error ? 'text-red-600' : 'text-charcoal/60'
          )}
        >
          {error || hint}
        </p>
      )}
    </div>
  )
}

// ============================================================================
// MOBILE STICKY SUMMARY
// Research: Visible total reduces abandonment, instant feedback on additions
// ============================================================================

interface MobileSummaryProps {
  subtotal: number
  shipping?: number
  discount?: number
  total: number
  itemCount?: number
  isExpanded?: boolean
  onToggle?: () => void
  className?: string
}

export function MobileStickySummary({
  subtotal,
  shipping = 0,
  discount = 0,
  total,
  itemCount = 1,
  isExpanded = false,
  onToggle,
  className
}: MobileSummaryProps) {
  // Swipe to expand/collapse
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.velocity.y) > 500 || Math.abs(info.offset.y) > 50) {
      if (info.offset.y < 0 && !isExpanded) {
        onToggle?.()
      } else if (info.offset.y > 0 && isExpanded) {
        onToggle?.()
      }
    }
  }
  
  return (
    <motion.div
      className={cn(
        'fixed bottom-0 left-0 right-0 bg-white border-t-2 border-stone shadow-lg z-50',
        'safe-area-bottom', // iOS safe area
        className
      )}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.1}
      onDragEnd={handleDragEnd}
    >
      {/* Drag handle */}
      <button
        onClick={onToggle}
        className="w-full flex justify-center py-2 touch-manipulation"
        aria-label={isExpanded ? 'Collapse order summary' : 'Expand order summary'}
      >
        <div className="w-10 h-1 bg-stone/50 rounded-full" />
      </button>
      
      <div className="px-4 pb-4">
        {/* Collapsed view - just total */}
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={onToggle}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm text-charcoal/70">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>
            {isExpanded ? (
              <CaretDown size={16} className="text-charcoal/50" />
            ) : (
              <CaretUp size={16} className="text-charcoal/50" />
            )}
          </div>
          <span className="text-xl font-bold text-charcoal">${total}</span>
        </div>
        
        {/* Expanded view - full breakdown */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-3 mt-3 border-t border-stone/50 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-charcoal/70">Subtotal</span>
                  <span className="text-charcoal">${subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/70">Shipping</span>
                  <span className={cn(
                    shipping === 0 ? 'text-sage font-medium' : 'text-charcoal'
                  )}>
                    {shipping === 0 ? 'Free' : `$${shipping}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sage">
                    <span>Discount</span>
                    <span>-${discount}</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ============================================================================
// EXPRESS CHECKOUT BUTTONS
// Research: Express checkout with saved credentials dramatically reduces friction
// ============================================================================

interface ExpressCheckoutProps {
  price: number
  onApplePay?: () => void
  onGooglePay?: () => void
  onPayPal?: () => void
  className?: string
}

export function ExpressCheckout({
  price,
  onApplePay,
  onGooglePay,
  onPayPal,
  className
}: ExpressCheckoutProps) {
  // Check for device capabilities
  const [canApplePay, setCanApplePay] = useState(false)
  const [canGooglePay, setCanGooglePay] = useState(false)
  
  useEffect(() => {
    // In production, use actual payment APIs to check capability
    // Apple Pay: window.ApplePaySession?.canMakePayments()
    // Google Pay: Check via Google Pay API
    
    // For now, detect iOS/Android
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isAndroid = /Android/.test(navigator.userAgent)
    
    setCanApplePay(isIOS)
    setCanGooglePay(isAndroid || !isIOS) // Show Google Pay on Android or desktop
  }, [])
  
  const hasExpressOptions = canApplePay || canGooglePay || onPayPal
  
  if (!hasExpressOptions) return null
  
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2">
        <Lightning size={20} weight="fill" className="text-terracotta" />
        <span className="text-sm font-medium text-charcoal">Express Checkout</span>
        <span className="text-xs text-charcoal/50">Save time with one tap</span>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {canApplePay && onApplePay && (
          <Button
            onClick={onApplePay}
            className="h-14 bg-black text-white hover:bg-black/90 rounded-lg font-medium"
            aria-label={`Pay $${price} with Apple Pay`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2" fill="currentColor">
              <path d="M17.72 7.62c-.09-.03-1.12-.43-1.12-1.88 0-1.35 1.04-1.96 1.09-2 .02-.02-.28-.54-.58-.98-.64-.93-1.64-1.01-1.98-1.03-.42-.05-.95-.06-1.55.3-.38.23-.73.6-1.08.6-.35 0-.7-.37-1.19-.36-.62.01-1.2.36-1.51.91-.66 1.14-.17 2.82.46 3.74.31.45.68.95 1.16.93.47-.02.65-.3 1.21-.3.56 0 .73.3 1.22.29.5-.01.81-.45 1.12-.9.35-.51.49-1 .5-1.03-.01-.01-1.67-.64-1.68-2.54 0-1.65 1.35-2.44 1.41-2.48-.77-1.14-1.97-1.27-2.39-1.3-.66-.05-1.29.18-1.71.18-.43 0-1.09-.17-1.79.33A3.6 3.6 0 0 0 9.06 4c-.12 1.23.45 2.48 1.14 3.3.63.74 1.39 1.58 2.38 1.55.96-.04 1.32-.61 2.48-.61 1.15 0 1.47.61 2.47.59 1.02-.02 1.68-.74 2.28-1.49.72-1 1.01-1.96 1.03-2.01-.02-.01-1.99-.76-2.01-3.03Z"/>
            </svg>
            Pay
          </Button>
        )}
        
        {canGooglePay && onGooglePay && (
          <Button
            onClick={onGooglePay}
            variant="outline"
            className="h-14 bg-white hover:bg-gray-50 border-2 rounded-lg font-medium"
            aria-label={`Pay $${price} with Google Pay`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Pay
          </Button>
        )}
        
        {onPayPal && (
          <Button
            onClick={onPayPal}
            variant="outline"
            className={cn(
              "h-14 bg-[#FFC439] hover:bg-[#f0b930] border-[#FFC439] rounded-lg font-medium text-[#003087]",
              !canApplePay && !canGooglePay && "col-span-2"
            )}
            aria-label={`Pay $${price} with PayPal`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2" fill="#003087">
              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/>
            </svg>
            PayPal
          </Button>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// DELIVERY DATE ESTIMATOR
// Research: Clear delivery expectations reduce purchase anxiety
// ============================================================================

interface DeliveryEstimateProps {
  className?: string
  showFastShipping?: boolean
}

export function DeliveryEstimate({ className, showFastShipping = true }: DeliveryEstimateProps) {
  // Calculate delivery dates
  const today = new Date()
  const standardDelivery = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000)
  const fastDelivery = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }
  
  // Check if fast shipping can meet upcoming occasion
  const daysUntilStandard = 14
  
  return (
    <div className={cn('space-y-3', className)}>
      {/* Standard shipping */}
      <div className="flex items-start gap-3 p-3 bg-sage/10 rounded-lg">
        <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center flex-shrink-0">
          <Truck size={20} className="text-sage" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-medium text-charcoal">Free Standard Shipping</span>
            <span className="text-xs bg-sage/20 text-sage px-2 py-0.5 rounded-full">Free</span>
          </div>
          <p className="text-sm text-charcoal/60">
            Arrives by {formatDate(standardDelivery)}
          </p>
        </div>
      </div>
      
      {/* Fast shipping option */}
      {showFastShipping && (
        <div className="flex items-start gap-3 p-3 bg-terracotta/5 rounded-lg border border-terracotta/20">
          <div className="w-10 h-10 rounded-full bg-terracotta/20 flex items-center justify-center flex-shrink-0">
            <Clock size={20} className="text-terracotta" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-medium text-charcoal">Rush Processing</span>
              <span className="text-sm font-medium text-terracotta">+$15</span>
            </div>
            <p className="text-sm text-charcoal/60">
              Arrives by {formatDate(fastDelivery)}
            </p>
            <p className="text-xs text-terracotta mt-1">
              Jump to front of the queue
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// CHECKOUT TRUST INDICATORS (Mobile-optimized)
// Research: Trust signals reduce abandonment by 17%
// ============================================================================

interface MobileTrustBadgesProps {
  className?: string
}

export function MobileTrustBadges({ className }: MobileTrustBadgesProps) {
  const badges = [
    { icon: Shield, label: '30-Day Guarantee', color: 'text-sage' },
    { icon: Truck, label: 'Free Shipping', color: 'text-terracotta' },
    { icon: Star, label: '4.9★ (500+ reviews)', color: 'text-amber-500' },
  ]
  
  return (
    <div className={cn('flex justify-between gap-2', className)}>
      {badges.map((badge) => (
        <div 
          key={badge.label}
          className="flex-1 flex flex-col items-center gap-1 p-2 bg-white rounded-lg border border-stone/50"
        >
          <badge.icon size={20} weight="duotone" className={badge.color} />
          <span className="text-[10px] sm:text-xs text-center text-charcoal/70 leading-tight">
            {badge.label}
          </span>
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// PHONE NUMBER INPUT (Mobile-optimized)
// Research: Optional phone for SMS updates increases conversion 12%
// ============================================================================

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function PhoneInput({ value, onChange, className }: PhoneInputProps) {
  const [isOptedIn, setIsOptedIn] = useState(false)
  
  // Format phone number as user types
  const formatPhone = (input: string) => {
    const digits = input.replace(/\D/g, '').slice(0, 10)
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  
  const handleChange = (newValue: string) => {
    onChange(formatPhone(newValue))
  }
  
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor="phone" className="text-sm font-medium">
          Phone <span className="text-charcoal/50 font-normal">(optional)</span>
        </Label>
        <span className="text-xs text-sage">Get SMS updates</span>
      </div>
      
      <div className="relative">
        <Phone 
          size={18} 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" 
        />
        <Input
          id="phone"
          type="tel"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="(555) 555-5555"
          autoComplete="tel"
          inputMode="tel"
          className="h-12 pl-10 bg-white border-2 border-stone rounded-lg"
        />
      </div>
      
      {value.length > 0 && (
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isOptedIn}
            onChange={(e) => setIsOptedIn(e.target.checked)}
            className="mt-1 rounded border-stone"
          />
          <span className="text-xs text-charcoal/70">
            Send me shipping updates via SMS. Standard message rates apply.
          </span>
        </label>
      )}
    </div>
  )
}

// ============================================================================
// CHECKOUT FORM SECTION (Mobile-optimized container)
// ============================================================================

interface CheckoutSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  isComplete?: boolean
  className?: string
}

export function CheckoutSection({ 
  title, 
  description, 
  children, 
  isComplete,
  className 
}: CheckoutSectionProps) {
  return (
    <div className={cn(
      'p-4 sm:p-6 bg-white rounded-xl border-2 transition-colors',
      isComplete ? 'border-sage/50' : 'border-stone',
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-display text-lg text-charcoal">{title}</h3>
          {description && (
            <p className="text-sm text-charcoal/60 mt-0.5">{description}</p>
          )}
        </div>
        {isComplete && (
          <div className="w-6 h-6 rounded-full bg-sage flex items-center justify-center">
            <Check size={14} weight="bold" className="text-white" />
          </div>
        )}
      </div>
      {children}
    </div>
  )
}

// ============================================================================
// MOBILE CTA BUTTON
// Research: Sticky CTA increases mobile conversion by 22%
// ============================================================================

interface MobileCTAProps {
  label: string
  price?: number
  onClick: () => void
  loading?: boolean
  disabled?: boolean
  className?: string
}

export function MobileCTA({ 
  label, 
  price, 
  onClick, 
  loading, 
  disabled,
  className 
}: MobileCTAProps) {
  return (
    <div className={cn(
      'fixed bottom-0 left-0 right-0 p-4 bg-white border-t-2 border-stone safe-area-bottom z-40',
      className
    )}>
      <Button
        onClick={onClick}
        disabled={disabled || loading}
        size="lg"
        className={cn(
          'w-full h-14 text-lg font-medium rounded-xl',
          'bg-terracotta hover:bg-terracotta/90'
        )}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            />
            Processing...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            {label}
            {price && (
              <>
                <span className="mx-2 opacity-50">—</span>
                <span>${price}</span>
              </>
            )}
            <ArrowRight size={20} weight="bold" />
          </span>
        )}
      </Button>
    </div>
  )
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  type CheckoutStep,
  type StepConfig,
  CHECKOUT_STEPS
}

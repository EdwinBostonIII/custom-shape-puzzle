/**
 * Exit-Intent Popup System
 * 
 * Research-backed implementation based on:
 * - OptiMonk: Cart abandonment popups convert at 17.12% average
 * - BigCommerce: 70% checkout abandonment rate industry average
 * - CXL Research: PayPal/Norton trust badges most recognized
 * - Exit popup strategies: countdown timers, segmentation, opt-out framing
 * 
 * Key strategies implemented:
 * 1. Segment visitors (new vs returning, cart vs browsing)
 * 2. Countdown timers increase urgency (15.05% conversion - Kiss My Keto)
 * 3. "Wait" headline grabs attention (+40% engagement)
 * 4. Opt-out framing increases conversions 30-40%
 * 5. Delay X button appearance for engagement
 * 6. Auto-apply discount codes at checkout
 */

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Gift, 
  Clock, 
  ShieldCheck, 
  Heart, 
  Sparkle,
  ArrowRight,
  Tag,
  Package,
  Timer,
  CheckCircle,
  Star
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { trackEvent } from '@/lib/analytics'

// ============================================================================
// Types
// ============================================================================

interface ExitIntentPopupProps {
  /** Current cart value for dynamic offers */
  cartValue?: number
  /** Whether user has items in cart */
  hasCartItems?: boolean
  /** Current funnel step for segmentation */
  currentStep?: string
  /** Whether user is first time visitor */
  isFirstTimeVisitor?: boolean
  /** Callback when discount is claimed */
  onDiscountClaim?: (code: string, percentage: number) => void
  /** Callback when email is captured */
  onEmailCapture?: (email: string) => void
  /** Callback when feedback is submitted */
  onFeedbackSubmit?: (feedback: string, reason: string) => void
  /** Whether exit intent is enabled */
  enabled?: boolean
}

interface CountdownTimerProps {
  initialMinutes: number
  onExpire: () => void
}

type PopupVariant = 
  | 'discount' 
  | 'free-shipping' 
  | 'cart-reminder' 
  | 'email-capture' 
  | 'feedback' 
  | 'limited-time'

type ExitReason = 
  | 'price-concern'
  | 'browsing'
  | 'timing'
  | 'shipping'
  | 'comparison'
  | 'other'

// ============================================================================
// Constants
// ============================================================================

const DISCOUNT_CODE = 'STAYWITHUS15'
const DISCOUNT_PERCENTAGE = 15
const FREE_SHIPPING_THRESHOLD = 99
const COUNTDOWN_MINUTES = 15

const EXIT_REASONS: { id: ExitReason; label: string; icon: React.ElementType }[] = [
  { id: 'price-concern', label: 'Price is too high', icon: Tag },
  { id: 'browsing', label: 'Just browsing for now', icon: Heart },
  { id: 'timing', label: 'Not the right time', icon: Clock },
  { id: 'shipping', label: 'Shipping costs/time', icon: Package },
  { id: 'comparison', label: 'Comparing options', icon: Star },
  { id: 'other', label: 'Other reason', icon: Sparkle },
]

// ============================================================================
// Countdown Timer Component
// ============================================================================

function CountdownTimer({ initialMinutes, onExpire }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60)

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire()
      return
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [timeLeft, onExpire])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg">
      <Timer weight="fill" className="w-5 h-5 animate-pulse" />
      <span className="font-mono font-bold text-lg">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
      <span className="text-sm text-amber-700">remaining</span>
    </div>
  )
}

// ============================================================================
// Discount Offer Popup
// ============================================================================

interface DiscountPopupProps {
  onClaim: (email: string) => void
  onDismiss: () => void
  showCloseButton: boolean
}

function DiscountPopup({ onClaim, onDismiss, showCloseButton }: DiscountPopupProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [timerExpired, setTimerExpired] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    
    setIsSubmitting(false)
    setShowSuccess(true)
    onClaim(email)

    trackEvent('exit_intent_discount_claimed', {
      email: email.split('@')[1], // Domain only for privacy
      discountCode: DISCOUNT_CODE,
      discountPercentage: DISCOUNT_PERCENTAGE
    })
  }

  if (showSuccess) {
    return (
      <div className="text-center space-y-4 py-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto"
        >
          <CheckCircle weight="fill" className="w-10 h-10 text-green-600" />
        </motion.div>
        <h3 className="text-xl font-semibold text-sage-900">
          Your discount is ready!
        </h3>
        <div className="bg-sage-50 border-2 border-dashed border-sage-300 rounded-lg px-6 py-4">
          <p className="text-sm text-sage-600 mb-1">Use code at checkout:</p>
          <p className="text-2xl font-mono font-bold text-sage-800 tracking-wider">
            {DISCOUNT_CODE}
          </p>
        </div>
        <p className="text-sm text-sage-600">
          Code copied to clipboard and sent to your email
        </p>
        <Button onClick={onDismiss} className="w-full">
          Continue Shopping
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Attention-grabbing headline with "Wait" */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl font-bold text-sage-800"
        >
          Wait! 🎁
        </motion.div>
        <h3 className="text-xl font-semibold text-sage-900">
          Don't leave empty-handed
        </h3>
        <p className="text-sage-600">
          Get <span className="font-bold text-sage-800">{DISCOUNT_PERCENTAGE}% off</span> your 
          custom puzzle — a one-time offer just for you
        </p>
      </div>

      {/* Countdown Timer for urgency */}
      {!timerExpired && (
        <div className="flex justify-center">
          <CountdownTimer 
            initialMinutes={COUNTDOWN_MINUTES} 
            onExpire={() => setTimerExpired(true)}
          />
        </div>
      )}

      {timerExpired && (
        <div className="text-center text-red-600 text-sm font-medium">
          Offer expired — but we'll still save your progress!
        </div>
      )}

      {/* Email Capture Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="exit-email" className="sr-only">Email address</Label>
          <Input
            id="exit-email"
            type="email"
            placeholder="Enter your email for the discount"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="text-center"
            disabled={timerExpired}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-sage-600 hover:bg-sage-700 text-white font-semibold py-3"
          disabled={isSubmitting || timerExpired}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
              Unlocking...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Gift weight="fill" />
              Unlock My {DISCOUNT_PERCENTAGE}% Discount
              <ArrowRight />
            </span>
          )}
        </Button>
      </form>

      {/* Opt-out with strategic framing */}
      <button
        onClick={onDismiss}
        className="w-full text-center text-sm text-sage-500 hover:text-sage-700 transition-colors py-2"
      >
        No thanks, I'd rather pay full price
      </button>

      {/* Trust signals */}
      <div className="flex items-center justify-center gap-4 text-xs text-sage-500 pt-2 border-t border-sage-100">
        <div className="flex items-center gap-1">
          <ShieldCheck weight="fill" className="w-4 h-4 text-green-600" />
          <span>Secure checkout</span>
        </div>
        <div className="flex items-center gap-1">
          <Package weight="fill" className="w-4 h-4 text-sage-600" />
          <span>Free shipping over ${FREE_SHIPPING_THRESHOLD}</span>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Cart Reminder Popup
// ============================================================================

interface CartReminderPopupProps {
  cartValue: number
  onContinue: () => void
  onDismiss: () => void
  showCloseButton: boolean
}

function CartReminderPopup({ cartValue, onContinue, onDismiss, showCloseButton }: CartReminderPopupProps) {
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartValue)
  const hasQualifiedForFreeShipping = amountToFreeShipping <= 0

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl font-bold text-sage-800"
        >
          Wait! 💝
        </motion.div>
        <h3 className="text-xl font-semibold text-sage-900">
          Your puzzle is waiting
        </h3>
        <p className="text-sage-600">
          Don't leave all that creativity behind!
        </p>
      </div>

      {/* Cart summary */}
      <div className="bg-sage-50 rounded-lg p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sage-600">Cart total:</span>
          <span className="font-semibold text-sage-800">${cartValue.toFixed(2)}</span>
        </div>
        
        {!hasQualifiedForFreeShipping && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-sage-500">Add ${amountToFreeShipping.toFixed(2)} for free shipping!</span>
            </div>
            <div className="h-2 bg-sage-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-sage-600"
                initial={{ width: 0 }}
                animate={{ width: `${(cartValue / FREE_SHIPPING_THRESHOLD) * 100}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}

        {hasQualifiedForFreeShipping && (
          <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
            <CheckCircle weight="fill" className="w-4 h-4" />
            You've unlocked free shipping!
          </div>
        )}
      </div>

      {/* Special offer for cart abandoners */}
      <div className="border border-amber-200 bg-amber-50 rounded-lg p-3 text-center">
        <p className="text-sm text-amber-800">
          <Sparkle weight="fill" className="inline w-4 h-4 mr-1" />
          Complete your order now and get <strong>free gift wrapping</strong>!
        </p>
      </div>

      {/* CTAs */}
      <div className="space-y-2">
        <Button 
          onClick={onContinue}
          className="w-full bg-sage-600 hover:bg-sage-700 font-semibold py-3"
        >
          <span className="flex items-center gap-2">
            Complete My Order
            <ArrowRight />
          </span>
        </Button>
        
        <button
          onClick={onDismiss}
          className="w-full text-center text-sm text-sage-500 hover:text-sage-700 transition-colors py-2"
        >
          I'll come back later
        </button>
      </div>

      {/* Progress saving message */}
      <p className="text-xs text-center text-sage-500">
        Don't worry — we'll save your progress for 30 days
      </p>
    </div>
  )
}

// ============================================================================
// Feedback Popup (for understanding exit reasons)
// ============================================================================

interface FeedbackPopupProps {
  onSubmit: (reason: ExitReason, feedback: string) => void
  onDismiss: () => void
  showCloseButton: boolean
}

function FeedbackPopup({ onSubmit, onDismiss, showCloseButton }: FeedbackPopupProps) {
  const [selectedReason, setSelectedReason] = useState<ExitReason | null>(null)
  const [feedback, setFeedback] = useState('')
  const [showThankYou, setShowThankYou] = useState(false)

  const handleSubmit = () => {
    if (!selectedReason) return
    
    trackEvent('exit_feedback_submitted', {
      reason: selectedReason,
      hasFeedback: feedback.length > 0
    })

    onSubmit(selectedReason, feedback)
    setShowThankYou(true)
    
    // Auto-close after thank you
    setTimeout(onDismiss, 2000)
  }

  if (showThankYou) {
    return (
      <div className="text-center space-y-4 py-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto"
        >
          <Heart weight="fill" className="w-10 h-10 text-sage-600" />
        </motion.div>
        <h3 className="text-xl font-semibold text-sage-900">
          Thank you for your feedback!
        </h3>
        <p className="text-sage-600">
          It helps us create better experiences for everyone.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-sage-900">
          Before you go...
        </h3>
        <p className="text-sage-600">
          Could you tell us why you're leaving? It helps us improve.
        </p>
      </div>

      {/* Reason selection */}
      <div className="grid grid-cols-2 gap-2">
        {EXIT_REASONS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSelectedReason(id)}
            className={`
              flex items-center gap-2 p-3 rounded-lg border-2 transition-all text-left text-sm
              ${selectedReason === id 
                ? 'border-sage-600 bg-sage-50 text-sage-800' 
                : 'border-sage-200 hover:border-sage-300 text-sage-600'
              }
            `}
          >
            <Icon weight={selectedReason === id ? 'fill' : 'regular'} className="w-5 h-5 flex-shrink-0" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Optional feedback */}
      {selectedReason === 'other' && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
        >
          <textarea
            placeholder="Tell us more (optional)"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full p-3 border border-sage-200 rounded-lg resize-none h-20 text-sm"
          />
        </motion.div>
      )}

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={!selectedReason}
        className="w-full"
      >
        Submit Feedback
      </Button>

      <button
        onClick={onDismiss}
        className="w-full text-center text-sm text-sage-500 hover:text-sage-700 transition-colors"
      >
        Skip
      </button>
    </div>
  )
}

// ============================================================================
// Main Exit Intent Popup
// ============================================================================

export function ExitIntentPopup({
  cartValue = 0,
  hasCartItems = false,
  currentStep = 'browsing',
  isFirstTimeVisitor = true,
  onDiscountClaim,
  onEmailCapture,
  onFeedbackSubmit,
  enabled = true
}: ExitIntentPopupProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showCloseButton, setShowCloseButton] = useState(false)
  const [popupVariant, setPopupVariant] = useState<PopupVariant>('discount')
  const [hasShownPopup, setHasShownPopup] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)
  const closeButtonDelay = useRef<NodeJS.Timeout | null>(null)

  // Determine which popup variant to show based on user context
  const determineVariant = useCallback((): PopupVariant => {
    // Cart abandoners get cart reminder
    if (hasCartItems && currentStep !== 'home') {
      return 'cart-reminder'
    }
    
    // First-time visitors who haven't made progress get discount
    if (isFirstTimeVisitor && currentStep === 'home') {
      return 'discount'
    }

    // Returning visitors who are browsing get feedback
    if (!isFirstTimeVisitor && currentStep === 'home') {
      return 'feedback'
    }

    // Default to discount for engaged but leaving users
    return 'discount'
  }, [hasCartItems, currentStep, isFirstTimeVisitor])

  // Exit intent detection
  useEffect(() => {
    if (!enabled || hasShownPopup) return

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse moves to top of viewport (about to close/navigate away)
      if (e.clientY <= 5 && e.relatedTarget === null) {
        setPopupVariant(determineVariant())
        setIsVisible(true)
        setHasShownPopup(true)

        trackEvent('exit_intent_triggered', {
          variant: determineVariant(),
          currentStep,
          cartValue,
          hasCartItems
        })

        // Delay showing close button (research shows 20-30% higher conversion)
        closeButtonDelay.current = setTimeout(() => {
          setShowCloseButton(true)
        }, 3000)
      }
    }

    // Mobile detection: back button or tab switch
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !hasShownPopup) {
        // User is switching tabs or using back button
        setPopupVariant(determineVariant())
        setIsVisible(true)
        setHasShownPopup(true)
        setShowCloseButton(true) // Show immediately on mobile
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (closeButtonDelay.current) {
        clearTimeout(closeButtonDelay.current)
      }
    }
  }, [enabled, hasShownPopup, determineVariant, currentStep, cartValue, hasCartItems])

  // Handle dismiss
  const handleDismiss = useCallback(() => {
    setIsVisible(false)
    trackEvent('exit_intent_dismissed', { variant: popupVariant })
  }, [popupVariant])

  // Handle discount claim
  const handleDiscountClaim = useCallback((email: string) => {
    onEmailCapture?.(email)
    onDiscountClaim?.(DISCOUNT_CODE, DISCOUNT_PERCENTAGE)
    
    // Copy code to clipboard
    navigator.clipboard.writeText(DISCOUNT_CODE).catch(() => {
      // Fallback for browsers without clipboard API
    })
  }, [onDiscountClaim, onEmailCapture])

  // Handle cart continue
  const handleCartContinue = useCallback(() => {
    setIsVisible(false)
    trackEvent('exit_intent_cart_continued', { cartValue })
  }, [cartValue])

  // Handle feedback submit
  const handleFeedbackSubmit = useCallback((reason: ExitReason, feedback: string) => {
    onFeedbackSubmit?.(feedback, reason)
  }, [onFeedbackSubmit])

  // Click outside to close (only if close button is showing)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showCloseButton && popupRef.current && !popupRef.current.contains(e.target as Node)) {
        handleDismiss()
      }
    }

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isVisible, showCloseButton, handleDismiss])

  // Prevent scroll when popup is visible
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isVisible])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            ref={popupRef}
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 10, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
          >
            {/* Close button with delayed appearance */}
            <AnimatePresence>
              {showCloseButton && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={handleDismiss}
                  className="absolute top-4 right-4 text-sage-400 hover:text-sage-600 transition-colors p-1"
                  aria-label="Close popup"
                >
                  <X weight="bold" className="w-5 h-5" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Popup content based on variant */}
            {popupVariant === 'discount' && (
              <DiscountPopup
                onClaim={handleDiscountClaim}
                onDismiss={handleDismiss}
                showCloseButton={showCloseButton}
              />
            )}

            {popupVariant === 'cart-reminder' && (
              <CartReminderPopup
                cartValue={cartValue}
                onContinue={handleCartContinue}
                onDismiss={handleDismiss}
                showCloseButton={showCloseButton}
              />
            )}

            {popupVariant === 'feedback' && (
              <FeedbackPopup
                onSubmit={handleFeedbackSubmit}
                onDismiss={handleDismiss}
                showCloseButton={showCloseButton}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ============================================================================
// Sticky Reminder Bar (shown after popup dismiss)
// ============================================================================

interface StickyReminderProps {
  discountCode?: string
  discountPercentage?: number
  expiresAt?: Date
  onApply: () => void
  onDismiss: () => void
}

export function StickyDiscountReminder({
  discountCode = DISCOUNT_CODE,
  discountPercentage = DISCOUNT_PERCENTAGE,
  expiresAt,
  onApply,
  onDismiss
}: StickyReminderProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [timeLeft, setTimeLeft] = useState<{ minutes: number; seconds: number } | null>(null)

  // Calculate time remaining if expiry set
  useEffect(() => {
    if (!expiresAt) return

    const updateTimer = () => {
      const now = new Date()
      const diff = expiresAt.getTime() - now.getTime()
      
      if (diff <= 0) {
        setIsVisible(false)
        return
      }

      const minutes = Math.floor(diff / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)
      setTimeLeft({ minutes, seconds })
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [expiresAt])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-sage-600 to-sage-700 text-white p-3 shadow-lg"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Gift weight="fill" className="w-6 h-6 text-amber-300" />
            <div className="text-sm">
              <span className="font-semibold">{discountPercentage}% OFF</span>
              {' with code '}
              <span className="font-mono bg-white/20 px-2 py-0.5 rounded">{discountCode}</span>
              {timeLeft && (
                <span className="ml-2 text-amber-200">
                  Expires in {timeLeft.minutes}:{String(timeLeft.seconds).padStart(2, '0')}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={onApply}
              className="bg-white text-sage-700 hover:bg-sage-50 font-semibold"
            >
              Apply Now
            </Button>
            <button
              onClick={() => {
                setIsVisible(false)
                onDismiss()
              }}
              className="text-white/70 hover:text-white p-1"
              aria-label="Dismiss"
            >
              <X weight="bold" className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// ============================================================================
// Hook for Exit Intent Logic
// ============================================================================

export function useExitIntent(options: {
  enabled?: boolean
  onExit?: () => void
  delay?: number
}) {
  const { enabled = true, onExit, delay = 0 } = options
  const [hasTriggered, setHasTriggered] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!enabled || hasTriggered) return

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5) {
        if (delay > 0) {
          timeoutRef.current = setTimeout(() => {
            setHasTriggered(true)
            onExit?.()
          }, delay)
        } else {
          setHasTriggered(true)
          onExit?.()
        }
      }
    }

    const handleMouseEnter = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [enabled, hasTriggered, onExit, delay])

  return { hasTriggered, reset: () => setHasTriggered(false) }
}

export default ExitIntentPopup

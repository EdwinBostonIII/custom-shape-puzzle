/**
 * EmailCapture - Email collection components for marketing and cart recovery
 * 
 * Research-backed best practices:
 * - Abandoned cart emails recover 3-14% of lost sales (Klaviyo)
 * - Exit-intent popups can recover 10-15% of abandoning visitors
 * - $5-10 incentive offers increase signup rates by 25-40%
 */

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Gift, 
  EnvelopeSimple, 
  Sparkle,
  Check,
  SpinnerGap
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

// ============================================================================
// EMAIL CAPTURE POPUP - Exit intent or timed trigger
// ============================================================================

interface EmailCapturePopupProps {
  trigger?: 'exit-intent' | 'timed' | 'scroll' | 'manual'
  delay?: number // ms for timed trigger
  scrollThreshold?: number // percentage for scroll trigger
  incentive?: string
  incentiveValue?: string
  onSubmit?: (email: string, optIn: boolean) => Promise<void>
  onClose?: () => void
}

export function EmailCapturePopup({
  trigger = 'timed',
  delay = 30000, // 30 seconds default
  scrollThreshold = 50,
  incentive = 'your first order',
  incentiveValue = '$10 off',
  onSubmit,
  onClose
}: EmailCapturePopupProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  // Check if user has already seen/dismissed popup
  const hasSeenPopup = () => {
    try {
      return localStorage.getItem('interlock_email_popup_seen') === 'true'
    } catch {
      return false
    }
  }

  const markPopupSeen = () => {
    try {
      localStorage.setItem('interlock_email_popup_seen', 'true')
    } catch {
      // Ignore localStorage errors
    }
  }

  // Exit intent detection
  useEffect(() => {
    if (trigger !== 'exit-intent' || hasSeenPopup()) return

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse leaves toward top of page
      if (e.clientY <= 5 && !isOpen && !isSubmitted) {
        setIsOpen(true)
        markPopupSeen()
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [trigger, isOpen, isSubmitted])

  // Timed trigger
  useEffect(() => {
    if (trigger !== 'timed' || hasSeenPopup()) return

    const timer = setTimeout(() => {
      if (!isOpen && !isSubmitted) {
        setIsOpen(true)
        markPopupSeen()
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [trigger, delay, isOpen, isSubmitted])

  // Scroll trigger
  useEffect(() => {
    if (trigger !== 'scroll' || hasSeenPopup()) return

    const handleScroll = () => {
      const scrollPercentage = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      if (scrollPercentage >= scrollThreshold && !isOpen && !isSubmitted) {
        setIsOpen(true)
        markPopupSeen()
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [trigger, scrollThreshold, isOpen, isSubmitted])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)

    try {
      // Call the onSubmit handler if provided
      if (onSubmit) {
        await onSubmit(email, true)
      } else {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      // Store email for abandoned cart recovery
      try {
        localStorage.setItem('interlock_email', email)
      } catch {
        // Ignore localStorage errors
      }

      setIsSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    onClose?.()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md border-2 border-terracotta/20">
        <DialogHeader>
          {!isSubmitted ? (
            <>
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-terracotta/10 flex items-center justify-center">
                <Gift size={32} className="text-terracotta" weight="duotone" />
              </div>
              <DialogTitle className="text-2xl font-display text-center">
                Wait! Don't leave empty-handed
              </DialogTitle>
              <DialogDescription className="text-center text-base">
                Get <span className="font-bold text-terracotta">{incentiveValue}</span> {incentive}
              </DialogDescription>
            </>
          ) : (
            <>
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center">
                <Check size={32} className="text-sage" weight="bold" />
              </div>
              <DialogTitle className="text-2xl font-display text-center">
                You're on the list!
              </DialogTitle>
              <DialogDescription className="text-center text-base">
                Check your inbox for your discount code.
              </DialogDescription>
            </>
          )}
        </DialogHeader>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <EnvelopeSimple 
                  size={20} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" 
                  weight="duotone"
                />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                  aria-label="Email address"
                  autoFocus
                />
              </div>
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <SpinnerGap size={20} className="mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Sparkle size={20} className="mr-2" weight="fill" />
                  Get My {incentiveValue}
                </>
              )}
            </Button>

            <p className="text-xs text-center text-charcoal/50">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <Button 
              onClick={handleClose}
              className="w-full h-12 text-base"
            >
              Continue Creating My Puzzle
            </Button>
          </div>
        )}

        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-charcoal/40 hover:text-charcoal transition-colors"
          aria-label="Close popup"
        >
          <X size={20} />
        </button>
      </DialogContent>
    </Dialog>
  )
}

// ============================================================================
// INLINE NEWSLETTER SIGNUP - For footer or content areas
// ============================================================================

interface NewsletterSignupProps {
  title?: string
  description?: string
  buttonText?: string
  compact?: boolean
  onSubmit?: (email: string) => Promise<void>
  className?: string
}

export function NewsletterSignup({
  title = 'Stay Connected',
  description = 'Get puzzle ideas, anniversary reminders, and exclusive offers.',
  buttonText = 'Subscribe',
  compact = false,
  onSubmit,
  className
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email')
      return
    }

    setIsSubmitting(true)

    try {
      if (onSubmit) {
        await onSubmit(email)
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      setIsSubmitted(true)
    } catch {
      setError('Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className={`text-center ${className}`}>
        <div className="flex items-center justify-center gap-2 text-sage">
          <Check size={20} weight="bold" />
          <span className="font-medium">Thanks for subscribing!</span>
        </div>
      </div>
    )
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-10 flex-1"
          aria-label="Email address"
        />
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? <SpinnerGap size={16} className="animate-spin" /> : buttonText}
        </Button>
      </form>
    )
  }

  return (
    <div className={`p-6 bg-terracotta/5 rounded-2xl border border-terracotta/20 ${className}`}>
      <h3 className="text-lg font-bold text-charcoal font-display mb-2">{title}</h3>
      <p className="text-sm text-charcoal/60 mb-4">{description}</p>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 bg-white"
          aria-label="Email address"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
          {isSubmitting ? (
            <SpinnerGap size={18} className="animate-spin" />
          ) : (
            buttonText
          )}
        </Button>
      </form>
      
      <p className="text-xs text-charcoal/40 mt-3 text-center">
        No spam, ever. Unsubscribe anytime.
      </p>
    </div>
  )
}

// ============================================================================
// ABANDONED CART RECOVERY - Session storage and recovery hooks
// ============================================================================

interface CartData {
  tier: string
  shapes: string[]
  timestamp: number
  email?: string
  step: string
}

export function useCartRecovery() {
  const [savedCart, setSavedCart] = useState<CartData | null>(null)

  // Load saved cart on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('interlock_cart')
      if (saved) {
        const parsed = JSON.parse(saved) as CartData
        // Only use if less than 24 hours old
        if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
          setSavedCart(parsed)
        }
      }
    } catch {
      // Ignore errors
    }
  }, [])

  // Save cart state
  const saveCart = useCallback((data: Omit<CartData, 'timestamp'>) => {
    try {
      const cartData: CartData = {
        ...data,
        timestamp: Date.now()
      }
      sessionStorage.setItem('interlock_cart', JSON.stringify(cartData))
      setSavedCart(cartData)
    } catch {
      // Ignore errors
    }
  }, [])

  // Clear cart
  const clearCart = useCallback(() => {
    try {
      sessionStorage.removeItem('interlock_cart')
      setSavedCart(null)
    } catch {
      // Ignore errors
    }
  }, [])

  // Check if there's a recoverable cart
  const hasRecoverableCart = savedCart !== null

  return {
    savedCart,
    saveCart,
    clearCart,
    hasRecoverableCart
  }
}

// ============================================================================
// CART RECOVERY BANNER - Shows when returning visitor has abandoned cart
// ============================================================================

interface CartRecoveryBannerProps {
  cartData: CartData | null
  onRecover: () => void
  onDismiss: () => void
}

export function CartRecoveryBanner({ cartData, onRecover, onDismiss }: CartRecoveryBannerProps) {
  if (!cartData) return null

  const tierName = {
    essential: 'Essential',
    classic: 'Classic',
    grand: 'Grand',
    heirloom: 'Heirloom'
  }[cartData.tier] || 'Custom'

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md"
      >
        <div className="bg-white rounded-xl shadow-xl border border-stone/50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-terracotta/10 flex items-center justify-center">
              <Sparkle size={20} className="text-terracotta" weight="duotone" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-charcoal">
                Welcome back! 👋
              </p>
              <p className="text-sm text-charcoal/60 mt-1">
                Your {tierName} puzzle is waiting. Pick up where you left off?
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" onClick={onRecover}>
                  Continue
                </Button>
                <Button size="sm" variant="ghost" onClick={onDismiss}>
                  Start Over
                </Button>
              </div>
            </div>
            <button
              onClick={onDismiss}
              className="text-charcoal/40 hover:text-charcoal"
              aria-label="Dismiss"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// ============================================================================
// REMINDER SIGNUP - Special occasion reminder signup
// ============================================================================

interface ReminderSignupProps {
  occasion?: string
  onSubmit?: (email: string, date: string) => Promise<void>
  className?: string
}

export function ReminderSignup({
  occasion = 'anniversary',
  onSubmit,
  className
}: ReminderSignupProps) {
  const [email, setEmail] = useState('')
  const [date, setDate] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !date) return

    setIsSubmitting(true)
    try {
      if (onSubmit) {
        await onSubmit(email, date)
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      setIsSubmitted(true)
    } catch {
      // Handle error
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className={`p-6 bg-sage/10 rounded-2xl border border-sage/30 text-center ${className}`}>
        <Check size={32} className="mx-auto text-sage mb-2" weight="bold" />
        <p className="font-medium text-charcoal">We'll remind you!</p>
        <p className="text-sm text-charcoal/60">
          Check your inbox 2 weeks before your {occasion}.
        </p>
      </div>
    )
  }

  return (
    <div className={`p-6 bg-terracotta/5 rounded-2xl border border-terracotta/20 ${className}`}>
      <h3 className="text-lg font-bold text-charcoal font-display mb-2">
        Never Miss Your {occasion.charAt(0).toUpperCase() + occasion.slice(1)}
      </h3>
      <p className="text-sm text-charcoal/60 mb-4">
        We'll send you a reminder 2 weeks before, so you have time to create the perfect gift.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 bg-white"
          aria-label="Email address"
        />
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="h-11 bg-white"
          aria-label="Anniversary date"
        />
        <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
          {isSubmitting ? (
            <SpinnerGap size={18} className="animate-spin" />
          ) : (
            'Set Reminder'
          )}
        </Button>
      </form>
    </div>
  )
}

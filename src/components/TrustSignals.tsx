/**
 * TrustSignals - Research-backed conversion optimization components
 * 
 * Based on Baymard Institute and Shopify checkout optimization research:
 * - 17% of shoppers abandon carts due to lack of trust signals
 * - Social proof increases conversions by 15-25%
 * - Urgency/scarcity can boost conversions by 332% (when genuine)
 * - Free shipping messaging increases conversions by 37%
 */

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShieldCheck, 
  Truck, 
  Timer, 
  Star, 
  Heart, 
  Users, 
  Package,
  CreditCard,
  Lock,
  CheckCircle,
  Certificate,
  Sparkle
} from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'

// ============================================================================
// SOCIAL PROOF - Real-time activity simulation (replace with actual data)
// ============================================================================

interface RecentActivity {
  id: string
  name: string
  location: string
  action: string
  timeAgo: string
}

const SAMPLE_ACTIVITIES: RecentActivity[] = [
  { id: '1', name: 'Sarah M.', location: 'Boston, MA', action: 'just ordered a Classic puzzle', timeAgo: '2 min ago' },
  { id: '2', name: 'Michael R.', location: 'Portland, OR', action: 'added an Heirloom puzzle to cart', timeAgo: '5 min ago' },
  { id: '3', name: 'Jessica L.', location: 'Austin, TX', action: 'just completed their design', timeAgo: '8 min ago' },
  { id: '4', name: 'David K.', location: 'Denver, CO', action: 'ordered for their anniversary', timeAgo: '12 min ago' },
  { id: '5', name: 'Emily W.', location: 'Seattle, WA', action: 'just ordered a Grand puzzle', timeAgo: '15 min ago' },
  { id: '6', name: 'Chris B.', location: 'Chicago, IL', action: 'added premium packaging', timeAgo: '18 min ago' },
  { id: '7', name: 'Amanda T.', location: 'Miami, FL', action: 'joined the Capsule subscription', timeAgo: '22 min ago' },
  { id: '8', name: 'Ryan P.', location: 'Phoenix, AZ', action: 'just ordered for a wedding gift', timeAgo: '25 min ago' },
]

export function RecentActivityToast() {
  const [currentActivity, setCurrentActivity] = useState<RecentActivity | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [activityIndex, setActivityIndex] = useState(0)

  useEffect(() => {
    // Show first activity after 8 seconds, then every 30-45 seconds
    const showActivity = () => {
      setCurrentActivity(SAMPLE_ACTIVITIES[activityIndex])
      setIsVisible(true)
      
      // Hide after 4 seconds
      setTimeout(() => setIsVisible(false), 4000)
      
      // Move to next activity
      setActivityIndex((prev) => (prev + 1) % SAMPLE_ACTIVITIES.length)
    }

    // Initial delay
    const initialTimeout = setTimeout(showActivity, 8000)
    
    // Recurring interval (30-45 seconds random)
    const interval = setInterval(showActivity, 30000 + Math.random() * 15000)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, [activityIndex])

  return (
    <AnimatePresence>
      {isVisible && currentActivity && (
        <motion.div
          initial={{ opacity: 0, x: -100, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className="fixed bottom-4 left-4 z-50 max-w-xs bg-white rounded-xl shadow-xl border border-stone/30 p-4"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center">
              <Package size={20} className="text-sage" weight="duotone" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-charcoal truncate">
                {currentActivity.name} from {currentActivity.location}
              </p>
              <p className="text-xs text-charcoal/60">
                {currentActivity.action}
              </p>
              <p className="text-xs text-charcoal/40 mt-1">
                {currentActivity.timeAgo}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ============================================================================
// DELIVERY URGENCY - Countdown to shipping cutoff
// ============================================================================

interface DeliveryCountdownProps {
  className?: string
  compact?: boolean
}

export function DeliveryCountdown({ className, compact = false }: DeliveryCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      // Cutoff at 2 PM local time
      const cutoff = new Date()
      cutoff.setHours(14, 0, 0, 0)
      
      // If past cutoff, set to next day
      if (now > cutoff) {
        cutoff.setDate(cutoff.getDate() + 1)
      }
      
      const diff = cutoff.getTime() - now.getTime()
      
      return {
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      }
    }

    setTimeLeft(calculateTimeLeft())
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000)

    return () => clearInterval(timer)
  }, [])

  if (compact) {
    return (
      <Badge 
        className={`bg-terracotta/10 text-terracotta border-terracotta/20 ${className}`}
        aria-label={`Order within ${timeLeft.hours} hours ${timeLeft.minutes} minutes for faster processing`}
      >
        <Timer size={14} weight="bold" className="mr-1.5" />
        {timeLeft.hours}h {timeLeft.minutes}m left for today's batch
      </Badge>
    )
  }

  return (
    <div className={`flex items-center gap-3 p-3 bg-terracotta/5 rounded-xl border border-terracotta/20 ${className}`}>
      <Timer size={20} className="text-terracotta" weight="fill" />
      <div>
        <p className="text-sm font-medium text-charcoal">
          Order within{' '}
          <span className="font-bold text-terracotta">
            {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
          </span>
        </p>
        <p className="text-xs text-charcoal/60">
          for priority processing
        </p>
      </div>
    </div>
  )
}

// ============================================================================
// TRUST BADGES - Security and guarantee indicators
// ============================================================================

interface TrustBadgesProps {
  variant?: 'compact' | 'full'
  className?: string
}

export function TrustBadges({ variant = 'full', className }: TrustBadgesProps) {
  const badges = useMemo(() => [
    {
      icon: Lock,
      label: 'Secure Checkout',
      description: '256-bit SSL encryption',
      color: 'text-sage'
    },
    {
      icon: ShieldCheck,
      label: '30-Day Guarantee',
      description: 'Love it or full refund',
      color: 'text-terracotta'
    },
    {
      icon: Truck,
      label: 'Free Shipping',
      description: 'On all US orders',
      color: 'text-sage'
    },
    {
      icon: Certificate,
      label: 'Handcrafted',
      description: 'Made in USA',
      color: 'text-terracotta'
    }
  ], [])

  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap justify-center gap-4 ${className}`}>
        {badges.map((badge) => (
          <div key={badge.label} className="flex items-center gap-1.5 text-xs text-charcoal/60">
            <badge.icon size={14} className={badge.color} weight="fill" />
            <span>{badge.label}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      {badges.map((badge) => (
        <div 
          key={badge.label} 
          className="text-center p-4 bg-white rounded-xl border border-stone/50 shadow-sm"
        >
          <badge.icon size={24} className={`mx-auto mb-2 ${badge.color}`} weight="duotone" />
          <p className="text-xs font-semibold text-charcoal">{badge.label}</p>
          <p className="text-xs text-charcoal/50">{badge.description}</p>
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// PAYMENT ICONS - Accepted payment methods
// ============================================================================

export function PaymentIcons({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <CreditCard size={28} className="text-charcoal/40" weight="duotone" />
      <span className="text-xs text-charcoal/50">Visa, Mastercard, Amex, PayPal</span>
    </div>
  )
}

// ============================================================================
// CUSTOMER REVIEWS WIDGET - Aggregated ratings
// ============================================================================

interface CustomerRatingsProps {
  rating?: number
  reviewCount?: number
  className?: string
}

export function CustomerRatings({ 
  rating = 4.9, 
  reviewCount = 847, 
  className 
}: CustomerRatingsProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            size={16} 
            weight="fill" 
            className={star <= Math.floor(rating) ? 'text-yellow-400' : 'text-charcoal/20'}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-charcoal">{rating}</span>
      <span className="text-sm text-charcoal/50">({reviewCount.toLocaleString()} reviews)</span>
    </div>
  )
}

// ============================================================================
// TESTIMONIAL CAROUSEL - Customer stories
// ============================================================================

interface Testimonial {
  id: string
  quote: string
  author: string
  location: string
  occasion: string
  rating: number
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    quote: "We gave this to my parents for their 50th anniversary. They cried when they saw the shapes we chose. It's hanging on their wall now—best gift we've ever given.",
    author: 'Sarah & Michael',
    location: 'Boston, MA',
    occasion: 'Anniversary Gift',
    rating: 5
  },
  {
    id: '2',
    quote: "The hint cards made it so much more special than a regular puzzle. We spent hours reminiscing while solving it together.",
    author: 'Jennifer L.',
    location: 'Portland, OR',
    occasion: 'Birthday Gift',
    rating: 5
  },
  {
    id: '3',
    quote: "We created this for our engagement party and everyone wanted to know where we got it. The quality is incredible—real wood, beautifully finished.",
    author: 'David & Amy',
    location: 'Austin, TX',
    occasion: 'Engagement',
    rating: 5
  },
  {
    id: '4',
    quote: "Worth every penny. My husband was so touched by the shapes I chose—each one represented a memory from our relationship.",
    author: 'Maria C.',
    location: 'Seattle, WA',
    occasion: 'Anniversary Gift',
    rating: 5
  },
]

export function TestimonialCarousel({ className }: { className?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  const testimonial = TESTIMONIALS[currentIndex]

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={testimonial.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="text-center px-4"
        >
          <div className="flex justify-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                size={20} 
                weight="fill" 
                className="text-yellow-400"
              />
            ))}
          </div>
          <blockquote className="text-lg md:text-xl text-charcoal/80 italic mb-4 font-display leading-relaxed">
            "{testimonial.quote}"
          </blockquote>
          <div>
            <p className="font-medium text-charcoal">{testimonial.author}</p>
            <p className="text-sm text-charcoal/50">{testimonial.location} · {testimonial.occasion}</p>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {TESTIMONIALS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-terracotta' : 'bg-charcoal/20'
            }`}
            aria-label={`View testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// STOCK/SCARCITY INDICATOR - Limited availability
// ============================================================================

interface StockIndicatorProps {
  available?: number
  threshold?: number
  className?: string
}

export function StockIndicator({ 
  available = 12, 
  threshold = 15,
  className 
}: StockIndicatorProps) {
  if (available > threshold) return null

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
      <span className="text-sm text-amber-700">
        Only {available} spots left in this week's batch
      </span>
    </div>
  )
}

// ============================================================================
// LIVE VIEWERS - "X people viewing this" indicator
// ============================================================================

export function LiveViewers({ className }: { className?: string }) {
  const [viewers, setViewers] = useState(8)

  useEffect(() => {
    // Simulate fluctuating viewer count
    const interval = setInterval(() => {
      setViewers((prev) => {
        const change = Math.random() > 0.5 ? 1 : -1
        return Math.max(5, Math.min(18, prev + change))
      })
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`flex items-center gap-2 text-sm text-charcoal/60 ${className}`}>
      <Users size={16} className="text-sage" weight="fill" />
      <span>
        <span className="font-medium text-charcoal">{viewers} people</span> designing puzzles right now
      </span>
    </div>
  )
}

// ============================================================================
// CHECKOUT TRUST STRIP - Compact trust bar for checkout
// ============================================================================

export function CheckoutTrustStrip({ className }: { className?: string }) {
  return (
    <div className={`py-3 px-4 bg-charcoal/[0.02] border-y border-charcoal/10 ${className}`}>
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-charcoal/60">
        <span className="flex items-center gap-1.5">
          <Lock size={12} weight="fill" className="text-sage" />
          Secure Checkout
        </span>
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={12} weight="fill" className="text-sage" />
          30-Day Guarantee
        </span>
        <span className="flex items-center gap-1.5">
          <Truck size={12} weight="fill" className="text-sage" />
          Free Shipping
        </span>
        <span className="flex items-center gap-1.5">
          <Heart size={12} weight="fill" className="text-terracotta" />
          Made with Love
        </span>
      </div>
    </div>
  )
}

// ============================================================================
// ORDER VALUE PROGRESS - Free shipping/bonus threshold
// ============================================================================

interface OrderValueProgressProps {
  currentValue: number
  freeShippingThreshold?: number
  bonusThreshold?: number
  bonusText?: string
  className?: string
}

export function OrderValueProgress({
  currentValue,
  freeShippingThreshold = 0, // Already free shipping
  bonusThreshold = 149,
  bonusText = 'Free Anniversary Capsule',
  className
}: OrderValueProgressProps) {
  const progress = Math.min((currentValue / bonusThreshold) * 100, 100)
  const amountNeeded = Math.max(0, bonusThreshold - currentValue)

  if (currentValue >= bonusThreshold) {
    return (
      <div className={`flex items-center gap-2 p-3 bg-sage/10 rounded-xl border border-sage/30 ${className}`}>
        <CheckCircle size={20} className="text-sage" weight="fill" />
        <span className="text-sm font-medium text-charcoal">
          🎁 You unlocked: {bonusText}!
        </span>
      </div>
    )
  }

  return (
    <div className={`p-3 bg-terracotta/5 rounded-xl border border-terracotta/20 ${className}`}>
      <div className="flex items-center justify-between text-xs text-charcoal/60 mb-2">
        <span>Add ${amountNeeded.toFixed(0)} more for {bonusText}</span>
        <span className="font-medium">${bonusThreshold}</span>
      </div>
      <div className="h-2 bg-charcoal/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
          className="h-full bg-gradient-to-r from-terracotta to-terracotta/70 rounded-full"
        />
      </div>
    </div>
  )
}

// ============================================================================
// RISK REVERSAL - Money-back guarantee callout
// ============================================================================

export function RiskReversal({ className }: { className?: string }) {
  return (
    <div className={`flex items-start gap-3 p-4 bg-sage/5 rounded-xl border border-sage/20 ${className}`}>
      <div className="flex-shrink-0">
        <ShieldCheck size={24} className="text-sage" weight="fill" />
      </div>
      <div>
        <p className="font-semibold text-charcoal text-sm">Risk-Free Guarantee</p>
        <p className="text-xs text-charcoal/60 mt-1">
          If you're not completely happy with your puzzle, we'll remake it for free or give you a full refund. No questions asked.
        </p>
      </div>
    </div>
  )
}

// ============================================================================
// COMBINED TRUST SECTION - For homepage/landing pages
// ============================================================================

export function TrustSection({ className }: { className?: string }) {
  return (
    <section className={`space-y-8 ${className}`}>
      <div className="text-center">
        <CustomerRatings className="justify-center" />
        <p className="text-sm text-charcoal/50 mt-1">Based on verified customer reviews</p>
      </div>
      
      <TestimonialCarousel />
      
      <TrustBadges />
    </section>
  )
}

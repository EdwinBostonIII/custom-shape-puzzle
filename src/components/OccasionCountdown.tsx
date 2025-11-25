/**
 * OccasionCountdown - Production and shipping deadline component with occasion targeting
 * 
 * Research-backed implementation:
 * - Deadline urgency increases conversion 8-12%
 * - "Order by X for delivery by Y" format is most effective
 * - Countdown timers create scarcity psychology
 * - Holiday/occasion targeting significantly boosts gift sales
 */

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock,
  Calendar,
  Gift,
  Truck,
  Timer,
  Warning,
  Sparkle,
  Heart,
  Confetti,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

// ============================================================================
// TYPES
// ============================================================================

interface DeliveryCountdownProps {
  /** Production days (default: 14) */
  productionDays?: number
  /** Shipping days (default: 5) */
  shippingDays?: number
  /** Visual variant */
  variant?: 'full' | 'compact' | 'inline'
  /** Custom class name */
  className?: string
  /** Whether to show urgency when close to deadline */
  showUrgency?: boolean
  /** Target occasion (optional - for holiday targeting) */
  targetOccasion?: Occasion | null
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
}

interface Occasion {
  name: string
  date: Date
  icon: React.ReactNode
  color: string
}

// ============================================================================
// DATE UTILITIES
// ============================================================================

const PRODUCTION_DAYS = 14
const SHIPPING_DAYS = 5
const CUTOFF_HOUR = 17 // 5 PM local time

/** Calculate delivery date from order date */
function calculateDeliveryDate(orderDate: Date, productionDays: number, shippingDays: number): Date {
  const delivery = new Date(orderDate)
  
  // Skip weekends for business days calculation
  let daysToAdd = productionDays + shippingDays
  while (daysToAdd > 0) {
    delivery.setDate(delivery.getDate() + 1)
    const day = delivery.getDay()
    if (day !== 0 && day !== 6) {
      daysToAdd--
    }
  }
  
  return delivery
}

/** Calculate order deadline for a target delivery date */
function calculateOrderDeadline(targetDate: Date, productionDays: number, shippingDays: number): Date {
  const deadline = new Date(targetDate)
  
  // Subtract business days
  let daysToSubtract = productionDays + shippingDays
  while (daysToSubtract > 0) {
    deadline.setDate(deadline.getDate() - 1)
    const day = deadline.getDay()
    if (day !== 0 && day !== 6) {
      daysToSubtract--
    }
  }
  
  // Set to cutoff hour
  deadline.setHours(CUTOFF_HOUR, 0, 0, 0)
  
  return deadline
}

/** Calculate time left until a deadline */
function calculateTimeLeft(deadline: Date): TimeLeft {
  const now = new Date()
  const diff = deadline.getTime() - now.getTime()
  
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 }
  }
  
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    total: diff,
  }
}

/** Format date for display */
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

// ============================================================================
// UPCOMING OCCASIONS
// ============================================================================

function getUpcomingOccasions(): Occasion[] {
  const now = new Date()
  const year = now.getFullYear()
  
  const occasions: Occasion[] = [
    {
      name: "Valentine's Day",
      date: new Date(year, 1, 14),
      icon: <Heart size={20} weight="fill" />,
      color: 'text-pink-500',
    },
    {
      name: "Mother's Day",
      date: new Date(year, 4, Math.ceil(14 - new Date(year, 4, 1).getDay())), // 2nd Sunday of May
      icon: <Heart size={20} weight="fill" />,
      color: 'text-pink-400',
    },
    {
      name: "Father's Day",
      date: new Date(year, 5, Math.ceil(21 - new Date(year, 5, 1).getDay())), // 3rd Sunday of June
      icon: <Gift size={20} weight="fill" />,
      color: 'text-blue-500',
    },
    {
      name: 'Anniversary Season',
      date: new Date(year, 5, 1), // June 1
      icon: <Sparkle size={20} weight="fill" />,
      color: 'text-amber-500',
    },
    {
      name: 'Christmas',
      date: new Date(year, 11, 25),
      icon: <Confetti size={20} weight="fill" />,
      color: 'text-red-500',
    },
    {
      name: 'New Year Gift',
      date: new Date(year + 1, 0, 1),
      icon: <Sparkle size={20} weight="fill" />,
      color: 'text-purple-500',
    },
  ]
  
  // If dates have passed this year, shift to next year
  return occasions
    .map(o => {
      if (o.date < now) {
        return { ...o, date: new Date(o.date.setFullYear(o.date.getFullYear() + 1)) }
      }
      return o
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime())
}

function findRelevantOccasion(
  occasions: Occasion[],
  productionDays: number,
  shippingDays: number
): Occasion | null {
  const now = new Date()
  const totalDays = productionDays + shippingDays
  const maxFutureDate = new Date(now)
  maxFutureDate.setDate(maxFutureDate.getDate() + totalDays + 14) // 2 weeks buffer
  
  return occasions.find(o => {
    const deadline = calculateOrderDeadline(o.date, productionDays, shippingDays)
    return deadline > now && o.date < maxFutureDate
  }) || null
}

// ============================================================================
// COUNTDOWN DIGIT COMPONENT
// ============================================================================

interface CountdownDigitProps {
  value: number
  label: string
  urgent?: boolean
}

function CountdownDigit({ value, label, urgent }: CountdownDigitProps) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ scale: 1.1, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        className={cn(
          'w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center text-xl sm:text-2xl font-bold',
          urgent
            ? 'bg-red-500 text-white'
            : 'bg-charcoal/10 text-charcoal'
        )}
      >
        {String(value).padStart(2, '0')}
      </motion.div>
      <span className={cn(
        'text-xs mt-1 uppercase tracking-wide',
        urgent ? 'text-red-500' : 'text-charcoal/60'
      )}>
        {label}
      </span>
    </div>
  )
}

// ============================================================================
// FULL COUNTDOWN COMPONENT
// ============================================================================

function DeliveryCountdownFull({
  productionDays = PRODUCTION_DAYS,
  shippingDays = SHIPPING_DAYS,
  showUrgency = true,
  targetOccasion,
  className,
}: DeliveryCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)
  const occasions = useMemo(() => getUpcomingOccasions(), [])
  
  // Find relevant occasion if not specified
  const occasion = targetOccasion ?? findRelevantOccasion(occasions, productionDays, shippingDays)
  
  // Calculate dates
  const deliveryDate = useMemo(() => {
    return calculateDeliveryDate(new Date(), productionDays, shippingDays)
  }, [productionDays, shippingDays])
  
  const occasionDeadline = useMemo(() => {
    if (!occasion) return null
    return calculateOrderDeadline(occasion.date, productionDays, shippingDays)
  }, [occasion, productionDays, shippingDays])
  
  // Update countdown every second
  useEffect(() => {
    if (!occasionDeadline) return
    
    const updateTimer = () => {
      setTimeLeft(calculateTimeLeft(occasionDeadline))
    }
    
    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    
    return () => clearInterval(interval)
  }, [occasionDeadline])
  
  const isUrgent = showUrgency && timeLeft !== null && timeLeft.days <= 3 && timeLeft.total > 0
  const isPastDeadline = timeLeft !== null && timeLeft.total <= 0

  return (
    <div className={cn('space-y-4', className)}>
      {/* Estimated delivery date */}
      <div className="bg-sage/10 rounded-xl p-4 flex items-center gap-4">
        <div className="w-12 h-12 bg-sage/20 rounded-full flex items-center justify-center flex-shrink-0">
          <Truck size={24} weight="duotone" className="text-sage" />
        </div>
        <div>
          <div className="text-sm text-charcoal/60">Order today, arrives by:</div>
          <div className="text-lg font-semibold text-charcoal">
            {formatDate(deliveryDate)}
          </div>
        </div>
      </div>
      
      {/* Occasion countdown */}
      <AnimatePresence mode="wait">
        {occasion && timeLeft && !isPastDeadline && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              'rounded-xl p-4 border-2',
              isUrgent
                ? 'bg-red-50 border-red-200'
                : 'bg-terracotta/5 border-terracotta/20'
            )}
          >
            {/* Occasion header */}
            <div className="flex items-center gap-2 mb-4">
              <span className={occasion.color}>{occasion.icon}</span>
              <span className="font-medium text-charcoal">
                {isUrgent ? (
                  <span className="flex items-center gap-2">
                    <Warning size={18} weight="fill" className="text-red-500" />
                    Order soon for {occasion.name}!
                  </span>
                ) : (
                  `Get it in time for ${occasion.name}`
                )}
              </span>
            </div>
            
            {/* Countdown timer */}
            <div className="flex justify-center gap-3 mb-4">
              <CountdownDigit value={timeLeft.days} label="Days" urgent={isUrgent} />
              <div className="flex items-center text-charcoal/30 font-bold">:</div>
              <CountdownDigit value={timeLeft.hours} label="Hours" urgent={isUrgent} />
              <div className="flex items-center text-charcoal/30 font-bold">:</div>
              <CountdownDigit value={timeLeft.minutes} label="Mins" urgent={isUrgent} />
              <div className="flex items-center text-charcoal/30 font-bold">:</div>
              <CountdownDigit value={timeLeft.seconds} label="Secs" urgent={isUrgent} />
            </div>
            
            {/* Deadline text */}
            <div className="text-center text-sm text-charcoal/60">
              Order by {occasionDeadline && formatDate(occasionDeadline)} at 5:00 PM
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Past deadline message */}
      <AnimatePresence>
        {isPastDeadline && occasion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-stone/30 rounded-xl p-4 text-center"
          >
            <p className="text-charcoal/70">
              The deadline for {occasion.name} delivery has passed, but your puzzle will still arrive by{' '}
              <span className="font-semibold">{formatDate(deliveryDate)}</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// COMPACT COUNTDOWN COMPONENT
// ============================================================================

function DeliveryCountdownCompact({
  productionDays = PRODUCTION_DAYS,
  shippingDays = SHIPPING_DAYS,
  showUrgency = true,
  className,
}: DeliveryCountdownProps) {
  const deliveryDate = useMemo(() => {
    return calculateDeliveryDate(new Date(), productionDays, shippingDays)
  }, [productionDays, shippingDays])
  
  const occasions = useMemo(() => getUpcomingOccasions(), [])
  const occasion = findRelevantOccasion(occasions, productionDays, shippingDays)
  
  const [daysUntilOccasion, setDaysUntilOccasion] = useState<number | null>(null)
  
  useEffect(() => {
    if (!occasion) return
    const deadline = calculateOrderDeadline(occasion.date, productionDays, shippingDays)
    const timeLeft = calculateTimeLeft(deadline)
    setDaysUntilOccasion(timeLeft.days)
  }, [occasion, productionDays, shippingDays])
  
  const isUrgent = showUrgency && daysUntilOccasion !== null && daysUntilOccasion <= 3 && daysUntilOccasion >= 0

  return (
    <div className={cn(
      'rounded-xl p-4 flex items-center gap-4',
      isUrgent ? 'bg-red-50 border border-red-200' : 'bg-sage/10',
      className
    )}>
      <div className={cn(
        'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
        isUrgent ? 'bg-red-500 text-white' : 'bg-sage/20'
      )}>
        {isUrgent ? (
          <Timer size={20} weight="fill" />
        ) : (
          <Truck size={20} weight="duotone" className="text-sage" />
        )}
      </div>
      
      <div className="flex-1">
        {isUrgent && occasion ? (
          <>
            <div className="text-sm font-medium text-red-600">
              {daysUntilOccasion === 0 ? 'Last day' : `${daysUntilOccasion} days left`} for {occasion.name}!
            </div>
            <div className="text-xs text-charcoal/60">
              Order now to get it in time
            </div>
          </>
        ) : (
          <>
            <div className="text-sm font-medium text-charcoal">
              Arrives by {formatDate(deliveryDate)}
            </div>
            <div className="text-xs text-charcoal/60">
              2-week production + free shipping
            </div>
          </>
        )}
      </div>
      
      {occasion && !isUrgent && daysUntilOccasion !== null && daysUntilOccasion > 0 && (
        <div className="text-right">
          <div className="text-xs text-charcoal/60">{occasion.name} delivery</div>
          <div className="text-sm font-medium text-charcoal">{daysUntilOccasion} days left</div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// INLINE COUNTDOWN COMPONENT
// ============================================================================

function DeliveryCountdownInline({
  productionDays = PRODUCTION_DAYS,
  shippingDays = SHIPPING_DAYS,
  className,
}: DeliveryCountdownProps) {
  const deliveryDate = useMemo(() => {
    return calculateDeliveryDate(new Date(), productionDays, shippingDays)
  }, [productionDays, shippingDays])

  return (
    <div className={cn('flex items-center gap-2 text-sm', className)}>
      <Calendar size={16} className="text-charcoal/50" />
      <span className="text-charcoal/70">
        Arrives by{' '}
        <span className="font-medium text-charcoal">
          {deliveryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </span>
    </div>
  )
}

// ============================================================================
// MAIN EXPORT
// ============================================================================

export function OccasionCountdown(props: DeliveryCountdownProps) {
  const { variant = 'full' } = props

  switch (variant) {
    case 'compact':
      return <DeliveryCountdownCompact {...props} />
    case 'inline':
      return <DeliveryCountdownInline {...props} />
    case 'full':
    default:
      return <DeliveryCountdownFull {...props} />
  }
}

// Named exports for direct use
export { DeliveryCountdownFull, DeliveryCountdownCompact, DeliveryCountdownInline }

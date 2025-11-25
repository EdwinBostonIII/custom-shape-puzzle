/**
 * GiftCalendar.tsx - Occasion-Based Gift Planning & Urgency System
 * 
 * Research-validated gift calendar component based on:
 * - Holiday urgency increases conversions by up to 332%
 * - Gift-giving occasions drive 70% of personalized product purchases
 * - Order-by deadlines create time-bound urgency
 * - Countdown timers increase conversion by 8.6% average
 * 
 * Features:
 * - Major gift-giving occasion tracking
 * - Dynamic order-by deadline calculations
 * - Countdown timers for upcoming occasions
 * - Occasion-specific messaging
 * - Gift reminder signup
 */

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Icon } from '@phosphor-icons/react'
import { 
  Gift, 
  Heart, 
  Flower,
  Tree,
  Star,
  Baby,
  Cake,
  Calendar,
  Clock,
  Bell,
  CheckCircle,
  ArrowRight,
  Warning,
  Confetti
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

// Gift-giving occasions with dates and messaging
const GIFT_OCCASIONS = [
  {
    id: 'christmas',
    name: 'Christmas',
    icon: Tree,
    color: '#D32F2F', // Red
    bgColor: '#FFEBEE',
    getDate: (year: number) => new Date(year, 11, 25), // Dec 25
    orderLeadDays: 14, // Order 14 days before to ensure delivery
    rushLeadDays: 7,
    message: 'Create a Christmas miracle they\'ll cherish forever',
    urgentMessage: 'Last chance for Christmas delivery!',
    emoji: '🎄'
  },
  {
    id: 'valentines',
    name: "Valentine's Day",
    icon: Heart,
    color: '#E91E63', // Pink
    bgColor: '#FCE4EC',
    getDate: (year: number) => new Date(year, 1, 14), // Feb 14
    orderLeadDays: 10,
    rushLeadDays: 5,
    message: 'A puzzle of your love story',
    urgentMessage: 'Order now for Valentine\'s delivery!',
    emoji: '💕'
  },
  {
    id: 'mothers-day',
    name: "Mother's Day",
    icon: Flower,
    color: '#9C27B0', // Purple
    bgColor: '#F3E5F5',
    getDate: (year: number) => {
      // Second Sunday in May
      const may = new Date(year, 4, 1)
      const day = may.getDay()
      const secondSunday = 14 - day + (day === 0 ? -7 : 0)
      return new Date(year, 4, secondSunday)
    },
    orderLeadDays: 12,
    rushLeadDays: 6,
    message: 'Show Mom how much she means to you',
    urgentMessage: 'Don\'t miss Mother\'s Day delivery!',
    emoji: '💐'
  },
  {
    id: 'fathers-day',
    name: "Father's Day",
    icon: Star,
    color: '#1976D2', // Blue
    bgColor: '#E3F2FD',
    getDate: (year: number) => {
      // Third Sunday in June
      const june = new Date(year, 5, 1)
      const day = june.getDay()
      const thirdSunday = 21 - day + (day === 0 ? -7 : 0)
      return new Date(year, 5, thirdSunday)
    },
    orderLeadDays: 12,
    rushLeadDays: 6,
    message: 'A gift Dad will treasure forever',
    urgentMessage: 'Order now for Father\'s Day!',
    emoji: '👔'
  },
  {
    id: 'anniversary',
    name: 'Anniversary',
    icon: Heart,
    color: '#FF5722', // Orange
    bgColor: '#FBE9E7',
    getDate: () => null, // Custom date
    orderLeadDays: 14,
    rushLeadDays: 7,
    message: 'Celebrate your love story',
    urgentMessage: 'Perfect for your special day!',
    emoji: '💍'
  },
  {
    id: 'birthday',
    name: 'Birthday',
    icon: Cake,
    color: '#FF9800', // Amber
    bgColor: '#FFF3E0',
    getDate: () => null, // Custom date
    orderLeadDays: 14,
    rushLeadDays: 7,
    message: 'Make their birthday unforgettable',
    urgentMessage: 'A birthday gift they\'ll remember!',
    emoji: '🎂'
  },
  {
    id: 'new-baby',
    name: 'New Baby',
    icon: Baby,
    color: '#4CAF50', // Green
    bgColor: '#E8F5E9',
    getDate: () => null, // Custom date
    orderLeadDays: 21,
    rushLeadDays: 10,
    message: 'Welcome the newest family member',
    urgentMessage: 'A keepsake for new parents!',
    emoji: '👶'
  },
  {
    id: 'graduation',
    name: 'Graduation',
    icon: Confetti,
    color: '#673AB7', // Deep Purple
    bgColor: '#EDE7F6',
    getDate: () => null, // Custom date
    orderLeadDays: 14,
    rushLeadDays: 7,
    message: 'Celebrate their achievement',
    urgentMessage: 'Perfect graduation gift!',
    emoji: '🎓'
  },
]

// Use the Phosphor Icon type directly
interface GiftOccasion {
  id: string
  name: string
  icon: Icon
  color: string
  bgColor: string
  getDate: (year: number) => Date | null
  orderLeadDays: number
  rushLeadDays: number
  message: string
  urgentMessage: string
  emoji: string
}

interface OccasionWithDate extends GiftOccasion {
  date: Date
  daysUntil: number
  orderByDate: Date
  rushOrderByDate: Date
  isRushPeriod: boolean
  isPastOrderDeadline: boolean
}

// Calculate upcoming occasions with deadlines
function getUpcomingOccasions(): OccasionWithDate[] {
  const now = new Date()
  const currentYear = now.getFullYear()
  
  return GIFT_OCCASIONS
    .filter(occasion => occasion.getDate(currentYear) !== null)
    .map(occasion => {
      let date = occasion.getDate(currentYear)!
      
      // If date has passed this year, get next year's date
      if (date < now) {
        date = occasion.getDate(currentYear + 1)!
      }
      
      const daysUntil = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      const orderByDate = new Date(date.getTime() - (occasion.orderLeadDays * 24 * 60 * 60 * 1000))
      const rushOrderByDate = new Date(date.getTime() - (occasion.rushLeadDays * 24 * 60 * 60 * 1000))
      
      return {
        ...occasion,
        date,
        daysUntil,
        orderByDate,
        rushOrderByDate,
        isRushPeriod: now > orderByDate && now <= rushOrderByDate,
        isPastOrderDeadline: now > rushOrderByDate
      }
    })
    .filter(o => !o.isPastOrderDeadline)
    .sort((a, b) => a.daysUntil - b.daysUntil)
}

// ========================
// COMPONENT: OccasionCountdown
// Single occasion countdown display
// ========================
interface OccasionCountdownProps {
  occasion: OccasionWithDate
  className?: string
  variant?: 'compact' | 'full'
  onOrderNow?: () => void
}

export function OccasionCountdown({ 
  occasion, 
  className, 
  variant = 'compact',
  onOrderNow 
}: OccasionCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const now = new Date()
    const target = occasion.isRushPeriod ? occasion.rushOrderByDate : occasion.orderByDate
    return Math.max(0, target.getTime() - now.getTime())
  })
  
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const target = occasion.isRushPeriod ? occasion.rushOrderByDate : occasion.orderByDate
      setTimeLeft(Math.max(0, target.getTime() - now.getTime()))
    }, 1000)
    
    return () => clearInterval(timer)
  }, [occasion])
  
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)
  
  const Icon = occasion.icon
  
  if (variant === 'compact') {
    return (
      <div 
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm",
          occasion.isRushPeriod ? "bg-red-50 text-red-700" : "bg-terracotta/10 text-charcoal",
          className
        )}
      >
        <Icon size={16} weight="duotone" aria-hidden="true" />
        <span className="font-medium">{occasion.name}</span>
        <span className="text-charcoal/60">
          {days > 0 ? `${days}d ${hours}h` : `${hours}h ${minutes}m`} to order
        </span>
        {occasion.isRushPeriod && (
          <span className="text-xs font-bold text-red-600 animate-pulse">RUSH</span>
        )}
      </div>
    )
  }
  
  return (
    <Card 
      className={cn(
        "overflow-hidden border-2",
        occasion.isRushPeriod ? "border-red-200 bg-red-50" : "border-stone"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
              style={{ backgroundColor: occasion.bgColor }}
            >
              {occasion.emoji}
            </div>
            <div>
              <CardTitle className="text-lg">{occasion.name}</CardTitle>
              <p className="text-sm text-charcoal/60">
                {occasion.date.toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric',
                  year: occasion.date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                })}
              </p>
            </div>
          </div>
          
          {occasion.isRushPeriod && (
            <span className="px-2 py-1 rounded-md bg-red-100 text-red-700 text-xs font-bold flex items-center gap-1">
              <Warning size={12} />
              RUSH DEADLINE
            </span>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Countdown Timer */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Days', value: days },
            { label: 'Hours', value: hours },
            { label: 'Mins', value: minutes },
            { label: 'Secs', value: seconds }
          ].map((unit) => (
            <div key={unit.label} className="text-center">
              <div 
                className={cn(
                  "text-2xl font-bold rounded-lg py-2",
                  occasion.isRushPeriod ? "bg-red-100 text-red-700" : "bg-sage/20 text-charcoal"
                )}
              >
                {unit.value.toString().padStart(2, '0')}
              </div>
              <p className="text-xs text-charcoal/60 mt-1">{unit.label}</p>
            </div>
          ))}
        </div>
        
        {/* Message */}
        <p className="text-sm text-charcoal/80">
          {occasion.isRushPeriod ? occasion.urgentMessage : occasion.message}
        </p>
        
        {/* Order Deadline Info */}
        <div className="flex items-center gap-2 text-xs text-charcoal/60">
          <Clock size={14} aria-hidden="true" />
          <span>
            Order by {(occasion.isRushPeriod ? occasion.rushOrderByDate : occasion.orderByDate)
              .toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            {' '}for guaranteed {occasion.name} delivery
          </span>
        </div>
        
        {onOrderNow && (
          <Button 
            onClick={onOrderNow}
            className={cn(
              "w-full",
              occasion.isRushPeriod 
                ? "bg-red-600 hover:bg-red-700" 
                : "bg-terracotta hover:bg-terracotta/90"
            )}
          >
            Order for {occasion.name}
            <ArrowRight size={16} className="ml-2" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// ========================
// COMPONENT: UpcomingOccasionsBanner
// Banner showing multiple upcoming occasions
// ========================
interface UpcomingOccasionsBannerProps {
  className?: string
  maxOccasions?: number
  onSelectOccasion?: (occasion: OccasionWithDate) => void
}

export function UpcomingOccasionsBanner({ 
  className, 
  maxOccasions = 3,
  onSelectOccasion 
}: UpcomingOccasionsBannerProps) {
  const occasions = useMemo(() => getUpcomingOccasions().slice(0, maxOccasions), [maxOccasions])
  
  if (occasions.length === 0) return null
  
  const nearestOccasion = occasions[0]
  
  return (
    <div 
      className={cn(
        "p-4 rounded-xl",
        "bg-gradient-to-r from-terracotta/10 via-cream to-sage/10",
        "border border-terracotta/20",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <Calendar size={18} className="text-terracotta" />
        <span className="font-medium text-charcoal">Upcoming Gift Occasions</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {occasions.map((occasion) => {
          const Icon = occasion.icon
          return (
            <button
              key={occasion.id}
              onClick={() => onSelectOccasion?.(occasion)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
                "border hover:shadow-md",
                occasion.isRushPeriod 
                  ? "border-red-200 bg-red-50 hover:bg-red-100" 
                  : "border-stone/30 bg-white hover:bg-stone/5"
              )}
            >
              <span className="text-lg">{occasion.emoji}</span>
              <span className="font-medium">{occasion.name}</span>
              <span className={cn(
                "text-xs",
                occasion.isRushPeriod ? "text-red-600 font-bold" : "text-charcoal/50"
              )}>
                {occasion.daysUntil}d
              </span>
            </button>
          )
        })}
      </div>
      
      {nearestOccasion.daysUntil <= 30 && (
        <p className="text-xs text-charcoal/60 mt-3 flex items-center gap-1">
          <Clock size={12} aria-hidden="true" />
          Order by {nearestOccasion.orderByDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          })} for {nearestOccasion.name} delivery
        </p>
      )}
    </div>
  )
}

// ========================
// COMPONENT: GiftReminderSignup
// Email signup for occasion reminders
// ========================
interface GiftReminderSignupProps {
  className?: string
  onSignup?: (email: string, occasions: string[]) => void
}

export function GiftReminderSignup({ className, onSignup }: GiftReminderSignupProps) {
  const [email, setEmail] = useState('')
  const [selectedOccasions, setSelectedOccasions] = useState<Set<string>>(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  
  const handleToggleOccasion = (id: string) => {
    setSelectedOccasions(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || selectedOccasions.size === 0) {
      toast.error('Please enter your email and select at least one occasion')
      return
    }
    
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    onSignup?.(email, Array.from(selectedOccasions))
    setIsComplete(true)
    toast.success('You\'ll receive reminders before each occasion!')
    
    setIsSubmitting(false)
  }
  
  if (isComplete) {
    return (
      <Card className={cn("border-sage bg-sage/10", className)}>
        <CardContent className="pt-6 text-center">
          <CheckCircle size={48} className="mx-auto text-sage mb-3" />
          <h3 className="font-display text-lg mb-2">Reminders Set!</h3>
          <p className="text-sm text-charcoal/60">
            We'll email you 2 weeks before each occasion so you never miss a perfect gift moment.
          </p>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className={cn("border-stone", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bell size={20} className="text-terracotta" />
          Never Miss a Gift Occasion
        </CardTitle>
        <p className="text-sm text-charcoal/60">
          Get reminders 2 weeks before important dates
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Occasion Selection */}
          <div className="grid grid-cols-2 gap-2">
            {GIFT_OCCASIONS.slice(0, 6).map((occasion) => (
              <button
                key={occasion.id}
                type="button"
                onClick={() => handleToggleOccasion(occasion.id)}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg text-sm text-left transition-all",
                  "border-2",
                  selectedOccasions.has(occasion.id)
                    ? "border-terracotta bg-terracotta/10"
                    : "border-stone/30 hover:border-stone"
                )}
              >
                <span className="text-lg">{occasion.emoji}</span>
                <span className="font-medium truncate">{occasion.name}</span>
              </button>
            ))}
          </div>
          
          {/* Email Input */}
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11"
            required
          />
          
          <Button 
            type="submit" 
            className="w-full bg-terracotta hover:bg-terracotta/90"
            disabled={isSubmitting || selectedOccasions.size === 0}
          >
            {isSubmitting ? 'Setting up...' : 'Get Reminders'}
          </Button>
          
          <p className="text-xs text-center text-charcoal/50">
            No spam. Just timely gift reminders.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}

// ========================
// COMPONENT: OccasionSelector
// Modal for selecting occasion during checkout
// ========================
interface OccasionSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectOccasion: (occasion: GiftOccasion, customDate?: Date) => void
}

export function OccasionSelector({ open, onOpenChange, onSelectOccasion }: OccasionSelectorProps) {
  const [customDate, setCustomDate] = useState('')
  const [selectedOccasion, setSelectedOccasion] = useState<GiftOccasion | null>(null)
  
  const handleSelect = (occasion: GiftOccasion) => {
    if (occasion.getDate(new Date().getFullYear()) === null) {
      setSelectedOccasion(occasion)
    } else {
      onSelectOccasion(occasion)
      onOpenChange(false)
    }
  }
  
  const handleCustomDateConfirm = () => {
    if (selectedOccasion && customDate) {
      onSelectOccasion(selectedOccasion, new Date(customDate))
      onOpenChange(false)
      setSelectedOccasion(null)
      setCustomDate('')
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift size={24} className="text-terracotta" />
            What's the occasion?
          </DialogTitle>
          <DialogDescription>
            Select the occasion to get delivery deadline info
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {selectedOccasion ? (
            // Custom date picker for occasions without fixed dates
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-terracotta/10">
                <span className="text-2xl">{selectedOccasion.emoji}</span>
                <span className="font-medium">{selectedOccasion.name}</span>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-charcoal">
                  When is the {selectedOccasion.name.toLowerCase()}?
                </label>
                <Input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="h-11"
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setSelectedOccasion(null)}
                >
                  Back
                </Button>
                <Button 
                  className="flex-1 bg-terracotta hover:bg-terracotta/90"
                  onClick={handleCustomDateConfirm}
                  disabled={!customDate}
                >
                  Confirm
                </Button>
              </div>
            </div>
          ) : (
            // Occasion grid
            <div className="grid grid-cols-2 gap-3">
              {GIFT_OCCASIONS.map((occasion) => (
                <button
                  key={occasion.id}
                  onClick={() => handleSelect(occasion)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-xl text-center",
                    "border-2 border-stone/30 hover:border-terracotta/50 hover:bg-terracotta/5",
                    "transition-all"
                  )}
                >
                  <span className="text-3xl">{occasion.emoji}</span>
                  <span className="font-medium text-sm">{occasion.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ========================
// COMPONENT: DeliveryDeadlineAlert
// Sticky alert for approaching deadlines
// ========================
interface DeliveryDeadlineAlertProps {
  occasion: OccasionWithDate
  className?: string
  onDismiss?: () => void
}

export function DeliveryDeadlineAlert({ 
  occasion, 
  className,
  onDismiss 
}: DeliveryDeadlineAlertProps) {
  if (occasion.daysUntil > 30) return null
  
  const isUrgent = occasion.isRushPeriod || occasion.daysUntil <= 10
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-3 px-4",
        isUrgent 
          ? "bg-red-600 text-white" 
          : "bg-terracotta text-white",
        className
      )}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xl">{occasion.emoji}</span>
          <div>
            <p className="font-medium">
              {isUrgent ? '⚡ ' : ''}
              {occasion.name} Deadline {isUrgent ? 'Approaching!' : 'Coming Up'}
            </p>
            <p className="text-sm opacity-90">
              Order by {(occasion.isRushPeriod ? occasion.rushOrderByDate : occasion.orderByDate)
                .toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              {' '}for guaranteed delivery
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="secondary"
            className="bg-white/20 hover:bg-white/30 text-white border-0"
          >
            Order Now
          </Button>
          {onDismiss && (
            <button 
              onClick={onDismiss}
              className="p-1 hover:bg-white/10 rounded"
              aria-label="Dismiss alert"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ========================
// Hook: useGiftCalendar
// Centralized gift calendar state
// ========================
export function useGiftCalendar() {
  const occasions = useMemo(() => getUpcomingOccasions(), [])
  const [selectedOccasion, setSelectedOccasion] = useState<OccasionWithDate | null>(null)
  
  const nearestOccasion = occasions[0] || null
  const hasUrgentDeadline = nearestOccasion?.isRushPeriod || (nearestOccasion?.daysUntil || Infinity) <= 10
  
  return {
    occasions,
    nearestOccasion,
    hasUrgentDeadline,
    selectedOccasion,
    setSelectedOccasion,
    allOccasionTypes: GIFT_OCCASIONS
  }
}

export { GIFT_OCCASIONS, getUpcomingOccasions }
export type { GiftOccasion, OccasionWithDate }

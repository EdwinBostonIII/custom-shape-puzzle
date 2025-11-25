/**
 * Personalization.tsx - User Preference & Personalization Engine
 * 
 * Research-validated personalization component based on:
 * - McKinsey: Companies that excel at personalization generate 40% more revenue
 * - 71% of consumers expect personalized interactions
 * - 76% get frustrated when personalization doesn't happen
 * - Personalized communications drive 78% more repurchases
 * 
 * Features:
 * - User preference tracking (localStorage)
 * - Session memory for returning visitors
 * - Personalized tier recommendations
 * - Dynamic messaging based on behavior
 * - A/B test integration ready
 */

import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  useCallback, 
  ReactNode,
  useMemo 
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Heart, 
  Star, 
  Sparkle, 
  ArrowRight,
  Clock,
  Gift,
  Repeat,
  HandWaving,
  Lightning
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// ========================
// User Preference Types
// ========================
interface UserPreferences {
  // Visit behavior
  visitCount: number
  firstVisitDate: string
  lastVisitDate: string
  totalTimeSpent: number // seconds
  
  // Product preferences
  viewedTiers: string[]
  preferredTier: string | null
  viewedShapes: string[]
  preferredShape: string | null
  viewedColors: string[]
  preferredColor: string | null
  
  // Occasion preferences
  occasions: string[]
  upcomingOccasion: string | null
  occasionDate: string | null
  
  // Cart/Checkout behavior
  cartAbandoned: boolean
  abandonedAt: string | null
  abandonedTier: string | null
  abandonedStep: string | null
  
  // Conversion
  hasConverted: boolean
  conversionDate: string | null
  orderCount: number
  
  // Email
  email: string | null
  emailCaptured: boolean
  
  // Source tracking
  utmSource: string | null
  utmCampaign: string | null
  referrer: string | null
}

interface PersonalizationContextType {
  preferences: UserPreferences
  isReturningVisitor: boolean
  isFrequentVisitor: boolean
  hasAbandonedCart: boolean
  daysSinceLastVisit: number
  
  // Actions
  trackTierView: (tierId: string) => void
  trackShapeView: (shapeId: string) => void
  trackColorView: (colorId: string) => void
  trackOccasion: (occasionId: string, date?: Date) => void
  trackCartAbandonment: (tier: string, step: string) => void
  trackConversion: () => void
  trackEmail: (email: string) => void
  clearCartAbandonment: () => void
  
  // Recommendations
  getRecommendedTier: () => string
  getPersonalizedMessage: () => string
  getWelcomeMessage: () => string
}

const defaultPreferences: UserPreferences = {
  visitCount: 0,
  firstVisitDate: '',
  lastVisitDate: '',
  totalTimeSpent: 0,
  viewedTiers: [],
  preferredTier: null,
  viewedShapes: [],
  preferredShape: null,
  viewedColors: [],
  preferredColor: null,
  occasions: [],
  upcomingOccasion: null,
  occasionDate: null,
  cartAbandoned: false,
  abandonedAt: null,
  abandonedTier: null,
  abandonedStep: null,
  hasConverted: false,
  conversionDate: null,
  orderCount: 0,
  email: null,
  emailCaptured: false,
  utmSource: null,
  utmCampaign: null,
  referrer: null
}

const STORAGE_KEY = 'interlock_user_prefs'

// ========================
// Personalization Context
// ========================
const PersonalizationContext = createContext<PersonalizationContextType | null>(null)

export function PersonalizationProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences)
  const [isInitialized, setIsInitialized] = useState(false)
  
  // Load preferences from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as UserPreferences
        setPreferences(parsed)
      }
    } catch {
      // Ignore storage errors
    }
    setIsInitialized(true)
  }, [])
  
  // Track visit on mount
  useEffect(() => {
    if (!isInitialized) return
    
    const now = new Date().toISOString()
    const urlParams = new URLSearchParams(window.location.search)
    
    setPreferences(prev => {
      const updated: UserPreferences = {
        ...prev,
        visitCount: prev.visitCount + 1,
        firstVisitDate: prev.firstVisitDate || now,
        lastVisitDate: now,
        utmSource: urlParams.get('utm_source') || prev.utmSource,
        utmCampaign: urlParams.get('utm_campaign') || prev.utmCampaign,
        referrer: document.referrer || prev.referrer
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
    
    // Track time spent
    const startTime = Date.now()
    const handleUnload = () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000)
      setPreferences(prev => {
        const updated = { ...prev, totalTimeSpent: prev.totalTimeSpent + timeSpent }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        return updated
      })
    }
    
    window.addEventListener('beforeunload', handleUnload)
    return () => window.removeEventListener('beforeunload', handleUnload)
  }, [isInitialized])
  
  // Save preferences when they change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
    }
  }, [preferences, isInitialized])
  
  // Computed values
  const isReturningVisitor = preferences.visitCount > 1
  const isFrequentVisitor = preferences.visitCount >= 3
  const hasAbandonedCart = preferences.cartAbandoned
  
  const daysSinceLastVisit = useMemo(() => {
    if (!preferences.lastVisitDate) return 0
    const last = new Date(preferences.lastVisitDate)
    const now = new Date()
    return Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24))
  }, [preferences.lastVisitDate])
  
  // Actions
  const trackTierView = useCallback((tierId: string) => {
    setPreferences(prev => {
      const viewedTiers = prev.viewedTiers.includes(tierId) 
        ? prev.viewedTiers 
        : [...prev.viewedTiers, tierId]
      
      // Most viewed tier becomes preferred
      const tierCounts = viewedTiers.reduce((acc, t) => {
        acc[t] = (acc[t] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      const preferredTier = Object.entries(tierCounts)
        .sort(([, a], [, b]) => b - a)[0]?.[0] || null
      
      return { ...prev, viewedTiers, preferredTier }
    })
  }, [])
  
  const trackShapeView = useCallback((shapeId: string) => {
    setPreferences(prev => ({
      ...prev,
      viewedShapes: prev.viewedShapes.includes(shapeId) 
        ? prev.viewedShapes 
        : [...prev.viewedShapes, shapeId],
      preferredShape: shapeId // Most recent becomes preferred
    }))
  }, [])
  
  const trackColorView = useCallback((colorId: string) => {
    setPreferences(prev => ({
      ...prev,
      viewedColors: prev.viewedColors.includes(colorId) 
        ? prev.viewedColors 
        : [...prev.viewedColors, colorId],
      preferredColor: colorId
    }))
  }, [])
  
  const trackOccasion = useCallback((occasionId: string, date?: Date) => {
    setPreferences(prev => ({
      ...prev,
      occasions: prev.occasions.includes(occasionId) 
        ? prev.occasions 
        : [...prev.occasions, occasionId],
      upcomingOccasion: occasionId,
      occasionDate: date?.toISOString() || null
    }))
  }, [])
  
  const trackCartAbandonment = useCallback((tier: string, step: string) => {
    setPreferences(prev => ({
      ...prev,
      cartAbandoned: true,
      abandonedAt: new Date().toISOString(),
      abandonedTier: tier,
      abandonedStep: step
    }))
  }, [])
  
  const clearCartAbandonment = useCallback(() => {
    setPreferences(prev => ({
      ...prev,
      cartAbandoned: false,
      abandonedAt: null,
      abandonedTier: null,
      abandonedStep: null
    }))
  }, [])
  
  const trackConversion = useCallback(() => {
    setPreferences(prev => ({
      ...prev,
      hasConverted: true,
      conversionDate: new Date().toISOString(),
      orderCount: prev.orderCount + 1,
      cartAbandoned: false,
      abandonedAt: null,
      abandonedTier: null,
      abandonedStep: null
    }))
  }, [])
  
  const trackEmail = useCallback((email: string) => {
    setPreferences(prev => ({
      ...prev,
      email,
      emailCaptured: true
    }))
  }, [])
  
  // Recommendations
  const getRecommendedTier = useCallback((): string => {
    // Based on viewing behavior and abandonment
    if (preferences.abandonedTier) {
      return preferences.abandonedTier
    }
    if (preferences.preferredTier) {
      return preferences.preferredTier
    }
    // Default to Classic (best value, most popular)
    return 'classic'
  }, [preferences.abandonedTier, preferences.preferredTier])
  
  const getPersonalizedMessage = useCallback((): string => {
    // Cart abandonment recovery
    if (preferences.cartAbandoned && preferences.abandonedTier) {
      const tierNames: Record<string, string> = {
        essential: 'Essential',
        classic: 'Classic',
        grand: 'Grand',
        heirloom: 'Heirloom'
      }
      return `Your ${tierNames[preferences.abandonedTier] || ''} puzzle is waiting for you!`
    }
    
    // Occasion-based
    if (preferences.upcomingOccasion) {
      const occasionMessages: Record<string, string> = {
        christmas: "Still time to create the perfect Christmas gift!",
        valentines: "Make this Valentine's Day unforgettable!",
        'mothers-day': "Show Mom how much she means to you!",
        'fathers-day': "Dad deserves something special!",
        anniversary: "Celebrate your love story in pieces!",
        birthday: "A birthday gift they'll never forget!"
      }
      return occasionMessages[preferences.upcomingOccasion] || "Create a meaningful gift!"
    }
    
    // Frequent visitor
    if (isFrequentVisitor) {
      return "Welcome back! Ready to create your masterpiece?"
    }
    
    // Returning visitor
    if (isReturningVisitor) {
      return "Good to see you again! Your perfect puzzle awaits."
    }
    
    return "Transform your favorite photo into a keepsake puzzle."
  }, [preferences, isReturningVisitor, isFrequentVisitor])
  
  const getWelcomeMessage = useCallback((): string => {
    if (preferences.hasConverted) {
      return `Welcome back! Ready for another masterpiece?`
    }
    if (preferences.cartAbandoned) {
      return "Welcome back! Your puzzle is still waiting."
    }
    if (isFrequentVisitor) {
      return "Hey there! We saved your progress."
    }
    if (isReturningVisitor) {
      return "Welcome back! Great to see you again."
    }
    return "Welcome to INTERLOCK!"
  }, [preferences, isReturningVisitor, isFrequentVisitor])
  
  const value: PersonalizationContextType = {
    preferences,
    isReturningVisitor,
    isFrequentVisitor,
    hasAbandonedCart,
    daysSinceLastVisit,
    trackTierView,
    trackShapeView,
    trackColorView,
    trackOccasion,
    trackCartAbandonment,
    trackConversion,
    trackEmail,
    clearCartAbandonment,
    getRecommendedTier,
    getPersonalizedMessage,
    getWelcomeMessage
  }
  
  return (
    <PersonalizationContext.Provider value={value}>
      {children}
    </PersonalizationContext.Provider>
  )
}

export function usePersonalization() {
  const context = useContext(PersonalizationContext)
  if (!context) {
    throw new Error('usePersonalization must be used within PersonalizationProvider')
  }
  return context
}

// ========================
// COMPONENT: WelcomeBackBanner
// Personalized welcome for returning visitors
// ========================
interface WelcomeBackBannerProps {
  className?: string
  onResume?: () => void
}

export function WelcomeBackBanner({ className, onResume }: WelcomeBackBannerProps) {
  const { 
    isReturningVisitor, 
    hasAbandonedCart, 
    preferences,
    getWelcomeMessage,
    daysSinceLastVisit
  } = usePersonalization()
  
  const [isDismissed, setIsDismissed] = useState(false)
  
  if (!isReturningVisitor || isDismissed) return null
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "p-4 rounded-xl",
        hasAbandonedCart 
          ? "bg-terracotta/10 border-2 border-terracotta/30" 
          : "bg-sage/10 border border-sage/30",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            hasAbandonedCart ? "bg-terracotta/20" : "bg-sage/20"
          )}>
            {hasAbandonedCart ? (
              <Gift size={20} className="text-terracotta" />
            ) : (
              <HandWaving size={20} className="text-sage" />
            )}
          </div>
          
          <div>
            <h3 className="font-medium text-charcoal">
              {getWelcomeMessage()}
            </h3>
            
            {hasAbandonedCart && preferences.abandonedTier && (
              <p className="text-sm text-charcoal/60 mt-1">
                You left a {preferences.abandonedTier} puzzle in progress
                {preferences.abandonedStep && ` at the ${preferences.abandonedStep} step`}
              </p>
            )}
            
            {!hasAbandonedCart && daysSinceLastVisit > 0 && (
              <p className="text-sm text-charcoal/60 mt-1">
                It's been {daysSinceLastVisit} day{daysSinceLastVisit > 1 ? 's' : ''} since your last visit
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {hasAbandonedCart && onResume && (
            <Button 
              size="sm" 
              onClick={onResume}
              className="bg-terracotta hover:bg-terracotta/90"
            >
              Resume
              <ArrowRight size={14} className="ml-1" />
            </Button>
          )}
          
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 text-charcoal/40 hover:text-charcoal/60"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ========================
// COMPONENT: PersonalizedTierBadge
// Shows "Recommended for you" badge
// ========================
interface PersonalizedTierBadgeProps {
  tierId: string
  className?: string
}

export function PersonalizedTierBadge({ tierId, className }: PersonalizedTierBadgeProps) {
  const { getRecommendedTier, preferences } = usePersonalization()
  
  const isRecommended = getRecommendedTier() === tierId
  const wasAbandoned = preferences.abandonedTier === tierId
  
  if (!isRecommended && !wasAbandoned) return null
  
  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
      wasAbandoned 
        ? "bg-terracotta text-white" 
        : "bg-sage/20 text-sage",
      className
    )}>
      {wasAbandoned ? (
        <>
          <Repeat size={12} />
          Continue where you left off
        </>
      ) : (
        <>
          <Star size={12} weight="fill" />
          Recommended for you
        </>
      )}
    </span>
  )
}

// ========================
// COMPONENT: PersonalizedHero
// Dynamic hero content based on user
// ========================
interface PersonalizedHeroProps {
  className?: string
}

export function PersonalizedHero({ className }: PersonalizedHeroProps) {
  const { 
    isReturningVisitor, 
    hasAbandonedCart, 
    preferences,
    getPersonalizedMessage
  } = usePersonalization()
  
  const headline = useMemo(() => {
    if (preferences.hasConverted) {
      return "Create Another Masterpiece"
    }
    if (hasAbandonedCart) {
      return "Your Puzzle Awaits"
    }
    if (preferences.upcomingOccasion) {
      const occasionHeadlines: Record<string, string> = {
        christmas: "A Christmas Gift They'll Treasure",
        valentines: "Love, Piece by Piece",
        'mothers-day': "For the Best Mom Ever",
        'fathers-day': "Dad's New Favorite Gift",
        anniversary: "Celebrate Your Journey Together",
        birthday: "A Birthday to Remember"
      }
      return occasionHeadlines[preferences.upcomingOccasion] || "Create a Meaningful Gift"
    }
    return "Turn Your Photo Into a Masterpiece"
  }, [preferences, hasAbandonedCart])
  
  return (
    <div className={cn("text-center", className)}>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-charcoal mb-4">
        {headline}
      </h1>
      <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
        {getPersonalizedMessage()}
      </p>
    </div>
  )
}

// ========================
// COMPONENT: SmartRecommendation
// Shows tier recommendation with explanation
// ========================
interface SmartRecommendationProps {
  className?: string
  onSelectTier?: (tierId: string) => void
}

export function SmartRecommendation({ className, onSelectTier }: SmartRecommendationProps) {
  const { getRecommendedTier, preferences, isFrequentVisitor } = usePersonalization()
  
  const recommendedTier = getRecommendedTier()
  
  const tierInfo: Record<string, { name: string; reason: string }> = {
    essential: { 
      name: 'Essential', 
      reason: 'Perfect for first-time puzzlers' 
    },
    classic: { 
      name: 'Classic', 
      reason: 'Our most popular choice — best value for quality' 
    },
    grand: { 
      name: 'Grand', 
      reason: 'For those who want something extra special' 
    },
    heirloom: { 
      name: 'Heirloom', 
      reason: 'The ultimate keepsake for generations' 
    }
  }
  
  const tier = tierInfo[recommendedTier]
  if (!tier) return null
  
  const getRecommendationReason = () => {
    if (preferences.abandonedTier === recommendedTier) {
      return "Based on where you left off"
    }
    if (preferences.preferredTier === recommendedTier) {
      return "Based on what you've been viewing"
    }
    if (isFrequentVisitor) {
      return "Popular among returning visitors"
    }
    return tier.reason
  }
  
  return (
    <Card className={cn("border-terracotta/30 bg-terracotta/5", className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-terracotta/20 flex items-center justify-center">
              <Lightning size={20} className="text-terracotta" />
            </div>
            <div>
              <p className="text-xs text-terracotta font-medium uppercase tracking-wide">
                Recommended for You
              </p>
              <p className="font-display text-lg text-charcoal mt-0.5">
                {tier.name} Tier
              </p>
              <p className="text-sm text-charcoal/60 mt-1">
                {getRecommendationReason()}
              </p>
            </div>
          </div>
          
          {onSelectTier && (
            <Button 
              size="sm"
              onClick={() => onSelectTier(recommendedTier)}
              className="bg-terracotta hover:bg-terracotta/90"
            >
              Select
              <ArrowRight size={14} className="ml-1" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ========================
// COMPONENT: ReturningVisitorStats
// Shows returning visitor their history
// ========================
interface ReturningVisitorStatsProps {
  className?: string
}

export function ReturningVisitorStats({ className }: ReturningVisitorStatsProps) {
  const { preferences, isReturningVisitor } = usePersonalization()
  
  if (!isReturningVisitor) return null
  
  return (
    <div className={cn("flex items-center gap-4 text-sm text-charcoal/60", className)}>
      <span className="flex items-center gap-1">
        <Repeat size={14} className="text-sage" />
        Visit #{preferences.visitCount}
      </span>
      
      {preferences.viewedTiers.length > 0 && (
        <span className="flex items-center gap-1">
          <Star size={14} className="text-terracotta" />
          {preferences.viewedTiers.length} tier{preferences.viewedTiers.length > 1 ? 's' : ''} viewed
        </span>
      )}
      
      {preferences.hasConverted && (
        <span className="flex items-center gap-1">
          <Heart size={14} weight="fill" className="text-terracotta" />
          {preferences.orderCount} order{preferences.orderCount > 1 ? 's' : ''}
        </span>
      )}
    </div>
  )
}

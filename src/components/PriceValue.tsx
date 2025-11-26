/**
 * INTERLOCK CUSTOM PUZZLES - Price Value Demonstration Component
 * 
 * Research-backed component that justifies premium pricing through:
 * - Price anchoring (showing higher reference prices)
 * - Value stacking (demonstrating all included features)
 * - Cost-per-use calculations (showing long-term value)
 * - Comparison with alternatives (gift cards, experiences)
 * - Social proof integration (perceived value ratings)
 * 
 * Research basis:
 * - Price anchoring increases perceived value by 60-80% (Ariely, 2008)
 * - Value stacking increases conversion by 32% (Digital Marketer)
 * - Cost-per-use framing increases purchase intent 28% (Journal of Consumer Research)
 * - Comparison framing reduces price sensitivity 45% (McKinsey)
 */

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart,
  Gift,
  Star,
  Check,
  Clock,
  Calendar,
  Users,
  Sparkle,
  HandHeart,
  CurrencyDollar,
  Package,
  Certificate,
  PaintBrush,
  Timer,
  TreePalm,
  Cake,
  Crown,
  ShieldCheck,
  ArrowRight,
  Info,
  TrendUp,
  PuzzlePiece,
} from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

// ============================================================================
// TYPES
// ============================================================================

export type TierType = 'essential' | 'classic' | 'grand' | 'heirloom'

interface TierPricing {
  id: TierType
  name: string
  price: number
  pieces: number
  originalValue: number // Anchoring price
  features: string[]
  emotionalBenefits: string[]
  timeValue: number // Hours of enjoyment
  longevity: string // How long it lasts
}

interface AlternativeGift {
  name: string
  price: number
  pros: string[]
  cons: string[]
  emotionalScore: number // 1-10
  lastingValue: number // 1-10
}

interface PriceValueProps {
  selectedTier: TierType
  onTierSelect?: (tier: TierType) => void
  compact?: boolean
  showComparisons?: boolean
  className?: string
}

// ============================================================================
// TIER CONFIGURATIONS
// ============================================================================

const tierConfigs: TierPricing[] = [
  {
    id: 'essential',
    name: 'Essential',
    price: 89,
    pieces: 100,
    originalValue: 129,
    features: [
      'Custom shape design',
      'Premium photo printing',
      'Gift-ready packaging',
      'Artisan craftsmanship',
    ],
    emotionalBenefits: [
      'Perfect first-time gift',
      'Meaningful keepsake',
      'Sparks joy and connection',
    ],
    timeValue: 3,
    longevity: 'Lifetime keepsake',
  },
  {
    id: 'classic',
    name: 'Classic',
    price: 99,
    pieces: 200,
    originalValue: 149,
    features: [
      'Custom shape design',
      'Premium photo printing',
      'Elegant gift box',
      'Personalized hint card',
      'Priority processing',
    ],
    emotionalBenefits: [
      'Creates lasting memories',
      'Quality time together',
      'Conversation starter',
      'Display-worthy artwork',
    ],
    timeValue: 6,
    longevity: 'Generational keepsake',
  },
  {
    id: 'grand',
    name: 'Grand',
    price: 149,
    pieces: 500,
    originalValue: 219,
    features: [
      'Custom shape design',
      'Ultra HD photo printing',
      'Luxury presentation box',
      'Custom hint booklet',
      'Premium materials',
      'Express shipping included',
    ],
    emotionalBenefits: [
      'Statement anniversary gift',
      'Multi-session bonding',
      'Impressive presentation',
      'Museum-quality finish',
    ],
    timeValue: 12,
    longevity: 'Heirloom quality',
  },
  {
    id: 'heirloom',
    name: 'Heirloom',
    price: 199,
    pieces: 1000,
    originalValue: 299,
    features: [
      'Custom shape design',
      'Gallery-grade printing',
      'Handcrafted wooden box',
      'Complete hint set',
      'Certificate of authenticity',
      'White glove service',
      'Lifetime guarantee',
    ],
    emotionalBenefits: [
      'Ultimate expression of love',
      'Family tradition starter',
      'Investment in memories',
      'Passed down generations',
    ],
    timeValue: 20,
    longevity: 'Multi-generational heirloom',
  },
]

// Alternative gifts for comparison
const alternativeGifts: AlternativeGift[] = [
  {
    name: 'Generic Gift Card',
    price: 100,
    pros: ['Easy to buy', 'Flexible'],
    cons: ['Impersonal', 'Often forgotten', 'No lasting memory'],
    emotionalScore: 3,
    lastingValue: 2,
  },
  {
    name: 'Bouquet of Flowers',
    price: 75,
    pros: ['Beautiful', 'Traditional'],
    cons: ['Lasts 1 week', 'Forgotten quickly', 'No keepsake'],
    emotionalScore: 5,
    lastingValue: 1,
  },
  {
    name: 'Dinner for Two',
    price: 150,
    pros: ['Experience gift', 'Quality time'],
    cons: ['One evening only', 'No physical keepsake', 'Can\'t revisit'],
    emotionalScore: 7,
    lastingValue: 4,
  },
  {
    name: 'Generic Photo Frame',
    price: 50,
    pros: ['Displays photo', 'Affordable'],
    cons: ['Common gift', 'Passive display', 'Limited engagement'],
    emotionalScore: 4,
    lastingValue: 6,
  },
  {
    name: 'INTERLOCK Custom Puzzle',
    price: 99,
    pros: ['Deeply personal', 'Active experience', 'Lasting keepsake', 'Creates memories'],
    cons: [],
    emotionalScore: 10,
    lastingValue: 10,
  },
]

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface ValueStackItemProps {
  icon: React.ReactNode
  title: string
  value: string
  description?: string
  highlight?: boolean
}

function ValueStackItem({ icon, title, value, description, highlight }: ValueStackItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg transition-colors",
        highlight ? "bg-amber-50 dark:bg-amber-950/20" : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
      )}
    >
      <div className={cn(
        "p-2 rounded-full shrink-0",
        highlight ? "bg-amber-100 text-amber-600" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
      )}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-gray-900 dark:text-gray-100">{title}</span>
          <span className={cn(
            "text-sm font-semibold",
            highlight ? "text-amber-600" : "text-green-600"
          )}>
            {value}
          </span>
        </div>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
    </motion.div>
  )
}

interface CostPerUseProps {
  price: number
  hoursOfEnjoyment: number
  yearsOfMemories: number
}

function CostPerUseCalculator({ price, hoursOfEnjoyment, yearsOfMemories }: CostPerUseProps) {
  const costPerHour = (price / hoursOfEnjoyment).toFixed(2)
  const costPerYear = (price / yearsOfMemories).toFixed(2)
  const costPerMemory = (price / (hoursOfEnjoyment * 10)).toFixed(2) // Estimated memories created
  
  return (
    <Card className="border-2 border-dashed border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-900">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendUp className="w-5 h-5 text-green-600" />
          True Value Analysis
        </CardTitle>
        <CardDescription>
          When you consider the lasting impact...
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-green-600">${costPerHour}</div>
            <div className="text-xs text-gray-500">per hour of joy</div>
          </div>
          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-green-600">${costPerYear}</div>
            <div className="text-xs text-gray-500">per year owned</div>
          </div>
          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-green-600">${costPerMemory}</div>
            <div className="text-xs text-gray-500">per memory made</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
          <Check className="w-4 h-4" />
          <span>Compare to a $15 movie that lasts 2 hours = $7.50/hour</span>
        </div>
      </CardContent>
    </Card>
  )
}

interface GiftComparisonProps {
  selectedTier: TierPricing
}

function GiftComparison({ selectedTier }: GiftComparisonProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-purple-600" />
          How It Compares to Other Gifts
        </CardTitle>
        <CardDescription>
          Not all $100 gifts are created equal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alternativeGifts.map((gift, index) => (
            <motion.div
              key={gift.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "p-4 rounded-lg border",
                gift.name.includes('INTERLOCK')
                  ? "border-amber-300 bg-amber-50 dark:bg-amber-950/20"
                  : "border-gray-200 dark:border-gray-700"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className={cn(
                    "font-semibold",
                    gift.name.includes('INTERLOCK') && "text-amber-700 dark:text-amber-400"
                  )}>
                    {gift.name}
                    {gift.name.includes('INTERLOCK') && (
                      <Badge className="ml-2 bg-amber-100 text-amber-700">Your Choice</Badge>
                    )}
                  </h4>
                  <span className="text-sm text-gray-500">${gift.price}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-xs font-medium text-gray-500 mb-1">Emotional Impact</div>
                  <div className="flex items-center gap-2">
                    <Progress value={gift.emotionalScore * 10} className="h-2" />
                    <span className="text-xs font-medium">{gift.emotionalScore}/10</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500 mb-1">Lasting Value</div>
                  <div className="flex items-center gap-2">
                    <Progress value={gift.lastingValue * 10} className="h-2" />
                    <span className="text-xs font-medium">{gift.lastingValue}/10</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="space-y-1">
                  {gift.pros.map((pro, i) => (
                    <div key={i} className="flex items-center gap-1 text-green-600">
                      <Check className="w-3 h-3" />
                      <span>{pro}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-1">
                  {gift.cons.map((con, i) => (
                    <div key={i} className="flex items-center gap-1 text-red-500">
                      <span className="w-3 h-3 flex items-center justify-center">×</span>
                      <span>{con}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface PriceAnchorProps {
  currentPrice: number
  originalValue: number
  savings: number
}

function PriceAnchor({ currentPrice, originalValue, savings }: PriceAnchorProps) {
  const savingsPercent = Math.round((savings / originalValue) * 100)
  
  return (
    <div className="flex items-center justify-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-lg">
      <div className="text-center">
        <div className="text-sm text-gray-500 line-through">${originalValue}</div>
        <div className="text-xs text-gray-400">Comparable value</div>
      </div>
      <ArrowRight className="w-5 h-5 text-amber-600" />
      <div className="text-center">
        <div className="text-3xl font-bold text-amber-600">${currentPrice}</div>
        <div className="text-xs text-amber-600 font-medium">Your price</div>
      </div>
      <Badge className="bg-green-100 text-green-700 border-green-200">
        Save ${savings} ({savingsPercent}%)
      </Badge>
    </div>
  )
}

interface EmotionalValueProps {
  benefits: string[]
  tier: string
}

function EmotionalValue({ benefits, tier }: EmotionalValueProps) {
  const icons = [Heart, Sparkle, Users, Crown]
  
  return (
    <Card className="border-rose-200 bg-rose-50/50 dark:bg-rose-950/20 dark:border-rose-900">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2 text-rose-700 dark:text-rose-400">
          <Heart className="w-5 h-5" weight="fill" />
          The Emotional Value
        </CardTitle>
        <CardDescription>
          What you can't put a price on
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {benefits.map((benefit, index) => {
            const Icon = icons[index % icons.length]
            return (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg"
              >
                <Icon className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="text-sm">{benefit}</span>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function PriceValue({
  selectedTier,
  onTierSelect,
  compact = false,
  showComparisons = true,
  className,
}: PriceValueProps) {
  const [showDetails, setShowDetails] = useState(!compact)
  
  const tierConfig = useMemo(() => 
    tierConfigs.find(t => t.id === selectedTier) || tierConfigs[1],
    [selectedTier]
  )
  
  const savings = tierConfig.originalValue - tierConfig.price
  
  // Value stack items
  const valueItems = useMemo(() => [
    {
      icon: <PuzzlePiece className="w-4 h-4" />,
      title: 'Custom shape design',
      value: '$25 value',
      description: 'Unique silhouette crafted just for you',
    },
    {
      icon: <PaintBrush className="w-4 h-4" />,
      title: 'Artisan craftsmanship',
      value: '$35 value',
      description: 'Hand-finished by skilled craftspeople',
    },
    {
      icon: <Package className="w-4 h-4" />,
      title: 'Premium gift packaging',
      value: '$20 value',
      description: 'Ready to gift, no wrapping needed',
    },
    {
      icon: <ShieldCheck className="w-4 h-4" />,
      title: 'Satisfaction guarantee',
      value: 'Priceless',
      description: 'Love it or your money back',
      highlight: true,
    },
    {
      icon: <Clock className="w-4 h-4" />,
      title: `${tierConfig.timeValue}+ hours of enjoyment`,
      value: `$${tierConfig.timeValue * 15} value`,
      description: 'Quality time with loved ones',
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      title: tierConfig.longevity,
      value: 'Priceless',
      description: 'A gift that keeps giving',
      highlight: true,
    },
  ], [tierConfig])
  
  if (compact) {
    return (
      <TooltipProvider>
        <div className={cn("space-y-4", className)}>
          {/* Compact price anchor */}
          <PriceAnchor
            currentPrice={tierConfig.price}
            originalValue={tierConfig.originalValue}
            savings={savings}
          />
          
          {/* Quick value highlights */}
          <div className="flex flex-wrap gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="cursor-help">
                  <Clock className="w-3 h-3 mr-1" />
                  {tierConfig.timeValue}+ hrs of joy
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Hours of quality time together</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="cursor-help">
                  <Heart className="w-3 h-3 mr-1" />
                  Lifetime keepsake
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Cherished for generations</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="cursor-help">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  Guaranteed
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>100% satisfaction guaranteed</p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="w-full"
          >
            {showDetails ? 'Hide' : 'See'} full value breakdown
            <ArrowRight className={cn(
              "w-4 h-4 ml-2 transition-transform",
              showDetails && "rotate-90"
            )} />
          </Button>
          
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-2 pt-2">
                  {valueItems.map((item, index) => (
                    <ValueStackItem key={index} {...item} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </TooltipProvider>
    )
  }
  
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Why INTERLOCK is Worth Every Penny
        </h2>
        <p className="text-gray-500 mt-2">
          A deeper look at what you're getting with the {tierConfig.name} puzzle
        </p>
      </div>
      
      {/* Price anchor */}
      <PriceAnchor
        currentPrice={tierConfig.price}
        originalValue={tierConfig.originalValue}
        savings={savings}
      />
      
      {/* Value stack */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CurrencyDollar className="w-5 h-5 text-green-600" />
            Everything You're Getting
          </CardTitle>
          <CardDescription>
            Totaling over ${tierConfig.originalValue} in value
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          {valueItems.map((item, index) => (
            <ValueStackItem key={index} {...item} />
          ))}
        </CardContent>
      </Card>
      
      {/* Cost per use calculator */}
      <CostPerUseCalculator
        price={tierConfig.price}
        hoursOfEnjoyment={tierConfig.timeValue}
        yearsOfMemories={50} // Lifetime keepsake
      />
      
      {/* Emotional value */}
      <EmotionalValue
        benefits={tierConfig.emotionalBenefits}
        tier={tierConfig.name}
      />
      
      {/* Gift comparison */}
      {showComparisons && <GiftComparison selectedTier={tierConfig} />}
      
      {/* Tier selector (if callback provided) */}
      {onTierSelect && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Compare Tiers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {tierConfigs.map((tier) => (
                <Button
                  key={tier.id}
                  variant={selectedTier === tier.id ? 'default' : 'outline'}
                  className={cn(
                    "flex flex-col h-auto py-3",
                    selectedTier === tier.id && "ring-2 ring-amber-500"
                  )}
                  onClick={() => onTierSelect(tier.id)}
                >
                  <span className="font-semibold">{tier.name}</span>
                  <span className="text-sm opacity-80">${tier.price}</span>
                  <span className="text-xs opacity-60">{tier.pieces} pieces</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Trust footer */}
      <div className="flex items-center justify-center gap-6 text-sm text-gray-500 py-4 border-t">
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-green-600" />
          <span>100% Satisfaction Guaranteed</span>
        </div>
        <div className="flex items-center gap-1">
          <Certificate className="w-4 h-4 text-amber-600" />
          <span>Artisan Quality</span>
        </div>
        <div className="flex items-center gap-1">
          <Gift className="w-4 h-4 text-purple-600" />
          <span>Gift Ready</span>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// MINI PRICE JUSTIFIER (for use in checkout)
// ============================================================================

interface MiniPriceJustifierProps {
  price: number
  tier: TierType
}

export function MiniPriceJustifier({ price, tier }: MiniPriceJustifierProps) {
  const tierConfig = tierConfigs.find(t => t.id === tier) || tierConfigs[1]
  const costPerHour = (price / tierConfig.timeValue).toFixed(2)
  
  return (
    <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-green-800 dark:text-green-200">
            💚 Great value for memories
          </div>
          <div className="text-xs text-green-600 dark:text-green-400">
            Only ${costPerHour}/hour of quality time • Lasts a lifetime
          </div>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Info className="w-4 h-4 text-green-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-xs">
              <p className="text-sm">
                Compare to a $15 movie (2 hrs) at $7.50/hr, or a $100 dinner 
                (3 hrs) at $33/hr. Your puzzle provides {tierConfig.timeValue}+ 
                hours of joy and lasts forever!
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}

// ============================================================================
// EXPORTS
// ============================================================================

export { tierConfigs, alternativeGifts }
export type { TierPricing, AlternativeGift }

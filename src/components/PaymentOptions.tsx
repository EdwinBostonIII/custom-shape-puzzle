/**
 * PaymentOptions.tsx - Buy Now Pay Later Integration
 * 
 * Research-validated BNPL component based on:
 * - Klarna data: 40% higher AOV, 20% conversion increase, 46% higher purchase frequency
 * - Shopify 2024: BNPL is essential payment option
 * - Payment flexibility messaging increases checkout completion
 * 
 * Features:
 * - BNPL provider messaging (Klarna, Afterpay, Affirm)
 * - Dynamic installment calculations
 * - Payment method badges
 * - Checkout integration
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CreditCard, 
  Clock, 
  ShieldCheck, 
  Info, 
  CaretDown, 
  CaretUp,
  CheckCircle,
  Wallet,
  CurrencyDollar,
  Calendar,
  LockSimple
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

// BNPL Provider configurations
const BNPL_PROVIDERS = {
  klarna: {
    name: 'Klarna',
    logo: '💳', // In production, use actual Klarna logo
    color: '#FFB3C7', // Klarna pink
    textColor: '#17120F',
    installments: 4,
    interval: 'bi-weekly',
    noInterest: true,
    noFees: true,
    description: 'Pay in 4 interest-free payments'
  },
  afterpay: {
    name: 'Afterpay',
    logo: '💠',
    color: '#B2FCE4',
    textColor: '#000000',
    installments: 4,
    interval: 'bi-weekly',
    noInterest: true,
    noFees: true,
    description: 'Pay in 4 interest-free installments'
  },
  affirm: {
    name: 'Affirm',
    logo: '✨',
    color: '#0FA0EA',
    textColor: '#FFFFFF',
    installments: 12,
    interval: 'monthly',
    noInterest: false,
    noFees: true,
    description: 'Pay over time from 0% APR'
  }
} as const

type BNPLProvider = keyof typeof BNPL_PROVIDERS

interface InstallmentCalculation {
  provider: BNPLProvider
  totalPrice: number
  installmentAmount: number
  installments: number
  interval: string
  dueDate: string
}

// Calculate installment amounts
function calculateInstallments(price: number, provider: BNPLProvider): InstallmentCalculation {
  const config = BNPL_PROVIDERS[provider]
  const installmentAmount = price / config.installments
  
  // Calculate first due date (2 weeks from now for bi-weekly, 1 month for monthly)
  const dueDate = new Date()
  if (config.interval === 'bi-weekly') {
    dueDate.setDate(dueDate.getDate() + 14)
  } else {
    dueDate.setMonth(dueDate.getMonth() + 1)
  }
  
  return {
    provider,
    totalPrice: price,
    installmentAmount: Math.ceil(installmentAmount * 100) / 100, // Round up to nearest cent
    installments: config.installments,
    interval: config.interval,
    dueDate: dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
}

// ========================
// COMPONENT: BNPLBadge
// Small badge for product cards and tier selection
// ========================
interface BNPLBadgeProps {
  price: number
  provider?: BNPLProvider
  className?: string
  compact?: boolean
}

export function BNPLBadge({ price, provider = 'klarna', className, compact = false }: BNPLBadgeProps) {
  const calculation = calculateInstallments(price, provider)
  const config = BNPL_PROVIDERS[provider]
  
  if (compact) {
    return (
      <span 
        className={cn(
          "inline-flex items-center gap-1 text-xs font-medium",
          className
        )}
        aria-label={`Or pay as low as $${calculation.installmentAmount.toFixed(2)} per ${config.interval === 'bi-weekly' ? 'payment' : 'month'} with ${config.name}`}
      >
        <span className="text-sage">or</span>
        <span className="font-semibold text-charcoal">
          ${calculation.installmentAmount.toFixed(2)}/mo
        </span>
        <span className="text-sage">×{calculation.installments}</span>
      </span>
    )
  }
  
  return (
    <div 
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm",
        "bg-terracotta/10 text-charcoal border border-terracotta/20",
        className
      )}
      role="note"
      aria-label={`Payment plan available: ${calculation.installments} payments of $${calculation.installmentAmount.toFixed(2)} with ${config.name}`}
    >
      <CreditCard size={16} weight="duotone" className="text-terracotta" aria-hidden="true" />
      <span className="font-medium">
        ${calculation.installmentAmount.toFixed(2)}
      </span>
      <span className="text-charcoal/60">×{calculation.installments}</span>
      <span className="text-xs text-charcoal/50">interest-free</span>
    </div>
  )
}

// ========================
// COMPONENT: BNPLInfoCard
// Expandable info card showing payment options
// ========================
interface BNPLInfoCardProps {
  price: number
  className?: string
  defaultExpanded?: boolean
}

export function BNPLInfoCard({ price, className, defaultExpanded = false }: BNPLInfoCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [selectedProvider, setSelectedProvider] = useState<BNPLProvider>('klarna')
  
  const calculation = calculateInstallments(price, selectedProvider)
  const config = BNPL_PROVIDERS[selectedProvider]
  
  return (
    <Card className={cn("border-sage/30 overflow-hidden", className)}>
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-sage/5 transition-colors"
        aria-expanded={isExpanded}
        aria-controls="bnpl-details"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-terracotta/10 flex items-center justify-center">
            <Wallet size={20} className="text-terracotta" />
          </div>
          <div className="text-left">
            <p className="font-medium text-charcoal">Pay Later Options</p>
            <p className="text-sm text-charcoal/60">
              Split into {calculation.installments} payments of ${calculation.installmentAmount.toFixed(2)}
            </p>
          </div>
        </div>
        {isExpanded ? (
          <CaretUp size={20} className="text-charcoal/40" />
        ) : (
          <CaretDown size={20} className="text-charcoal/40" />
        )}
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            id="bnpl-details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="pt-0 pb-4 px-4 space-y-4">
              {/* Provider Selection */}
              <div className="flex gap-2">
                {(Object.keys(BNPL_PROVIDERS) as BNPLProvider[]).map((provider) => {
                  const providerConfig = BNPL_PROVIDERS[provider]
                  const isSelected = selectedProvider === provider
                  
                  return (
                    <button
                      key={provider}
                      type="button"
                      onClick={() => setSelectedProvider(provider)}
                      className={cn(
                        "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all",
                        "border-2",
                        isSelected 
                          ? "border-terracotta bg-terracotta/5" 
                          : "border-stone/30 hover:border-stone"
                      )}
                      aria-pressed={isSelected}
                    >
                      <span className="mr-1">{providerConfig.logo}</span>
                      {providerConfig.name}
                    </button>
                  )
                })}
              </div>
              
              {/* Payment Schedule */}
              <div 
                className="p-4 rounded-lg bg-cream border border-stone/20"
                style={{ 
                  background: `linear-gradient(135deg, ${config.color}15 0%, transparent 50%)` 
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{config.logo}</span>
                  <span className="font-medium">{config.name}</span>
                  {config.noInterest && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-sage/20 text-sage font-medium">
                      0% Interest
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {Array.from({ length: calculation.installments }).map((_, i) => {
                    const paymentDate = new Date()
                    if (config.interval === 'bi-weekly') {
                      paymentDate.setDate(paymentDate.getDate() + (i * 14))
                    } else {
                      paymentDate.setMonth(paymentDate.getMonth() + i)
                    }
                    
                    return (
                      <div 
                        key={i} 
                        className={cn(
                          "text-center p-2 rounded-lg",
                          i === 0 ? "bg-terracotta/10 border border-terracotta/30" : "bg-stone/10"
                        )}
                      >
                        <p className="text-xs text-charcoal/50 mb-1">
                          {i === 0 ? 'Today' : paymentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                        <p className="font-semibold text-charcoal">
                          ${calculation.installmentAmount.toFixed(2)}
                        </p>
                      </div>
                    )
                  })}
                </div>
                
                <p className="text-xs text-charcoal/60 leading-relaxed">
                  {config.description}. {config.noFees && 'No hidden fees.'} Split your total of{' '}
                  <span className="font-medium">${price.toFixed(2)}</span> into easy payments.
                </p>
              </div>
              
              {/* Trust Badges */}
              <div className="flex items-center gap-4 text-xs text-charcoal/60">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={14} className="text-sage" />
                  Buyer protection
                </span>
                <span className="flex items-center gap-1">
                  <LockSimple size={14} className="text-sage" />
                  Secure checkout
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle size={14} className="text-sage" />
                  Instant approval
                </span>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

// ========================
// COMPONENT: CheckoutBNPLSection
// Full BNPL section for checkout page
// ========================
interface CheckoutBNPLSectionProps {
  price: number
  onSelectBNPL?: (provider: BNPLProvider) => void
  className?: string
}

export function CheckoutBNPLSection({ price, onSelectBNPL, className }: CheckoutBNPLSectionProps) {
  const [selectedProvider, setSelectedProvider] = useState<BNPLProvider | null>(null)
  
  const handleSelectProvider = (provider: BNPLProvider) => {
    setSelectedProvider(provider)
    onSelectBNPL?.(provider)
  }
  
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-charcoal">Pay Later</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                type="button" 
                className="text-charcoal/40 hover:text-charcoal/60"
                aria-label="Learn more about pay later options"
              >
                <Info size={18} aria-hidden="true" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-sm">
                Split your purchase into interest-free payments. Quick approval, no credit check impact.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="grid gap-3">
        {(Object.keys(BNPL_PROVIDERS) as BNPLProvider[]).map((provider) => {
          const config = BNPL_PROVIDERS[provider]
          const calculation = calculateInstallments(price, provider)
          const isSelected = selectedProvider === provider
          
          return (
            <button
              key={provider}
              type="button"
              onClick={() => handleSelectProvider(provider)}
              className={cn(
                "w-full p-4 rounded-xl text-left transition-all",
                "border-2 flex items-center justify-between gap-4",
                "hover:shadow-md",
                isSelected 
                  ? "border-terracotta bg-terracotta/5 shadow-md" 
                  : "border-stone/30 bg-white hover:border-stone"
              )}
              aria-pressed={isSelected}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${config.color}30` }}
                >
                  {config.logo}
                </div>
                <div>
                  <p className="font-medium text-charcoal flex items-center gap-2">
                    {config.name}
                    {config.noInterest && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-sage/20 text-sage font-medium">
                        0% APR
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-charcoal/60">
                    {calculation.installments} payments of ${calculation.installmentAmount.toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                isSelected 
                  ? "border-terracotta bg-terracotta" 
                  : "border-stone/40"
              )}>
                {isSelected && (
                  <CheckCircle size={16} weight="fill" className="text-white" />
                )}
              </div>
            </button>
          )
        })}
      </div>
      
      {selectedProvider && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-sage/10 border border-sage/30"
        >
          <div className="flex items-start gap-3">
            <CheckCircle size={20} className="text-sage flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-charcoal">
                {BNPL_PROVIDERS[selectedProvider].name} selected
              </p>
              <p className="text-xs text-charcoal/60 mt-1">
                You'll complete the {BNPL_PROVIDERS[selectedProvider].name} checkout after reviewing your order.
                First payment of ${calculateInstallments(price, selectedProvider).installmentAmount.toFixed(2)} due today.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// ========================
// COMPONENT: PriceWithBNPL
// Price display with BNPL option inline
// ========================
interface PriceWithBNPLProps {
  price: number
  provider?: BNPLProvider
  className?: string
  showProvider?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function PriceWithBNPL({ 
  price, 
  provider = 'klarna', 
  className, 
  showProvider = false,
  size = 'md' 
}: PriceWithBNPLProps) {
  const calculation = calculateInstallments(price, provider)
  const config = BNPL_PROVIDERS[provider]
  
  const sizes = {
    sm: { price: 'text-xl', installment: 'text-xs' },
    md: { price: 'text-2xl', installment: 'text-sm' },
    lg: { price: 'text-3xl', installment: 'text-base' }
  }
  
  return (
    <div className={cn("space-y-1", className)}>
      <p className={cn("font-bold text-charcoal", sizes[size].price)}>
        ${price.toFixed(2)}
      </p>
      <p className={cn("text-charcoal/60", sizes[size].installment)}>
        or{' '}
        <span className="font-medium text-terracotta">
          ${calculation.installmentAmount.toFixed(2)}
        </span>
        {' '}× {calculation.installments}
        {showProvider && (
          <span className="text-charcoal/40"> with {config.name}</span>
        )}
      </p>
    </div>
  )
}

// ========================
// COMPONENT: BNPLPromoBanner
// Promotional banner for homepage/product pages
// ========================
interface BNPLPromoBannerProps {
  minPrice: number
  maxPrice: number
  className?: string
}

export function BNPLPromoBanner({ minPrice, maxPrice, className }: BNPLPromoBannerProps) {
  const minCalc = calculateInstallments(minPrice, 'klarna')
  const maxCalc = calculateInstallments(maxPrice, 'klarna')
  
  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-2xl p-6",
        "bg-gradient-to-r from-terracotta/10 via-cream to-sage/10",
        "border border-terracotta/20",
        className
      )}
    >
      <div className="flex items-center justify-between gap-6 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center">
            <Wallet size={28} className="text-terracotta" />
          </div>
          <div>
            <h3 className="font-display text-lg text-charcoal">
              Buy Now, Pay Later
            </h3>
            <p className="text-sm text-charcoal/60 mt-0.5">
              Split your purchase from{' '}
              <span className="font-medium">${minCalc.installmentAmount.toFixed(2)}</span>
              {' '}to{' '}
              <span className="font-medium">${maxCalc.installmentAmount.toFixed(2)}</span>
              {' '}per payment
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {(['klarna', 'afterpay', 'affirm'] as BNPLProvider[]).map((provider) => {
            const config = BNPL_PROVIDERS[provider]
            return (
              <div 
                key={provider}
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl bg-white shadow-sm border border-stone/20"
                title={config.name}
              >
                {config.logo}
              </div>
            )
          })}
        </div>
      </div>
      
      <div className="flex items-center gap-6 mt-4 text-xs text-charcoal/50">
        <span className="flex items-center gap-1">
          <CheckCircle size={14} className="text-sage" />
          0% interest on select plans
        </span>
        <span className="flex items-center gap-1">
          <Clock size={14} className="text-sage" />
          Instant approval
        </span>
        <span className="flex items-center gap-1">
          <ShieldCheck size={14} className="text-sage" />
          No hidden fees
        </span>
      </div>
    </div>
  )
}

// ========================
// COMPONENT: InlinePaymentMessaging
// Subtle inline BNPL messaging for tier cards
// ========================
interface InlinePaymentMessagingProps {
  price: number
  className?: string
}

export function InlinePaymentMessaging({ price, className }: InlinePaymentMessagingProps) {
  const calculation = calculateInstallments(price, 'klarna')
  
  return (
    <p className={cn("text-xs text-charcoal/50 flex items-center gap-1", className)}>
      <CurrencyDollar size={12} className="text-terracotta" />
      or {calculation.installments}x ${calculation.installmentAmount.toFixed(2)} interest-free
    </p>
  )
}

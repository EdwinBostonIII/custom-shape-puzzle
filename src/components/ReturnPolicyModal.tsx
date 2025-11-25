/**
 * ReturnPolicyModal - Research-backed return policy visibility
 * 
 * Based on CRO research findings:
 * - 67% of shoppers check return policy before purchasing
 * - Clear return policies reduce cart abandonment by 18-25%
 * - "Hassle-free returns" is a top-3 purchase driver after price and free shipping
 * - Risk reversal messaging increases conversion by 15%
 */

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft,
  ShieldCheck,
  Package,
  CheckCircle,
  X,
  Clock,
  HandHeart,
  Sparkle,
  Phone,
  EnvelopeSimple,
  ChatCircle
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

// ============================================================================
// RETURN POLICY DATA
// ============================================================================

const RETURN_POLICY = {
  headline: "Love It or We'll Fix It — Guaranteed",
  subheadline: "We stand behind every puzzle we create. If something's not right, we make it right.",
  
  guarantees: [
    {
      id: 'quality',
      icon: ShieldCheck,
      title: '30-Day Quality Guarantee',
      description: 'If any piece is damaged, warped, or missing, we\'ll replace the entire puzzle for free.',
    },
    {
      id: 'satisfaction',
      icon: HandHeart,
      title: '100% Satisfaction Promise',
      description: 'Not happy with how it turned out? We\'ll remake it with your feedback or issue a full refund.',
    },
    {
      id: 'shipping',
      icon: Package,
      title: 'Free Return Shipping',
      description: 'We\'ll send you a prepaid label. Never pay for return shipping on defective items.',
    },
    {
      id: 'response',
      icon: Clock,
      title: '24-Hour Response',
      description: 'Email us anytime and get a response within 24 hours (usually much faster).',
    },
  ],

  process: [
    { step: 1, title: 'Contact Us', description: 'Email hello@interlockpuzzle.com with your order number and issue' },
    { step: 2, title: 'We Assess', description: 'We\'ll review within 24 hours and propose a solution' },
    { step: 3, title: 'We Resolve', description: 'Replacement shipped or refund processed immediately' },
  ],

  faqs: [
    {
      question: 'What if I made a mistake in my design?',
      answer: 'Contact us before production begins and we\'ll help you make changes at no extra cost. If the puzzle is already in production, we\'ll work with you on options.'
    },
    {
      question: 'How long do I have to report an issue?',
      answer: '30 days from delivery. Most issues are reported within the first week when you open and start solving your puzzle.'
    },
    {
      question: 'Will I need to return the defective puzzle?',
      answer: 'Usually not. For most issues, we\'ll ship a replacement without requiring the original back. For refunds on unassembled puzzles, we may request a return.'
    },
    {
      question: 'What if a piece is lost after I\'ve solved it?',
      answer: 'We can create and ship individual replacement pieces for up to 1 year after purchase. Just email us with your order number.'
    },
  ],

  contact: {
    email: 'hello@interlockpuzzle.com',
    responseTime: '< 24 hours',
    hours: 'Mon-Fri 9am-6pm EST',
  }
}

// ============================================================================
// INLINE POLICY BADGE - For product pages
// ============================================================================

interface PolicyBadgeProps {
  variant?: 'compact' | 'full'
  className?: string
  onClick?: () => void
}

export function PolicyBadge({ variant = 'compact', className, onClick }: PolicyBadgeProps) {
  if (variant === 'compact') {
    return (
      <button 
        onClick={onClick}
        className={`inline-flex items-center gap-1.5 text-sm text-charcoal/70 hover:text-charcoal transition-colors underline-offset-2 hover:underline ${className}`}
        aria-label="View our return policy"
      >
        <ShieldCheck size={14} className="text-sage" weight="fill" />
        30-Day Guarantee
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 p-3 bg-sage/5 rounded-xl border border-sage/20 hover:border-sage/40 transition-colors w-full text-left ${className}`}
      aria-label="View our return policy"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center">
        <ShieldCheck size={20} className="text-sage" weight="fill" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-charcoal">30-Day Guarantee</p>
        <p className="text-xs text-charcoal/60">Love it or full refund</p>
      </div>
      <ArrowLeft size={16} className="text-charcoal/40 rotate-180" />
    </button>
  )
}

// ============================================================================
// FULL RETURN POLICY MODAL
// ============================================================================

interface ReturnPolicyModalProps {
  trigger?: React.ReactNode
  className?: string
}

export function ReturnPolicyModal({ trigger, className }: ReturnPolicyModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  const defaultTrigger = (
    <PolicyBadge variant="full" onClick={() => setIsOpen(true)} />
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-sage/10 flex items-center justify-center">
              <ShieldCheck size={24} className="text-sage" weight="fill" />
            </div>
            <div>
              <DialogTitle className="text-xl font-display">
                {RETURN_POLICY.headline}
              </DialogTitle>
              <DialogDescription className="text-charcoal/60">
                {RETURN_POLICY.subheadline}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-8 pt-4">
          {/* Main Guarantees */}
          <div className="grid sm:grid-cols-2 gap-4">
            {RETURN_POLICY.guarantees.map((guarantee) => (
              <div 
                key={guarantee.id}
                className="p-4 rounded-xl border border-stone/50 bg-stone/5"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-sage/10 flex items-center justify-center">
                    <guarantee.icon size={16} className="text-sage" weight="fill" />
                  </div>
                  <div>
                    <p className="font-semibold text-charcoal text-sm">{guarantee.title}</p>
                    <p className="text-xs text-charcoal/60 mt-1">{guarantee.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* How It Works */}
          <div>
            <h3 className="font-display font-semibold text-charcoal mb-4">How Returns Work</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              {RETURN_POLICY.process.map((step, index) => (
                <div key={step.step} className="flex-1 relative">
                  {index < RETURN_POLICY.process.length - 1 && (
                    <div className="hidden sm:block absolute top-4 left-full w-full h-px bg-stone/30 -translate-x-1/2" />
                  )}
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-terracotta/10 flex items-center justify-center text-terracotta font-bold text-sm">
                      {step.step}
                    </div>
                    <div>
                      <p className="font-medium text-charcoal text-sm">{step.title}</p>
                      <p className="text-xs text-charcoal/60 mt-0.5">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div>
            <h3 className="font-display font-semibold text-charcoal mb-4">Common Questions</h3>
            <div className="space-y-3">
              {RETURN_POLICY.faqs.map((faq, index) => (
                <details 
                  key={index} 
                  className="group p-3 rounded-lg border border-stone/30 bg-white hover:border-stone/50 transition-colors"
                >
                  <summary className="font-medium text-sm text-charcoal cursor-pointer list-none flex items-center justify-between">
                    {faq.question}
                    <Sparkle 
                      size={14} 
                      className="text-charcoal/30 group-open:rotate-180 transition-transform" 
                    />
                  </summary>
                  <p className="mt-2 text-xs text-charcoal/70 leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="p-4 rounded-xl bg-terracotta/5 border border-terracotta/20">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-terracotta/10 flex items-center justify-center">
                <ChatCircle size={20} className="text-terracotta" weight="fill" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-charcoal text-sm">Need Help?</p>
                <p className="text-xs text-charcoal/60 mt-1">
                  Email us at{' '}
                  <a 
                    href={`mailto:${RETURN_POLICY.contact.email}`}
                    className="text-terracotta hover:underline"
                  >
                    {RETURN_POLICY.contact.email}
                  </a>
                </p>
                <p className="text-xs text-charcoal/50 mt-0.5">
                  Response time: {RETURN_POLICY.contact.responseTime} · {RETURN_POLICY.contact.hours}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ============================================================================
// CHECKOUT GUARANTEE STRIP
// ============================================================================

interface CheckoutGuaranteeProps {
  className?: string
}

export function CheckoutGuarantee({ className }: CheckoutGuaranteeProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className={`p-4 rounded-xl bg-sage/5 border border-sage/20 ${className}`}>
        <div className="flex items-center gap-3">
          <ShieldCheck size={24} className="text-sage flex-shrink-0" weight="fill" />
          <div className="flex-1">
            <p className="font-semibold text-charcoal text-sm">Risk-Free Guarantee</p>
            <p className="text-xs text-charcoal/60">
              30-day returns · Free shipping · Love it or full refund
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-xs text-sage hover:text-sage/80 underline underline-offset-2"
          >
            Details
          </button>
        </div>
      </div>
      
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-sage/10 flex items-center justify-center">
                <ShieldCheck size={24} className="text-sage" weight="fill" />
              </div>
              <div>
                <DialogTitle className="text-xl font-display">
                  {RETURN_POLICY.headline}
                </DialogTitle>
                <DialogDescription className="text-charcoal/60">
                  {RETURN_POLICY.subheadline}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {RETURN_POLICY.guarantees.map((guarantee) => (
                <div 
                  key={guarantee.id}
                  className="p-4 rounded-xl border border-stone/50 bg-stone/5"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-sage/10 flex items-center justify-center">
                      <guarantee.icon size={16} className="text-sage" weight="fill" />
                    </div>
                    <div>
                      <p className="font-semibold text-charcoal text-sm">{guarantee.title}</p>
                      <p className="text-xs text-charcoal/60 mt-1">{guarantee.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 rounded-xl bg-terracotta/5 border border-terracotta/20">
              <p className="text-sm text-charcoal/70">
                Questions? Email{' '}
                <a 
                  href={`mailto:${RETURN_POLICY.contact.email}`}
                  className="text-terracotta hover:underline font-medium"
                >
                  {RETURN_POLICY.contact.email}
                </a>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// ============================================================================
// MINI GUARANTEE INLINE - For cart/product summary
// ============================================================================

export function MiniGuarantee({ className }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-charcoal/60 ${className}`}>
      <span className="flex items-center gap-1">
        <CheckCircle size={12} className="text-sage" weight="fill" />
        30-day guarantee
      </span>
      <span className="flex items-center gap-1">
        <CheckCircle size={12} className="text-sage" weight="fill" />
        Free returns
      </span>
      <span className="flex items-center gap-1">
        <CheckCircle size={12} className="text-sage" weight="fill" />
        Made in USA
      </span>
    </div>
  )
}

export default ReturnPolicyModal

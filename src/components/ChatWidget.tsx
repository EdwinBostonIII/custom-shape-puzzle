/**
 * ChatWidget - Research-backed FAQ chatbot and support widget
 * 
 * Based on CRO research findings:
 * - Live chat increases conversions by 40% (Forrester)
 * - 53% of customers abandon purchase if they can't find answers quickly
 * - FAQ sections reduce support tickets by 70%
 * - AI chatbots can handle 80% of routine customer inquiries
 * - Response time expectation: < 1 minute for chat, < 24h for email
 */

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChatCircle,
  X,
  PaperPlaneTilt,
  MagnifyingGlass,
  Question,
  Package,
  Truck,
  ShieldCheck,
  Clock,
  Palette,
  Gift,
  CreditCard,
  CaretRight,
  EnvelopeSimple,
  ArrowLeft,
  Sparkle,
  CheckCircle,
  User
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { trackEvent } from '@/lib/analytics'

// ============================================================================
// TYPES
// ============================================================================

interface FAQItem {
  id: string
  category: string
  question: string
  answer: string
  keywords: string[]
  popularity: number
}

interface Message {
  id: string
  type: 'user' | 'bot' | 'system'
  content: string
  timestamp: Date
  options?: QuickReply[]
}

interface QuickReply {
  id: string
  label: string
  action: string
  icon?: React.ReactNode
}

// ============================================================================
// FAQ DATABASE
// ============================================================================

const FAQ_DATABASE: FAQItem[] = [
  // Ordering & Customization
  {
    id: 'customize-shapes',
    category: 'customization',
    question: 'How do I customize my puzzle with shapes?',
    answer: 'You can choose from 70+ meaningful shapes (animals, flowers, symbols, etc.) during the design process. Each shape becomes a unique piece in your puzzle. The number of custom shapes depends on your tier: Essential (5), Classic (7), Grand (10), or Heirloom (15).',
    keywords: ['shapes', 'customize', 'design', 'silhouettes', 'pieces'],
    popularity: 95,
  },
  {
    id: 'hint-cards',
    category: 'customization',
    question: 'What are hint cards and how do they work?',
    answer: 'Hint cards replace the traditional reference picture. Instead of looking at a photo, solvers read personalized clues like "Where we first met" or "Our favorite song." This makes the puzzle a memory experience, not just a visual challenge.',
    keywords: ['hints', 'cards', 'clues', 'memory', 'no photo'],
    popularity: 88,
  },
  {
    id: 'photo-vs-color',
    category: 'customization',
    question: 'Can I use a photo or just colors?',
    answer: 'You have two options: 1) Upload a photo that gets transformed into the puzzle background, or 2) Choose from our "comfy" color palette for a more abstract, artistic look. Both options work beautifully with our custom shapes.',
    keywords: ['photo', 'picture', 'color', 'image', 'upload'],
    popularity: 82,
  },
  
  // Shipping & Delivery
  {
    id: 'shipping-time',
    category: 'shipping',
    question: 'How long does shipping take?',
    answer: 'Each puzzle is handcrafted to order. Production takes 7-10 business days, then 3-5 days for shipping within the US. Total delivery time is approximately 2 weeks. We\'ll send tracking info when your puzzle ships!',
    keywords: ['shipping', 'delivery', 'time', 'how long', 'arrive', 'when'],
    popularity: 98,
  },
  {
    id: 'shipping-cost',
    category: 'shipping',
    question: 'How much does shipping cost?',
    answer: 'Shipping is FREE on all US orders! We cover the cost because we believe everyone deserves this experience without hidden fees.',
    keywords: ['shipping cost', 'free', 'delivery cost', 'price'],
    popularity: 90,
  },
  {
    id: 'international',
    category: 'shipping',
    question: 'Do you ship internationally?',
    answer: 'Currently we ship within the United States only. We\'re working on international shipping - sign up for our newsletter to be the first to know when we expand!',
    keywords: ['international', 'outside US', 'other countries', 'worldwide', 'global'],
    popularity: 65,
  },
  {
    id: 'holiday-deadline',
    category: 'shipping',
    question: 'Will my puzzle arrive in time for [holiday]?',
    answer: 'We recommend ordering at least 3 weeks before your event to ensure delivery. Check our homepage for specific holiday deadlines. If you\'re cutting it close, email us at hello@interlockpuzzle.com and we\'ll do our best to accommodate!',
    keywords: ['holiday', 'christmas', 'birthday', 'anniversary', 'deadline', 'in time'],
    popularity: 85,
  },
  
  // Quality & Materials
  {
    id: 'material',
    category: 'quality',
    question: 'What are the puzzles made of?',
    answer: 'Our puzzles are precision laser-cut from 3mm premium Baltic birch plywood. This ensures durability, a satisfying tactile feel, and beautiful natural wood grain. Each piece is hand-finished for a smooth, splinter-free experience.',
    keywords: ['material', 'wood', 'quality', 'made of', 'baltic birch'],
    popularity: 78,
  },
  {
    id: 'puzzle-size',
    category: 'quality',
    question: 'How big is the completed puzzle?',
    answer: 'Completed puzzle sizes: Essential (100 pcs) - 8"×10", Classic (250 pcs) - 12"×16", Grand (500 pcs) - 16"×20", Heirloom (1000 pcs) - 20"×24". All sizes are designed to fit standard frames for display.',
    keywords: ['size', 'dimensions', 'how big', 'inches', 'measurement'],
    popularity: 75,
  },
  
  // Returns & Guarantees
  {
    id: 'return-policy',
    category: 'returns',
    question: 'What is your return policy?',
    answer: 'We offer a 30-day "Love It" guarantee. If your puzzle arrives damaged, has missing pieces, or you\'re not satisfied with the quality, we\'ll remake it for free or issue a full refund. No questions asked. Just email hello@interlockpuzzle.com with your order number.',
    keywords: ['return', 'refund', 'money back', 'guarantee', 'exchange'],
    popularity: 92,
  },
  {
    id: 'damaged-piece',
    category: 'returns',
    question: 'What if a piece is missing or damaged?',
    answer: 'Contact us immediately at hello@interlockpuzzle.com with your order number and a photo of the issue. We\'ll send replacement pieces for free, or remake the entire puzzle if needed. We can even send individual replacement pieces for up to 1 year after purchase.',
    keywords: ['missing', 'damaged', 'broken', 'piece', 'replace'],
    popularity: 70,
  },
  
  // Pricing
  {
    id: 'pricing',
    category: 'pricing',
    question: 'How much do the puzzles cost?',
    answer: 'Our puzzles range from $89-$199 depending on size: Essential (100 pcs) - $89, Classic (250 pcs) - $99, Grand (500 pcs) - $149, Heirloom (1000 pcs) - $199. All prices include free shipping!',
    keywords: ['price', 'cost', 'how much', 'money', 'expensive'],
    popularity: 97,
  },
  {
    id: 'discount',
    category: 'pricing',
    question: 'Are there any discounts or promo codes?',
    answer: 'First-time customers can use code WELCOME10 for 10% off. We also offer special discounts during holidays. Sign up for our newsletter to get exclusive offers!',
    keywords: ['discount', 'promo', 'code', 'coupon', 'sale', 'offer'],
    popularity: 88,
  },
  
  // Gift-specific
  {
    id: 'gift-message',
    category: 'gifting',
    question: 'Can I add a gift message?',
    answer: 'Yes! During checkout, you can add a personalized gift message that will be beautifully printed and included with your puzzle. You can also choose premium packaging with a magnetic closure box and optional wax seal.',
    keywords: ['gift', 'message', 'card', 'note', 'present'],
    popularity: 72,
  },
  {
    id: 'ship-to-recipient',
    category: 'gifting',
    question: 'Can you ship directly to the gift recipient?',
    answer: 'Absolutely! Just enter the recipient\'s address as the shipping address during checkout. We never include pricing information in the package, and you can add a gift message. It\'s the perfect surprise!',
    keywords: ['recipient', 'gift', 'ship to', 'address', 'surprise'],
    popularity: 68,
  },
]

// ============================================================================
// CATEGORY CONFIGURATION
// ============================================================================

const FAQ_CATEGORIES = [
  { id: 'customization', label: 'Design & Customization', icon: Palette },
  { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
  { id: 'quality', label: 'Quality & Materials', icon: Package },
  { id: 'returns', label: 'Returns & Guarantee', icon: ShieldCheck },
  { id: 'pricing', label: 'Pricing & Discounts', icon: CreditCard },
  { id: 'gifting', label: 'Gifting', icon: Gift },
]

// ============================================================================
// SEARCH FUNCTION
// ============================================================================

function searchFAQ(query: string): FAQItem[] {
  const normalizedQuery = query.toLowerCase().trim()
  
  if (normalizedQuery.length < 2) return []
  
  const queryWords = normalizedQuery.split(/\s+/)
  
  const scored = FAQ_DATABASE.map((faq) => {
    let score = 0
    
    // Check keywords
    queryWords.forEach((word) => {
      faq.keywords.forEach((keyword) => {
        if (keyword.includes(word) || word.includes(keyword)) {
          score += 10
        }
      })
    })
    
    // Check question
    if (faq.question.toLowerCase().includes(normalizedQuery)) {
      score += 20
    }
    
    // Check answer
    if (faq.answer.toLowerCase().includes(normalizedQuery)) {
      score += 5
    }
    
    // Factor in popularity
    score += faq.popularity * 0.1
    
    return { faq, score }
  })
  
  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ faq }) => faq)
}

// ============================================================================
// CHAT WIDGET COMPONENT
// ============================================================================

interface ChatWidgetProps {
  className?: string
}

export function ChatWidget({ className }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState<'home' | 'search' | 'category' | 'faq' | 'contact'>('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<FAQItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedFAQ, setSelectedFAQ] = useState<FAQItem | null>(null)
  const [wasHelpful, setWasHelpful] = useState<boolean | null>(null)
  const [contactForm, setContactForm] = useState({ email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [contactSubmitted, setContactSubmitted] = useState(false)
  
  const searchInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Search as user types
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const results = searchFAQ(searchQuery)
      setSearchResults(results)
      setView('search')
    } else {
      setSearchResults([])
      if (view === 'search') setView('home')
    }
  }, [searchQuery])

  // Track widget opens
  useEffect(() => {
    if (isOpen) {
      trackEvent('chat_widget_opened')
    }
  }, [isOpen])

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setView('category')
    trackEvent('chat_category_clicked', { category: categoryId })
  }

  const handleFAQClick = (faq: FAQItem) => {
    setSelectedFAQ(faq)
    setView('faq')
    setWasHelpful(null)
    trackEvent('chat_faq_viewed', { faq_id: faq.id })
  }

  const handleBack = () => {
    if (view === 'faq') {
      setSelectedFAQ(null)
      setView(selectedCategory ? 'category' : 'home')
    } else if (view === 'category') {
      setSelectedCategory(null)
      setView('home')
    } else if (view === 'contact') {
      setView('home')
    } else {
      setSearchQuery('')
      setView('home')
    }
  }

  const handleHelpful = (helpful: boolean) => {
    setWasHelpful(helpful)
    trackEvent('chat_faq_feedback', { 
      faq_id: selectedFAQ?.id, 
      helpful 
    })
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // TODO: Send to backend
      // await fetch('/api/support', {
      //   method: 'POST',
      //   body: JSON.stringify(contactForm)
      // })
      
      trackEvent('chat_contact_submitted')
      setContactSubmitted(true)
    } catch (err) {
      console.error('Failed to submit contact form')
    } finally {
      setIsSubmitting(false)
    }
  }

  const categoryFAQs = useMemo(() => {
    if (!selectedCategory) return []
    return FAQ_DATABASE
      .filter(faq => faq.category === selectedCategory)
      .sort((a, b) => b.popularity - a.popularity)
  }, [selectedCategory])

  const popularFAQs = useMemo(() => {
    return [...FAQ_DATABASE]
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 4)
  }, [])

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full bg-terracotta text-white shadow-xl flex items-center justify-center hover:bg-terracotta/90 transition-colors ${isOpen ? 'hidden' : ''} ${className}`}
        aria-label="Open help chat"
      >
        <ChatCircle size={28} weight="fill" />
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed bottom-4 right-4 z-50 w-[360px] max-h-[600px] bg-white rounded-2xl shadow-2xl border border-stone/30 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-terracotta text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {view !== 'home' && (
                  <button
                    onClick={handleBack}
                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                    aria-label="Go back"
                  >
                    <ArrowLeft size={20} />
                  </button>
                )}
                <div>
                  <h2 className="font-semibold">How can we help?</h2>
                  <p className="text-xs text-white/80">Usually responds instantly</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-3 border-b border-stone/20">
              <div className="relative">
                <MagnifyingGlass 
                  size={16} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" 
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for answers..."
                  className="w-full pl-9 pr-4 py-2.5 bg-stone/5 border border-stone/20 rounded-xl text-sm focus:outline-none focus:border-terracotta/50 focus:ring-1 focus:ring-terracotta/20"
                />
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4">
              <AnimatePresence mode="wait">
                {/* Home View */}
                {view === 'home' && (
                  <motion.div
                    key="home"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {/* Popular Questions */}
                    <div>
                      <p className="text-xs font-semibold text-charcoal/50 uppercase tracking-wide mb-2">
                        Popular Questions
                      </p>
                      <div className="space-y-2">
                        {popularFAQs.map((faq) => (
                          <button
                            key={faq.id}
                            onClick={() => handleFAQClick(faq)}
                            className="w-full text-left p-3 rounded-lg border border-stone/20 hover:border-terracotta/30 hover:bg-terracotta/5 transition-colors"
                          >
                            <p className="text-sm text-charcoal font-medium line-clamp-2">
                              {faq.question}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Categories */}
                    <div>
                      <p className="text-xs font-semibold text-charcoal/50 uppercase tracking-wide mb-2">
                        Browse by Topic
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {FAQ_CATEGORIES.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.id)}
                            className="flex items-center gap-2 p-3 rounded-lg border border-stone/20 hover:border-terracotta/30 hover:bg-terracotta/5 transition-colors"
                          >
                            <cat.icon size={16} className="text-terracotta" />
                            <span className="text-xs font-medium text-charcoal">
                              {cat.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Search Results */}
                {view === 'search' && (
                  <motion.div
                    key="search"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {searchResults.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-xs text-charcoal/50 mb-2">
                          {searchResults.length} results for "{searchQuery}"
                        </p>
                        {searchResults.map((faq) => (
                          <button
                            key={faq.id}
                            onClick={() => handleFAQClick(faq)}
                            className="w-full text-left p-3 rounded-lg border border-stone/20 hover:border-terracotta/30 hover:bg-terracotta/5 transition-colors"
                          >
                            <p className="text-sm text-charcoal font-medium">
                              {faq.question}
                            </p>
                            <p className="text-xs text-charcoal/60 mt-1 line-clamp-2">
                              {faq.answer}
                            </p>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Question size={32} className="text-charcoal/20 mx-auto mb-2" />
                        <p className="text-sm text-charcoal/60">
                          No results found for "{searchQuery}"
                        </p>
                        <button
                          onClick={() => setView('contact')}
                          className="text-sm text-terracotta hover:underline mt-2"
                        >
                          Contact us instead
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Category View */}
                {view === 'category' && selectedCategory && (
                  <motion.div
                    key="category"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <p className="text-xs text-charcoal/50 mb-3">
                      {FAQ_CATEGORIES.find(c => c.id === selectedCategory)?.label}
                    </p>
                    <div className="space-y-2">
                      {categoryFAQs.map((faq) => (
                        <button
                          key={faq.id}
                          onClick={() => handleFAQClick(faq)}
                          className="w-full text-left p-3 rounded-lg border border-stone/20 hover:border-terracotta/30 hover:bg-terracotta/5 transition-colors flex items-center justify-between"
                        >
                          <p className="text-sm text-charcoal font-medium pr-2">
                            {faq.question}
                          </p>
                          <CaretRight size={14} className="text-charcoal/40 flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* FAQ Detail View */}
                {view === 'faq' && selectedFAQ && (
                  <motion.div
                    key="faq"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <h3 className="font-semibold text-charcoal mb-2">
                        {selectedFAQ.question}
                      </h3>
                      <p className="text-sm text-charcoal/70 leading-relaxed">
                        {selectedFAQ.answer}
                      </p>
                    </div>

                    {/* Helpful? */}
                    <div className="pt-4 border-t border-stone/20">
                      <p className="text-xs text-charcoal/50 mb-2">Was this helpful?</p>
                      {wasHelpful === null ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleHelpful(true)}
                            className="flex-1"
                          >
                            <CheckCircle size={14} className="mr-1" />
                            Yes
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleHelpful(false)}
                            className="flex-1"
                          >
                            Not really
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center text-sm">
                          {wasHelpful ? (
                            <p className="text-sage">
                              <CheckCircle size={16} weight="fill" className="inline mr-1" />
                              Thanks for your feedback!
                            </p>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-charcoal/60">
                                Sorry we couldn't help. Would you like to contact us?
                              </p>
                              <Button
                                size="sm"
                                onClick={() => setView('contact')}
                              >
                                <EnvelopeSimple size={14} className="mr-1" />
                                Contact Support
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Contact View */}
                {view === 'contact' && (
                  <motion.div
                    key="contact"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {contactSubmitted ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center mx-auto mb-4">
                          <CheckCircle size={32} className="text-sage" weight="fill" />
                        </div>
                        <h3 className="font-semibold text-charcoal mb-2">Message Sent!</h3>
                        <p className="text-sm text-charcoal/60">
                          We'll get back to you within 24 hours.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setContactSubmitted(false)
                            setContactForm({ email: '', message: '' })
                            setView('home')
                          }}
                          className="mt-4"
                        >
                          Back to Help Center
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleContactSubmit} className="space-y-4">
                        <p className="text-sm text-charcoal/60">
                          Couldn't find what you're looking for? Send us a message and we'll get back to you within 24 hours.
                        </p>
                        
                        <div>
                          <label className="text-xs font-medium text-charcoal/70">
                            Your Email
                          </label>
                          <Input
                            type="email"
                            required
                            value={contactForm.email}
                            onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="you@example.com"
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <label className="text-xs font-medium text-charcoal/70">
                            Your Message
                          </label>
                          <Textarea
                            required
                            value={contactForm.message}
                            onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                            placeholder="How can we help?"
                            className="mt-1 min-h-[100px]"
                          />
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Sending...' : 'Send Message'}
                        </Button>
                      </form>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-stone/20 bg-stone/5">
              <button
                onClick={() => setView('contact')}
                className="w-full flex items-center justify-center gap-2 text-sm text-charcoal/60 hover:text-charcoal transition-colors"
              >
                <EnvelopeSimple size={14} />
                Can't find an answer? Contact us
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ============================================================================
// INLINE FAQ WIDGET - For embedding in pages
// ============================================================================

interface InlineFAQProps {
  category?: string
  maxItems?: number
  className?: string
}

export function InlineFAQ({ category, maxItems = 4, className }: InlineFAQProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const faqs = useMemo(() => {
    let filtered = FAQ_DATABASE
    if (category) {
      filtered = filtered.filter(faq => faq.category === category)
    }
    return filtered
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, maxItems)
  }, [category, maxItems])

  return (
    <div className={`space-y-2 ${className}`}>
      {faqs.map((faq) => (
        <div
          key={faq.id}
          className="border border-stone/30 rounded-lg overflow-hidden"
        >
          <button
            onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
            className="w-full text-left p-4 flex items-center justify-between hover:bg-stone/5 transition-colors"
          >
            <span className="font-medium text-charcoal text-sm pr-4">
              {faq.question}
            </span>
            <CaretRight 
              size={16} 
              className={`text-charcoal/40 flex-shrink-0 transition-transform ${
                expandedId === faq.id ? 'rotate-90' : ''
              }`} 
            />
          </button>
          <AnimatePresence>
            {expandedId === faq.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="px-4 pb-4 text-sm text-charcoal/70">
                  {faq.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

export default ChatWidget

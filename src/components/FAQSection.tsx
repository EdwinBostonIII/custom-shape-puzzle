import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { CaretDown } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'How does the puzzle work?',
    answer: 'Each puzzle contains 10 custom wooden pieces, laser-engraved with shapes you choose. Solo puzzles let you pick all 10 shapes yourself. Couple puzzles split the pieces—you each pick 5 shapes that represent your relationship, creating a unified keepsake that tells both sides of your story.',
  },
  {
    question: 'What\'s the difference between Standard and Keepsake editions?',
    answer: 'Both editions include 10 laser-engraved wooden pieces and a Story Card. The Standard Edition comes in a simple cardboard box. The Keepsake Edition upgrades to a beautiful solid walnut box with magnetic closure, custom engraving inside the lid, premium linen Story Card, handwritten note, and elegant gift wrapping—perfect for anniversaries, weddings, or milestone moments.',
  },
  {
    question: 'How long does shipping take?',
    answer: 'Each puzzle is handcrafted to order. Production takes 7-10 business days, then shipping is 2-3 days (US only, free shipping). You\'ll receive a confirmation email with tracking once your puzzle ships. Rush options available at checkout for milestone dates.',
  },
  {
    question: 'Can I see what my partner chose before the puzzle arrives?',
    answer: 'No—and that\'s the magic! In couple mode, your selections are kept secret until the puzzle is assembled together. This preserves the surprise and creates a special moment of discovery when you first see each other\'s chosen shapes and their meanings.',
  },
  {
    question: 'What if I make a mistake or want to change my order?',
    answer: 'You can edit your selections anytime before placing your order. Once submitted, you have 1 hour to contact us for changes. After production begins, customizations cannot be altered. If you\'re unhappy with your finished puzzle, we offer a 30-day satisfaction guarantee.',
  },
  {
    question: 'How do the "meanings" work on the Story Card?',
    answer: 'After selecting your shapes, you can add a short note (up to 140 characters) explaining why each shape is meaningful. These notes are beautifully printed on a Story Card that comes inside the box. It\'s optional but highly recommended—it transforms abstract shapes into deeply personal symbols of your story.',
  },
  {
    question: 'What are the shapes made of? Are they safe?',
    answer: 'Each piece is cut from sustainably sourced maple or walnut wood, then laser-engraved for precision. The wood is finished with food-safe mineral oil for a smooth, natural feel. No toxic coatings or paints. Pieces are approximately 2" in size, perfectly weighted for satisfying tactile assembly.',
  },
  {
    question: 'Can I upload my own photos?',
    answer: 'Yes! In the design phase, you can upload a photo to be laser-engraved onto the wooden pieces. Our Wood Reality Filter shows a preview of how it will look on natural grain. For best results, choose high-contrast images with good lighting—we\'ll warn you if brightness levels are too low for clear engraving.',
  },
  {
    question: 'Is this a good gift for long-distance relationships?',
    answer: 'Absolutely! Use the "Generate Partner Link" feature to create your puzzle remotely. You pick your 5 shapes, share a unique link, and your partner picks their 5. Once both selections are complete, you can proceed to checkout. The assembled puzzle arrives as a surprise, merging both your stories into one keepsake.',
  },
  {
    question: 'Do you offer gift wrapping?',
    answer: 'The Keepsake Edition includes premium gift wrapping and a handwritten note card. Standard Edition orders can add gift wrapping for an additional $8 at checkout. All puzzles ship in protective packaging to ensure they arrive in perfect condition.',
  },
  {
    question: 'Can I order multiples or get bulk pricing?',
    answer: 'Yes! Orders of 5+ puzzles receive a 15% discount. Orders of 10+ receive 20% off. Perfect for wedding favors, corporate gifts, or family reunions. Contact us for custom bulk orders with personalized touches like company logos or event dates.',
  },
  {
    question: 'What if pieces get lost over time?',
    answer: 'We keep your design on file for 2 years. If you lose a piece, contact us with your order number and we can create a replacement for a small fee ($5 per piece + shipping). Many customers frame their completed puzzles to preserve them permanently.',
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section
      className="w-full bg-sage/10 py-16 px-6 md:py-24"
      role="region"
      aria-labelledby="faq-heading"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2
            id="faq-heading"
            className="text-4xl md:text-5xl font-bold text-charcoal mb-4"
            style={{ fontFamily: 'var(--font-fraunces)', letterSpacing: '-0.02em' }}
          >
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
            Everything you need to know about creating your custom wooden puzzle
          </p>
        </div>

        <div className="space-y-4" role="list">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index

            return (
              <Card
                key={index}
                className="border-2 border-stone overflow-hidden transition-all duration-300"
                role="listitem"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left p-6 flex items-start justify-between gap-4 hover:bg-stone/20 transition-colors"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  id={`faq-question-${index}`}
                >
                  <span
                    className="text-lg font-semibold text-charcoal flex-1"
                    style={{ fontFamily: 'var(--font-fraunces)' }}
                  >
                    {faq.question}
                  </span>
                  <CaretDown
                    size={24}
                    weight="bold"
                    className={cn(
                      'text-terracotta transition-transform duration-300 flex-shrink-0',
                      isOpen && 'rotate-180'
                    )}
                    aria-hidden="true"
                  />
                </button>

                <div
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                  className={cn(
                    'overflow-hidden transition-all duration-300',
                    isOpen ? 'max-h-96' : 'max-h-0'
                  )}
                >
                  <CardContent className="px-6 pb-6 pt-0">
                    <p className="text-charcoal/80 leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </div>
              </Card>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-charcoal/60 mb-4">Still have questions?</p>
          <a
            href="mailto:hello@interlockpuzzles.com"
            className="inline-block text-terracotta font-semibold hover:text-terracotta/80 transition-colors underline"
            style={{ fontFamily: 'var(--font-fraunces)' }}
          >
            Contact us at hello@interlockpuzzles.com
          </a>
        </div>
      </div>
    </section>
  )
}

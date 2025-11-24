import { useState } from 'react'
import { CaretDown } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface FAQItem {
  question: string
  answer: string
}

// Simplified FAQs for MVP launch (no photo upload, mystery box, or keepsake edition)
const faqs: FAQItem[] = [
  {
    question: 'How does the puzzle work?',
    answer: 'Your puzzle contains 10 custom wooden pieces, each laser-engraved with a shape you choose. Pick shapes that represent your memories, dreams, or the things you love most. Every puzzle comes with a personalized Story Card where your notes about each shape are beautifully printed.',
  },
  {
    question: 'What\'s included with my order?',
    answer: 'Every $65 order includes: a 10-piece handcrafted basswood puzzle (5" × 7"), your chosen wood stain finish, a personalized Story Card with your notes, and gift-ready packaging. Free shipping is included for all US orders.',
  },
  {
    question: 'How long does shipping take?',
    answer: 'Each puzzle is handcrafted to order. Production takes about 2 weeks, then shipping is 2-5 business days (US only, free shipping). You\'ll receive a confirmation email with tracking once your puzzle ships.',
  },
  {
    question: 'What wood stain options are available?',
    answer: 'We offer 6 beautiful stain options: Natural (light birch), Honey Oak (warm golden), Walnut (rich brown), Ebony (deep charcoal), Gray Wash (modern driftwood), and White Wash (coastal white). You can preview how your puzzle will look in each stain before ordering.',
  },
  {
    question: 'Can I add personal notes to each shape?',
    answer: 'Yes! After selecting your shapes, you can add a short note (up to 140 characters) explaining why each shape is meaningful to you. These notes are beautifully printed on a Story Card that comes inside the box. It\'s optional but highly recommended—it transforms abstract shapes into deeply personal symbols.',
  },
  {
    question: 'What are the pieces made of?',
    answer: 'Each piece is cut from premium basswood, then laser-engraved for precision. The wood is finished with your chosen stain for a beautiful, natural feel. Pieces are approximately 2" in size, perfectly weighted for satisfying tactile assembly.',
  },
  {
    question: 'Is this a good gift for someone special?',
    answer: 'Absolutely! Custom puzzles make meaningful gifts for anniversaries, birthdays, friendships, or just because. Choose shapes that remind you of shared memories, inside jokes, or things they love. The Story Card adds a personal touch that makes it truly one-of-a-kind.',
  },
  {
    question: 'What if I\'m not happy with my puzzle?',
    answer: 'We offer a 30-day satisfaction guarantee. If you\'re not completely happy with your puzzle, contact us and we\'ll make it right. We keep your design on file for 2 years, so we can create replacement pieces if needed ($5 per piece + shipping).',
  },
  {
    question: 'Can I change my order after placing it?',
    answer: 'You can contact us within 24 hours of placing your order to make changes. Once production begins, we cannot alter customizations. That\'s why we show you a preview of your puzzle before checkout!',
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
            className="text-4xl md:text-5xl font-bold text-charcoal mb-4 font-display"
          >
            Common Questions
          </h2>
          <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
            Everything you need to know about your custom puzzle
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border-2 border-stone overflow-hidden transition-shadow hover:shadow-md"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="text-lg font-semibold text-charcoal pr-4">
                  {faq.question}
                </span>
                <CaretDown
                  size={24}
                  weight="bold"
                  className={cn(
                    "flex-shrink-0 text-terracotta transition-transform duration-200",
                    openIndex === index && "rotate-180"
                  )}
                  aria-hidden="true"
                />
              </button>
              <div
                id={`faq-answer-${index}`}
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  openIndex === index ? "max-h-96" : "max-h-0"
                )}
                aria-hidden={openIndex !== index}
              >
                <p className="px-6 pb-5 text-charcoal/70 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-charcoal/60 mb-2">Still have questions?</p>
          <a
            href="mailto:hello@interlockpuzzle.com"
            className="text-terracotta hover:text-terracotta/80 font-medium underline underline-offset-4"
          >
            Contact us at hello@interlockpuzzle.com
          </a>
        </div>
      </div>
    </section>
  )
}

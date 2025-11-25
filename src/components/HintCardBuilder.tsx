import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Sparkles, ChevronDown, ChevronUp } from 'lucide-react'
import { HintCard, HintPrompt, HintPromptType, ShapeType, PuzzleTier } from '@/lib/types'
import { getTierConfig, PUZZLE_SHAPES } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface HintCardBuilderProps {
  hintCards: HintCard[]
  selectedShapes: ShapeType[]
  tier: PuzzleTier
  onHintCardsChange: (cards: HintCard[]) => void
  onContinue: () => void
  onBack: () => void
}

// Example prompts that stream in for inspiration
const PROMPT_EXAMPLES: Record<HintPromptType, string[]> = {
  'fill-in-blank': [
    'first met',
    'said "I love you"',
    'knew you were the one',
    'laughed until we cried',
    'stayed up all night talking',
  ],
  'memory': [
    'That rainy Sunday...',
    'The trip to...',
    'When we first...',
    'Remember when...',
    'The night we...',
  ],
  'emotion': [
    'safe',
    'home',
    'understood',
    'brave',
    'inspired',
  ],
  'location': [
    'first apartment',
    'favorite restaurant',
    'that beach',
    'our spot',
    'where it all began',
  ],
}

const PROMPT_TEMPLATES: Record<HintPromptType, string> = {
  'fill-in-blank': 'The place where we ____',
  'memory': 'Remember when...',
  'emotion': 'You make me feel ____',
  'location': 'The pieces that remind you of ____',
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

function createEmptyCard(index: number): HintCard {
  return {
    id: generateId(),
    title: `Hint Card ${index + 1}`,
    prompts: [createEmptyPrompt()],
  }
}

function createEmptyPrompt(): HintPrompt {
  return {
    id: generateId(),
    type: 'fill-in-blank',
    template: PROMPT_TEMPLATES['fill-in-blank'],
    userInput: '',
    characterLimit: 50,
  }
}

export function HintCardBuilder({
  hintCards,
  selectedShapes,
  tier,
  onHintCardsChange,
  onContinue,
  onBack,
}: HintCardBuilderProps) {
  const tierConfig = getTierConfig(tier)
  const maxCards = tierConfig.hintCards
  const [expandedCard, setExpandedCard] = useState<string | null>(
    hintCards[0]?.id || null
  )
  const [streamingExample, setStreamingExample] = useState<string>('')
  const [focusedPrompt, setFocusedPrompt] = useState<string | null>(null)

  // Initialize cards if empty
  if (hintCards.length === 0) {
    const initialCards = Array.from({ length: Math.min(3, maxCards) }, (_, i) => 
      createEmptyCard(i)
    )
    onHintCardsChange(initialCards)
    return null
  }

  const addCard = () => {
    if (hintCards.length < maxCards) {
      onHintCardsChange([...hintCards, createEmptyCard(hintCards.length)])
    }
  }

  const removeCard = (cardId: string) => {
    onHintCardsChange(hintCards.filter(c => c.id !== cardId))
  }

  const updateCard = (cardId: string, updates: Partial<HintCard>) => {
    onHintCardsChange(
      hintCards.map(c => (c.id === cardId ? { ...c, ...updates } : c))
    )
  }

  const addPrompt = (cardId: string) => {
    const card = hintCards.find(c => c.id === cardId)
    if (card && card.prompts.length < 4) {
      updateCard(cardId, {
        prompts: [...card.prompts, createEmptyPrompt()],
      })
    }
  }

  const updatePrompt = (cardId: string, promptId: string, updates: Partial<HintPrompt>) => {
    const card = hintCards.find(c => c.id === cardId)
    if (card) {
      updateCard(cardId, {
        prompts: card.prompts.map(p =>
          p.id === promptId ? { ...p, ...updates } : p
        ),
      })
    }
  }

  const removePrompt = (cardId: string, promptId: string) => {
    const card = hintCards.find(c => c.id === cardId)
    if (card && card.prompts.length > 1) {
      updateCard(cardId, {
        prompts: card.prompts.filter(p => p.id !== promptId),
      })
    }
  }

  // Simulate streaming examples when a prompt is focused
  const handlePromptFocus = (promptId: string, promptType: HintPromptType) => {
    setFocusedPrompt(promptId)
    const examples = PROMPT_EXAMPLES[promptType]
    let index = 0
    
    const streamNext = () => {
      if (index < examples.length) {
        setStreamingExample(examples[index])
        index++
        setTimeout(streamNext, 2000)
      } else {
        index = 0
        setTimeout(streamNext, 2000)
      }
    }
    streamNext()
  }

  const filledPromptCount = hintCards.reduce(
    (acc, card) => acc + card.prompts.filter(p => p.userInput.trim()).length,
    0
  )
  const totalPromptCount = hintCards.reduce((acc, card) => acc + card.prompts.length, 0)

  return (
    <div className="min-h-screen bg-cream pt-4">
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Back button */}
        <button
          onClick={onBack}
          className="mb-6 text-charcoal/60 hover:text-charcoal transition-colors flex items-center gap-1"
        >
          ← Back to Design
        </button>
        {/* Intro */}
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
            Create the clues
          </h2>
          <p className="text-charcoal/70 max-w-xl mx-auto">
            Instead of a reference photo, your puzzle comes with hint cards. 
            Fill in prompts that guide assembly through memories and emotions.
          </p>
        </div>

        {/* Cards */}
        <div className="space-y-4 mb-8">
          {hintCards.map((card, cardIndex) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: cardIndex * 0.1 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              {/* Card Header */}
              <button
                onClick={() => setExpandedCard(expandedCard === card.id ? null : card.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-cream/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center text-sm font-medium">
                    {cardIndex + 1}
                  </span>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => updateCard(card.id, { title: e.target.value })}
                    onClick={(e) => e.stopPropagation()}
                    className="font-medium text-charcoal bg-transparent border-none focus:outline-none focus:ring-0"
                    placeholder="Card title..."
                  />
                </div>
                <div className="flex items-center gap-2">
                  {hintCards.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeCard(card.id)
                      }}
                      className="p-2 text-charcoal/40 hover:text-red-500 transition-colors"
                      aria-label="Remove card"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  {expandedCard === card.id ? (
                    <ChevronUp className="w-5 h-5 text-charcoal/40" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-charcoal/40" />
                  )}
                </div>
              </button>

              {/* Card Content */}
              <AnimatePresence>
                {expandedCard === card.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-charcoal/10"
                  >
                    <div className="p-4 space-y-4">
                      {card.prompts.map((prompt, promptIndex) => (
                        <div key={prompt.id} className="space-y-2">
                          {/* Prompt Type Selector */}
                          <div className="flex items-center gap-2">
                            <select
                              value={prompt.type}
                              onChange={(e) =>
                                updatePrompt(card.id, prompt.id, {
                                  type: e.target.value as HintPromptType,
                                  template: PROMPT_TEMPLATES[e.target.value as HintPromptType],
                                })
                              }
                              className="text-sm bg-cream rounded-lg px-3 py-1.5 border border-charcoal/10 focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                              aria-label="Prompt type"
                            >
                              <option value="fill-in-blank">Fill in the blank</option>
                              <option value="memory">Memory</option>
                              <option value="emotion">Emotion</option>
                              <option value="location">Location</option>
                            </select>
                            {card.prompts.length > 1 && (
                              <button
                                onClick={() => removePrompt(card.id, prompt.id)}
                                className="p-1 text-charcoal/40 hover:text-red-500 transition-colors"
                                aria-label="Remove prompt"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          {/* Template Display */}
                          <p className="text-sm text-charcoal/60 italic">
                            {prompt.template}
                          </p>

                          {/* User Input */}
                          <div className="relative">
                            <input
                              type="text"
                              value={prompt.userInput}
                              onChange={(e) =>
                                updatePrompt(card.id, prompt.id, {
                                  userInput: e.target.value.slice(0, prompt.characterLimit),
                                })
                              }
                              onFocus={() => handlePromptFocus(prompt.id, prompt.type)}
                              onBlur={() => setFocusedPrompt(null)}
                              placeholder="Your answer..."
                              className="w-full px-4 py-2 rounded-lg border border-charcoal/20 focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-transparent"
                              maxLength={prompt.characterLimit}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-charcoal/40">
                              {prompt.userInput.length}/{prompt.characterLimit}
                            </span>
                          </div>

                          {/* Streaming Example */}
                          <AnimatePresence>
                            {focusedPrompt === prompt.id && streamingExample && (
                              <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2 text-sm text-charcoal/50"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Try: "{streamingExample}"</span>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}

                      {/* Add Prompt Button */}
                      {card.prompts.length < 4 && (
                        <button
                          onClick={() => addPrompt(card.id)}
                          className="w-full py-2 border border-dashed border-charcoal/20 rounded-lg text-charcoal/50 text-sm hover:border-charcoal/40 hover:text-charcoal/70 transition-colors"
                        >
                          + Add another prompt
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Add Card Button */}
        {hintCards.length < maxCards && (
          <button
            onClick={addCard}
            className="w-full py-4 border-2 border-dashed border-charcoal/20 rounded-2xl text-charcoal/60 flex items-center justify-center gap-2 hover:border-charcoal/40 hover:text-charcoal transition-colors mb-8"
          >
            <Plus className="w-5 h-5" />
            Add Hint Card ({hintCards.length}/{maxCards})
          </button>
        )}

        {/* Progress */}
        <p className="text-center text-charcoal/60 text-sm mb-8">
          {filledPromptCount} of {totalPromptCount} prompts filled
        </p>

        {/* Continue Button */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onContinue}
            className="bg-terracotta text-white px-8 py-4 rounded-full font-medium text-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            Continue
          </motion.button>
        </div>
      </main>
    </div>
  )
}

export default HintCardBuilder

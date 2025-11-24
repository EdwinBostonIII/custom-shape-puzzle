import { Check } from '@phosphor-icons/react'

// Simplified 4-step flow per Validated Improvements Master List
type Step = 'home' | 'shapes' | 'stain' | 'checkout' | 'confirmation'

interface ProgressStep {
  id: Step[]
  label: string
  icon?: string
}

interface ProgressIndicatorProps {
  currentStep: Step
}

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  // Simplified to 4 visible steps per master list recommendations
  const steps: ProgressStep[] = [
    { id: ['shapes'], label: 'Pick Shapes', icon: '✨' },
    { id: ['stain'], label: 'Choose Stain', icon: '🪵' },
    { id: ['checkout'], label: 'Checkout', icon: '💳' },
    { id: ['confirmation'], label: 'Done!', icon: '✓' },
  ]

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id.includes(currentStep))
  }

  const currentIndex = getCurrentStepIndex()

  return (
    <nav
      className="w-full bg-white/80 backdrop-blur-sm border-b-2 border-stone sticky top-0 z-50 py-4 px-6"
      aria-label="Progress through puzzle creation"
      role="navigation"
    >
      <div className="max-w-4xl mx-auto">
        <ol className="flex items-center justify-between" role="list" aria-label="Creation steps">
          {steps.map((step, index) => {
            const isActive = index === currentIndex
            const isCompleted = index < currentIndex
            const isLast = index === steps.length - 1

            return (
              <li
                key={step.label}
                className="flex items-center flex-1"
                aria-current={isActive ? 'step' : undefined}
              >
                <div className="flex flex-col items-center flex-1" role="group" aria-label={`Step ${index + 1}: ${step.label}. ${isCompleted ? 'Completed' : isActive ? 'Current step' : 'Not started'}`}>
                  {/* Circle */}
                  <div
                    className={`
                      relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300
                      ${isCompleted
                        ? 'bg-sage border-sage'
                        : isActive
                          ? 'bg-terracotta border-terracotta scale-110 shadow-lg'
                          : 'bg-white border-stone'
                      }
                    `}
                  >
                    {isCompleted ? (
                      <Check size={20} weight="bold" className="text-white" />
                    ) : (
                      <span className={`text-lg ${isActive ? 'text-white' : 'text-charcoal/40'}`}>
                        {step.icon}
                      </span>
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={`
                      mt-2 text-xs font-medium transition-all duration-300 text-center
                      ${isActive
                        ? 'text-terracotta font-semibold'
                        : isCompleted
                          ? 'text-sage'
                          : 'text-charcoal/40'
                      }
                    `}
                    style={{ fontFamily: isActive ? 'var(--font-fraunces)' : 'inherit' }}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connector Line */}
                {!isLast && (
                  <div className="flex-1 h-0.5 mx-2 relative top-[-18px]" aria-hidden="true">
                    <div
                      className={`
                        h-full transition-all duration-300
                        ${index < currentIndex ? 'bg-sage' : 'bg-stone'}
                      `}
                    />
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}

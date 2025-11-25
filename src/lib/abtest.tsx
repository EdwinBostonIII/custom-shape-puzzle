/**
 * A/B Testing Infrastructure - Feature flag and experiment management
 * 
 * Research-backed implementation:
 * - Simple client-side A/B testing for rapid iteration
 * - Cookie-based persistence for consistent user experience
 * - Analytics integration for variant tracking
 * - Support for multivariate tests
 * 
 * Usage:
 * const { variant, isVariant } = useExperiment('hero_cta')
 * if (isVariant('button_green')) { ... }
 */

import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react'
import { trackEvent } from './analytics'

// ============================================================================
// TYPES
// ============================================================================

export interface Experiment {
  /** Unique identifier for the experiment */
  id: string
  /** Human-readable name */
  name: string
  /** Possible variants */
  variants: ExperimentVariant[]
  /** Percentage of users to include (0-100) */
  trafficPercentage?: number
  /** Whether the experiment is active */
  active: boolean
  /** Start date (ISO string) */
  startDate?: string
  /** End date (ISO string) */
  endDate?: string
}

export interface ExperimentVariant {
  /** Variant identifier */
  id: string
  /** Display name */
  name: string
  /** Weight for random assignment (default: equal) */
  weight?: number
}

export interface UserAssignments {
  [experimentId: string]: string // variant id
}

interface ABTestContextType {
  assignments: UserAssignments
  getVariant: (experimentId: string) => string | null
  isVariant: (experimentId: string, variantId: string) => boolean
  trackExperimentEvent: (experimentId: string, eventName: string, data?: Record<string, unknown>) => void
  forceVariant: (experimentId: string, variantId: string) => void
}

// ============================================================================
// EXPERIMENT DEFINITIONS
// ============================================================================

/**
 * Define your experiments here
 * 
 * Each experiment should have:
 * - Unique ID (snake_case)
 * - Name (human-readable)
 * - Variants array
 * - Active flag
 */
export const EXPERIMENTS: Experiment[] = [
  {
    id: 'hero_cta',
    name: 'Hero CTA Button Text',
    variants: [
      { id: 'control', name: 'Create Your Puzzle' },
      { id: 'emotional', name: 'Tell Your Story' },
      { id: 'action', name: 'Start Building' },
    ],
    active: true,
    trafficPercentage: 100,
  },
  {
    id: 'pricing_display',
    name: 'Pricing Display Format',
    variants: [
      { id: 'control', name: 'From $79' },
      { id: 'anchored', name: '$99 $79 (SAVE $20)' },
      { id: 'per_piece', name: 'Just $0.79 per piece' },
    ],
    active: false,
    trafficPercentage: 50,
  },
  {
    id: 'social_proof_style',
    name: 'Social Proof Display',
    variants: [
      { id: 'control', name: 'Rating + Reviews' },
      { id: 'recent_orders', name: 'Recent Orders' },
      { id: 'testimonials', name: 'Testimonials Only' },
    ],
    active: false,
    trafficPercentage: 100,
  },
  {
    id: 'checkout_urgency',
    name: 'Checkout Urgency Elements',
    variants: [
      { id: 'control', name: 'No Urgency' },
      { id: 'countdown', name: 'Countdown Timer' },
      { id: 'stock', name: 'Limited Stock Warning' },
    ],
    active: false,
    trafficPercentage: 100,
  },
  {
    id: 'email_popup_timing',
    name: 'Email Popup Delay',
    variants: [
      { id: 'control', name: '45 seconds' },
      { id: 'aggressive', name: '15 seconds' },
      { id: 'patient', name: '90 seconds' },
      { id: 'exit_only', name: 'Exit intent only' },
    ],
    active: false,
    trafficPercentage: 100,
  },
]

// ============================================================================
// UTILITIES
// ============================================================================

const STORAGE_KEY = 'interlock_ab_assignments'
const USER_ID_KEY = 'interlock_user_id'

/** Generate a unique user ID */
function generateUserId(): string {
  return `user_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`
}

/** Get or create user ID */
function getUserId(): string {
  if (typeof window === 'undefined') return generateUserId()
  
  let userId = localStorage.getItem(USER_ID_KEY)
  if (!userId) {
    userId = generateUserId()
    localStorage.setItem(USER_ID_KEY, userId)
  }
  return userId
}

/** Hash a string to a number between 0 and 99 */
function hashToPercentage(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash) % 100
}

/** Pick a variant based on weights */
function pickVariant(variants: ExperimentVariant[], userId: string, experimentId: string): string {
  // Use deterministic selection based on userId + experimentId
  const hash = hashToPercentage(`${userId}_${experimentId}`)
  
  // Calculate total weight
  const totalWeight = variants.reduce((sum, v) => sum + (v.weight ?? 1), 0)
  
  // Find variant based on hash
  let cumulative = 0
  for (const variant of variants) {
    cumulative += ((variant.weight ?? 1) / totalWeight) * 100
    if (hash < cumulative) {
      return variant.id
    }
  }
  
  return variants[0].id
}

/** Load assignments from storage */
function loadAssignments(): UserAssignments {
  if (typeof window === 'undefined') return {}
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

/** Save assignments to storage */
function saveAssignments(assignments: UserAssignments): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments))
  } catch {
    console.warn('Failed to save A/B assignments')
  }
}

/** Check if experiment is currently active */
function isExperimentActive(experiment: Experiment): boolean {
  if (!experiment.active) return false
  
  const now = new Date()
  
  if (experiment.startDate && new Date(experiment.startDate) > now) {
    return false
  }
  
  if (experiment.endDate && new Date(experiment.endDate) < now) {
    return false
  }
  
  return true
}

// ============================================================================
// CONTEXT PROVIDER
// ============================================================================

const ABTestContext = createContext<ABTestContextType | null>(null)

export interface ABTestProviderProps {
  children: ReactNode
  /** Override experiments for testing */
  experiments?: Experiment[]
}

export function ABTestProvider({ children, experiments = EXPERIMENTS }: ABTestProviderProps) {
  const [assignments, setAssignments] = useState<UserAssignments>({})
  const [userId] = useState(getUserId)
  
  // Initialize assignments on mount
  useEffect(() => {
    const stored = loadAssignments()
    const updated = { ...stored }
    
    for (const experiment of experiments) {
      if (!isExperimentActive(experiment)) continue
      
      // Check if user is in traffic percentage
      const trafficHash = hashToPercentage(`${userId}_${experiment.id}_traffic`)
      if (trafficHash >= (experiment.trafficPercentage ?? 100)) {
        continue // User not in experiment
      }
      
      // Use existing assignment or create new one
      if (!updated[experiment.id]) {
        updated[experiment.id] = pickVariant(experiment.variants, userId, experiment.id)
        
        // Track assignment
        trackEvent('experiment_assigned', {
          experiment_id: experiment.id,
          variant_id: updated[experiment.id],
          user_id: userId,
        })
      }
    }
    
    setAssignments(updated)
    saveAssignments(updated)
  }, [experiments, userId])
  
  const getVariant = useCallback((experimentId: string): string | null => {
    return assignments[experimentId] ?? null
  }, [assignments])
  
  const isVariant = useCallback((experimentId: string, variantId: string): boolean => {
    return assignments[experimentId] === variantId
  }, [assignments])
  
  const trackExperimentEvent = useCallback((
    experimentId: string, 
    eventName: string, 
    data?: Record<string, unknown>
  ) => {
    const variant = assignments[experimentId]
    if (!variant) return
    
    trackEvent(`experiment_${eventName}`, {
      experiment_id: experimentId,
      variant_id: variant,
      user_id: userId,
      ...data,
    })
  }, [assignments, userId])
  
  const forceVariant = useCallback((experimentId: string, variantId: string) => {
    setAssignments(prev => {
      const updated = { ...prev, [experimentId]: variantId }
      saveAssignments(updated)
      return updated
    })
  }, [])
  
  return (
    <ABTestContext.Provider value={{
      assignments,
      getVariant,
      isVariant,
      trackExperimentEvent,
      forceVariant,
    }}>
      {children}
    </ABTestContext.Provider>
  )
}

// ============================================================================
// HOOKS
// ============================================================================

/** Access the A/B testing context */
export function useABTest(): ABTestContextType {
  const context = useContext(ABTestContext)
  if (!context) {
    throw new Error('useABTest must be used within an ABTestProvider')
  }
  return context
}

/** 
 * Get the variant for a specific experiment
 * Returns the variant configuration and helper methods
 */
export function useExperiment(experimentId: string) {
  const { getVariant, isVariant, trackExperimentEvent } = useABTest()
  
  const variant = getVariant(experimentId)
  const experiment = EXPERIMENTS.find(e => e.id === experimentId)
  const variantConfig = experiment?.variants.find(v => v.id === variant)
  
  const trackEvent = useCallback((eventName: string, data?: Record<string, unknown>) => {
    trackExperimentEvent(experimentId, eventName, data)
  }, [experimentId, trackExperimentEvent])
  
  return {
    variant,
    variantConfig,
    experiment,
    isVariant: (variantId: string) => isVariant(experimentId, variantId),
    trackEvent,
    isControl: variant === 'control',
    isInExperiment: variant !== null,
  }
}

// ============================================================================
// COMPONENTS
// ============================================================================

interface VariantProps {
  experimentId: string
  variantId: string
  children: ReactNode
}

/**
 * Render children only if user is in the specified variant
 */
export function Variant({ experimentId, variantId, children }: VariantProps) {
  const { isVariant } = useABTest()
  
  if (!isVariant(experimentId, variantId)) {
    return null
  }
  
  return <>{children}</>
}

interface ExperimentProps {
  id: string
  children: (variant: string | null, variantConfig: ExperimentVariant | undefined) => ReactNode
}

/**
 * Render with access to current variant
 */
export function ExperimentRenderer({ id, children }: ExperimentProps) {
  const { variant, variantConfig } = useExperiment(id)
  return <>{children(variant, variantConfig)}</>
}

// ============================================================================
// DEBUG TOOLS
// ============================================================================

interface ABTestDebugPanelProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

/**
 * Debug panel for viewing and overriding A/B test assignments
 * Only renders in development mode
 */
export function ABTestDebugPanel({ position = 'bottom-right' }: ABTestDebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { assignments, forceVariant } = useABTest()
  
  if (process.env.NODE_ENV !== 'development') {
    return null
  }
  
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  }
  
  return (
    <div className={`fixed ${positionClasses[position]} z-[9999]`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg hover:bg-purple-700 transition-colors"
      >
        A/B {isOpen ? '▼' : '▲'}
      </button>
      
      {isOpen && (
        <div className="mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 min-w-[280px] max-h-[400px] overflow-y-auto">
          <h3 className="font-bold text-gray-900 mb-3">A/B Test Assignments</h3>
          
          {EXPERIMENTS.filter(isExperimentActive).map(experiment => (
            <div key={experiment.id} className="mb-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0 last:mb-0">
              <div className="text-sm font-medium text-gray-700 mb-2">
                {experiment.name}
              </div>
              <select
                value={assignments[experiment.id] ?? ''}
                onChange={(e) => forceVariant(experiment.id, e.target.value)}
                className="w-full text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="">Not assigned</option>
                {experiment.variants.map(variant => (
                  <option key={variant.id} value={variant.id}>
                    {variant.name}
                  </option>
                ))}
              </select>
            </div>
          ))}
          
          <button
            onClick={() => {
              localStorage.removeItem(STORAGE_KEY)
              window.location.reload()
            }}
            className="w-full mt-2 text-xs text-red-600 hover:text-red-700"
          >
            Reset All Assignments
          </button>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  ABTestProvider,
  useABTest,
  useExperiment,
  Variant,
  ExperimentRenderer,
  ABTestDebugPanel,
  EXPERIMENTS,
}

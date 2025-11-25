/**
 * Analytics - Conversion tracking and event logging utilities
 * 
 * This module provides a unified interface for tracking user behavior
 * and conversion events. It's designed to be platform-agnostic, supporting:
 * - Google Analytics 4 (GA4)
 * - Meta Pixel (Facebook)
 * - Custom analytics endpoints
 * - Console logging in development
 * 
 * Usage:
 * import { analytics, trackEvent, trackConversion } from '@/lib/analytics'
 * 
 * trackEvent('button_click', { button_name: 'create_puzzle' })
 * trackConversion('purchase', { value: 99, currency: 'USD' })
 */

// ============================================================================
// TYPES
// ============================================================================

interface AnalyticsConfig {
  debug: boolean
  enabled: boolean
  gaTrackingId?: string
  metaPixelId?: string
  customEndpoint?: string
}

interface EventData {
  [key: string]: string | number | boolean | undefined | null | object
}

interface ConversionData {
  value?: number
  currency?: string
  transactionId?: string
  items?: Array<{
    id: string
    name: string
    price: number
    quantity: number
  }>
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const config: AnalyticsConfig = {
  debug: import.meta.env.DEV,
  enabled: true, // Toggle for GDPR compliance
  // These would be set from environment variables in production
  gaTrackingId: import.meta.env.VITE_GA_TRACKING_ID,
  metaPixelId: import.meta.env.VITE_META_PIXEL_ID,
  customEndpoint: import.meta.env.VITE_ANALYTICS_ENDPOINT,
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function log(message: string, data?: EventData | ConversionData) {
  if (config.debug) {
    console.log(`[Analytics] ${message}`, data || '')
  }
}

function getSessionId(): string {
  try {
    let sessionId = sessionStorage.getItem('analytics_session_id')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
      sessionStorage.setItem('analytics_session_id', sessionId)
    }
    return sessionId
  } catch {
    return `session_${Date.now()}`
  }
}

function getUserId(): string | null {
  try {
    return localStorage.getItem('analytics_user_id')
  } catch {
    return null
  }
}

function setUserId(userId: string): void {
  try {
    localStorage.setItem('analytics_user_id', userId)
  } catch {
    // Ignore errors
  }
}

// ============================================================================
// EVENT TRACKING
// ============================================================================

/**
 * Track a custom event
 */
export function trackEvent(eventName: string, data?: EventData): void {
  if (!config.enabled) return

  const enrichedData = {
    ...data,
    timestamp: new Date().toISOString(),
    sessionId: getSessionId(),
    userId: getUserId(),
    page: typeof window !== 'undefined' ? window.location.pathname : '',
  }

  log(`Event: ${eventName}`, enrichedData)

  // Google Analytics 4
  if (config.gaTrackingId && typeof window !== 'undefined' && 'gtag' in window) {
    (window as typeof window & { gtag: (...args: unknown[]) => void }).gtag(
      'event', 
      eventName, 
      enrichedData
    )
  }

  // Meta Pixel
  if (config.metaPixelId && typeof window !== 'undefined' && 'fbq' in window) {
    (window as typeof window & { fbq: (...args: unknown[]) => void }).fbq(
      'trackCustom', 
      eventName, 
      enrichedData
    )
  }

  // Custom endpoint
  if (config.customEndpoint) {
    fetch(config.customEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: eventName, data: enrichedData }),
      keepalive: true,
    }).catch(() => {
      // Ignore fetch errors for analytics
    })
  }
}

/**
 * Track a conversion event (purchase, signup, etc.)
 */
export function trackConversion(
  conversionType: 'purchase' | 'signup' | 'lead' | 'add_to_cart',
  data: ConversionData
): void {
  if (!config.enabled) return

  log(`Conversion: ${conversionType}`, data)

  // Google Analytics 4 - Enhanced e-commerce
  if (config.gaTrackingId && typeof window !== 'undefined' && 'gtag' in window) {
    const gtag = (window as typeof window & { gtag: (...args: unknown[]) => void }).gtag
    
    switch (conversionType) {
      case 'purchase':
        gtag('event', 'purchase', {
          transaction_id: data.transactionId,
          value: data.value,
          currency: data.currency || 'USD',
          items: data.items,
        })
        break
      case 'add_to_cart':
        gtag('event', 'add_to_cart', {
          value: data.value,
          currency: data.currency || 'USD',
          items: data.items,
        })
        break
      case 'signup':
        gtag('event', 'sign_up', { method: 'email' })
        break
      case 'lead':
        gtag('event', 'generate_lead', { value: data.value })
        break
    }
  }

  // Meta Pixel
  if (config.metaPixelId && typeof window !== 'undefined' && 'fbq' in window) {
    const fbq = (window as typeof window & { fbq: (...args: unknown[]) => void }).fbq
    
    switch (conversionType) {
      case 'purchase':
        fbq('track', 'Purchase', {
          value: data.value,
          currency: data.currency || 'USD',
        })
        break
      case 'add_to_cart':
        fbq('track', 'AddToCart', {
          value: data.value,
          currency: data.currency || 'USD',
        })
        break
      case 'signup':
        fbq('track', 'CompleteRegistration')
        break
      case 'lead':
        fbq('track', 'Lead', { value: data.value })
        break
    }
  }

  // Track as regular event too for custom analytics
  trackEvent(`conversion_${conversionType}`, {
    ...data,
    value: data.value,
  } as EventData)
}

// ============================================================================
// PAGE TRACKING
// ============================================================================

/**
 * Track a page view
 */
export function trackPageView(pageName?: string): void {
  if (!config.enabled) return

  const page = pageName || (typeof window !== 'undefined' ? window.location.pathname : '')
  
  log(`Page View: ${page}`)

  trackEvent('page_view', { page_title: pageName, page_location: page })
}

// ============================================================================
// FUNNEL TRACKING - Specific to puzzle creation flow
// ============================================================================

export type FunnelStep = 
  | 'home'
  | 'tier_selection'
  | 'shape_selection'
  | 'partner_invitation'
  | 'image_choice'
  | 'hint_cards'
  | 'packaging'
  | 'checkout'
  | 'confirmation'

/**
 * Track funnel step progression
 */
export function trackFunnelStep(step: FunnelStep, data?: EventData): void {
  trackEvent('funnel_step', {
    step,
    step_index: [
      'home',
      'tier_selection',
      'shape_selection',
      'partner_invitation',
      'image_choice',
      'hint_cards',
      'packaging',
      'checkout',
      'confirmation',
    ].indexOf(step),
    ...data,
  })
}

/**
 * Track funnel abandonment
 */
export function trackFunnelAbandonment(step: FunnelStep, reason?: string): void {
  trackEvent('funnel_abandonment', {
    step,
    reason,
    session_duration: Date.now() - (parseInt(getSessionId().split('_')[1]) || Date.now()),
  })
}

// ============================================================================
// USER BEHAVIOR TRACKING
// ============================================================================

/**
 * Track time spent on step
 */
let stepStartTime: number | null = null

export function startStepTimer(): void {
  stepStartTime = Date.now()
}

export function endStepTimer(step: FunnelStep): void {
  if (stepStartTime) {
    const duration = Date.now() - stepStartTime
    trackEvent('step_duration', {
      step,
      duration_ms: duration,
      duration_seconds: Math.round(duration / 1000),
    })
    stepStartTime = null
  }
}

/**
 * Track feature interaction
 */
export function trackInteraction(
  feature: string, 
  action: 'click' | 'hover' | 'scroll' | 'input',
  data?: EventData
): void {
  trackEvent('interaction', {
    feature,
    action,
    ...data,
  })
}

// ============================================================================
// ERROR TRACKING
// ============================================================================

/**
 * Track errors for debugging
 */
export function trackError(error: Error, context?: string): void {
  trackEvent('error', {
    error_name: error.name,
    error_message: error.message,
    error_stack: error.stack?.substring(0, 500),
    context,
  })
}

// ============================================================================
// ANALYTICS HOOK
// ============================================================================

import { useEffect, useRef } from 'react'

/**
 * Hook for automatic page and step tracking
 */
export function useAnalytics(step: FunnelStep) {
  const hasTracked = useRef(false)

  useEffect(() => {
    if (!hasTracked.current) {
      startStepTimer()
      trackFunnelStep(step)
      hasTracked.current = true
    }

    return () => {
      endStepTimer(step)
    }
  }, [step])
}

/**
 * Hook for tracking form interactions
 */
export function useFormAnalytics(formName: string) {
  const startTime = useRef(Date.now())
  const interactionCount = useRef(0)

  const trackFieldInteraction = (fieldName: string) => {
    interactionCount.current++
    trackInteraction(formName, 'input', { field: fieldName })
  }

  const trackFormSubmit = (success: boolean) => {
    trackEvent('form_submit', {
      form_name: formName,
      success,
      duration_ms: Date.now() - startTime.current,
      interaction_count: interactionCount.current,
    })
  }

  return { trackFieldInteraction, trackFormSubmit }
}

// ============================================================================
// CONSENT MANAGEMENT
// ============================================================================

/**
 * Enable/disable analytics based on user consent
 */
export function setAnalyticsConsent(hasConsent: boolean): void {
  config.enabled = hasConsent
  try {
    localStorage.setItem('analytics_consent', hasConsent ? 'true' : 'false')
  } catch {
    // Ignore errors
  }
  
  if (hasConsent) {
    trackEvent('consent_granted')
  }
}

/**
 * Check if user has given consent
 */
export function getAnalyticsConsent(): boolean {
  try {
    return localStorage.getItem('analytics_consent') === 'true'
  } catch {
    return false
  }
}

// ============================================================================
// EXPORT ANALYTICS OBJECT FOR CONVENIENCE
// ============================================================================

export const analytics = {
  trackEvent,
  trackConversion,
  trackPageView,
  trackFunnelStep,
  trackFunnelAbandonment,
  trackInteraction,
  trackError,
  setConsent: setAnalyticsConsent,
  getConsent: getAnalyticsConsent,
  setUserId,
}

export default analytics

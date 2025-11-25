/**
 * Web Vitals Monitoring
 * 
 * Tracks Core Web Vitals (LCP, FID, CLS) for performance optimization.
 * Based on Google's web-vitals library patterns.
 */

import { trackEvent } from './analytics'

// Type definitions for web vitals
interface Metric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  id: string
  navigationType: string
}

// Thresholds based on Google's Core Web Vitals
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint
  FID: { good: 100, poor: 300 },   // First Input Delay
  CLS: { good: 0.1, poor: 0.25 },  // Cumulative Layout Shift
  FCP: { good: 1800, poor: 3000 }, // First Contentful Paint
  TTFB: { good: 800, poor: 1800 }, // Time to First Byte
  INP: { good: 200, poor: 500 },   // Interaction to Next Paint
}

type MetricName = keyof typeof THRESHOLDS

// Get rating based on thresholds
function getRating(name: MetricName, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name]
  if (!threshold) return 'good'
  
  if (value <= threshold.good) return 'good'
  if (value <= threshold.poor) return 'needs-improvement'
  return 'poor'
}

// Report metric to analytics
function reportMetric(metric: Metric) {
  const { name, value, rating, id, navigationType } = metric
  
  // Track in analytics
  trackEvent('web_vital', {
    metric_name: name,
    metric_value: Math.round(value),
    metric_rating: rating,
    metric_id: id,
    navigation_type: navigationType,
  })
  
  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[WebVital] ${name}: ${Math.round(value)}ms (${rating})`)
  }
}

// Observe Largest Contentful Paint
function observeLCP() {
  if (!('PerformanceObserver' in window)) return
  
  try {
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number }
      
      if (lastEntry) {
        const value = lastEntry.renderTime || lastEntry.loadTime || 0
        reportMetric({
          name: 'LCP',
          value,
          rating: getRating('LCP', value),
          delta: value,
          id: crypto.randomUUID?.() || String(Date.now()),
          navigationType: getNavigationType(),
        })
      }
    })
    
    observer.observe({ type: 'largest-contentful-paint', buffered: true })
  } catch (error) {
    console.warn('[WebVital] LCP observation failed:', error)
  }
}

// Observe First Input Delay
function observeFID() {
  if (!('PerformanceObserver' in window)) return
  
  try {
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const firstEntry = entries[0] as PerformanceEventTiming
      
      if (firstEntry) {
        const value = firstEntry.processingStart - firstEntry.startTime
        reportMetric({
          name: 'FID',
          value,
          rating: getRating('FID', value),
          delta: value,
          id: crypto.randomUUID?.() || String(Date.now()),
          navigationType: getNavigationType(),
        })
      }
    })
    
    observer.observe({ type: 'first-input', buffered: true })
  } catch (error) {
    console.warn('[WebVital] FID observation failed:', error)
  }
}

// Observe Cumulative Layout Shift
function observeCLS() {
  if (!('PerformanceObserver' in window)) return
  
  let clsValue = 0
  let sessionValue = 0
  let sessionEntries: PerformanceEntry[] = []
  
  try {
    const observer = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries() as (PerformanceEntry & { hadRecentInput?: boolean; value?: number })[]) {
        // Only count layout shifts without recent user input
        if (!entry.hadRecentInput) {
          const firstSessionEntry = sessionEntries[0]
          const lastSessionEntry = sessionEntries[sessionEntries.length - 1]
          
          // If the entry occurred within 1 second of the previous entry and
          // within 5 seconds of the first entry, include it in the current session
          if (
            sessionValue &&
            firstSessionEntry &&
            lastSessionEntry &&
            entry.startTime - lastSessionEntry.startTime < 1000 &&
            entry.startTime - firstSessionEntry.startTime < 5000
          ) {
            sessionValue += entry.value || 0
            sessionEntries.push(entry)
          } else {
            sessionValue = entry.value || 0
            sessionEntries = [entry]
          }
          
          if (sessionValue > clsValue) {
            clsValue = sessionValue
          }
        }
      }
    })
    
    observer.observe({ type: 'layout-shift', buffered: true })
    
    // Report CLS on page hide
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        reportMetric({
          name: 'CLS',
          value: clsValue,
          rating: getRating('CLS', clsValue),
          delta: clsValue,
          id: crypto.randomUUID?.() || String(Date.now()),
          navigationType: getNavigationType(),
        })
      }
    })
  } catch (error) {
    console.warn('[WebVital] CLS observation failed:', error)
  }
}

// Observe First Contentful Paint
function observeFCP() {
  if (!('PerformanceObserver' in window)) return
  
  try {
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint')
      
      if (fcpEntry) {
        const value = fcpEntry.startTime
        reportMetric({
          name: 'FCP',
          value,
          rating: getRating('FCP', value),
          delta: value,
          id: crypto.randomUUID?.() || String(Date.now()),
          navigationType: getNavigationType(),
        })
      }
    })
    
    observer.observe({ type: 'paint', buffered: true })
  } catch (error) {
    console.warn('[WebVital] FCP observation failed:', error)
  }
}

// Observe Time to First Byte
function observeTTFB() {
  try {
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    
    if (navigationEntry) {
      const value = navigationEntry.responseStart - navigationEntry.requestStart
      reportMetric({
        name: 'TTFB',
        value,
        rating: getRating('TTFB', value),
        delta: value,
        id: crypto.randomUUID?.() || String(Date.now()),
        navigationType: getNavigationType(),
      })
    }
  } catch (error) {
    console.warn('[WebVital] TTFB observation failed:', error)
  }
}

// Get navigation type
function getNavigationType(): string {
  try {
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    return navigationEntry?.type || 'navigate'
  } catch {
    return 'navigate'
  }
}

/**
 * Initialize Web Vitals monitoring
 * Call this in main.tsx after app mounts
 */
export function initWebVitals() {
  if (typeof window === 'undefined') return
  
  // Wait for page to be interactive
  if (document.readyState === 'complete') {
    startObserving()
  } else {
    window.addEventListener('load', startObserving)
  }
}

function startObserving() {
  // Small delay to not interfere with initial render
  requestIdleCallback?.(() => {
    observeLCP()
    observeFID()
    observeCLS()
    observeFCP()
    observeTTFB()
  }) || setTimeout(() => {
    observeLCP()
    observeFID()
    observeCLS()
    observeFCP()
    observeTTFB()
  }, 100)
}

/**
 * Get current performance summary
 * Useful for debugging in development
 */
export function getPerformanceSummary() {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
  
  if (!navigation) return null
  
  return {
    dns: navigation.domainLookupEnd - navigation.domainLookupStart,
    tcp: navigation.connectEnd - navigation.connectStart,
    ttfb: navigation.responseStart - navigation.requestStart,
    download: navigation.responseEnd - navigation.responseStart,
    domInteractive: navigation.domInteractive - navigation.fetchStart,
    domComplete: navigation.domComplete - navigation.fetchStart,
    loadEvent: navigation.loadEventEnd - navigation.fetchStart,
  }
}

// RequestIdleCallback is already defined in lib.dom.d.ts
// No polyfill type needed

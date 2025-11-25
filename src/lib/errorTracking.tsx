/**
 * Error Tracking and Monitoring Utilities
 * 
 * Provides a unified interface for error tracking and monitoring.
 * Supports multiple backends:
 * - Console logging (development)
 * - Sentry (production)
 * - Custom error endpoint
 * 
 * Usage:
 * import { captureError, captureMessage } from '@/lib/errorTracking'
 * 
 * try {
 *   // risky operation
 * } catch (error) {
 *   captureError(error, { context: 'checkout', userId: 'xyz' })
 * }
 */

// ============================================================================
// TYPES
// ============================================================================

export interface ErrorContext {
  /** Component or feature where error occurred */
  component?: string
  /** User action that triggered error */
  action?: string
  /** User ID if available */
  userId?: string
  /** Session ID */
  sessionId?: string
  /** Additional metadata */
  extra?: Record<string, unknown>
  /** Error severity */
  level?: 'info' | 'warning' | 'error' | 'fatal'
  /** Tags for categorization */
  tags?: Record<string, string>
}

export interface ErrorTrackerConfig {
  /** Enable error tracking */
  enabled: boolean
  /** Environment (development, staging, production) */
  environment: string
  /** Application version */
  release?: string
  /** Sentry DSN */
  sentryDsn?: string
  /** Custom error endpoint */
  customEndpoint?: string
  /** Sample rate for error capture (0-1) */
  sampleRate?: number
  /** User consent for tracking */
  hasConsent?: boolean
}

interface ErrorReport {
  message: string
  stack?: string
  name?: string
  context: ErrorContext
  url: string
  userAgent: string
  timestamp: string
  release?: string
  environment: string
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const config: ErrorTrackerConfig = {
  enabled: true,
  environment: import.meta.env.MODE || 'development',
  release: import.meta.env.VITE_APP_VERSION || '1.0.0',
  sentryDsn: import.meta.env.VITE_SENTRY_DSN,
  customEndpoint: import.meta.env.VITE_ERROR_ENDPOINT,
  sampleRate: 1.0,
  hasConsent: true,
}

// Error buffer for offline/rate-limiting scenarios
const errorBuffer: ErrorReport[] = []
const MAX_BUFFER_SIZE = 50
let flushInterval: ReturnType<typeof setInterval> | null = null

// ============================================================================
// UTILITIES
// ============================================================================

/** Serialize error to plain object */
function serializeError(error: unknown): { message: string; stack?: string; name?: string } {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
      name: error.name,
    }
  }
  
  if (typeof error === 'string') {
    return { message: error }
  }
  
  try {
    return { message: JSON.stringify(error) }
  } catch {
    return { message: String(error) }
  }
}

/** Get session ID from storage */
function getSessionId(): string {
  if (typeof window === 'undefined') return 'ssr'
  
  let sessionId = sessionStorage.getItem('interlock_error_session')
  if (!sessionId) {
    sessionId = `sess_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('interlock_error_session', sessionId)
  }
  return sessionId
}

/** Should capture this error based on sampling */
function shouldCapture(): boolean {
  if (!config.enabled) return false
  if (!config.hasConsent) return false
  
  return Math.random() < (config.sampleRate ?? 1)
}

/** Build error report */
function buildReport(error: unknown, context: ErrorContext = {}): ErrorReport {
  const serialized = serializeError(error)
  
  return {
    ...serialized,
    context: {
      ...context,
      sessionId: context.sessionId ?? getSessionId(),
    },
    url: typeof window !== 'undefined' ? window.location.href : 'ssr',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'ssr',
    timestamp: new Date().toISOString(),
    release: config.release,
    environment: config.environment,
  }
}

// ============================================================================
// TRANSPORT LAYER
// ============================================================================

/** Log to console */
function logToConsole(report: ErrorReport): void {
  const level = report.context.level ?? 'error'
  const style = {
    info: 'color: #2196F3',
    warning: 'color: #FF9800',
    error: 'color: #f44336',
    fatal: 'color: #9C27B0; font-weight: bold',
  }
  
  console.groupCollapsed(
    `%c[${level.toUpperCase()}] ${report.message}`,
    style[level]
  )
  console.log('Stack:', report.stack)
  console.log('Context:', report.context)
  console.log('URL:', report.url)
  console.log('Timestamp:', report.timestamp)
  console.groupEnd()
}

/** Send to Sentry */
async function sendToSentry(report: ErrorReport): Promise<void> {
  // In production, you would initialize Sentry and use their SDK
  // This is a placeholder for the integration
  if (!config.sentryDsn) return
  
  // Example Sentry integration (requires @sentry/browser)
  // Sentry.captureException(new Error(report.message), {
  //   extra: report.context.extra,
  //   tags: report.context.tags,
  //   user: { id: report.context.userId },
  // })
  
  console.debug('[Sentry] Would send:', report)
}

/** Send to custom endpoint */
async function sendToCustomEndpoint(report: ErrorReport): Promise<void> {
  if (!config.customEndpoint) return
  
  try {
    await fetch(config.customEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report),
      // Don't wait for response in background
      keepalive: true,
    })
  } catch (err) {
    console.warn('[ErrorTracking] Failed to send to custom endpoint:', err)
  }
}

/** Flush error buffer */
async function flushBuffer(): Promise<void> {
  if (errorBuffer.length === 0) return
  
  const toSend = errorBuffer.splice(0, 10) // Send in batches of 10
  
  for (const report of toSend) {
    if (config.sentryDsn) {
      await sendToSentry(report)
    }
    if (config.customEndpoint) {
      await sendToCustomEndpoint(report)
    }
  }
}

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * Initialize error tracking
 * Call this once at app startup
 */
export function initErrorTracking(options: Partial<ErrorTrackerConfig> = {}): void {
  Object.assign(config, options)
  
  // Set up global error handlers
  if (typeof window !== 'undefined') {
    window.onerror = (message, source, lineno, colno, error) => {
      captureError(error ?? message, {
        component: 'global',
        action: 'uncaught_error',
        extra: { source, lineno, colno },
      })
    }
    
    window.onunhandledrejection = (event) => {
      captureError(event.reason, {
        component: 'global',
        action: 'unhandled_rejection',
      })
    }
  }
  
  // Start flush interval
  if (!flushInterval) {
    flushInterval = setInterval(flushBuffer, 10000) // Flush every 10 seconds
  }
}

/**
 * Capture an error
 */
export function captureError(error: unknown, context: ErrorContext = {}): void {
  if (!shouldCapture()) return
  
  const report = buildReport(error, context)
  
  // Always log to console in development
  if (config.environment === 'development') {
    logToConsole(report)
    return
  }
  
  // Add to buffer for sending
  if (errorBuffer.length < MAX_BUFFER_SIZE) {
    errorBuffer.push(report)
  }
  
  // Immediately send fatal errors
  if (context.level === 'fatal') {
    flushBuffer()
  }
}

/**
 * Capture a message (non-error)
 */
export function captureMessage(
  message: string,
  level: 'info' | 'warning' | 'error' = 'info',
  context: Omit<ErrorContext, 'level'> = {}
): void {
  captureError(message, { ...context, level })
}

/**
 * Set user context for all future errors
 */
export function setUser(user: { id?: string; email?: string; name?: string } | null): void {
  if (typeof window !== 'undefined' && user) {
    sessionStorage.setItem('interlock_error_user', JSON.stringify(user))
  } else if (typeof window !== 'undefined') {
    sessionStorage.removeItem('interlock_error_user')
  }
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(
  category: string,
  message: string,
  level: 'info' | 'warning' | 'error' = 'info',
  data?: Record<string, unknown>
): void {
  if (config.environment === 'development') {
    console.debug(`[Breadcrumb:${category}] ${message}`, data)
  }
  
  // In production, these would be sent to Sentry
  // Sentry.addBreadcrumb({ category, message, level, data })
}

/**
 * Create a scoped error capturer for a specific component
 */
export function createErrorScope(
  component: string
): {
  captureError: (error: unknown, context?: Omit<ErrorContext, 'component'>) => void
  captureMessage: (message: string, level?: 'info' | 'warning' | 'error', context?: Omit<ErrorContext, 'component' | 'level'>) => void
} {
  return {
    captureError: (error, context = {}) => {
      captureError(error, { ...context, component })
    },
    captureMessage: (message, level = 'info', context = {}) => {
      captureMessage(message, level, { ...context, component })
    },
  }
}

/**
 * Wrap a function with error capture
 */
export function withErrorCapture<T extends (...args: unknown[]) => unknown>(
  fn: T,
  context: ErrorContext = {}
): T {
  return ((...args: Parameters<T>) => {
    try {
      const result = fn(...args)
      
      // Handle async functions
      if (result instanceof Promise) {
        return result.catch((error) => {
          captureError(error, { ...context, action: fn.name || 'async_function' })
          throw error
        })
      }
      
      return result
    } catch (error) {
      captureError(error, { ...context, action: fn.name || 'function' })
      throw error
    }
  }) as T
}

// ============================================================================
// REACT INTEGRATION
// ============================================================================

import { Component, type ReactNode, type ErrorInfo } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode)
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  component?: string
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * Error boundary with integrated error tracking
 */
export class TrackedErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    captureError(error, {
      component: this.props.component ?? 'ErrorBoundary',
      level: 'error',
      extra: {
        componentStack: errorInfo.componentStack,
      },
    })
    
    this.props.onError?.(error, errorInfo)
  }
  
  reset = (): void => {
    this.setState({ hasError: false, error: null })
  }
  
  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      const { fallback } = this.props
      
      if (typeof fallback === 'function') {
        return fallback(this.state.error, this.reset)
      }
      
      return fallback ?? (
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">We've been notified and are working on a fix.</p>
          <button
            onClick={this.reset}
            className="px-4 py-2 bg-terracotta text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      )
    }
    
    return this.props.children
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  initErrorTracking,
  captureError,
  captureMessage,
  setUser,
  addBreadcrumb,
  createErrorScope,
  withErrorCapture,
  TrackedErrorBoundary,
}

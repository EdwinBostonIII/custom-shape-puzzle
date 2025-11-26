/**
 * INTERLOCK CUSTOM PUZZLES - Accessibility Utilities & Components
 * 
 * WCAG 2.1 AA compliant accessibility enhancements including:
 * - Skip links for keyboard navigation
 * - Screen reader announcements
 * - Focus management
 * - Reduced motion preferences
 * - High contrast mode detection
 * - Keyboard shortcuts
 * 
 * Research basis:
 * - 15-20% of users have some form of disability (WHO)
 * - Accessible sites see 12% higher conversion rates (Click-Away Pound)
 * - 71% of users with disabilities leave inaccessible sites (WebAIM)
 * - Keyboard-only users represent 7% of web users
 */

import { useState, useEffect, useCallback, useRef, createContext, useContext, type ReactNode } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

// ============================================================================
// TYPES
// ============================================================================

interface AccessibilitySettings {
  reduceMotion: boolean
  highContrast: boolean
  largeText: boolean
  keyboardMode: boolean
  screenReaderActive: boolean
}

interface AccessibilityContextType {
  settings: AccessibilitySettings
  updateSetting: (key: keyof AccessibilitySettings, value: boolean) => void
  announce: (message: string, priority?: 'polite' | 'assertive') => void
  focusMain: () => void
}

interface SkipLinkProps {
  href?: string
  children?: ReactNode
  className?: string
}

interface LiveRegionProps {
  priority?: 'polite' | 'assertive'
  className?: string
}

interface FocusTrapProps {
  children: ReactNode
  active?: boolean
  initialFocus?: string
  returnFocus?: boolean
}

interface KeyboardShortcutConfig {
  key: string
  ctrl?: boolean
  alt?: boolean
  shift?: boolean
  action: () => void
  description: string
}

// ============================================================================
// ACCESSIBILITY CONTEXT
// ============================================================================

const AccessibilityContext = createContext<AccessibilityContextType | null>(null)

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion()
  const [announcement, setAnnouncement] = useState('')
  const [announcePriority, setAnnouncePriority] = useState<'polite' | 'assertive'>('polite')
  
  const [settings, setSettings] = useState<AccessibilitySettings>({
    reduceMotion: prefersReducedMotion || false,
    highContrast: false,
    largeText: false,
    keyboardMode: false,
    screenReaderActive: false,
  })

  // Detect high contrast mode
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const mediaQuery = window.matchMedia('(forced-colors: active)')
    setSettings(prev => ({ ...prev, highContrast: mediaQuery.matches }))
    
    const handler = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, highContrast: e.matches }))
    }
    
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Detect keyboard navigation
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setSettings(prev => ({ ...prev, keyboardMode: true }))
      }
    }
    
    const handleMouseDown = () => {
      setSettings(prev => ({ ...prev, keyboardMode: false }))
    }
    
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('mousedown', handleMouseDown)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  // Update reduced motion preference
  useEffect(() => {
    setSettings(prev => ({ ...prev, reduceMotion: prefersReducedMotion || false }))
  }, [prefersReducedMotion])

  const updateSetting = useCallback((key: keyof AccessibilitySettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }, [])

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setAnnouncePriority(priority)
    setAnnouncement(message)
    // Clear after a short delay to allow re-announcement of same message
    setTimeout(() => setAnnouncement(''), 1000)
  }, [])

  const focusMain = useCallback(() => {
    const main = document.querySelector('main') || document.getElementById('main-content')
    if (main instanceof HTMLElement) {
      main.focus()
    }
  }, [])

  return (
    <AccessibilityContext.Provider value={{ settings, updateSetting, announce, focusMain }}>
      {children}
      {/* Live region for announcements */}
      <div
        role="status"
        aria-live={announcePriority}
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider')
  }
  return context
}

// ============================================================================
// SKIP LINK
// ============================================================================

export function SkipLink({ href = '#main-content', children, className }: SkipLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        "sr-only focus:not-sr-only",
        "focus:absolute focus:top-4 focus:left-4 focus:z-[100]",
        "focus:px-4 focus:py-2 focus:bg-black focus:text-white",
        "focus:rounded-md focus:shadow-lg focus:outline-none",
        "focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black",
        "transition-all duration-200",
        className
      )}
    >
      {children || 'Skip to main content'}
    </a>
  )
}

// ============================================================================
// SKIP LINKS GROUP
// ============================================================================

interface SkipLinksProps {
  links?: Array<{ href: string; label: string }>
}

export function SkipLinks({ links }: SkipLinksProps) {
  const defaultLinks = [
    { href: '#main-content', label: 'Skip to main content' },
    { href: '#navigation', label: 'Skip to navigation' },
    { href: '#footer', label: 'Skip to footer' },
  ]
  
  const linksToRender = links || defaultLinks
  
  return (
    <nav className="sr-only focus-within:not-sr-only focus-within:fixed focus-within:top-4 focus-within:left-4 focus-within:z-[100]">
      <ul className="flex flex-col gap-2">
        {linksToRender.map((link) => (
          <li key={link.href}>
            <SkipLink href={link.href}>{link.label}</SkipLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

// ============================================================================
// FOCUS TRAP
// ============================================================================

export function FocusTrap({ children, active = true, initialFocus, returnFocus = true }: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!active) return
    
    // Store previously focused element
    previousFocusRef.current = document.activeElement as HTMLElement
    
    // Focus initial element
    if (initialFocus && containerRef.current) {
      const element = containerRef.current.querySelector(initialFocus)
      if (element instanceof HTMLElement) {
        element.focus()
      }
    }
    
    return () => {
      // Return focus on cleanup
      if (returnFocus && previousFocusRef.current) {
        previousFocusRef.current.focus()
      }
    }
  }, [active, initialFocus, returnFocus])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!active || e.key !== 'Tab') return
    
    const container = containerRef.current
    if (!container) return
    
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement
    
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault()
      lastElement.focus()
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault()
      firstElement.focus()
    }
  }, [active])

  return (
    <div ref={containerRef} onKeyDown={handleKeyDown}>
      {children}
    </div>
  )
}

// ============================================================================
// VISUALLY HIDDEN (for screen readers only)
// ============================================================================

interface VisuallyHiddenProps {
  children: ReactNode
  as?: 'span' | 'div' | 'p' | 'label'
}

export function VisuallyHidden({ children, as: Component = 'span' }: VisuallyHiddenProps) {
  return (
    <Component className="sr-only">
      {children}
    </Component>
  )
}

// ============================================================================
// LIVE REGION (for dynamic announcements)
// ============================================================================

export function LiveRegion({ priority = 'polite', className }: LiveRegionProps) {
  const [message, setMessage] = useState('')
  
  // Expose a way to update the message
  useEffect(() => {
    const handler = (e: CustomEvent<string>) => {
      setMessage(e.detail)
      setTimeout(() => setMessage(''), 1000)
    }
    
    window.addEventListener('announce' as never, handler)
    return () => window.removeEventListener('announce' as never, handler)
  }, [])
  
  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className={cn("sr-only", className)}
    >
      {message}
    </div>
  )
}

// Helper to trigger announcements
export function announceMessage(message: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('announce', { detail: message }))
  }
}

// ============================================================================
// FOCUS INDICATOR
// ============================================================================

interface FocusIndicatorProps {
  children: ReactNode
  className?: string
}

export function FocusIndicator({ children, className }: FocusIndicatorProps) {
  const { settings } = useAccessibility()
  
  return (
    <div
      className={cn(
        "relative",
        settings.keyboardMode && [
          "focus-within:outline-none",
          "focus-within:ring-2 focus-within:ring-offset-2",
          "focus-within:ring-amber-500 focus-within:ring-offset-white",
          "dark:focus-within:ring-offset-gray-900",
        ],
        className
      )}
    >
      {children}
    </div>
  )
}

// ============================================================================
// MOTION WRAPPER (respects reduced motion)
// ============================================================================

interface MotionWrapperProps {
  children: ReactNode
  animate?: object
  initial?: object
  exit?: object
  transition?: object
  className?: string
}

export function MotionWrapper({
  children,
  animate,
  initial,
  exit,
  transition,
  className,
}: MotionWrapperProps) {
  const { settings } = useAccessibility()
  
  // If reduced motion is preferred, skip animations
  if (settings.reduceMotion) {
    return <div className={className}>{children}</div>
  }
  
  return (
    <motion.div
      initial={initial as never}
      animate={animate as never}
      exit={exit as never}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ============================================================================
// KEYBOARD SHORTCUTS MANAGER
// ============================================================================

interface UseKeyboardShortcutsOptions {
  enabled?: boolean
  shortcuts: KeyboardShortcutConfig[]
}

export function useKeyboardShortcuts({ enabled = true, shortcuts }: UseKeyboardShortcutsOptions) {
  useEffect(() => {
    if (!enabled) return
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return
      }
      
      for (const shortcut of shortcuts) {
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase()
        const ctrlMatch = shortcut.ctrl ? e.ctrlKey || e.metaKey : true
        const altMatch = shortcut.alt ? e.altKey : true
        const shiftMatch = shortcut.shift ? e.shiftKey : true
        
        if (keyMatch && ctrlMatch && altMatch && shiftMatch) {
          e.preventDefault()
          shortcut.action()
          return
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enabled, shortcuts])
}

// ============================================================================
// KEYBOARD SHORTCUTS HELP DIALOG
// ============================================================================

interface KeyboardShortcutsHelpProps {
  shortcuts: KeyboardShortcutConfig[]
  isOpen: boolean
  onClose: () => void
}

export function KeyboardShortcutsHelp({ shortcuts, isOpen, onClose }: KeyboardShortcutsHelpProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="shortcuts-title"
        >
          <FocusTrap active initialFocus="[data-close-button]">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h2 id="shortcuts-title" className="text-lg font-semibold">
                  Keyboard Shortcuts
                </h2>
                <button
                  data-close-button
                  onClick={onClose}
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Close dialog"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              
              <div className="p-4 max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500">
                      <th className="pb-2">Shortcut</th>
                      <th className="pb-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {shortcuts.map((shortcut, index) => (
                      <tr key={index}>
                        <td className="py-2">
                          <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono">
                            {shortcut.ctrl && (
                              <span className="text-gray-500">Ctrl + </span>
                            )}
                            {shortcut.alt && (
                              <span className="text-gray-500">Alt + </span>
                            )}
                            {shortcut.shift && (
                              <span className="text-gray-500">Shift + </span>
                            )}
                            {shortcut.key.toUpperCase()}
                          </kbd>
                        </td>
                        <td className="py-2 text-sm">{shortcut.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500">
                Press <kbd className="px-1 bg-gray-100 dark:bg-gray-800 rounded">?</kbd> anytime to view shortcuts
              </div>
            </motion.div>
          </FocusTrap>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ============================================================================
// ARIA HELPERS
// ============================================================================

/**
 * Generate unique IDs for ARIA relationships
 */
let idCounter = 0
export function useAriaId(prefix = 'aria'): string {
  const [id] = useState(() => `${prefix}-${++idCounter}`)
  return id
}

/**
 * Announce page changes for SPAs
 */
export function usePageAnnouncement(pageTitle: string) {
  const { announce } = useAccessibility()
  
  useEffect(() => {
    announce(`Page loaded: ${pageTitle}`, 'polite')
    document.title = `${pageTitle} | INTERLOCK Custom Puzzles`
  }, [pageTitle, announce])
}

/**
 * Handle loading states with announcements
 */
export function useLoadingAnnouncement(isLoading: boolean, loadingMessage = 'Loading...', completeMessage = 'Content loaded') {
  const { announce } = useAccessibility()
  const wasLoadingRef = useRef(false)
  
  useEffect(() => {
    if (isLoading && !wasLoadingRef.current) {
      announce(loadingMessage)
    } else if (!isLoading && wasLoadingRef.current) {
      announce(completeMessage)
    }
    wasLoadingRef.current = isLoading
  }, [isLoading, loadingMessage, completeMessage, announce])
}

// ============================================================================
// EXPORTS
// ============================================================================

export type {
  AccessibilitySettings,
  AccessibilityContextType,
  SkipLinkProps,
  LiveRegionProps,
  FocusTrapProps,
  KeyboardShortcutConfig,
}

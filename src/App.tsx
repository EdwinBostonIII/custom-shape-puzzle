import { useEffect, useState, lazy, Suspense } from 'react'
import { Toaster } from 'sonner'
import { HomePage } from '@/components/HomePage'
import { ProgressIndicator } from '@/components/ProgressIndicator'
import { PuzzleSession, ShapeType, ShippingInfo, WoodStainColor } from '@/lib/types'

// Lazy load heavy components for better initial load performance
const ShapeSelection = lazy(() => import('@/components/ShapeSelection').then(m => ({ default: m.ShapeSelection })))
const ColorSelection = lazy(() => import('@/components/ColorSelection').then(m => ({ default: m.ColorSelection })))
const Checkout = lazy(() => import('@/components/Checkout').then(m => ({ default: m.Checkout })))
const OrderConfirmation = lazy(() => import('@/components/OrderConfirmation').then(m => ({ default: m.OrderConfirmation })))

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="spinner" style={{ width: '48px', height: '48px', borderWidth: '4px', color: 'var(--terracotta)' }} />
        <p className="text-charcoal/60 font-light">Loading...</p>
      </div>
    </div>
  )
}

// Simplified 4-step flow per master list: Shapes → Stain → Checkout → Confirmation
type Step = 'home' | 'shapes' | 'stain' | 'checkout' | 'confirmation'

function generateId() {
  const array = new Uint32Array(2)
  window.crypto.getRandomValues(array)
  const randomPart = Array.from(array).map(n => n.toString(36)).join('')
  return Date.now().toString(36) + randomPart
}

// LocalStorage persistence helper
const STORAGE_KEY = 'interlock-session'

function saveSession(session: PuzzleSession) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  } catch (e) {
    console.warn('Failed to save session:', e)
  }
}

function loadSession(): PuzzleSession | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const session = JSON.parse(saved) as PuzzleSession
      // Check if session is less than 24 hours old
      const hoursSinceCreation = (Date.now() - session.createdAt) / (1000 * 60 * 60)
      if (hoursSinceCreation < 24 && !session.orderComplete) {
        return session
      }
    }
  } catch (e) {
    console.warn('Failed to load session:', e)
  }
  return null
}

function clearSession() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (e) {
    console.warn('Failed to clear session:', e)
  }
}

function App() {
  const [step, setStep] = useState<Step>('home')
  const [session, setSession] = useState<PuzzleSession | null>(null)
  const [orderNumber, setOrderNumber] = useState<string>('')

  // Restore session on mount
  useEffect(() => {
    const savedSession = loadSession()
    if (savedSession && savedSession.selectedShapes.length > 0) {
      setSession(savedSession)
      // Resume where user left off
      if (savedSession.woodStain) {
        setStep('checkout')
      } else if (savedSession.selectedShapes.length === 10) {
        setStep('stain')
      } else {
        setStep('shapes')
      }
    }
  }, [])

  // Auto-save session on changes
  useEffect(() => {
    if (session && session.id) {
      saveSession(session)
    }
  }, [session])

  const handleStart = () => {
    const newSession: PuzzleSession = {
      id: generateId(),
      selectedShapes: [],
      woodStain: 'natural',
      createdAt: Date.now(),
    }
    setSession(newSession)
    setStep('shapes')
  }

  const handleShapesComplete = (shapes: ShapeType[], meanings?: Partial<Record<ShapeType, string>>) => {
    setSession(prev => {
      if (!prev) return prev
      return {
        ...prev,
        selectedShapes: shapes,
        shapeMeanings: meanings,
      }
    })
    setStep('stain')
  }

  const handleStainComplete = (stain: WoodStainColor) => {
    setSession(prev => {
      if (!prev) return prev
      return {
        ...prev,
        woodStain: stain,
      }
    })
    setStep('checkout')
  }

  const handleCheckoutComplete = (shippingInfo: ShippingInfo) => {
    const newOrderNumber = `PZ-${Date.now().toString(36).toUpperCase()}`
    setOrderNumber(newOrderNumber)
    setSession(prev => {
      if (!prev) return prev
      return {
        ...prev,
        shippingInfo,
        orderComplete: true,
      }
    })
    clearSession()
    setStep('confirmation')
  }

  const handleCreateAnother = () => {
    clearSession()
    setSession(null)
    setStep('home')
  }

  const handleBack = (toStep: Step) => {
    setStep(toStep)
  }

  return (
    <>
      <Toaster position="top-center" />

      {/* Show progress indicator on all steps except home and confirmation */}
      {step !== 'home' && step !== 'confirmation' && (
        <ProgressIndicator currentStep={step} />
      )}

      <Suspense fallback={<LoadingFallback />}>
        {step === 'home' && (
          <HomePage onStart={handleStart} />
        )}

        {step === 'shapes' && session && (
          <ShapeSelection
            selectedShapes={session.selectedShapes}
            shapeMeanings={session.shapeMeanings}
            onComplete={handleShapesComplete}
            onBack={handleCreateAnother}
          />
        )}

        {step === 'stain' && session && (
          <ColorSelection
            selectedColor={session.woodStain}
            selectedShapes={session.selectedShapes}
            shapeMeanings={session.shapeMeanings}
            onComplete={handleStainComplete}
            onBack={() => handleBack('shapes')}
          />
        )}

        {step === 'checkout' && session && (
          <Checkout
            session={session}
            onBack={() => handleBack('stain')}
            onComplete={handleCheckoutComplete}
          />
        )}

        {step === 'confirmation' && (
          <OrderConfirmation
            orderNumber={orderNumber}
            onCreateAnother={handleCreateAnother}
          />
        )}
      </Suspense>
    </>
  )
}

export default App
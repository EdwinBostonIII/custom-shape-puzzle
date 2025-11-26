import { useEffect, useState, lazy, Suspense } from 'react'
import { Toaster } from 'sonner'
import { HomePage } from '@/components/HomePage'
import { ProgressIndicator } from '@/components/ProgressIndicator'
import { EmailCapturePopup } from '@/components/EmailCapture'
import { ChatWidget } from '@/components/ChatWidget'
import { LiveOrderNotification } from '@/components/SocialProofNotifications'
import { PersonalizationProvider, usePersonalization } from '@/components/Personalization'
import { ExitIntentPopup, StickyDiscountReminder, useExitIntent } from '@/components/ExitIntent'
import { CookieConsent } from '@/components/CookieConsent'
import { 
  PageSkeleton, 
  TierSelectionSkeleton, 
  ImageChoiceSkeleton, 
  PackagingSkeleton, 
  CheckoutSkeleton 
} from '@/components/Skeleton'
import { 
  PuzzleSession, 
  ShapeType, 
  ShippingInfo, 
  PuzzleTier,
  ImageChoice as ImageChoiceType,
  HintCard,
  PackagingOptions,
  WoodStainColor,
  PartnerInvitation
} from '@/lib/types'
import { createDefaultSession, getTierConfig } from '@/lib/constants'
import { trackFunnelStep, trackConversion, useAnalytics } from '@/lib/analytics'

// Lazy load heavy components for better initial load performance
const TierSelection = lazy(() => import('@/components/TierSelection').then(m => ({ default: m.TierSelection })))
const ShapeSelection = lazy(() => import('@/components/ShapeSelection').then(m => ({ default: m.ShapeSelection })))
const ImageChoice = lazy(() => import('@/components/ImageChoice').then(m => ({ default: m.ImageChoice })))
const HintCardBuilder = lazy(() => import('@/components/HintCardBuilder').then(m => ({ default: m.HintCardBuilder })))
const PackagingSelection = lazy(() => import('@/components/PackagingSelection').then(m => ({ default: m.PackagingSelection })))
const Checkout = lazy(() => import('@/components/Checkout').then(m => ({ default: m.Checkout })))
const OrderConfirmation = lazy(() => import('@/components/OrderConfirmation').then(m => ({ default: m.OrderConfirmation })))
const PartnerInvitationFlow = lazy(() => import('@/components/PartnerInvitation').then(m => ({ default: m.PartnerInvitationFlow })))

// Loading fallback component with contextual skeletons
function LoadingFallback({ step }: { step?: Step }) {
  switch (step) {
    case 'tier':
      return <TierSelectionSkeleton />
    case 'image':
      return <ImageChoiceSkeleton />
    case 'packaging':
      return <PackagingSkeleton />
    case 'checkout':
      return <CheckoutSkeleton />
    default:
      return <PageSkeleton />
  }
}

// Flow: Home → Tier → Shapes → Partner? → Image → HintCards → Packaging → Checkout → Confirmation
type Step = 'home' | 'tier' | 'shapes' | 'partner' | 'image' | 'hints' | 'packaging' | 'checkout' | 'confirmation'

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
      // Resume where user left off based on progress
      if (savedSession.orderComplete) {
        setStep('confirmation')
      } else if (savedSession.shippingInfo) {
        setStep('checkout')
      } else if (savedSession.hintCards.length > 0) {
        setStep('packaging')
      } else if (savedSession.imageChoice && (savedSession.photoUrl || savedSession.colorAssignments)) {
        setStep('hints')
      } else if (savedSession.selectedShapes.length >= getTierConfig(savedSession.tier).shapes) {
        setStep('image')
      } else if (savedSession.tier) {
        setStep('shapes')
      } else {
        setStep('tier')
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
    const newSession = createDefaultSession(generateId())
    setSession(newSession)
    trackFunnelStep('tier_selection', { sessionId: newSession.id })
    setStep('tier')
  }

  const handleTierSelect = (tier: PuzzleTier) => {
    const tierConfig = getTierConfig(tier)
    trackConversion('add_to_cart', { 
      value: tierConfig.price,
      currency: 'USD',
      items: [{
        id: tier,
        name: `${tierConfig.name} Puzzle`,
        price: tierConfig.price,
        quantity: 1
      }]
    })
    setSession(prev => prev ? { ...prev, tier, updatedAt: Date.now() } : prev)
  }

  const handleTierContinue = () => {
    trackFunnelStep('shape_selection', { tier: session?.tier })
    setStep('shapes')
  }

  const handleShapesComplete = (shapes: ShapeType[], meanings?: Partial<Record<ShapeType, string>>) => {
    trackFunnelStep('partner_invitation', { 
      shapeCount: shapes.length
    })
    setSession(prev => {
      if (!prev) return prev
      return {
        ...prev,
        selectedShapes: shapes,
        shapeMeanings: meanings,
        updatedAt: Date.now(),
      }
    })
    // Offer partner invitation after shapes are selected
    setStep('partner')
  }

  const handlePartnerInvitationCreated = (invitation: PartnerInvitation) => {
    setSession(prev => prev ? { ...prev, partnerInvitation: invitation, updatedAt: Date.now() } : prev)
  }

  const handleSkipPartner = () => {
    trackFunnelStep('image_choice')
    setStep('image')
  }

  const handleImageChoiceChange = (choice: ImageChoiceType) => {
    setSession(prev => prev ? { ...prev, imageChoice: choice, updatedAt: Date.now() } : prev)
  }

  const handlePhotoUpload = (url: string) => {
    setSession(prev => prev ? { ...prev, photoUrl: url, updatedAt: Date.now() } : prev)
  }

  const handleColorAssign = (assignments: Partial<Record<ShapeType, string>>) => {
    setSession(prev => prev ? { ...prev, colorAssignments: assignments, updatedAt: Date.now() } : prev)
  }

  const handleImageContinue = () => {
    trackFunnelStep('hint_cards')
    setStep('hints')
  }

  const handleHintCardsChange = (hintCards: HintCard[]) => {
    setSession(prev => prev ? { ...prev, hintCards, updatedAt: Date.now() } : prev)
  }

  const handleHintsContinue = () => {
    trackFunnelStep('packaging')
    setStep('packaging')
  }

  const handlePackagingChange = (packaging: PackagingOptions) => {
    setSession(prev => prev ? { ...prev, packaging, updatedAt: Date.now() } : prev)
  }

  const handlePackagingContinue = () => {
    trackFunnelStep('checkout')
    setStep('checkout')
  }

  const handleCheckoutComplete = (shippingInfo: ShippingInfo) => {
    const newOrderNumber = `INT-${Date.now().toString(36).toUpperCase()}`
    setOrderNumber(newOrderNumber)
    
    // Track conversion
    const tierConfig = session ? getTierConfig(session.tier) : null
    if (tierConfig) {
      trackConversion('purchase', {
        value: tierConfig.price,
        currency: 'USD',
        transactionId: newOrderNumber,
        items: [{
          id: session?.tier || 'classic',
          name: `${tierConfig.name} Puzzle`,
          price: tierConfig.price,
          quantity: 1
        }]
      })
    }
    
    setSession(prev => {
      if (!prev) return prev
      return {
        ...prev,
        shippingInfo,
        orderComplete: true,
        updatedAt: Date.now(),
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

  // Show progress indicator for all steps except home and confirmation
  const showProgress = !['home', 'confirmation', 'partner'].includes(step)

  return (
    <>
      <Toaster position="top-center" />
      
      {/* Progress Indicator - sticky at top for all creation steps */}
      {showProgress && <ProgressIndicator currentStep={step} />}

      <Suspense fallback={<LoadingFallback step={step} />}>
        {step === 'home' && (
          <HomePage onStart={handleStart} />
        )}

        {step === 'tier' && session && (
          <TierSelection
            selectedTier={session.tier}
            onSelectTier={handleTierSelect}
            onContinue={handleTierContinue}
            onBack={handleCreateAnother}
          />
        )}

        {step === 'shapes' && session && (
          <ShapeSelection
            selectedShapes={session.selectedShapes}
            shapeMeanings={session.shapeMeanings}
            tier={session.tier}
            onComplete={handleShapesComplete}
            onBack={() => handleBack('tier')}
          />
        )}

        {step === 'partner' && session && (
          <PartnerInvitationFlow
            selectedShapes={session.selectedShapes}
            onInvitationCreated={handlePartnerInvitationCreated}
            onSkip={handleSkipPartner}
            existingInvitation={session.partnerInvitation}
          />
        )}

        {step === 'image' && session && (
          <ImageChoice
            imageChoice={session.imageChoice}
            selectedShapes={session.selectedShapes}
            colorAssignments={session.colorAssignments}
            photoUrl={session.photoUrl}
            tier={session.tier}
            onImageChoiceChange={handleImageChoiceChange}
            onPhotoUpload={handlePhotoUpload}
            onColorAssign={handleColorAssign}
            onContinue={handleImageContinue}
            onBack={() => handleBack('shapes')}
          />
        )}

        {step === 'hints' && session && (
          <HintCardBuilder
            hintCards={session.hintCards}
            selectedShapes={session.selectedShapes}
            tier={session.tier}
            onHintCardsChange={handleHintCardsChange}
            onContinue={handleHintsContinue}
            onBack={() => handleBack('image')}
          />
        )}

        {step === 'packaging' && session && (
          <PackagingSelection
            packaging={session.packaging}
            tier={session.tier}
            hasWoodStain={session.hasWoodStain}
            onPackagingChange={handlePackagingChange}
            onContinue={handlePackagingContinue}
            onBack={() => handleBack('hints')}
          />
        )}

        {step === 'checkout' && session && (
          <Checkout
            session={session}
            onBack={() => handleBack('packaging')}
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

      {/* Global Chat Widget - FAQ and Support */}
      <ChatWidget />
      
      {/* Live Order Notifications - Social Proof */}
      <LiveOrderNotification 
        enabled={step === 'home' || step === 'tier'} 
        position="bottom-left"
        interval={20000}
      />
      
      {/* Exit Intent Popup - Cart Abandonment Recovery (17% conversion rate) */}
      <ExitIntentPopup
        cartValue={session ? getTierConfig(session.tier).price : 0}
        hasCartItems={session !== null && step !== 'home' && step !== 'confirmation'}
        currentStep={step}
        isFirstTimeVisitor={!loadSession()}
        onDiscountClaim={(code) => {
          console.log('Discount claimed:', code)
          // Store discount code for checkout
        }}
        onEmailCapture={(email) => {
          console.log('Email captured:', email)
          // Send to email marketing system
        }}
        onFeedbackSubmit={(feedback) => {
          console.log('Feedback received:', feedback)
          // Store feedback for analysis
        }}
        enabled={step !== 'confirmation'}
      />
      
      {/* GDPR-compliant Cookie Consent Banner */}
      <CookieConsent
        privacyPolicyUrl="/privacy-policy"
        onAccept={(prefs) => {
          console.log('Cookie preferences accepted:', prefs)
        }}
        onDecline={() => {
          console.log('Cookies declined')
        }}
      />
    </>
  )
}

// Wrap App with PersonalizationProvider
function AppWithProviders() {
  return (
    <PersonalizationProvider>
      <App />
    </PersonalizationProvider>
  )
}

export default AppWithProviders
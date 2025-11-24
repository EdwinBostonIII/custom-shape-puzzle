import { useEffect, useState } from 'react'
import { Toaster } from 'sonner'
import { useKV } from '@github/spark/hooks'
import { HomePage } from '@/components/HomePage'
import { ShapeSelection } from '@/components/ShapeSelection'
import { PartnerWaiting } from '@/components/PartnerWaiting'
import { TemplatePreview } from '@/components/TemplatePreview'
import { DesignChoice } from '@/components/DesignChoice'
import { Checkout } from '@/components/Checkout'
import { OrderConfirmation } from '@/components/OrderConfirmation'
import { PuzzleSession, PuzzleType, ShapeType, ShippingInfo } from '@/lib/types'

type Step = 'home' | 'shapes' | 'waiting' | 'template' | 'design' | 'checkout' | 'confirmation'

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

function App() {
  const [step, setStep] = useState<Step>('home')
  const [sessionId, setSessionId] = useState<string>('')
  const [session, setSession] = useKV<PuzzleSession>(`puzzle-session-${sessionId}`, {} as PuzzleSession)
  const [orderNumber, setOrderNumber] = useState<string>('')
  const [isPartnerMode, setIsPartnerMode] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const partnerId = urlParams.get('partner')
    
    if (partnerId) {
      setSessionId(partnerId)
      setIsPartnerMode(true)
      setStep('shapes')
    }
  }, [])

  const handleSelectType = (type: PuzzleType) => {
    const newSessionId = generateId()
    setSessionId(newSessionId)
    setSession({
      id: newSessionId,
      type,
      selectedShapes: [],
      partnerShapes: [],
      isPartnerComplete: false,
    })
    setStep('shapes')
  }

  const handleShapesSelected = (shapes: ShapeType[], meanings?: Partial<Record<ShapeType, string>>) => {
    if (isPartnerMode) {
      setSession(prev => {
        if (!prev || !prev.id) return prev!
        return {
          ...prev,
          partnerShapes: shapes,
          partnerShapeMeanings: meanings,
          isPartnerComplete: true,
        }
      })
    } else {
      setSession(prev => {
        if (!prev || !prev.id) return prev!
        return {
          ...prev,
          selectedShapes: shapes,
          shapeMeanings: meanings,
        }
      })
    }
  }

  const handlePartnerComplete = () => {
    setStep('template')
  }

  const handleSwitchToSolo = () => {
    setSession(prev => {
      if (!prev || !prev.id) return prev!
      return {
        ...prev,
        type: 'solo',
      }
    })
    setStep('shapes')
  }

  const handleDesignComplete = (designType: 'photo' | 'colors', data: string | Partial<Record<ShapeType, string>>) => {
    if (designType === 'photo') {
      setSession(prev => {
        if (!prev || !prev.id) return prev!
        return {
          ...prev,
          designType,
          photoData: data as string,
        }
      })
    } else {
      setSession(prev => {
        if (!prev || !prev.id) return prev!
        return {
          ...prev,
          designType,
          colorMap: data as Partial<Record<ShapeType, string>>,
        }
      })
    }
    setStep('checkout')
  }

  const handleCheckoutComplete = (shippingInfo: ShippingInfo) => {
    const newOrderNumber = `PZ-${Date.now().toString(36).toUpperCase()}`
    setOrderNumber(newOrderNumber)
    setSession(prev => {
      if (!prev || !prev.id) return prev!
      return {
        ...prev,
        shippingInfo,
        orderComplete: true,
      }
    })
    setStep('confirmation')
  }

  const handleCreateAnother = () => {
    setSessionId('')
    setSession({} as PuzzleSession)
    setIsPartnerMode(false)
    setStep('home')
    window.history.replaceState({}, '', window.location.pathname)
  }

  const allShapes = [
    ...(session?.selectedShapes || []),
    ...(session?.partnerShapes || []),
  ]

  return (
    <>
      <Toaster position="top-center" />
      
      {step === 'home' && (
        <HomePage onSelectType={handleSelectType} />
      )}

      {step === 'shapes' && session && (
        <ShapeSelection
          type={session.type}
          sessionId={sessionId}
          selectedShapes={isPartnerMode ? session.partnerShapes || [] : session.selectedShapes}
          shapeMeanings={isPartnerMode ? session.partnerShapeMeanings : session.shapeMeanings}
          onShapesSelected={handleShapesSelected}
          onBack={handleCreateAnother}
          onContinue={() => {
            if (isPartnerMode) {
              window.close()
            } else if (session.type === 'couple') {
              setStep('waiting')
            } else {
              setStep('template')
            }
          }}
          isPartnerMode={isPartnerMode}
        />
      )}

      {step === 'waiting' && (
        <PartnerWaiting
          sessionId={sessionId}
          onPartnerComplete={handlePartnerComplete}
          onSwitchToSolo={handleSwitchToSolo}
        />
      )}

      {step === 'template' && (
        <TemplatePreview
          shapes={allShapes}
          onBack={() => setStep('shapes')}
          onContinue={() => setStep('design')}
        />
      )}

      {step === 'design' && (
        <DesignChoice
          shapes={allShapes}
          onBack={() => setStep('template')}
          onContinue={handleDesignComplete}
        />
      )}

      {step === 'checkout' && session && (
        <Checkout
          type={session.type}
          onBack={() => setStep('design')}
          onComplete={handleCheckoutComplete}
        />
      )}

      {step === 'confirmation' && (
        <OrderConfirmation
          orderNumber={orderNumber}
          onCreateAnother={handleCreateAnother}
        />
      )}
    </>
  )
}

export default App
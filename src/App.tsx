import { useEffect, useState } from 'react'
import { Toaster } from 'sonner'
import { useKV } from '@github/spark/hooks'
import { HomePage } from '@/components/HomePage'
import { ModeSelectScreen } from '@/components/ModeSelectScreen'
import { ShapeSelection } from '@/components/ShapeSelection'
import { PartnerHandoffScreen } from '@/components/PartnerHandoffScreen'
import { PartnerWaiting } from '@/components/PartnerWaiting'
import { TemplatePreview } from '@/components/TemplatePreview'
import { DesignChoice } from '@/components/DesignChoice'
import { BoxDesign } from '@/components/BoxDesign'
import { Checkout } from '@/components/Checkout'
import { OrderConfirmation } from '@/components/OrderConfirmation'
import { PuzzleSession, PuzzleType, ShapeType, ShippingInfo } from '@/lib/types'

type Step = 'home' | 'mode-select' | 'shapes' | 'partner-handoff' | 'waiting' | 'template' | 'design' | 'boxdesign' | 'checkout' | 'confirmation'

function generateId() {
  // Use crypto.getRandomValues for better randomness
  const array = new Uint32Array(2);
  window.crypto.getRandomValues(array);
  const randomPart = Array.from(array).map(n => n.toString(36)).join('');
  return Date.now().toString(36) + randomPart;
}

function App() {
  const [step, setStep] = useState<Step>('home')
  const [sessionId, setSessionId] = useState<string>('')
  const [session, setSession] = useKV<PuzzleSession>(`puzzle-session-${sessionId}`, {} as PuzzleSession)
  const [orderNumber, setOrderNumber] = useState<string>('')
  const [isPartnerMode, setIsPartnerMode] = useState(false)
  const [isCouchMode, setIsCouchMode] = useState(false)
  const [isPartner1Complete, setIsPartner1Complete] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const partnerId = urlParams.get('partner')
    
    if (partnerId) {
      setSessionId(partnerId)
      setIsPartnerMode(true)
      setStep('shapes')
    }
  }, [])

  const handleSelectType = (type: PuzzleType, couchMode?: boolean) => {
    const newSessionId = generateId()
    setSessionId(newSessionId)
    setIsCouchMode(couchMode || false)
    setSession({
      id: newSessionId,
      type,
      selectedShapes: [],
      partnerShapes: [],
      isPartnerComplete: false,
    })

    // For couple in couch mode, show mode selection first
    if (type === 'couple' && couchMode === undefined) {
      setStep('mode-select')
    } else {
      setStep('shapes')
    }
  }

  const handleModeSelect = (couch: boolean) => {
    setIsCouchMode(couch)
    setStep('shapes')
  }

  const handlePartner1Complete = (shapes: ShapeType[], meanings?: Partial<Record<ShapeType, string>>) => {
    setSession(prev => {
      if (!prev || !prev.id) return prev!
      return {
        ...prev,
        selectedShapes: shapes,
        shapeMeanings: meanings,
      }
    })
    setIsPartner1Complete(true)
    setStep('partner-handoff')
  }

  const handleShapesSelected = (shapes: ShapeType[], meanings?: Partial<Record<ShapeType, string>>) => {
    if (isPartnerMode || (isCouchMode && isPartner1Complete)) {
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
    setStep('boxdesign')
  }

  const handleBoxDesignComplete = (boxDesign: 'standard' | 'mystery', boxData?: {
    boxTitle?: string
    boxHint1?: string
    boxHint2?: string
    boxHiddenMessage?: string
  }) => {
    setSession(prev => {
      if (!prev || !prev.id) return prev!
      return {
        ...prev,
        boxDesign,
        boxTitle: boxData?.boxTitle,
        boxHint1: boxData?.boxHint1,
        boxHint2: boxData?.boxHint2,
        boxHiddenMessage: boxData?.boxHiddenMessage,
      }
    })
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

      {step === 'mode-select' && (
        <ModeSelectScreen
          onSelect={handleModeSelect}
          onBack={handleCreateAnother}
        />
      )}

      {step === 'shapes' && session && (
        <ShapeSelection
          type={session.type}
          sessionId={sessionId}
          selectedShapes={
            isPartnerMode
              ? session.partnerShapes || []
              : (isCouchMode && isPartner1Complete)
                ? session.partnerShapes || []
                : session.selectedShapes || []
          }
          shapeMeanings={
            isPartnerMode
              ? session.partnerShapeMeanings
              : (isCouchMode && isPartner1Complete)
                ? session.partnerShapeMeanings
                : session.shapeMeanings
          }
          onShapesSelected={handleShapesSelected}
          onBack={handleCreateAnother}
          onContinue={() => {
            if (isPartnerMode) {
              // Partner completed - show success message instead of closing window
              setStep('confirmation')
              setOrderNumber('PARTNER-COMPLETE')
            } else if (session.type === 'couple' && !isCouchMode) {
              setStep('waiting')
            } else if (session.type === 'couple' && isCouchMode && !isPartner1Complete) {
              // Partner 1 finished in couch mode - show handoff
              handlePartner1Complete(session.selectedShapes, session.shapeMeanings)
            } else {
              setStep('template')
            }
          }}
          isPartnerMode={isPartnerMode || (isCouchMode && isPartner1Complete)}
        />
      )}

      {step === 'partner-handoff' && (
        <PartnerHandoffScreen
          onContinue={() => {
            setIsPartnerMode(false)
            setStep('shapes')
          }}
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
          photoData={session?.photoData}
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

      {step === 'boxdesign' && session && (
        <BoxDesign
          photoData={session.photoData}
          onBack={() => setStep('design')}
          onContinue={handleBoxDesignComplete}
        />
      )}

      {step === 'checkout' && session && (
        <Checkout
          type={session.type}
          onBack={() => setStep('boxdesign')}
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
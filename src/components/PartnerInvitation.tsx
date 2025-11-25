/**
 * Partner Invitation Component
 * 
 * Enables collaborative puzzle creation between partners.
 * This is critical for the "platform moat" - creating relationship data
 * that increases switching costs and engagement.
 * 
 * Key metrics tracked:
 * - Invitation acceptance rate (target: >60%)
 * - Partner contribution rate (target: >3 memories per partner)
 * - Time to acceptance
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Heart, 
  Link as LinkIcon, 
  Copy, 
  Check, 
  Clock, 
  Sparkle,
  EnvelopeSimple,
  Share,
  ArrowRight
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { PartnerInvitation as PartnerInvitationType, ShapeType } from '@/lib/types'
import { COLLABORATION_CONFIG, PUZZLE_SHAPES } from '@/lib/constants'
import { ShapeSilhouette } from './ShapeSilhouette'

interface PartnerInvitationFlowProps {
  selectedShapes: ShapeType[]
  onInvitationCreated: (invitation: PartnerInvitationType) => void
  onSkip: () => void
  existingInvitation?: PartnerInvitationType
}

export function PartnerInvitationFlow({
  selectedShapes,
  onInvitationCreated,
  onSkip,
  existingInvitation,
}: PartnerInvitationFlowProps) {
  const [step, setStep] = useState<'intro' | 'invite' | 'waiting'>('intro')
  const [partnerEmail, setPartnerEmail] = useState('')
  const [partnerName, setPartnerName] = useState('')
  const [shareLink, setShareLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Generate share link
  useEffect(() => {
    const generateLink = () => {
      const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2, 8)
      return `${window.location.origin}/collab/${uniqueId}`
    }
    setShareLink(generateLink())
  }, [])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy link')
    }
  }

  const handleSendInvitation = async () => {
    if (!partnerName.trim()) {
      toast.error('Please enter your partner\'s name')
      return
    }

    setIsSubmitting(true)

    // Simulate sending invitation (in real app, this would be an API call)
    await new Promise(resolve => setTimeout(resolve, 1000))

    const invitation: PartnerInvitationType = {
      id: Date.now().toString(36),
      shareLink,
      partnerEmail: partnerEmail || undefined,
      partnerName: partnerName.trim(),
      status: 'pending',
      sentAt: Date.now(),
      expiresAt: Date.now() + (COLLABORATION_CONFIG.invitationExpiryDays * 24 * 60 * 60 * 1000),
      personAShapes: selectedShapes,
      personBShapes: [],
      personAMemories: 0,
      personBMemories: 0,
    }

    onInvitationCreated(invitation)
    setStep('waiting')
    setIsSubmitting(false)
    toast.success(`Invitation sent to ${partnerName}!`)
  }

  // Show waiting state if invitation already exists
  if (existingInvitation && existingInvitation.status === 'pending') {
    return (
      <InvitationWaitingState 
        invitation={existingInvitation} 
        onContinueSolo={onSkip}
      />
    )
  }

  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Hero Section */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-terracotta/10 mb-4">
                  <Users size={40} weight="duotone" className="text-terracotta" />
                </div>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-charcoal tracking-display leading-display">
                  Make It Together
                </h1>
                <p className="text-lg text-charcoal/70 max-w-lg mx-auto font-light">
                  The best puzzles tell stories from both perspectives. Invite your partner 
                  to add their favorite shapes and memories.
                </p>
              </div>

              {/* Benefits Cards */}
              <div className="grid gap-4">
                <BenefitCard
                  icon={<Heart weight="fill" className="text-rose-500" />}
                  title="Twice the Memories"
                  description="Each person adds their perspective, creating a richer story"
                />
                <BenefitCard
                  icon={<Sparkle weight="fill" className="text-amber-500" />}
                  title="Surprise Elements"
                  description="Their shapes become hidden treasures in the finished puzzle"
                />
                <BenefitCard
                  icon={<LinkIcon weight="fill" className="text-sage" />}
                  title="No Account Needed"
                  description="They just click a link and start adding—simple as that"
                />
              </div>

              {/* Your Selected Shapes Preview */}
              <Card className="p-6 border-2 border-stone">
                <p className="text-sm text-charcoal/60 mb-3">Your shapes so far:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedShapes.slice(0, 5).map((shapeId) => (
                    <div 
                      key={shapeId}
                      className="w-12 h-12 rounded-lg bg-stone/30 p-2"
                    >
                      <ShapeSilhouette shapeId={shapeId} className="text-charcoal" />
                    </div>
                  ))}
                  {selectedShapes.length > 5 && (
                    <div className="w-12 h-12 rounded-lg bg-stone/30 flex items-center justify-center text-charcoal/60 text-sm font-medium">
                      +{selectedShapes.length - 5}
                    </div>
                  )}
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Button
                  size="lg"
                  onClick={() => setStep('invite')}
                  className="w-full py-6 text-lg"
                >
                  <Users className="mr-2" size={20} />
                  Invite My Partner
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={onSkip}
                  className="text-charcoal/60"
                >
                  Continue Solo
                  <ArrowRight className="ml-2" size={18} />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'invite' && (
            <motion.div
              key="invite"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h2 className="font-display text-3xl font-bold text-charcoal">
                  Send an Invitation
                </h2>
                <p className="text-charcoal/70">
                  They'll have {COLLABORATION_CONFIG.invitationExpiryDays} days to add their shapes
                </p>
              </div>

              <Card className="p-6 border-2 border-stone space-y-6">
                {/* Partner Name (Required) */}
                <div>
                  <label 
                    htmlFor="partner-name" 
                    className="block text-sm font-medium text-charcoal mb-2"
                  >
                    Their Name *
                  </label>
                  <Input
                    id="partner-name"
                    type="text"
                    placeholder="e.g., Sarah"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    className="bg-white"
                    required
                  />
                </div>

                {/* Partner Email (Optional) */}
                <div>
                  <label 
                    htmlFor="partner-email" 
                    className="block text-sm font-medium text-charcoal mb-2"
                  >
                    Their Email <span className="text-charcoal/50">(optional)</span>
                  </label>
                  <Input
                    id="partner-email"
                    type="email"
                    placeholder="We'll send them a reminder"
                    value={partnerEmail}
                    onChange={(e) => setPartnerEmail(e.target.value)}
                    className="bg-white"
                  />
                  <p className="text-xs text-charcoal/50 mt-1">
                    We'll send a friendly reminder if they haven't added shapes yet
                  </p>
                </div>

                {/* Share Link */}
                <div className="pt-4 border-t border-stone">
                  <p className="text-sm font-medium text-charcoal mb-3">
                    Or share this link directly:
                  </p>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={shareLink}
                      readOnly
                      className="bg-stone/30 text-charcoal/70 font-mono text-sm"
                      aria-label="Share link"
                    />
                    <Button
                      variant="outline"
                      onClick={handleCopyLink}
                      className="flex-shrink-0"
                      aria-label={copied ? 'Link copied' : 'Copy link'}
                    >
                      {copied ? (
                        <Check size={18} className="text-sage" />
                      ) : (
                        <Copy size={18} />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Share Options */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const text = COLLABORATION_CONFIG.shareMessageTemplate(partnerName || 'Your partner')
                      window.open(`sms:?body=${encodeURIComponent(text + ' ' + shareLink)}`, '_blank')
                    }}
                    className="flex-1"
                    aria-label="Share via text message"
                  >
                    <Share size={16} className="mr-2" />
                    Text
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const text = COLLABORATION_CONFIG.shareMessageTemplate(partnerName || 'Your partner')
                      window.open(`mailto:${partnerEmail}?subject=Help me create our puzzle!&body=${encodeURIComponent(text + '\n\n' + shareLink)}`, '_blank')
                    }}
                    className="flex-1"
                    aria-label="Share via email"
                  >
                    <EnvelopeSimple size={16} className="mr-2" />
                    Email
                  </Button>
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Button
                  size="lg"
                  onClick={handleSendInvitation}
                  disabled={isSubmitting || !partnerName.trim()}
                  className="w-full py-6"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Invitation
                      <ArrowRight className="ml-2" size={18} />
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setStep('intro')}
                  className="text-charcoal/60"
                >
                  ← Back
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'waiting' && (
            <InvitationWaitingState
              invitation={{
                id: 'pending',
                shareLink,
                partnerName,
                partnerEmail,
                status: 'pending',
                sentAt: Date.now(),
                expiresAt: Date.now() + (COLLABORATION_CONFIG.invitationExpiryDays * 24 * 60 * 60 * 1000),
                personAShapes: selectedShapes,
                personBShapes: [],
                personAMemories: 0,
                personBMemories: 0,
              }}
              onContinueSolo={onSkip}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Benefit Card Component
function BenefitCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode
  title: string
  description: string 
}) {
  return (
    <Card className="p-4 border border-stone/50 hover:border-terracotta/30 transition-colors">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-stone/30 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-charcoal">{title}</h3>
          <p className="text-sm text-charcoal/60">{description}</p>
        </div>
      </div>
    </Card>
  )
}

// Waiting State Component
function InvitationWaitingState({ 
  invitation, 
  onContinueSolo 
}: { 
  invitation: PartnerInvitationType
  onContinueSolo: () => void
}) {
  const [copied, setCopied] = useState(false)
  const timeRemaining = invitation.expiresAt - Date.now()
  const daysRemaining = Math.ceil(timeRemaining / (24 * 60 * 60 * 1000))

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(invitation.shareLink)
      setCopied(true)
      toast.success('Link copied!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center space-y-4">
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            repeatType: 'reverse' 
          }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 mb-4"
        >
          <Clock size={40} weight="duotone" className="text-amber-600" />
        </motion.div>
        <h2 className="font-display text-3xl font-bold text-charcoal">
          Waiting for {invitation.partnerName}
        </h2>
        <p className="text-charcoal/70">
          They have {daysRemaining} days to add their shapes
        </p>
      </div>

      <Card className="p-6 border-2 border-amber-200 bg-amber-50/50">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-charcoal/60">Invitation Status</span>
            <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
              Pending
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-charcoal/60">Partner's Shapes</span>
            <span className="font-medium text-charcoal">
              {invitation.personBShapes.length} / 5
            </span>
          </div>

          <div className="pt-4 border-t border-amber-200">
            <p className="text-sm text-charcoal/60 mb-2">Share link:</p>
            <div className="flex gap-2">
              <Input
                type="text"
                value={invitation.shareLink}
                readOnly
                className="bg-white text-charcoal/70 font-mono text-xs"
                aria-label="Share link"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                aria-label={copied ? 'Link copied' : 'Copy link'}
              >
                {copied ? <Check size={16} className="text-sage" /> : <Copy size={16} />}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="text-center space-y-4">
        <p className="text-sm text-charcoal/60">
          You can continue building your puzzle while waiting. 
          Their shapes will be added when they join.
        </p>
        <Button
          size="lg"
          onClick={onContinueSolo}
          className="px-12"
        >
          Continue Building
          <ArrowRight className="ml-2" size={18} />
        </Button>
      </div>
    </motion.div>
  )
}

// Partner Landing Page Component (for when partner clicks the link)
interface PartnerLandingProps {
  invitationId: string
  personAName: string
  personAShapes: ShapeType[]
  onAccept: (selectedShapes: ShapeType[]) => void
}

export function PartnerLanding({
  invitationId,
  personAName,
  personAShapes,
  onAccept,
}: PartnerLandingProps) {
  const [selectedShapes, setSelectedShapes] = useState<ShapeType[]>([])
  const MAX_PARTNER_SHAPES = 5

  const availableShapes = PUZZLE_SHAPES.filter(
    shape => !personAShapes.includes(shape.id)
  )

  const handleShapeToggle = (shapeId: ShapeType) => {
    if (selectedShapes.includes(shapeId)) {
      setSelectedShapes(prev => prev.filter(s => s !== shapeId))
    } else if (selectedShapes.length < MAX_PARTNER_SHAPES) {
      setSelectedShapes(prev => [...prev, shapeId])
    }
  }

  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-terracotta/10 mb-4">
            <Heart size={40} weight="fill" className="text-terracotta" />
          </div>
          <h1 className="font-display text-4xl font-bold text-charcoal tracking-display leading-display">
            {personAName} is creating something special for you both
          </h1>
          <p className="text-lg text-charcoal/70">
            Choose up to {MAX_PARTNER_SHAPES} shapes to add your perspective to the puzzle
          </p>
        </div>

        {/* Person A's Shapes Preview */}
        <Card className="p-4 bg-sage/10 border-sage/20">
          <p className="text-sm text-charcoal/60 mb-2">{personAName}'s shapes:</p>
          <div className="flex flex-wrap gap-2">
            {personAShapes.slice(0, 5).map((shapeId) => (
              <div key={shapeId} className="w-10 h-10 rounded bg-white p-1.5">
                <ShapeSilhouette shapeId={shapeId} className="text-sage" />
              </div>
            ))}
            {personAShapes.length > 5 && (
              <span className="text-sm text-charcoal/50 self-center">
                +{personAShapes.length - 5} more
              </span>
            )}
          </div>
        </Card>

        {/* Shape Selection */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold text-charcoal">
              Your Shapes
            </h2>
            <Badge variant="outline">
              {selectedShapes.length} / {MAX_PARTNER_SHAPES}
            </Badge>
          </div>
          
          <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
            {availableShapes.slice(0, 24).map((shape) => {
              const isSelected = selectedShapes.includes(shape.id)
              return (
                <button
                  key={shape.id}
                  onClick={() => handleShapeToggle(shape.id)}
                  disabled={!isSelected && selectedShapes.length >= MAX_PARTNER_SHAPES}
                  className={cn(
                    'aspect-square rounded-xl p-3 border-2 transition-all',
                    isSelected
                      ? 'border-terracotta bg-terracotta/10'
                      : 'border-stone hover:border-terracotta/50 bg-white',
                    !isSelected && selectedShapes.length >= MAX_PARTNER_SHAPES && 'opacity-50 cursor-not-allowed'
                  )}
                  aria-label={`${shape.name}${isSelected ? ' - selected' : ''}`}
                  aria-pressed={isSelected}
                >
                  <ShapeSilhouette 
                    shapeId={shape.id} 
                    className={isSelected ? 'text-terracotta' : 'text-charcoal'} 
                  />
                </button>
              )
            })}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          size="lg"
          onClick={() => onAccept(selectedShapes)}
          disabled={selectedShapes.length === 0}
          className="w-full py-6 text-lg"
        >
          Add My Shapes to the Puzzle
          <ArrowRight className="ml-2" size={20} />
        </Button>
      </div>
    </div>
  )
}

export default PartnerInvitationFlow

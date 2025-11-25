/**
 * Social Commerce Integration
 * 
 * Provides shareable puzzle previews and social media integration
 * for viral growth per mobile commerce research findings.
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShareNetwork, 
  Copy, 
  Check, 
  InstagramLogo, 
  FacebookLogo, 
  TwitterLogo, 
  PinterestLogo,
  WhatsappLogo,
  EnvelopeSimple,
  Link as LinkIcon,
  X
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ShapeType, PuzzleTier } from '@/lib/types'
import { ShapeSilhouette } from './ShapeSilhouette'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { trackEvent } from '@/lib/analytics'

interface SocialShareProps {
  puzzleId?: string
  shapes: ShapeType[]
  tier: PuzzleTier
  imageUrl?: string
  recipientName?: string
  message?: string
  variant?: 'button' | 'inline' | 'modal'
  onShare?: (platform: string) => void
}

// Generate shareable puzzle preview URL
function generateShareUrl(puzzleId: string, shapes: ShapeType[]): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://interlockpuzzles.com'
  const shapesParam = shapes.slice(0, 5).join(',')
  return `${baseUrl}/preview/${puzzleId}?shapes=${encodeURIComponent(shapesParam)}`
}

// Social platform configurations
const SOCIAL_PLATFORMS = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: FacebookLogo,
    color: '#1877F2',
    getShareUrl: (url: string, text: string) => 
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: TwitterLogo,
    color: '#1DA1F2',
    getShareUrl: (url: string, text: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}&hashtags=interlock,custompuzzle`,
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    icon: PinterestLogo,
    color: '#E60023',
    getShareUrl: (url: string, text: string, imageUrl?: string) =>
      `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}${imageUrl ? `&media=${encodeURIComponent(imageUrl)}` : ''}`,
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: WhatsappLogo,
    color: '#25D366',
    getShareUrl: (url: string, text: string) =>
      `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
  },
  {
    id: 'email',
    name: 'Email',
    icon: EnvelopeSimple,
    color: '#6B7280',
    getShareUrl: (url: string, text: string) =>
      `mailto:?subject=${encodeURIComponent('Check out this custom puzzle!')}&body=${encodeURIComponent(`${text}\n\n${url}`)}`,
  },
]

export function SocialShareButton({
  puzzleId = 'preview',
  shapes,
  tier,
  imageUrl,
  recipientName,
  message = "I'm creating a custom puzzle with Interlock. Check it out!",
  variant = 'button',
  onShare,
}: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareUrl = generateShareUrl(puzzleId, shapes)
  const shareText = recipientName 
    ? `I made a custom puzzle for ${recipientName}! Each piece is handcrafted with meaning.`
    : message

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      trackEvent('share_link_copied', { puzzle_id: puzzleId })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  const handleShare = async (platform: typeof SOCIAL_PLATFORMS[0]) => {
    trackEvent('share_initiated', { 
      platform: platform.id, 
      puzzle_id: puzzleId,
      tier 
    })

    // Use native share on mobile if available
    if (platform.id === 'native' && navigator.share) {
      try {
        await navigator.share({
          title: 'Custom Interlock Puzzle',
          text: shareText,
          url: shareUrl,
        })
        trackEvent('share_completed', { platform: 'native', puzzle_id: puzzleId })
        onShare?.('native')
        return
      } catch (error) {
        // User cancelled or error - fall through to popup
      }
    }

    // Open share popup
    const url = platform.getShareUrl(shareUrl, shareText, imageUrl)
    window.open(url, '_blank', 'width=600,height=400,scrollbars=yes')
    onShare?.(platform.id)
    trackEvent('share_completed', { platform: platform.id, puzzle_id: puzzleId })
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Custom Interlock Puzzle',
          text: shareText,
          url: shareUrl,
        })
        trackEvent('share_completed', { platform: 'native', puzzle_id: puzzleId })
        onShare?.('native')
      } catch (error) {
        // User cancelled - open fallback modal
        setIsOpen(true)
      }
    } else {
      setIsOpen(true)
    }
  }

  if (variant === 'button') {
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNativeShare}
          className="gap-2"
          aria-label="Share this puzzle"
        >
          <ShareNetwork size={18} weight="bold" aria-hidden="true" />
          Share
        </Button>

        <ShareModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          shapes={shapes}
          shareUrl={shareUrl}
          shareText={shareText}
          imageUrl={imageUrl}
          copied={copied}
          onCopyLink={handleCopyLink}
          onShare={handleShare}
        />
      </>
    )
  }

  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-charcoal/60 mr-2">Share:</span>
        {SOCIAL_PLATFORMS.slice(0, 4).map((platform) => (
          <button
            key={platform.id}
            onClick={() => handleShare(platform)}
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110',
              'bg-white border border-stone shadow-sm'
            )}
            style={{ color: platform.color }}
            aria-label={`Share on ${platform.name}`}
          >
            <platform.icon size={16} weight="fill" aria-hidden="true" />
          </button>
        ))}
        <button
          onClick={handleCopyLink}
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110',
            'bg-white border border-stone shadow-sm text-charcoal'
          )}
          aria-label="Copy link"
        >
          {copied ? (
            <Check size={16} weight="bold" className="text-sage" aria-hidden="true" />
          ) : (
            <LinkIcon size={16} weight="bold" aria-hidden="true" />
          )}
        </button>
      </div>
    )
  }

  return null
}

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  shapes: ShapeType[]
  shareUrl: string
  shareText: string
  imageUrl?: string
  copied: boolean
  onCopyLink: () => void
  onShare: (platform: typeof SOCIAL_PLATFORMS[0]) => void
}

function ShareModal({
  isOpen,
  onClose,
  shapes,
  shareUrl,
  shareText,
  imageUrl,
  copied,
  onCopyLink,
  onShare,
}: ShareModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleEscape)
      return () => window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
            aria-hidden="true"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-title"
          >
            <Card className="border-2 border-stone shadow-2xl">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 id="share-title" className="text-xl font-bold font-display text-charcoal">
                    Share Your Puzzle
                  </h2>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-stone/20 transition-colors"
                    aria-label="Close share dialog"
                  >
                    <X size={20} weight="bold" aria-hidden="true" />
                  </button>
                </div>

                {/* Puzzle Preview */}
                <div className="mb-6 p-4 bg-burlywood/30 rounded-xl">
                  <div className="grid grid-cols-5 gap-2">
                    {shapes.slice(0, 5).map((shape, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-lg bg-white/90 flex items-center justify-center shadow-sm"
                      >
                        <ShapeSilhouette shapeId={shape} className="w-6 h-6 text-terracotta" />
                      </div>
                    ))}
                  </div>
                  {shapes.length > 5 && (
                    <p className="text-xs text-center text-charcoal/50 mt-2">
                      +{shapes.length - 5} more pieces
                    </p>
                  )}
                </div>

                {/* Social Platforms */}
                <div className="grid grid-cols-5 gap-3 mb-6">
                  {SOCIAL_PLATFORMS.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => onShare(platform)}
                      className={cn(
                        'flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all',
                        'hover:bg-stone/10 active:scale-95'
                      )}
                      aria-label={`Share on ${platform.name}`}
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${platform.color}20`, color: platform.color }}
                      >
                        <platform.icon size={24} weight="fill" aria-hidden="true" />
                      </div>
                      <span className="text-xs text-charcoal/70">{platform.name}</span>
                    </button>
                  ))}
                </div>

                {/* Copy Link */}
                <div className="flex gap-2">
                  <div className="flex-1 px-4 py-3 bg-stone/10 rounded-lg text-sm text-charcoal/70 truncate">
                    {shareUrl}
                  </div>
                  <Button
                    onClick={onCopyLink}
                    variant="outline"
                    className="shrink-0 gap-2"
                    aria-label={copied ? 'Link copied' : 'Copy link'}
                  >
                    {copied ? (
                      <>
                        <Check size={18} weight="bold" className="text-sage" aria-hidden="true" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy size={18} weight="bold" aria-hidden="true" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/**
 * Instagram-ready puzzle preview card
 * Optimized aspect ratio for social media sharing
 */
export function InstagramPuzzleCard({
  shapes,
  tier,
  recipientName,
}: {
  shapes: ShapeType[]
  tier: PuzzleTier
  recipientName?: string
}) {
  return (
    <div 
      className="aspect-square bg-gradient-to-br from-cream to-stone/20 p-8 flex flex-col items-center justify-center"
      style={{ width: '1080px', height: '1080px' }} // Instagram optimal size
    >
      {/* Logo */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-display font-bold text-charcoal tracking-display">
          Interlock
        </h1>
        <p className="text-xl text-charcoal/60 mt-2">Custom Puzzle · Made for {recipientName || 'You'}</p>
      </div>

      {/* Puzzle Preview Grid */}
      <div className="grid grid-cols-5 gap-4 p-8 bg-burlywood/30 rounded-3xl">
        {shapes.slice(0, 10).map((shape, index) => (
          <div
            key={index}
            className="aspect-square rounded-2xl bg-white/90 flex items-center justify-center shadow-md"
            style={{ width: '120px', height: '120px' }}
          >
            <ShapeSilhouette shapeId={shape} className="w-20 h-20 text-terracotta" />
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-8 text-center">
        <p className="text-2xl font-medium text-charcoal mb-2">
          Create yours at interlockpuzzles.com
        </p>
        <p className="text-lg text-charcoal/60">
          {shapes.length} meaningful pieces · Handcrafted in the USA
        </p>
      </div>
    </div>
  )
}

export default SocialShareButton

/**
 * VideoTestimonials.tsx - Video Commerce & Social Proof
 * 
 * Research-validated video commerce component based on:
 * - Shopify: Video commerce worth $562B in China, growing rapidly in US
 * - Videos increase conversion by 144% when added to product pages
 * - User-generated content (UGC) videos are 50% more trusted than brand content
 * - Short-form video (TikTok style) sees 85% completion rate vs 36% for long-form
 * 
 * Features:
 * - Video testimonials carousel
 * - Product demo videos
 * - UGC video gallery
 * - Shoppable video integration
 * - Mobile-optimized vertical video player
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { 
  Play, 
  Pause, 
  SpeakerHigh, 
  SpeakerSlash,
  Heart,
  ChatCircle,
  Share,
  Star,
  CaretLeft,
  CaretRight,
  User,
  CheckCircle,
  ShoppingCart,
  Lightning,
  Eye
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// ============================================================================
// TYPES
// ============================================================================

interface VideoTestimonial {
  id: string
  videoUrl: string
  thumbnailUrl: string
  posterUrl?: string
  customerName: string
  customerLocation: string
  customerAvatar?: string
  rating: number
  caption: string
  date: string
  verified: boolean
  likes: number
  views: number
  productPurchased?: string
  duration: number // in seconds
  aspectRatio?: '9:16' | '16:9' | '1:1' // Default vertical for mobile
}

interface ProductDemo {
  id: string
  title: string
  description: string
  videoUrl: string
  thumbnailUrl: string
  duration: number
  chapters?: { time: number; title: string }[]
}

// ============================================================================
// SAMPLE DATA (Would come from CMS/API in production)
// ============================================================================

const SAMPLE_TESTIMONIALS: VideoTestimonial[] = [
  {
    id: 'v1',
    videoUrl: '/videos/testimonial-1.mp4',
    thumbnailUrl: '/images/testimonial-thumb-1.jpg',
    customerName: 'Sarah M.',
    customerLocation: 'Austin, TX',
    rating: 5,
    caption: "My husband was speechless when he opened it! Best anniversary gift ever 💕",
    date: '2024-12-15',
    verified: true,
    likes: 234,
    views: 3420,
    productPurchased: 'Classic 250-piece',
    duration: 28
  },
  {
    id: 'v2',
    videoUrl: '/videos/testimonial-2.mp4',
    thumbnailUrl: '/images/testimonial-thumb-2.jpg',
    customerName: 'Mike R.',
    customerLocation: 'Denver, CO',
    rating: 5,
    caption: "The quality of the wood is incredible. My kids love putting it together every holiday!",
    date: '2024-12-10',
    verified: true,
    likes: 189,
    views: 2890,
    productPurchased: 'Grand 500-piece',
    duration: 35
  },
  {
    id: 'v3',
    videoUrl: '/videos/testimonial-3.mp4',
    thumbnailUrl: '/images/testimonial-thumb-3.jpg',
    customerName: 'Jennifer L.',
    customerLocation: 'Seattle, WA',
    rating: 5,
    caption: "Got this for my mom's 70th birthday. She cried happy tears! 🥹",
    date: '2024-12-08',
    verified: true,
    likes: 312,
    views: 4100,
    productPurchased: 'Heirloom 1000-piece',
    duration: 42
  },
  {
    id: 'v4',
    videoUrl: '/videos/testimonial-4.mp4',
    thumbnailUrl: '/images/testimonial-thumb-4.jpg',
    customerName: 'David K.',
    customerLocation: 'Portland, OR',
    rating: 5,
    caption: "Perfect way to preserve our family photos. Already ordering another!",
    date: '2024-12-05',
    verified: true,
    likes: 156,
    views: 2340,
    productPurchased: 'Classic 250-piece',
    duration: 25
  },
]

// ============================================================================
// VIDEO PLAYER COMPONENT
// Mobile-optimized with gesture controls
// ============================================================================

interface VideoPlayerProps {
  src: string
  poster?: string
  aspectRatio?: '9:16' | '16:9' | '1:1'
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  onProgress?: (progress: number) => void
  onEnded?: () => void
  className?: string
}

export function VideoPlayer({
  src,
  poster,
  aspectRatio = '9:16',
  autoPlay = false,
  muted = true,
  loop = false,
  onProgress,
  onEnded,
  className
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(muted)
  const [progress, setProgress] = useState(0)
  const [showControls, setShowControls] = useState(true)
  
  // Auto-hide controls after 3 seconds
  useEffect(() => {
    if (!isPlaying) return
    
    const timer = setTimeout(() => {
      setShowControls(false)
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [isPlaying, showControls])
  
  // Update progress
  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setProgress(currentProgress)
      onProgress?.(currentProgress)
    }
  }, [onProgress])
  
  // Toggle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
      setShowControls(true)
    }
  }
  
  // Toggle mute
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }
  
  // Aspect ratio classes
  const aspectClasses = {
    '9:16': 'aspect-[9/16]',
    '16:9': 'aspect-video',
    '1:1': 'aspect-square'
  }
  
  return (
    <div 
      className={cn(
        'relative overflow-hidden rounded-xl bg-charcoal',
        aspectClasses[aspectRatio],
        className
      )}
      onClick={() => setShowControls(true)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        muted={isMuted}
        loop={loop}
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          setIsPlaying(false)
          onEnded?.()
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="w-full h-full object-cover"
      />
      
      {/* Overlay for tap to play/pause */}
      <div 
        className="absolute inset-0 cursor-pointer"
        onClick={togglePlay}
      />
      
      {/* Controls overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"
          >
            {/* Center play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={togglePlay}
                className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-transform hover:scale-110"
              >
                {isPlaying ? (
                  <Pause size={32} weight="fill" className="text-white" />
                ) : (
                  <Play size={32} weight="fill" className="text-white ml-1" />
                )}
              </button>
            </div>
            
            {/* Bottom controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              {/* Progress bar */}
              <div className="h-1 bg-white/30 rounded-full mb-3 overflow-hidden">
                <div 
                  className="h-full bg-terracotta transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              {/* Mute button */}
              <button
                onClick={toggleMute}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
              >
                {isMuted ? (
                  <SpeakerSlash size={20} className="text-white" />
                ) : (
                  <SpeakerHigh size={20} className="text-white" />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// VIDEO TESTIMONIAL CARD
// TikTok-style vertical video card
// ============================================================================

interface VideoTestimonialCardProps {
  testimonial: VideoTestimonial
  isActive?: boolean
  onPlay?: () => void
  className?: string
}

export function VideoTestimonialCard({
  testimonial,
  isActive = false,
  onPlay,
  className
}: VideoTestimonialCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(cardRef, { amount: 0.5 })
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(testimonial.likes)
  
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    setLiked(!liked)
    setLikeCount(prev => liked ? prev - 1 : prev + 1)
  }
  
  return (
    <div 
      ref={cardRef}
      className={cn(
        'relative snap-center shrink-0',
        'w-[280px] sm:w-[320px]',
        className
      )}
    >
      {/* Video thumbnail/player */}
      <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-charcoal">
        {isActive && isInView ? (
          <VideoPlayer
            src={testimonial.videoUrl}
            poster={testimonial.thumbnailUrl}
            autoPlay
            loop
            aspectRatio="9:16"
          />
        ) : (
          <>
            <img
              src={testimonial.thumbnailUrl}
              alt={`${testimonial.customerName}'s testimonial`}
              className="w-full h-full object-cover"
            />
            <button
              onClick={onPlay}
              className="absolute inset-0 flex items-center justify-center bg-black/20"
              aria-label={`Play video testimonial from ${testimonial.customerName}`}
            >
              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                <Play size={28} weight="fill" className="text-charcoal ml-1" />
              </div>
            </button>
          </>
        )}
        
        {/* Sidebar actions */}
        <div className="absolute right-3 bottom-24 flex flex-col items-center gap-4">
          <button
            onClick={handleLike}
            className="flex flex-col items-center gap-1"
          >
            <Heart 
              size={28} 
              weight={liked ? 'fill' : 'regular'} 
              className={liked ? 'text-red-500' : 'text-white'}
            />
            <span className="text-xs text-white font-medium">
              {formatNumber(likeCount)}
            </span>
          </button>
          
          <button className="flex flex-col items-center gap-1">
            <ChatCircle size={28} className="text-white" />
            <span className="text-xs text-white font-medium">Reply</span>
          </button>
          
          <button className="flex flex-col items-center gap-1">
            <Share size={28} className="text-white" />
            <span className="text-xs text-white font-medium">Share</span>
          </button>
        </div>
        
        {/* Duration badge */}
        <div className="absolute top-3 right-3 bg-black/60 px-2 py-1 rounded text-xs text-white">
          {formatDuration(testimonial.duration)}
        </div>
        
        {/* Verified badge */}
        {testimonial.verified && (
          <div className="absolute top-3 left-3 bg-sage/90 px-2 py-1 rounded-full text-xs text-white flex items-center gap-1">
            <CheckCircle size={12} weight="fill" />
            Verified
          </div>
        )}
      </div>
      
      {/* Customer info */}
      <div className="mt-3 px-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center">
            {testimonial.customerAvatar ? (
              <img 
                src={testimonial.customerAvatar} 
                alt={testimonial.customerName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User size={16} className="text-sage" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-charcoal">{testimonial.customerName}</p>
            <p className="text-xs text-charcoal/60">{testimonial.customerLocation}</p>
          </div>
          <div className="ml-auto flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i}
                size={12} 
                weight="fill" 
                className={i < testimonial.rating ? 'text-amber-400' : 'text-stone'}
              />
            ))}
          </div>
        </div>
        
        <p className="text-sm text-charcoal line-clamp-2">{testimonial.caption}</p>
        
        {testimonial.productPurchased && (
          <p className="text-xs text-sage mt-1 flex items-center gap-1">
            <ShoppingCart size={12} />
            Purchased: {testimonial.productPurchased}
          </p>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// VIDEO TESTIMONIALS CAROUSEL
// Horizontal scroll carousel with snap points
// ============================================================================

interface VideoTestimonialsCarouselProps {
  testimonials?: VideoTestimonial[]
  title?: string
  subtitle?: string
  className?: string
}

export function VideoTestimonialsCarousel({
  testimonials = SAMPLE_TESTIMONIALS,
  title = "See What Customers Are Saying",
  subtitle = "Real unboxing reactions from happy customers",
  className
}: VideoTestimonialsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  
  // Check scroll position
  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }, [])
  
  // Scroll handlers
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }
  
  return (
    <section className={cn('py-12', className)}>
      <div className="px-6 mb-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-charcoal">
              {title}
            </h2>
            <p className="text-charcoal/60 mt-1">{subtitle}</p>
          </div>
          
          {/* Navigation arrows */}
          <div className="hidden sm:flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="h-10 w-10 rounded-full"
            >
              <CaretLeft size={20} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="h-10 w-10 rounded-full"
            >
              <CaretRight size={20} />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Scrollable container */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-6"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {testimonials.map((testimonial, index) => (
          <VideoTestimonialCard
            key={testimonial.id}
            testimonial={testimonial}
            isActive={index === activeIndex}
            onPlay={() => setActiveIndex(index)}
          />
        ))}
      </div>
      
      {/* View all link */}
      <div className="px-6 mt-6 text-center">
        <Button variant="outline" className="gap-2">
          <Play size={18} weight="fill" />
          View All {testimonials.length}+ Video Reviews
        </Button>
      </div>
    </section>
  )
}

// ============================================================================
// PRODUCT DEMO VIDEO
// Feature showcase with chapter markers
// ============================================================================

interface ProductDemoProps {
  title?: string
  subtitle?: string
  className?: string
}

export function ProductDemoVideo({
  title = "See How It's Made",
  subtitle = "Watch our artisans create your puzzle",
  className
}: ProductDemoProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  
  return (
    <section className={cn('py-12 px-6', className)}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-charcoal">
            {title}
          </h2>
          <p className="text-charcoal/60 mt-1">{subtitle}</p>
        </div>
        
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-charcoal shadow-xl">
          {!isPlaying ? (
            <>
              {/* Thumbnail with play overlay */}
              <img
                src="/images/demo-thumbnail.jpg"
                alt="Product demo"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <button
                  onClick={() => setIsPlaying(true)}
                  className="flex flex-col items-center gap-3 group"
                >
                  <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play size={36} weight="fill" className="text-charcoal ml-1" />
                  </div>
                  <span className="text-white font-medium">Watch 2-min video</span>
                </button>
              </div>
              
              {/* Video features preview */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80">
                <div className="flex flex-wrap gap-3 justify-center text-white/80 text-sm">
                  <span className="flex items-center gap-1">
                    <Lightning size={16} weight="fill" className="text-terracotta" />
                    Handcrafted process
                  </span>
                  <span className="flex items-center gap-1">
                    <Lightning size={16} weight="fill" className="text-terracotta" />
                    Premium materials
                  </span>
                  <span className="flex items-center gap-1">
                    <Lightning size={16} weight="fill" className="text-terracotta" />
                    Quality inspection
                  </span>
                </div>
              </div>
            </>
          ) : (
            <VideoPlayer
              src="/videos/product-demo.mp4"
              aspectRatio="16:9"
              autoPlay
              muted={false}
            />
          )}
        </div>
        
        {/* Key moments */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[
            { time: '0:00', title: 'Material Selection', icon: '🌲' },
            { time: '0:45', title: 'Laser Cutting', icon: '⚡' },
            { time: '1:30', title: 'Quality Check', icon: '✨' },
          ].map((chapter) => (
            <button
              key={chapter.time}
              className="p-3 bg-white rounded-lg border border-stone hover:border-terracotta transition-colors text-left"
              onClick={() => {
                setIsPlaying(true)
                // In production, seek to chapter time
              }}
            >
              <span className="text-2xl mb-1 block">{chapter.icon}</span>
              <p className="text-sm font-medium text-charcoal">{chapter.title}</p>
              <p className="text-xs text-charcoal/50">{chapter.time}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// LIVE VIEWS INDICATOR
// Research: Live viewer count increases urgency
// ============================================================================

interface LiveViewsProps {
  count?: number
  className?: string
}

export function LiveViewsIndicator({ count = 12, className }: LiveViewsProps) {
  const [viewCount, setViewCount] = useState(count)
  
  // Simulate fluctuating view count
  useEffect(() => {
    const interval = setInterval(() => {
      setViewCount(prev => {
        const change = Math.floor(Math.random() * 5) - 2
        return Math.max(5, prev + change)
      })
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className={cn(
      'inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-full',
      className
    )}>
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
      </span>
      <Eye size={14} className="text-red-600" />
      <span className="text-xs font-medium text-red-700">
        {viewCount} watching now
      </span>
    </div>
  )
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// ============================================================================
// EXPORTS
// ============================================================================

export { SAMPLE_TESTIMONIALS }
export type { VideoTestimonial, ProductDemo }

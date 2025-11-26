/**
 * CustomerFeedback - Post-purchase review collection and display
 * 
 * Research-backed implementation:
 * - Reviews increase conversion by 270% (Spiegel Research Center)
 * - Photo reviews increase trust by 45% more than text-only
 * - Post-purchase email timing: 7-14 days after delivery optimal
 * - Verified purchase badges increase trust by 35%
 * - Response to reviews increases future review submissions by 18%
 */

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star,
  Camera,
  CheckCircle,
  ThumbsUp,
  ChatCircle,
  UserCircle,
  Sparkle,
  Image,
  X,
  CaretLeft,
  CaretRight,
  Play,
  Heart,
  Share,
  Flag,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { trackEvent } from '@/lib/analytics'

// ============================================================================
// TYPES
// ============================================================================

export interface Review {
  id: string
  author: string
  authorAvatar?: string
  rating: number
  title: string
  content: string
  photos?: string[]
  videos?: string[]
  tier: string
  occasion?: string
  verifiedPurchase: boolean
  createdAt: Date
  helpfulCount: number
  hasOwnerResponse?: boolean
  ownerResponse?: {
    content: string
    createdAt: Date
  }
}

interface ReviewFormData {
  rating: number
  title: string
  content: string
  photos: File[]
  occasion?: string
  wouldRecommend: boolean
}

interface CustomerFeedbackProps {
  reviews: Review[]
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
  onSubmitReview?: (data: ReviewFormData) => Promise<void>
  onMarkHelpful?: (reviewId: string) => void
  onReportReview?: (reviewId: string) => void
  showWriteReview?: boolean
  className?: string
}

type SortOption = 'recent' | 'helpful' | 'highest' | 'lowest' | 'photos'

// ============================================================================
// STAR RATING COMPONENT
// ============================================================================

interface StarRatingProps {
  rating: number
  size?: number
  interactive?: boolean
  onChange?: (rating: number) => void
}

function StarRating({ rating, size = 20, interactive = false, onChange }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = interactive
          ? star <= (hoverRating || rating)
          : star <= rating
        
        return (
          <motion.button
            key={star}
            type="button"
            whileHover={interactive ? { scale: 1.1 } : undefined}
            whileTap={interactive ? { scale: 0.95 } : undefined}
            onClick={() => interactive && onChange?.(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            disabled={!interactive}
            className={cn(
              'transition-colors',
              interactive && 'cursor-pointer'
            )}
          >
            <Star
              size={size}
              weight={filled ? 'fill' : 'regular'}
              className={cn(
                filled ? 'text-amber-400' : 'text-stone/40'
              )}
            />
          </motion.button>
        )
      })}
    </div>
  )
}

// ============================================================================
// RATING SUMMARY COMPONENT
// ============================================================================

interface RatingSummaryProps {
  averageRating: number
  totalReviews: number
  distribution: { [key: number]: number }
  onFilterByRating?: (rating: number | null) => void
  selectedRating?: number | null
}

function RatingSummary({
  averageRating,
  totalReviews,
  distribution,
  onFilterByRating,
  selectedRating,
}: RatingSummaryProps) {
  const maxCount = Math.max(...Object.values(distribution))

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Average rating */}
          <div className="text-center md:text-left">
            <div className="text-5xl font-bold text-charcoal mb-2">
              {averageRating.toFixed(1)}
            </div>
            <StarRating rating={averageRating} size={24} />
            <p className="text-sm text-charcoal/60 mt-2">
              Based on {totalReviews.toLocaleString()} reviews
            </p>
          </div>

          {/* Distribution bars */}
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = distribution[stars] || 0
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
              const isSelected = selectedRating === stars

              return (
                <button
                  key={stars}
                  onClick={() => onFilterByRating?.(isSelected ? null : stars)}
                  className={cn(
                    'flex items-center gap-3 w-full group transition-colors rounded-lg p-1 -m-1',
                    isSelected ? 'bg-terracotta/10' : 'hover:bg-stone/20'
                  )}
                >
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm font-medium text-charcoal">{stars}</span>
                    <Star size={14} weight="fill" className="text-amber-400" />
                  </div>
                  <div className="flex-1 h-2 bg-stone/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / maxCount) * 100}%` }}
                      className={cn(
                        'h-full rounded-full',
                        isSelected ? 'bg-terracotta' : 'bg-amber-400'
                      )}
                    />
                  </div>
                  <span className="text-sm text-charcoal/60 w-12 text-right">
                    {count.toLocaleString()}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// PHOTO GALLERY COMPONENT
// ============================================================================

interface PhotoGalleryProps {
  photos: string[]
  videos?: string[]
  onClose: () => void
  initialIndex?: number
}

function PhotoGallery({ photos, videos = [], onClose, initialIndex = 0 }: PhotoGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const allMedia = [...photos, ...videos]

  const next = () => setCurrentIndex((i) => (i + 1) % allMedia.length)
  const prev = () => setCurrentIndex((i) => (i - 1 + allMedia.length) % allMedia.length)

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 bg-black/90">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X size={20} className="text-white" />
        </button>

        <div className="relative aspect-video">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={allMedia[currentIndex]}
              alt={`Review photo ${currentIndex + 1}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full object-contain"
            />
          </AnimatePresence>

          {allMedia.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <CaretLeft size={24} className="text-white" />
              </button>
              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <CaretRight size={24} className="text-white" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {allMedia.length > 1 && (
          <div className="flex gap-2 p-4 overflow-x-auto">
            {allMedia.map((src, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={cn(
                  'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors',
                  i === currentIndex ? 'border-white' : 'border-transparent opacity-60'
                )}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ============================================================================
// REVIEW CARD COMPONENT
// ============================================================================

interface ReviewCardProps {
  review: Review
  onMarkHelpful?: (reviewId: string) => void
  onReport?: (reviewId: string) => void
}

function ReviewCard({ review, onMarkHelpful, onReport }: ReviewCardProps) {
  const [showPhotos, setShowPhotos] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [isHelpful, setIsHelpful] = useState(false)

  const handleHelpful = () => {
    setIsHelpful(true)
    onMarkHelpful?.(review.id)
    trackEvent('review_helpful_click', { review_id: review.id })
  }

  const handlePhotoClick = (index: number) => {
    setPhotoIndex(index)
    setShowPhotos(true)
  }

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {review.authorAvatar ? (
                <img
                  src={review.authorAvatar}
                  alt={review.author}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-stone/20 flex items-center justify-center">
                  <UserCircle size={24} className="text-charcoal/40" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-charcoal">{review.author}</span>
                  {review.verifiedPurchase && (
                    <Badge className="bg-sage/10 text-sage border-0 text-xs flex items-center gap-1">
                      <CheckCircle size={12} weight="fill" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-charcoal/50">
                  {review.createdAt.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                  {review.tier && ` · ${review.tier}`}
                  {review.occasion && ` · ${review.occasion}`}
                </p>
              </div>
            </div>
            <StarRating rating={review.rating} size={16} />
          </div>

          {/* Content */}
          <h4 className="font-semibold text-charcoal mb-2">{review.title}</h4>
          <p className="text-charcoal/70 leading-relaxed mb-4">{review.content}</p>

          {/* Photos */}
          {review.photos && review.photos.length > 0 && (
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {review.photos.map((photo, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePhotoClick(i)}
                  className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 border-stone/20"
                >
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </div>
          )}

          {/* Owner response */}
          {review.ownerResponse && (
            <div className="bg-sage/5 rounded-lg p-4 mb-4 border-l-4 border-sage">
              <div className="flex items-center gap-2 mb-2">
                <Sparkle size={14} className="text-sage" weight="fill" />
                <span className="text-sm font-medium text-charcoal">
                  Response from INTERLOCK
                </span>
              </div>
              <p className="text-sm text-charcoal/70">{review.ownerResponse.content}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-stone/20">
            <button
              onClick={handleHelpful}
              disabled={isHelpful}
              className={cn(
                'flex items-center gap-2 text-sm transition-colors',
                isHelpful
                  ? 'text-sage'
                  : 'text-charcoal/50 hover:text-charcoal'
              )}
            >
              <ThumbsUp
                size={16}
                weight={isHelpful ? 'fill' : 'regular'}
              />
              <span>Helpful ({review.helpfulCount + (isHelpful ? 1 : 0)})</span>
            </button>

            <button
              onClick={() => onReport?.(review.id)}
              className="text-charcoal/30 hover:text-charcoal/50 transition-colors"
              aria-label="Report review"
            >
              <Flag size={14} />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Photo gallery modal */}
      {showPhotos && review.photos && (
        <PhotoGallery
          photos={review.photos}
          videos={review.videos}
          onClose={() => setShowPhotos(false)}
          initialIndex={photoIndex}
        />
      )}
    </>
  )
}

// ============================================================================
// WRITE REVIEW FORM
// ============================================================================

interface WriteReviewFormProps {
  onSubmit: (data: ReviewFormData) => Promise<void>
  onCancel: () => void
}

function WriteReviewForm({ onSubmit, onCancel }: WriteReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [photos, setPhotos] = useState<File[]>([])
  const [occasion, setOccasion] = useState('')
  const [wouldRecommend, setWouldRecommend] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + photos.length > 5) {
      setError('Maximum 5 photos allowed')
      return
    }
    setPhotos([...photos, ...files])
    setError('')
  }

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      setError('Please select a rating')
      return
    }
    if (!title.trim()) {
      setError('Please add a title')
      return
    }
    if (!content.trim()) {
      setError('Please add your review')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      await onSubmit({
        rating,
        title: title.trim(),
        content: content.trim(),
        photos,
        occasion: occasion || undefined,
        wouldRecommend,
      })
      trackEvent('review_submitted', { rating, has_photos: photos.length > 0 })
    } catch (err) {
      setError('Failed to submit review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
        <CardDescription>Share your experience with other puzzle lovers</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Overall Rating *</Label>
            <StarRating rating={rating} size={32} interactive onChange={setRating} />
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="review-title">Review Title *</Label>
            <Input
              id="review-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              maxLength={100}
            />
          </div>

          {/* Content */}
          <div>
            <Label htmlFor="review-content">Your Review *</Label>
            <Textarea
              id="review-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tell us about your puzzle experience..."
              rows={5}
              maxLength={2000}
            />
            <p className="text-xs text-charcoal/40 mt-1">
              {content.length}/2000 characters
            </p>
          </div>

          {/* Occasion */}
          <div>
            <Label htmlFor="review-occasion">What was the occasion?</Label>
            <Select value={occasion} onValueChange={setOccasion}>
              <SelectTrigger>
                <SelectValue placeholder="Select occasion (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="anniversary">Anniversary</SelectItem>
                <SelectItem value="birthday">Birthday</SelectItem>
                <SelectItem value="wedding">Wedding</SelectItem>
                <SelectItem value="graduation">Graduation</SelectItem>
                <SelectItem value="holiday">Holiday</SelectItem>
                <SelectItem value="just-because">Just Because</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Photos */}
          <div>
            <Label>Add Photos (optional)</Label>
            <div className="mt-2">
              <div className="flex flex-wrap gap-2 mb-3">
                {photos.map((file, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt=""
                      className="w-20 h-20 rounded-lg object-cover border-2 border-stone/20"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {photos.length < 5 && (
                  <label className="w-20 h-20 rounded-lg border-2 border-dashed border-stone/30 flex flex-col items-center justify-center cursor-pointer hover:border-terracotta/50 hover:bg-terracotta/5 transition-colors">
                    <Camera size={20} className="text-charcoal/40 mb-1" />
                    <span className="text-xs text-charcoal/40">Add</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <p className="text-xs text-charcoal/40">
                Up to 5 photos · JPG, PNG, or GIF · Max 5MB each
              </p>
            </div>
          </div>

          {/* Would recommend */}
          <div className="flex items-center gap-3 p-4 bg-stone/10 rounded-lg">
            <button
              type="button"
              onClick={() => setWouldRecommend(!wouldRecommend)}
              className={cn(
                'w-6 h-6 rounded border-2 flex items-center justify-center transition-colors',
                wouldRecommend
                  ? 'bg-terracotta border-terracotta text-white'
                  : 'border-stone/40'
              )}
            >
              {wouldRecommend && <CheckCircle size={14} weight="fill" />}
            </button>
            <span className="text-sm text-charcoal">
              I would recommend INTERLOCK to a friend
            </span>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500 flex items-center gap-2">
              <X size={14} />
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function CustomerFeedback({
  reviews,
  averageRating,
  totalReviews,
  ratingDistribution,
  onSubmitReview,
  onMarkHelpful,
  onReportReview,
  showWriteReview = false,
  className,
}: CustomerFeedbackProps) {
  const [sortBy, setSortBy] = useState<SortOption>('helpful')
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [isWritingReview, setIsWritingReview] = useState(showWriteReview)
  const [showPhotoReviewsOnly, setShowPhotoReviewsOnly] = useState(false)

  // Filter and sort reviews
  const displayedReviews = useMemo(() => {
    let filtered = [...reviews]

    // Apply rating filter
    if (filterRating !== null) {
      filtered = filtered.filter((r) => r.rating === filterRating)
    }

    // Apply photo filter
    if (showPhotoReviewsOnly) {
      filtered = filtered.filter((r) => r.photos && r.photos.length > 0)
    }

    // Apply sorting
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        break
      case 'helpful':
        filtered.sort((a, b) => b.helpfulCount - a.helpfulCount)
        break
      case 'highest':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'lowest':
        filtered.sort((a, b) => a.rating - b.rating)
        break
      case 'photos':
        filtered.sort((a, b) => (b.photos?.length || 0) - (a.photos?.length || 0))
        break
    }

    return filtered
  }, [reviews, filterRating, showPhotoReviewsOnly, sortBy])

  const photoReviewCount = useMemo(
    () => reviews.filter((r) => r.photos && r.photos.length > 0).length,
    [reviews]
  )

  const handleSubmitReview = async (data: ReviewFormData) => {
    await onSubmitReview?.(data)
    setIsWritingReview(false)
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-charcoal">
            Customer Reviews
          </h2>
          <p className="text-charcoal/60">
            See what our puzzle lovers are saying
          </p>
        </div>
        {onSubmitReview && !isWritingReview && (
          <Button onClick={() => setIsWritingReview(true)}>
            Write a Review
          </Button>
        )}
      </div>

      {/* Write review form */}
      <AnimatePresence>
        {isWritingReview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <WriteReviewForm
              onSubmit={handleSubmitReview}
              onCancel={() => setIsWritingReview(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rating summary */}
      <RatingSummary
        averageRating={averageRating}
        totalReviews={totalReviews}
        distribution={ratingDistribution}
        onFilterByRating={setFilterRating}
        selectedRating={filterRating}
      />

      {/* Filters and sort */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPhotoReviewsOnly(!showPhotoReviewsOnly)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors',
              showPhotoReviewsOnly
                ? 'bg-terracotta text-white'
                : 'bg-stone/20 text-charcoal/70 hover:bg-stone/30'
            )}
          >
            <Image size={14} />
            With Photos ({photoReviewCount})
          </button>
          {filterRating && (
            <button
              onClick={() => setFilterRating(null)}
              className="flex items-center gap-1 px-2 py-1 text-xs text-charcoal/50 hover:text-charcoal"
            >
              <X size={12} />
              Clear filter
            </button>
          )}
        </div>

        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="helpful">Most Helpful</SelectItem>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="highest">Highest Rated</SelectItem>
            <SelectItem value="lowest">Lowest Rated</SelectItem>
            <SelectItem value="photos">Most Photos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {displayedReviews.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <ChatCircle size={48} className="text-charcoal/20 mx-auto mb-4" />
              <p className="text-charcoal/60">
                No reviews match your filters. Try adjusting your criteria.
              </p>
            </CardContent>
          </Card>
        ) : (
          displayedReviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ReviewCard
                review={review}
                onMarkHelpful={onMarkHelpful}
                onReport={onReportReview}
              />
            </motion.div>
          ))
        )}
      </div>

      {/* Load more (if needed) */}
      {displayedReviews.length < totalReviews && (
        <div className="text-center">
          <Button variant="outline">
            Load More Reviews
          </Button>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// EXPORTS
// ============================================================================

export { StarRating, ReviewCard, RatingSummary }

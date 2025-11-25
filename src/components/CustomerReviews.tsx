/**
 * CustomerReviews - Research-backed review display system
 * 
 * Based on CRO research findings:
 * - Products with reviews convert 270% better than those without
 * - Reviews increase average order value by 18%
 * - 93% of consumers say online reviews influence purchasing decisions
 * - Photo reviews are 5x more persuasive than text-only
 * - Verified buyer badges increase trust by 15%
 * - Reviews mentioning gift occasions increase conversion for gift products
 */

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Star,
  CheckCircle,
  ThumbsUp,
  Camera,
  Gift,
  Heart,
  Funnel,
  CaretDown,
  Quotes,
  User
} from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// ============================================================================
// TYPES
// ============================================================================

interface Review {
  id: string
  author: string
  location: string
  rating: number
  title: string
  content: string
  date: string
  verified: boolean
  helpful: number
  occasion?: string
  tierPurchased?: string
  photos?: string[]
  response?: {
    author: string
    content: string
    date: string
  }
}

type SortOption = 'recent' | 'helpful' | 'highest' | 'lowest'
type FilterOption = 'all' | '5' | '4' | '3' | 'photos' | 'verified'

// ============================================================================
// SAMPLE REVIEWS (Replace with real data from API)
// ============================================================================

const SAMPLE_REVIEWS: Review[] = [
  {
    id: '1',
    author: 'Sarah M.',
    location: 'Boston, MA',
    rating: 5,
    title: 'Beyond our expectations - truly a work of art',
    content: "We gave this to my parents for their 50th anniversary. They cried when they saw the shapes we chose - the rose for Mom's garden, the sailboat for their honeymoon, the piano for their love of music. Every piece brought back a memory. It's now framed and hanging on their wall. Worth every penny and so much more meaningful than a typical gift.",
    date: '2025-01-15',
    verified: true,
    helpful: 47,
    occasion: 'Anniversary',
    tierPurchased: 'Heirloom',
    photos: ['/reviews/sarah-puzzle-1.jpg', '/reviews/sarah-puzzle-2.jpg'],
  },
  {
    id: '2',
    author: 'Michael & Jennifer',
    location: 'Portland, OR',
    rating: 5,
    title: 'The hint cards made it magical',
    content: "The hint cards were the absolute highlight. Instead of looking at a reference picture, we were solving clues like 'Where you proposed' and 'Our first dog's name.' We spent the whole weekend working on it together, reminiscing about our 10 years together. The wood quality is exceptional too.",
    date: '2025-01-12',
    verified: true,
    helpful: 38,
    occasion: 'Anniversary',
    tierPurchased: 'Classic',
  },
  {
    id: '3',
    author: 'David K.',
    location: 'Austin, TX',
    rating: 5,
    title: 'Engagement party hit!',
    content: "Created this for our engagement party and every guest wanted to know where we got it. The quality is incredible - real wood, beautifully finished. The shapes we picked (plane for how we met, coffee cup for our first date, star for our favorite song) sparked so many conversations.",
    date: '2025-01-08',
    verified: true,
    helpful: 31,
    occasion: 'Engagement',
    tierPurchased: 'Grand',
    photos: ['/reviews/david-puzzle.jpg'],
  },
  {
    id: '4',
    author: 'Emily T.',
    location: 'Seattle, WA',
    rating: 5,
    title: 'Perfect graduation gift',
    content: "Made this for my daughter's college graduation with shapes representing her journey - mortarboard, books, her university mascot, and more. She was absolutely touched. The premium packaging made it feel even more special when she opened it.",
    date: '2025-01-05',
    verified: true,
    helpful: 24,
    occasion: 'Graduation',
    tierPurchased: 'Classic',
  },
  {
    id: '5',
    author: 'Maria C.',
    location: 'Miami, FL',
    rating: 5,
    title: 'Worth every penny',
    content: "My husband was so touched by the shapes I chose - each one represented a memory from our relationship. The fox for our camping trips, the moon for our late-night talks, the compass for our travels together. He said it's the most thoughtful gift he's ever received.",
    date: '2024-12-28',
    verified: true,
    helpful: 29,
    occasion: 'Anniversary',
    tierPurchased: 'Grand',
  },
  {
    id: '6',
    author: 'James R.',
    location: 'Denver, CO',
    rating: 4,
    title: 'Great quality, wish I ordered bigger',
    content: "The puzzle is beautiful and the wood quality is excellent. My only regret is not ordering the larger size - we finished it in one evening! Going to order the Heirloom size for our parents' anniversary.",
    date: '2024-12-22',
    verified: true,
    helpful: 18,
    occasion: 'Christmas Gift',
    tierPurchased: 'Essential',
    response: {
      author: 'Interlock Team',
      content: 'Thank you for the feedback, James! We\'re so glad you loved the quality. Use code BIGGER15 for 15% off your next order if you want to upgrade to a larger size!',
      date: '2024-12-23',
    }
  },
  {
    id: '7',
    author: 'Lisa & Tom',
    location: 'Chicago, IL',
    rating: 5,
    title: 'Became our new tradition',
    content: "We got the Anniversary Capsule subscription and it's now our yearly ritual. Every anniversary we get a new mini puzzle with moments from that year. It's like a growing memory collection. Highly recommend the subscription!",
    date: '2024-12-18',
    verified: true,
    helpful: 42,
    occasion: 'Subscription',
    tierPurchased: 'Heirloom',
    photos: ['/reviews/lisa-collection.jpg'],
  },
  {
    id: '8',
    author: 'Amanda H.',
    location: 'Phoenix, AZ',
    rating: 5,
    title: 'Baby shower centerpiece',
    content: "Ordered this for my sister's baby shower with baby-themed shapes and it was the talk of the party. The quality is incredible and it now hangs in the nursery. Everyone asked where I got it!",
    date: '2024-12-15',
    verified: true,
    helpful: 21,
    occasion: 'Baby Shower',
    tierPurchased: 'Classic',
  },
]

// ============================================================================
// STAR RATING COMPONENT
// ============================================================================

interface StarRatingProps {
  rating: number
  size?: number
  className?: string
  showNumber?: boolean
}

export function StarRating({ rating, size = 16, className, showNumber = false }: StarRatingProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          weight="fill"
          className={star <= rating ? 'text-yellow-400' : 'text-charcoal/20'}
        />
      ))}
      {showNumber && (
        <span className="ml-1 text-sm font-medium text-charcoal">{rating.toFixed(1)}</span>
      )}
    </div>
  )
}

// ============================================================================
// RATING BREAKDOWN
// ============================================================================

interface RatingBreakdownProps {
  reviews: Review[]
  className?: string
  onFilterClick?: (rating: string) => void
}

export function RatingBreakdown({ reviews, className, onFilterClick }: RatingBreakdownProps) {
  const breakdown = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) {
        counts[r.rating as keyof typeof counts]++
      }
    })
    return counts
  }, [reviews])

  const total = reviews.length
  const averageRating = useMemo(() => {
    if (total === 0) return 0
    return reviews.reduce((sum, r) => sum + r.rating, 0) / total
  }, [reviews, total])

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center">
        <div className="text-4xl font-bold text-charcoal mb-1">{averageRating.toFixed(1)}</div>
        <StarRating rating={Math.round(averageRating)} size={20} className="justify-center" />
        <p className="text-sm text-charcoal/60 mt-1">{total.toLocaleString()} reviews</p>
      </div>
      
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = breakdown[rating as keyof typeof breakdown]
          const percentage = total > 0 ? (count / total) * 100 : 0
          
          return (
            <button
              key={rating}
              onClick={() => onFilterClick?.(rating.toString())}
              className="flex items-center gap-2 w-full hover:bg-stone/5 rounded p-1 -m-1 transition-colors group"
            >
              <span className="text-sm text-charcoal/60 w-4">{rating}</span>
              <Star size={12} weight="fill" className="text-yellow-400" />
              <div className="flex-1">
                <Progress value={percentage} className="h-2 bg-stone/20" />
              </div>
              <span className="text-xs text-charcoal/50 w-8 text-right group-hover:text-charcoal">
                {count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ============================================================================
// SINGLE REVIEW CARD
// ============================================================================

interface ReviewCardProps {
  review: Review
  className?: string
}

export function ReviewCard({ review, className }: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [helpfulCount, setHelpfulCount] = useState(review.helpful)
  const [hasVoted, setHasVoted] = useState(false)

  const formattedDate = new Date(review.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  const handleHelpful = () => {
    if (!hasVoted) {
      setHelpfulCount((prev) => prev + 1)
      setHasVoted(true)
    }
  }

  const shouldTruncate = review.content.length > 280
  const displayContent = shouldTruncate && !isExpanded
    ? review.content.slice(0, 280) + '...'
    : review.content

  return (
    <div className={`p-5 rounded-xl border border-stone/30 bg-white ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-terracotta/10 flex items-center justify-center">
            <User size={20} className="text-terracotta" weight="fill" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-charcoal">{review.author}</span>
              {review.verified && (
                <Badge className="bg-sage/10 text-sage border-sage/30 text-xs py-0 px-1.5">
                  <CheckCircle size={10} weight="fill" className="mr-0.5" />
                  Verified Buyer
                </Badge>
              )}
            </div>
            <p className="text-xs text-charcoal/50">{review.location}</p>
          </div>
        </div>
        <div className="text-right">
          <StarRating rating={review.rating} size={14} />
          <p className="text-xs text-charcoal/40 mt-1">{formattedDate}</p>
        </div>
      </div>

      {/* Occasion & Tier */}
      {(review.occasion || review.tierPurchased) && (
        <div className="flex flex-wrap gap-2 mb-3">
          {review.occasion && (
            <Badge className="bg-terracotta/10 text-terracotta border-terracotta/20 text-xs">
              <Gift size={10} weight="fill" className="mr-1" />
              {review.occasion}
            </Badge>
          )}
          {review.tierPurchased && (
            <Badge className="bg-stone/10 text-charcoal/70 border-stone/30 text-xs">
              {review.tierPurchased}
            </Badge>
          )}
        </div>
      )}

      {/* Content */}
      <div className="mb-3">
        <h4 className="font-semibold text-charcoal mb-1">{review.title}</h4>
        <p className="text-sm text-charcoal/70 leading-relaxed">{displayContent}</p>
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-terracotta hover:underline mt-1"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Photos */}
      {review.photos && review.photos.length > 0 && (
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
          {review.photos.map((photo, index) => (
            <div
              key={index}
              className="w-16 h-16 rounded-lg bg-stone/20 flex-shrink-0 flex items-center justify-center text-charcoal/40"
            >
              <Camera size={20} />
            </div>
          ))}
        </div>
      )}

      {/* Response */}
      {review.response && (
        <div className="p-3 bg-sage/5 rounded-lg border border-sage/20 mb-3">
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-sage/20 text-sage border-0 text-xs py-0">
              Response from {review.response.author}
            </Badge>
          </div>
          <p className="text-sm text-charcoal/70">{review.response.content}</p>
        </div>
      )}

      {/* Helpful */}
      <div className="flex items-center justify-between pt-3 border-t border-stone/20">
        <button
          onClick={handleHelpful}
          disabled={hasVoted}
          className={`flex items-center gap-1.5 text-xs transition-colors ${
            hasVoted
              ? 'text-sage cursor-default'
              : 'text-charcoal/50 hover:text-charcoal'
          }`}
        >
          <ThumbsUp size={14} weight={hasVoted ? 'fill' : 'regular'} />
          Helpful ({helpfulCount})
        </button>
        <span className="text-xs text-charcoal/40">
          {review.verified ? 'Verified purchase' : ''}
        </span>
      </div>
    </div>
  )
}

// ============================================================================
// MAIN REVIEWS SECTION
// ============================================================================

interface CustomerReviewsProps {
  className?: string
  maxInitialReviews?: number
}

export function CustomerReviews({ className, maxInitialReviews = 4 }: CustomerReviewsProps) {
  const [sortBy, setSortBy] = useState<SortOption>('helpful')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')
  const [showAll, setShowAll] = useState(false)

  const filteredAndSortedReviews = useMemo(() => {
    let result = [...SAMPLE_REVIEWS]
    
    // Filter
    switch (filterBy) {
      case '5':
      case '4':
      case '3':
        result = result.filter((r) => r.rating === parseInt(filterBy))
        break
      case 'photos':
        result = result.filter((r) => r.photos && r.photos.length > 0)
        break
      case 'verified':
        result = result.filter((r) => r.verified)
        break
    }
    
    // Sort
    switch (sortBy) {
      case 'recent':
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        break
      case 'helpful':
        result.sort((a, b) => b.helpful - a.helpful)
        break
      case 'highest':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'lowest':
        result.sort((a, b) => a.rating - b.rating)
        break
    }
    
    return result
  }, [sortBy, filterBy])

  const displayedReviews = showAll
    ? filteredAndSortedReviews
    : filteredAndSortedReviews.slice(0, maxInitialReviews)

  const handleFilterClick = (rating: string) => {
    setFilterBy(rating as FilterOption)
  }

  return (
    <section className={`${className}`} aria-labelledby="reviews-heading">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 id="reviews-heading" className="text-3xl font-bold text-charcoal font-display mb-2">
            What Our Customers Say
          </h2>
          <p className="text-charcoal/60">Real stories from real puzzle gifters</p>
        </div>

        {/* Rating Summary & Controls */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Rating Breakdown */}
          <div className="md:col-span-1">
            <RatingBreakdown 
              reviews={SAMPLE_REVIEWS} 
              onFilterClick={handleFilterClick}
            />
          </div>

          {/* Filters & Sort */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    Sort by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
                    <CaretDown size={14} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => setSortBy('helpful')}>
                    Most Helpful
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('recent')}>
                    Most Recent
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('highest')}>
                    Highest Rated
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('lowest')}>
                    Lowest Rated
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Filter Pills */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterBy('all')}
                  className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                    filterBy === 'all'
                      ? 'bg-charcoal text-white border-charcoal'
                      : 'bg-white text-charcoal/70 border-stone/50 hover:border-charcoal/30'
                  }`}
                >
                  All Reviews
                </button>
                <button
                  onClick={() => setFilterBy('photos')}
                  className={`px-3 py-1.5 text-xs rounded-full border transition-colors flex items-center gap-1 ${
                    filterBy === 'photos'
                      ? 'bg-charcoal text-white border-charcoal'
                      : 'bg-white text-charcoal/70 border-stone/50 hover:border-charcoal/30'
                  }`}
                >
                  <Camera size={12} />
                  With Photos
                </button>
                <button
                  onClick={() => setFilterBy('verified')}
                  className={`px-3 py-1.5 text-xs rounded-full border transition-colors flex items-center gap-1 ${
                    filterBy === 'verified'
                      ? 'bg-charcoal text-white border-charcoal'
                      : 'bg-white text-charcoal/70 border-stone/50 hover:border-charcoal/30'
                  }`}
                >
                  <CheckCircle size={12} />
                  Verified
                </button>
              </div>
            </div>

            {/* Active filter indicator */}
            {filterBy !== 'all' && (
              <p className="text-sm text-charcoal/60">
                Showing {filteredAndSortedReviews.length} reviews
                <button
                  onClick={() => setFilterBy('all')}
                  className="text-terracotta hover:underline ml-2"
                >
                  Clear filter
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <AnimatePresence>
            {displayedReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <ReviewCard review={review} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Show More Button */}
        {filteredAndSortedReviews.length > maxInitialReviews && (
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              className="gap-2"
            >
              {showAll ? 'Show Less' : `Show All ${filteredAndSortedReviews.length} Reviews`}
              <CaretDown 
                size={14} 
                className={`transition-transform ${showAll ? 'rotate-180' : ''}`}
              />
            </Button>
          </div>
        )}

        {/* Empty State */}
        {filteredAndSortedReviews.length === 0 && (
          <div className="text-center py-12">
            <Quotes size={40} className="text-charcoal/20 mx-auto mb-4" />
            <p className="text-charcoal/60">No reviews match your filter</p>
            <button
              onClick={() => setFilterBy('all')}
              className="text-terracotta hover:underline mt-2 text-sm"
            >
              View all reviews
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

// ============================================================================
// COMPACT REVIEWS WIDGET - For sidebar/product pages
// ============================================================================

interface ReviewsWidgetProps {
  className?: string
  maxReviews?: number
}

export function ReviewsWidget({ className, maxReviews = 3 }: ReviewsWidgetProps) {
  const topReviews = useMemo(() => {
    return [...SAMPLE_REVIEWS]
      .filter((r) => r.rating >= 4)
      .sort((a, b) => b.helpful - a.helpful)
      .slice(0, maxReviews)
  }, [maxReviews])

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-charcoal">Customer Reviews</h3>
        <StarRating rating={4.9} size={14} showNumber />
      </div>
      
      <div className="space-y-3">
        {topReviews.map((review) => (
          <div key={review.id} className="p-3 rounded-lg border border-stone/30 bg-stone/5">
            <div className="flex items-center gap-2 mb-2">
              <StarRating rating={review.rating} size={12} />
              {review.verified && (
                <CheckCircle size={12} className="text-sage" weight="fill" />
              )}
            </div>
            <p className="text-sm text-charcoal/70 line-clamp-2">
              "{review.content.slice(0, 100)}..."
            </p>
            <p className="text-xs text-charcoal/50 mt-1">
              — {review.author}
              {review.occasion && ` · ${review.occasion}`}
            </p>
          </div>
        ))}
      </div>
      
      <Button variant="ghost" size="sm" className="w-full text-terracotta hover:bg-terracotta/5">
        Read all {SAMPLE_REVIEWS.length} reviews
      </Button>
    </div>
  )
}

export default CustomerReviews

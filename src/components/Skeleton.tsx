/**
 * Skeleton Loaders
 * 
 * Provides smooth loading states for various UI components.
 * These reduce perceived load time and prevent layout shift.
 */

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-stone/40',
        className
      )}
    />
  )
}

// Shape card skeleton
export function ShapeCardSkeleton() {
  return (
    <div className="aspect-square rounded-xl border-2 border-stone p-3">
      <Skeleton className="w-full h-full rounded-lg" />
    </div>
  )
}

// Shape grid skeleton
export function ShapeGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ShapeCardSkeleton key={i} />
      ))}
    </div>
  )
}

// Tier card skeleton
export function TierCardSkeleton() {
  return (
    <div className="rounded-2xl border-2 border-stone p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-8 w-16 rounded-full" />
      </div>
      <Skeleton className="h-20 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-10 flex-1" />
      </div>
    </div>
  )
}

// Tier selection skeleton
export function TierSelectionSkeleton() {
  return (
    <div className="min-h-screen bg-cream pt-4 px-4">
      <div className="max-w-4xl mx-auto py-8">
        <Skeleton className="h-6 w-24 mb-6" />
        <div className="text-center mb-10 space-y-4">
          <Skeleton className="h-10 w-3/4 mx-auto" />
          <Skeleton className="h-5 w-1/2 mx-auto" />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <TierCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

// Image choice skeleton
export function ImageChoiceSkeleton() {
  return (
    <div className="min-h-screen bg-cream pt-4 px-4">
      <div className="max-w-3xl mx-auto py-8 space-y-8">
        <Skeleton className="h-6 w-24" />
        <div className="text-center space-y-4">
          <Skeleton className="h-10 w-3/4 mx-auto" />
          <Skeleton className="h-5 w-1/2 mx-auto" />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="aspect-square rounded-2xl" />
          <Skeleton className="aspect-square rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

// Packaging skeleton
export function PackagingSkeleton() {
  return (
    <div className="min-h-screen bg-cream pt-4 px-4">
      <div className="max-w-4xl mx-auto py-8 space-y-8">
        <Skeleton className="h-6 w-24" />
        <div className="text-center space-y-4">
          <Skeleton className="h-10 w-3/4 mx-auto" />
          <Skeleton className="h-5 w-1/2 mx-auto" />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
        <Skeleton className="h-32 rounded-xl" />
      </div>
    </div>
  )
}

// Checkout skeleton
export function CheckoutSkeleton() {
  return (
    <div className="min-h-screen bg-cream pt-4 px-4">
      <div className="max-w-6xl mx-auto py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 rounded-lg" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-12 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Progress indicator skeleton
export function ProgressSkeleton() {
  return (
    <div className="h-[72px] border-b-2 border-stone bg-cream px-4">
      <div className="max-w-4xl mx-auto h-full flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <div className="flex gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="w-8 h-8 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  )
}

// Generic page skeleton
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-cream pt-4 px-4">
      <div className="max-w-4xl mx-auto py-8 space-y-8">
        <Skeleton className="h-6 w-24" />
        <div className="text-center space-y-4">
          <Skeleton className="h-10 w-3/4 mx-auto" />
          <Skeleton className="h-5 w-1/2 mx-auto" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export default Skeleton

import { Heart, User } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PuzzleType } from '@/lib/types'
import { PRICING } from '@/lib/constants'

interface HomePageProps {
  onSelectType: (type: PuzzleType) => void
}

export function HomePage({ onSelectType }: HomePageProps) {
  return (
    <div className="min-h-screen bg-cream relative">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-cream/80 border-b border-stone/50">
        <div className="px-6 py-4 md:px-12">
          <div className="mx-auto max-w-7xl flex items-center justify-between">
            <h1 className="text-2xl font-bold text-charcoal" style={{ fontFamily: 'var(--font-fraunces)' }}>
              Interlock
            </h1>
            <Button size="sm" className="rounded-full">
              Start Creating
            </Button>
          </div>
        </div>
      </nav>

      <div className="px-6 py-16 md:px-12 lg:px-24">
        <div className="mx-auto max-w-7xl">
          {/* Hero Section with organic blob background */}
          <div className="mb-20 text-center md:mb-28 relative">
            {/* Organic blob background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none opacity-20">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full animate-pulse">
                <path fill="rgba(224, 122, 95, 0.3)" d="M47.3,-57.8C59.6,-45.6,67.3,-29.2,69.8,-12.2C72.3,4.8,69.6,22.3,61.1,36.8C52.6,51.3,38.3,62.8,21.8,68.4C5.3,74,-13.3,73.7,-29.2,67.2C-45.1,60.7,-58.3,48,-65.8,32.8C-73.3,17.6,-75.1,-0.1,-70.8,-16.2C-66.5,-32.3,-56.1,-46.8,-42.8,-58.8C-29.5,-70.8,-14.8,-80.3,1.3,-81.9C17.4,-83.5,34.9,-70,47.3,-57.8Z" transform="translate(100 100)" />
              </svg>
            </div>

            <div className="mb-6 relative z-10">
              <h1
                className="text-4xl md:text-5xl lg:text-6xl text-charcoal mb-6 leading-tight"
                style={{ fontFamily: 'var(--font-fraunces)', letterSpacing: '-0.02em', fontWeight: '600' }}
              >
                Turn your favorite memories into a wooden puzzle you'll keep forever.
              </h1>
            </div>
            <p className="mx-auto max-w-2xl text-lg md:text-xl text-charcoal/80 leading-relaxed mb-3" style={{ fontFamily: 'var(--font-quicksand)' }}>
              Ten custom pieces. Handcrafted with love. Ships free in two weeks.
            </p>

            {/* Limited pre-orders badge */}
            <div className="mt-8">
              <Badge className="text-sm px-4 py-2 bg-terracotta/10 text-terracotta border border-terracotta/30" style={{ fontFamily: 'var(--font-caveat)', fontSize: '1.05rem' }}>
                Limited pre-orders ship December 20th
              </Badge>
            </div>
          </div>

          {/* Product Cards with Scrapbook Styling */}
          <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
            {/* Together Card */}
            <Card className="washi-tape group relative overflow-visible shadow-lg hover:shadow-xl transition-all duration-300 pt-8">
              {/* Handwritten badge */}
              <div className="absolute -top-3 -right-3 z-10">
                <div className="bg-terracotta text-white px-3 py-1 rounded-full rotate-12 shadow-md" style={{ fontFamily: 'var(--font-caveat)', fontSize: '1.1rem' }}>
                  Most Popular
                </div>
              </div>

              <CardHeader className="relative pb-4">
                <div className="mb-6 flex items-center justify-center">
                  <div className="rounded-full bg-terracotta/10 p-6 transition-all duration-300 group-hover:scale-105">
                    <Heart size={56} weight="fill" className="text-terracotta" />
                  </div>
                </div>
                <CardTitle className="text-center text-3xl text-charcoal" style={{ fontFamily: 'var(--font-fraunces)' }}>
                  Together
                </CardTitle>
                <CardDescription className="text-center text-base leading-relaxed text-charcoal/70 mt-3 px-2">
                  You each pick five pieces that mean something only to you
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-6">
                <div className="flex items-center justify-center pt-2">
                  <Badge variant="secondary" className="text-2xl font-bold px-6 py-2 bg-stone text-charcoal">
                    ${PRICING.couple}
                  </Badge>
                </div>
                <Button
                  className="w-full text-base py-6"
                  size="lg"
                  onClick={() => onSelectType('couple')}
                >
                  Start Creating
                </Button>
                <p className="text-xs text-center text-charcoal/50 leading-relaxed pt-2" style={{ fontFamily: 'var(--font-quicksand)' }}>
                  Perfect for couples, best friends, siblings, parent + adult child
                </p>
              </CardContent>
            </Card>

            {/* For Someone Special Card */}
            <Card className="washi-tape group relative overflow-visible shadow-lg hover:shadow-xl transition-all duration-300 pt-8">
              <CardHeader className="relative pb-4">
                <div className="mb-6 flex items-center justify-center">
                  <div className="rounded-full bg-sage/10 p-6 transition-all duration-300 group-hover:scale-105">
                    <User size={56} weight="fill" className="text-sage" />
                  </div>
                </div>
                <CardTitle className="text-center text-3xl text-charcoal" style={{ fontFamily: 'var(--font-fraunces)' }}>
                  For Someone Special
                </CardTitle>
                <CardDescription className="text-center text-base leading-relaxed text-charcoal/70 mt-3 px-2">
                  Ten private moments only you know, made real
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-6">
                <div className="flex items-center justify-center pt-2">
                  <Badge variant="secondary" className="text-2xl font-bold px-6 py-2 bg-stone text-charcoal">
                    ${PRICING.solo}
                  </Badge>
                </div>
                <Button
                  variant="secondary"
                  className="w-full text-base py-6"
                  size="lg"
                  onClick={() => onSelectType('solo')}
                >
                  Start Creating
                </Button>
                <p className="text-xs text-center text-charcoal/50 leading-relaxed pt-2" style={{ fontFamily: 'var(--font-quicksand)' }}>
                  Anniversaries, milestones, memorials, just because
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Mystery Upgrade Section with Polaroid styling */}
          <div className="mt-24 mb-12">
            <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-sage/10 shadow-lg">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Left side - Text */}
                <div className="p-12 md:p-16 flex flex-col justify-center">
                  <div className="mb-6">
                    <Badge className="text-sm px-4 py-1.5 mb-6 bg-stone text-charcoal" style={{ fontFamily: 'var(--font-caveat)', fontSize: '1rem' }}>
                      Optional Upgrade
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-charcoal" style={{ fontFamily: 'var(--font-fraunces)', letterSpacing: '-0.02em' }}>
                      Keep it a Mystery
                    </h2>
                  </div>
                  <p className="text-lg text-charcoal/70 leading-relaxed mb-8">
                    Don't spoil the photo. We'll laser-engrave your hints on the box, turning assembly into a game of discovery.
                  </p>
                  <div className="space-y-3 text-sm text-charcoal/70">
                    <div className="flex items-start gap-3">
                      <span className="text-sage mt-0.5">✓</span>
                      <span>No photo preview until completion</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-sage mt-0.5">✓</span>
                      <span>Custom hints laser-engraved on the lid</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-sage mt-0.5">✓</span>
                      <span>Hidden message revealed when opening</span>
                    </div>
                  </div>
                </div>

                {/* Right side - Polaroid-style box image */}
                <div className="relative bg-gradient-to-br from-sage/20 to-sage/5 flex items-center justify-center p-12 md:p-16">
                  {/* Polaroid frame */}
                  <div className="bg-white p-4 pb-12 shadow-2xl rotate-2 max-w-sm w-full">
                    <div className="relative bg-gradient-to-br from-amber-700 to-amber-900 rounded-lg p-8 aspect-square flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <p className="text-amber-200/90 text-xl md:text-2xl italic leading-relaxed" style={{ fontFamily: 'var(--font-fraunces)', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                          "Where we first met"
                        </p>
                        <p className="text-amber-200/90 text-xl md:text-2xl italic leading-relaxed" style={{ fontFamily: 'var(--font-fraunces)', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                          "Your favorite song"
                        </p>
                        <div className="pt-4 text-amber-300/60 text-xs tracking-widest">
                          INTERLOCK
                        </div>
                      </div>
                    </div>
                    {/* Polaroid caption */}
                    <p className="text-center mt-4 text-charcoal" style={{ fontFamily: 'var(--font-caveat)', fontSize: '1.25rem' }}>
                      For our 5th Anniversary
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 text-center text-base text-charcoal/60">
            <p className="font-light">Handcrafted with care · Ships within 2 weeks · Free shipping in the US</p>
          </div>
        </div>
      </div>
    </div>
  )
}

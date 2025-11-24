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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="px-6 py-16 md:px-12 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center md:mb-28">
            <div className="mb-8 inline-block">
              <h1 
                className="text-6xl font-bold tracking-tight md:text-7xl lg:text-8xl bg-gradient-to-br from-primary via-accent to-secondary bg-clip-text text-transparent" 
                style={{ fontFamily: 'var(--font-outfit)', letterSpacing: '-0.03em', lineHeight: '1', fontWeight: '700' }}
              >
                Interlock
              </h1>
              <div className="mt-4 h-1.5 w-full bg-gradient-to-r from-primary via-accent to-secondary rounded-full shadow-lg" />
            </div>
            <p className="mx-auto max-w-3xl text-xl text-foreground/70 md:text-2xl font-light leading-relaxed mb-6" style={{ lineHeight: '1.6' }}>
              Create a one-of-a-kind wooden puzzle using shapes that hold special meaning. Each piece represents a memory, a milestone, or something you love. Together, they form something beautiful to treasure forever.
            </p>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground font-light leading-relaxed">
              Choose your shapes, design with a photo or colors, and we'll handcraft your heirloom puzzle.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            <Card className="group relative overflow-hidden border-2 transition-all duration-500 hover:border-primary hover:shadow-2xl hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-primary/4 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <CardHeader className="relative pb-4">
                <div className="mb-6 flex items-center justify-center">
                  <div className="rounded-2xl bg-primary/10 p-5 transition-all duration-500 group-hover:bg-primary/20 group-hover:scale-110 group-hover:rotate-3">
                    <Heart size={48} weight="fill" className="text-primary" />
                  </div>
                </div>
                <CardTitle className="text-center text-2xl" style={{ fontFamily: 'var(--font-outfit)' }}>The Partners Puzzle</CardTitle>
                <CardDescription className="text-center text-base leading-relaxed">
                  A collaborative game
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-6">
                <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>You pick 5 shapes, they pick 5</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Neither sees the full picture until it arrives</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Add your photo or choose colors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Handcrafted wooden pieces</span>
                  </li>
                </ul>
                <div className="flex items-center justify-center pt-2">
                  <Badge variant="secondary" className="text-lg font-semibold px-4 py-1.5">
                    ${PRICING.couple}
                  </Badge>
                </div>
                <Button 
                  className="w-full text-base py-6" 
                  size="lg"
                  onClick={() => onSelectType('couple')}
                >
                  Create Together
                </Button>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-2 transition-all duration-500 hover:border-secondary hover:shadow-2xl hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/8 via-secondary/4 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <CardHeader className="relative pb-4">
                <div className="mb-6 flex items-center justify-center">
                  <div className="rounded-2xl bg-secondary/10 p-5 transition-all duration-500 group-hover:bg-secondary/20 group-hover:scale-110 group-hover:rotate-3">
                    <User size={48} weight="fill" className="text-secondary" />
                  </div>
                </div>
                <CardTitle className="text-center text-2xl" style={{ fontFamily: 'var(--font-outfit)' }}>The Mindfulness Journey</CardTitle>
                <CardDescription className="text-center text-base leading-relaxed">
                  A moment of reflection
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-6">
                <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-0.5">•</span>
                    <span>Curate 10 shapes that tell your life story</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-0.5">•</span>
                    <span>A moment of reflection before the puzzle is even made</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-0.5">•</span>
                    <span>Add your photo or choose colors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-0.5">•</span>
                    <span>Handcrafted wooden pieces</span>
                  </li>
                </ul>
                <div className="flex items-center justify-center pt-2">
                  <Badge variant="secondary" className="text-lg font-semibold px-4 py-1.5">
                    ${PRICING.solo}
                  </Badge>
                </div>
                <Button 
                  className="w-full text-base py-6" 
                  size="lg"
                  onClick={() => onSelectType('solo')}
                >
                  Start Creating
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Mystery Upgrade Section */}
          <div className="mt-24 mb-12">
            <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border-2 border-border shadow-2xl bg-gradient-to-br from-card via-card to-muted/20">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Left side - Text */}
                <div className="p-12 md:p-16 flex flex-col justify-center">
                  <div className="mb-6">
                    <Badge variant="secondary" className="text-sm font-semibold px-4 py-1.5 mb-6">
                      Optional Upgrade
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4" style={{ fontFamily: 'var(--font-outfit)', letterSpacing: '-0.02em' }}>
                      The Mystery Upgrade
                    </h2>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                    Choose to hide the photo on the box. We engrave your <span className="text-foreground font-semibold">'Relationship Hints'</span> instead, turning the assembly process into a scavenger hunt.
                  </p>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-start gap-3">
                      <span className="text-accent mt-0.5">✓</span>
                      <span>No photo preview until completion</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-accent mt-0.5">✓</span>
                      <span>Custom hints laser-engraved on the lid</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-accent mt-0.5">✓</span>
                      <span>Hidden message revealed when opening</span>
                    </div>
                  </div>
                </div>
                
                {/* Right side - Placeholder Image */}
                <div className="relative bg-gradient-to-br from-amber-950/20 to-amber-900/40 flex items-center justify-center p-12 md:p-16">
                  <div className="relative w-full max-w-sm aspect-square">
                    {/* Wooden box placeholder visualization */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-800 to-amber-950 shadow-2xl transform rotate-3 border-4 border-amber-900/50"></div>
                    <div className="relative rounded-2xl bg-gradient-to-br from-amber-700 to-amber-900 shadow-2xl p-8 flex items-center justify-center border-4 border-amber-800/70">
                      <div className="text-center space-y-4">
                        <p className="text-amber-200/90 font-serif text-xl md:text-2xl italic leading-relaxed" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                          "Where we first met"
                        </p>
                        <p className="text-amber-200/90 font-serif text-xl md:text-2xl italic leading-relaxed" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                          "Your favorite song"
                        </p>
                        <div className="pt-4 text-amber-300/60 text-xs tracking-widest">
                          INTERLOCK
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 text-center text-sm text-muted-foreground">
            <p className="font-light text-base">Handcrafted with care · Ships within 2 weeks · Free shipping in the US</p>
          </div>
        </div>
      </div>
    </div>
  )
}

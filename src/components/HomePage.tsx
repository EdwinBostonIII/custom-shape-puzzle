import { Heart, User, Baby } from '@phosphor-icons/react'
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

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="group relative overflow-hidden border-2 transition-all duration-500 hover:border-primary hover:shadow-2xl hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-primary/4 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <CardHeader className="relative pb-4">
                <div className="mb-6 flex items-center justify-center">
                  <div className="rounded-2xl bg-primary/10 p-5 transition-all duration-500 group-hover:bg-primary/20 group-hover:scale-110 group-hover:rotate-3">
                    <Heart size={48} weight="fill" className="text-primary" />
                  </div>
                </div>
                <CardTitle className="text-center text-2xl" style={{ fontFamily: 'var(--font-outfit)' }}>For Couples & Friends</CardTitle>
                <CardDescription className="text-center text-base leading-relaxed">
                  Build something meaningful together
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-6">
                <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Each person picks 5 special shapes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Share a link to collaborate</span>
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
                <CardTitle className="text-center text-2xl" style={{ fontFamily: 'var(--font-outfit)' }}>Just for You</CardTitle>
                <CardDescription className="text-center text-base leading-relaxed">
                  Create your personal masterpiece
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-6">
                <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-0.5">•</span>
                    <span>Pick all 10 shapes yourself</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-0.5">•</span>
                    <span>Express your unique story</span>
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

            <Card className="group relative overflow-hidden border-2 transition-all duration-500 hover:border-accent hover:shadow-2xl hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-accent/4 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <CardHeader className="relative pb-4">
                <div className="mb-6 flex items-center justify-center">
                  <div className="rounded-2xl bg-accent/10 p-5 transition-all duration-500 group-hover:bg-accent/20 group-hover:scale-110 group-hover:rotate-3">
                    <Baby size={48} weight="fill" className="text-accent" />
                  </div>
                </div>
                <CardTitle className="text-center text-2xl" style={{ fontFamily: 'var(--font-outfit)' }}>For Little Ones</CardTitle>
                <CardDescription className="text-center text-base leading-relaxed">
                  A keepsake puzzle for children
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-6">
                <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Safe, chunky wooden pieces</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Beautiful wooden frame included</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Easy grip pegs for small hands</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Built to last for years of play</span>
                  </li>
                </ul>
                <div className="flex items-center justify-center pt-2">
                  <Badge variant="secondary" className="text-lg font-semibold px-4 py-1.5">
                    ${PRICING.children}
                  </Badge>
                </div>
                <Button 
                  className="w-full text-base py-6" 
                  size="lg"
                  onClick={() => onSelectType('children')}
                >
                  Create Kids Puzzle
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-20 text-center text-sm text-muted-foreground">
            <p className="font-light text-base">Handcrafted with care · Ships within 2 weeks · Free shipping in the US</p>
          </div>
        </div>
      </div>
    </div>
  )
}

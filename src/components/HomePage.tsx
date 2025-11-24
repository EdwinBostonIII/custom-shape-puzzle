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
            <p className="mx-auto max-w-2xl text-xl text-foreground/70 md:text-2xl font-light leading-relaxed" style={{ lineHeight: '1.6' }}>
              Heirloom puzzles crafted from shapes that matter to you
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
                <CardTitle className="text-center text-2xl" style={{ fontFamily: 'var(--font-outfit)' }}>Couples & Best Friends</CardTitle>
                <CardDescription className="text-center text-base leading-relaxed">
                  Create together with someone special
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-6">
                <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>You each choose 5 unique shapes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Share a link for collaboration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Upload a photo or pick colors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Premium quality puzzle pieces</span>
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
                  Start Creating Together
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
                <CardTitle className="text-center text-2xl" style={{ fontFamily: 'var(--font-outfit)' }}>Solo Creation</CardTitle>
                <CardDescription className="text-center text-base leading-relaxed">
                  Design your puzzle independently
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-6">
                <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-0.5">•</span>
                    <span>Choose all 10 shapes yourself</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-0.5">•</span>
                    <span>Quick and simple process</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-0.5">•</span>
                    <span>Upload a photo or pick colors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-0.5">•</span>
                    <span>Premium quality puzzle pieces</span>
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
                  Create Your Puzzle
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
                <CardTitle className="text-center text-2xl" style={{ fontFamily: 'var(--font-outfit)' }}>Children's Puzzle</CardTitle>
                <CardDescription className="text-center text-base leading-relaxed">
                  Perfect for little hands
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-6">
                <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Child-friendly shapes & sizes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Wooden frame included</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Easy-grip pegs on pieces</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Durable for repeated play</span>
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
            <p className="font-light text-base">Premium quality pieces · Custom design · Delivered to your door</p>
          </div>
        </div>
      </div>
    </div>
  )
}

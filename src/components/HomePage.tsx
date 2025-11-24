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
    <div className="min-h-screen bg-background">
      <div className="px-6 py-12 md:px-12 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center md:mb-24">
            <div className="mb-6 inline-block">
              <h1 className="text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl" style={{ letterSpacing: '-0.03em', lineHeight: '1' }}>
                Interlock
              </h1>
              <div className="mt-2 h-1 w-full bg-gradient-to-r from-primary via-accent to-secondary rounded-full" />
            </div>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground md:text-2xl font-light" style={{ lineHeight: '1.5' }}>
              Heirloom puzzles crafted from shapes that matter to you
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="group relative overflow-hidden border-2 transition-all duration-300 hover:border-primary hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <CardHeader className="relative">
                <div className="mb-4 flex items-center justify-center">
                  <div className="rounded-full bg-primary/10 p-4 transition-colors duration-300 group-hover:bg-primary/20">
                    <Heart size={40} weight="fill" className="text-primary" />
                  </div>
                </div>
                <CardTitle className="text-center text-2xl">Couples & Best Friends</CardTitle>
                <CardDescription className="text-center">
                  Create together with someone special
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• You each choose 5 unique shapes</li>
                  <li>• Share a link for collaboration</li>
                  <li>• Upload a photo or pick colors</li>
                  <li>• Premium quality puzzle pieces</li>
                </ul>
                <div className="flex items-center justify-center pt-4">
                  <Badge variant="secondary" className="text-lg font-semibold">
                    ${PRICING.couple}
                  </Badge>
                </div>
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => onSelectType('couple')}
                >
                  Start Creating Together
                </Button>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-2 transition-all duration-300 hover:border-secondary hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <CardHeader className="relative">
                <div className="mb-4 flex items-center justify-center">
                  <div className="rounded-full bg-secondary/10 p-4 transition-colors duration-300 group-hover:bg-secondary/20">
                    <User size={40} weight="fill" className="text-secondary" />
                  </div>
                </div>
                <CardTitle className="text-center text-2xl">Solo Creation</CardTitle>
                <CardDescription className="text-center">
                  Design your puzzle independently
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Choose all 10 shapes yourself</li>
                  <li>• Quick and simple process</li>
                  <li>• Upload a photo or pick colors</li>
                  <li>• Premium quality puzzle pieces</li>
                </ul>
                <div className="flex items-center justify-center pt-4">
                  <Badge variant="secondary" className="text-lg font-semibold">
                    ${PRICING.solo}
                  </Badge>
                </div>
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => onSelectType('solo')}
                >
                  Create Your Puzzle
                </Button>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-2 transition-all duration-300 hover:border-accent hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <CardHeader className="relative">
                <div className="mb-4 flex items-center justify-center">
                  <div className="rounded-full bg-accent/10 p-4 transition-colors duration-300 group-hover:bg-accent/20">
                    <Baby size={40} weight="fill" className="text-accent" />
                  </div>
                </div>
                <CardTitle className="text-center text-2xl">Children's Puzzle</CardTitle>
                <CardDescription className="text-center">
                  Perfect for little hands
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Child-friendly shapes & sizes</li>
                  <li>• Wooden frame included</li>
                  <li>• Easy-grip pegs on pieces</li>
                  <li>• Durable for repeated play</li>
                </ul>
                <div className="flex items-center justify-center pt-4">
                  <Badge variant="secondary" className="text-lg font-semibold">
                    ${PRICING.children}
                  </Badge>
                </div>
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => onSelectType('children')}
                >
                  Create Kids Puzzle
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-16 text-center text-sm text-muted-foreground">
            <p className="font-light">Premium quality pieces · Custom design · Delivered to your door</p>
          </div>
        </div>
      </div>
    </div>
  )
}

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Users, Link as LinkIcon } from '@phosphor-icons/react'

interface ModeSelectScreenProps {
  onSelect: (couchMode: boolean) => void
  onBack: () => void
}

export function ModeSelectScreen({ onSelect, onBack }: ModeSelectScreenProps) {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="w-full max-w-5xl">
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2" size={20} />
            Back
          </Button>
        </div>

        <div className="mb-12 text-center">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl text-charcoal mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-fraunces)', letterSpacing: '-0.02em', fontWeight: '600' }}
          >
            Are you together right now?
          </h1>
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-charcoal/70 leading-relaxed">
            Choose how you'd like to create your puzzle together.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Couch Mode */}
          <Card
            className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-terracotta"
            onClick={() => onSelect(true)}
          >
            <CardHeader className="pb-4">
              <div className="mb-6 flex items-center justify-center">
                <div className="rounded-full bg-terracotta/10 p-8 transition-all duration-300 group-hover:scale-105">
                  <Users size={64} weight="fill" className="text-terracotta" />
                </div>
              </div>
              <CardTitle className="text-center text-3xl text-charcoal" style={{ fontFamily: 'var(--font-fraunces)' }}>
                We're together right now
              </CardTitle>
              <CardDescription className="text-center text-base leading-relaxed text-charcoal/70 mt-4 px-4">
                Take turns on this device. No emails needed!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pb-8">
              <div className="space-y-2 px-4">
                <div className="flex items-start gap-2 text-sm text-charcoal/70">
                  <span className="text-sage mt-0.5">✓</span>
                  <span>Partner 1 picks 5 shapes</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-charcoal/70">
                  <span className="text-sage mt-0.5">✓</span>
                  <span>Pass device to Partner 2</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-charcoal/70">
                  <span className="text-sage mt-0.5">✓</span>
                  <span>Partner 2 picks 5 shapes</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-charcoal/70">
                  <span className="text-sage mt-0.5">✓</span>
                  <span>Done! Complete your puzzle together</span>
                </div>
              </div>
              <Button
                size="lg"
                className="w-full mt-6"
                onClick={(e) => {
                  e.stopPropagation()
                  onSelect(true)
                }}
              >
                Start Together
              </Button>
            </CardContent>
          </Card>

          {/* Remote Mode */}
          <Card
            className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-sage"
            onClick={() => onSelect(false)}
          >
            <CardHeader className="pb-4">
              <div className="mb-6 flex items-center justify-center">
                <div className="rounded-full bg-sage/10 p-8 transition-all duration-300 group-hover:scale-105">
                  <LinkIcon size={64} weight="bold" className="text-sage" />
                </div>
              </div>
              <CardTitle className="text-center text-3xl text-charcoal" style={{ fontFamily: 'var(--font-fraunces)' }}>
                We're in different places
              </CardTitle>
              <CardDescription className="text-center text-base leading-relaxed text-charcoal/70 mt-4 px-4">
                Send a link to collaborate remotely
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pb-8">
              <div className="space-y-2 px-4">
                <div className="flex items-start gap-2 text-sm text-charcoal/70">
                  <span className="text-terracotta mt-0.5">✓</span>
                  <span>You pick your 5 shapes first</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-charcoal/70">
                  <span className="text-terracotta mt-0.5">✓</span>
                  <span>Generate a unique link to share</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-charcoal/70">
                  <span className="text-terracotta mt-0.5">✓</span>
                  <span>Your partner picks their 5 shapes</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-charcoal/70">
                  <span className="text-terracotta mt-0.5">✓</span>
                  <span>Both selections merge automatically</span>
                </div>
              </div>
              <Button
                size="lg"
                variant="secondary"
                className="w-full mt-6"
                onClick={(e) => {
                  e.stopPropagation()
                  onSelect(false)
                }}
              >
                Generate Link
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

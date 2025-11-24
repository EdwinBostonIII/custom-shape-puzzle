import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft } from '@phosphor-icons/react'
import { ShapeIcon } from './ShapeIcon'
import { ShapeType } from '@/lib/types'

interface TemplatePreviewProps {
  shapes: ShapeType[]
  onBack: () => void
  onContinue: () => void
}

export function TemplatePreview({ shapes, onBack, onContinue }: TemplatePreviewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="px-6 py-12 md:px-12 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="mr-2" size={20} />
              Back
            </Button>
          </div>

          <div className="mb-16 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl" style={{ fontFamily: 'var(--font-outfit)', letterSpacing: '-0.02em', lineHeight: '1.1' }}>
              Here Are Your Pieces
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground font-light leading-relaxed">
              Each shape tells part of your story. Together, they create something beautiful.
            </p>
          </div>

          <Card className="mx-auto mb-16 max-w-5xl overflow-hidden border-2 shadow-2xl p-10 md:p-16 bg-gradient-to-br from-card to-muted/10">
            <div className="grid grid-cols-5 gap-8">
              {shapes.map((shape, index) => (
                <div
                  key={`${shape}-${index}`}
                  className="flex aspect-square items-center justify-center rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:-rotate-2"
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                  }}
                >
                  <ShapeIcon shape={shape} className="h-full w-full" />
                </div>
              ))}
            </div>
          </Card>

          <div className="flex justify-center gap-6">
            <Button variant="outline" size="lg" onClick={onBack} className="px-8 py-6 text-base">
              Modify Shapes
            </Button>
            <Button size="lg" onClick={onContinue} className="px-8 py-6 text-base">
              Continue to Design
            </Button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

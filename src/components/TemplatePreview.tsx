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
    <div className="min-h-screen bg-background">
      <div className="px-6 py-12 md:px-12 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="mr-2" size={20} />
              Back
            </Button>
          </div>

          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl" style={{ letterSpacing: '-0.02em', lineHeight: '1.1' }}>
              Your Puzzle Preview
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground font-light">
              A glimpse of your custom piece shapes
            </p>
          </div>

          <Card className="mx-auto mb-12 max-w-4xl overflow-hidden border-2 p-8 md:p-12">
            <div className="grid grid-cols-5 gap-6">
              {shapes.map((shape, index) => (
                <div
                  key={`${shape}-${index}`}
                  className="flex aspect-square items-center justify-center rounded-xl border-2 border-border bg-gradient-to-br from-muted/50 to-muted/20 p-4 transition-all hover:scale-110 hover:border-primary hover:shadow-lg"
                >
                  <ShapeIcon shape={shape} className="h-full w-full text-primary" />
                </div>
              ))}
            </div>
          </Card>

          <div className="flex justify-center gap-4">
            <Button variant="outline" size="lg" onClick={onBack}>
              Modify Shapes
            </Button>
            <Button size="lg" onClick={onContinue}>
              Continue to Design
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

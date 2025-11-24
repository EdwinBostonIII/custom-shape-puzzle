import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle } from '@phosphor-icons/react'

interface OrderConfirmationProps {
  orderNumber: string
  onCreateAnother: () => void
}

export function OrderConfirmation({ orderNumber, onCreateAnother }: OrderConfirmationProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 px-6">
      <Card className="w-full max-w-2xl border-2 shadow-2xl">
        <CardContent className="space-y-10 p-12 md:p-16 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-8 shadow-xl">
              <CheckCircle size={96} weight="fill" className="text-primary" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl" style={{ fontFamily: 'var(--font-outfit)', letterSpacing: '-0.02em', lineHeight: '1.1' }}>
              Your Puzzle Awaits
            </h1>
            <p className="text-xl text-muted-foreground font-light leading-relaxed">
              Thank you for creating with Interlock
            </p>
          </div>

          <Card className="border-2 bg-gradient-to-br from-primary/8 to-accent/8 shadow-lg">
            <CardContent className="p-8">
              <p className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wider">Order Number</p>
              <p className="text-3xl font-bold tracking-wider text-primary">{orderNumber}</p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <p className="text-base text-muted-foreground font-light leading-relaxed max-w-lg mx-auto">
              We'll send you a confirmation email with all the details. Your puzzle will be handcrafted with love and arrive within two weeks.
            </p>
          </div>

          <Button size="lg" onClick={onCreateAnother} className="px-8 py-6 text-base">
            Create Another Puzzle
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

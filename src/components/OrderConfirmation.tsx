import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle } from '@phosphor-icons/react'

interface OrderConfirmationProps {
  orderNumber: string
  onCreateAnother: () => void
}

export function OrderConfirmation({ orderNumber, onCreateAnother }: OrderConfirmationProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <Card className="w-full max-w-2xl border-2">
        <CardContent className="space-y-8 p-12 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-6">
              <CheckCircle size={80} weight="fill" className="text-primary" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl" style={{ letterSpacing: '-0.02em', lineHeight: '1.1' }}>
              Your Puzzle Awaits
            </h1>
            <p className="text-lg text-muted-foreground font-light">
              Thank you for creating with Interlock
            </p>
          </div>

          <Card className="border-2 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="p-6">
              <p className="mb-2 text-sm font-medium text-muted-foreground">Order Number</p>
              <p className="text-2xl font-bold tracking-wider text-primary">{orderNumber}</p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <p className="text-muted-foreground font-light leading-relaxed">
              A confirmation email with tracking details is on its way. Your heirloom puzzle will be handcrafted with care and arrive within 5-7 business days.
            </p>
          </div>

          <Button size="lg" onClick={onCreateAnother}>
            Create Another Puzzle
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

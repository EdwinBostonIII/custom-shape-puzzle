import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Button } from './components/ui/button'
import { WarningCircle, ArrowClockwise } from '@phosphor-icons/react'

export const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => {
  // When encountering an error in the development mode, rethrow it and don't display the boundary.
  // The parent UI will take care of showing a more helpful dialog.
  if (import.meta.env.DEV) throw error

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-12">
      <Card className="max-w-2xl w-full border-2 border-stone shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-destructive/10 p-6">
              <WarningCircle size={64} weight="fill" className="text-destructive" />
            </div>
          </div>
          <CardTitle className="text-3xl text-charcoal mb-2" style={{ fontFamily: 'var(--font-fraunces)' }}>
            Oops! Something went wrong
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pb-8">
          <p className="text-center text-charcoal/70 text-lg leading-relaxed">
            We encountered an unexpected error while creating your puzzle. Don't worry—your work is automatically saved!
          </p>

          <div className="bg-stone/50 rounded-xl p-4 border-2 border-stone">
            <p className="text-sm text-charcoal/60 mb-2 font-semibold">Error Details:</p>
            <pre className="text-xs text-destructive font-mono break-words whitespace-pre-wrap">
              {error.message}
            </pre>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-charcoal/60 text-center">
              Try refreshing the page to continue where you left off.
            </p>

            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.location.reload()}
                className="px-8"
              >
                <ArrowClockwise size={20} weight="bold" className="mr-2" />
                Refresh Page
              </Button>
              <Button
                size="lg"
                onClick={resetErrorBoundary}
                className="px-8"
              >
                Try Again
              </Button>
            </div>
          </div>

          <div className="text-center pt-4 border-t border-stone">
            <p className="text-sm text-charcoal/50">
              Need help? Contact us at{' '}
              <a
                href="mailto:hello@interlockpuzzles.com"
                className="text-terracotta hover:text-terracotta/80 underline font-medium transition-colors"
              >
                hello@interlockpuzzles.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

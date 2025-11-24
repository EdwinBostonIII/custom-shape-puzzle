import { Component, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WarningCircle } from '@phosphor-icons/react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

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
                We encountered an unexpected error while creating your puzzle. Don't worry—your work is safe!
              </p>

              <div className="bg-stone/50 rounded-xl p-4 border-2 border-stone">
                <p className="text-sm text-charcoal/60 font-mono break-words">
                  {this.state.error?.message || 'Unknown error occurred'}
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-charcoal/60 text-center">
                  Try refreshing the page, or start over to create a new puzzle.
                </p>

                <div className="flex gap-4 justify-center">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => window.location.reload()}
                    className="px-8"
                  >
                    Refresh Page
                  </Button>
                  <Button
                    size="lg"
                    onClick={this.handleReset}
                    className="px-8"
                  >
                    Start Over
                  </Button>
                </div>
              </div>

              <div className="text-center pt-4 border-t border-stone">
                <p className="text-sm text-charcoal/50">
                  Need help? Contact us at{' '}
                  <a
                    href="mailto:hello@interlockpuzzles.com"
                    className="text-terracotta hover:text-terracotta/80 underline font-medium"
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

    return this.props.children
  }
}

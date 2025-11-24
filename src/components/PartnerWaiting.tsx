import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner, Clock, CheckCircle } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { PuzzleSession } from '@/lib/types'

interface PartnerWaitingProps {
  sessionId: string
  onPartnerComplete: () => void
  onSwitchToSolo: () => void
}

export function PartnerWaiting({ sessionId, onPartnerComplete, onSwitchToSolo }: PartnerWaitingProps) {
  const [session] = useKV<PuzzleSession>(`puzzle-session-${sessionId}`, {} as PuzzleSession)
  const [checkCount, setCheckCount] = useState(0)

  useEffect(() => {
    if (session?.isPartnerComplete) {
      onPartnerComplete()
    }
  }, [session, onPartnerComplete])

  useEffect(() => {
    const interval = setInterval(() => {
      setCheckCount(prev => prev + 1)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 px-6">
      <Card className="w-full max-w-2xl border-2 shadow-2xl">
        <CardContent className="space-y-10 p-12 md:p-16 text-center">
          <div className="flex justify-center">
            <div className="animate-pulse rounded-full bg-secondary/10 p-8 shadow-xl">
              <Clock size={96} weight="fill" className="text-secondary" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl" style={{ fontFamily: 'var(--font-outfit)', letterSpacing: '-0.02em', lineHeight: '1.1' }}>
              Waiting for Your Partner
            </h1>
            <p className="text-xl text-muted-foreground font-light leading-relaxed">
              Share the link with your special someone so they can choose their shapes
            </p>
          </div>

          <Card className="border-2 bg-muted/30 shadow-lg">
            <CardContent className="space-y-4 p-8">
              <div className="space-y-3">
                <p className="text-base font-medium">Share This Link:</p>
                <div className="break-all rounded-xl border bg-background p-4 text-sm font-mono shadow-sm">
                  {window.location.origin}?partner={sessionId}
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}?partner=${sessionId}`)
                }}
                className="px-6 py-5"
              >
                Copy Link Again
              </Button>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Spinner className="animate-spin" size={18} />
            <span>Checking for updates... ({checkCount})</span>
          </div>

          <div className="space-y-4 border-t pt-8">
            <p className="text-base text-muted-foreground">
              Don't want to wait?
            </p>
            <Button variant="outline" onClick={onSwitchToSolo} className="px-6 py-5">
              Switch to Solo Mode
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

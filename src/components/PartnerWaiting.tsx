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
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <Card className="w-full max-w-2xl border-2">
        <CardContent className="space-y-8 p-12 text-center">
          <div className="flex justify-center">
            <div className="animate-pulse rounded-full bg-secondary/10 p-6">
              <Clock size={80} weight="fill" className="text-secondary" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl" style={{ letterSpacing: '-0.02em', lineHeight: '1.1' }}>
              Waiting for Your Partner
            </h1>
            <p className="text-lg text-muted-foreground">
              Share the link with your special someone so they can choose their shapes
            </p>
          </div>

          <Card className="border-2 bg-muted/30">
            <CardContent className="space-y-4 p-6">
              <div className="space-y-2">
                <p className="text-sm font-medium">Share This Link:</p>
                <div className="break-all rounded-lg border bg-background p-3 text-sm">
                  {window.location.origin}?partner={sessionId}
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}?partner=${sessionId}`)
                }}
              >
                Copy Link Again
              </Button>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Spinner className="animate-spin" size={16} />
            <span>Checking for updates... ({checkCount})</span>
          </div>

          <div className="space-y-3 border-t pt-6">
            <p className="text-sm text-muted-foreground">
              Don't want to wait?
            </p>
            <Button variant="outline" onClick={onSwitchToSolo}>
              Switch to Solo Mode
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

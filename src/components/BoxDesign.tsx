import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface BoxDesignProps {
  photoData?: string
  onBack: () => void
  onContinue: (boxDesign: 'standard' | 'mystery', boxData?: {
    boxTitle?: string
    boxHint1?: string
    boxHint2?: string
    boxHiddenMessage?: string
  }) => void
}

export function BoxDesign({ photoData, onBack, onContinue }: BoxDesignProps) {
  const [boxStyle, setBoxStyle] = useState<'standard' | 'mystery'>('standard')
  const [boxTitle, setBoxTitle] = useState('')
  const [boxHint1, setBoxHint1] = useState('')
  const [boxHint2, setBoxHint2] = useState('')
  const [boxHiddenMessage, setBoxHiddenMessage] = useState('')

  const handleContinue = () => {
    if (boxStyle === 'mystery') {
      if (!boxTitle || !boxHint1 || !boxHint2) {
        toast.error('Please fill in the box title and both hints')
        return
      }
      onContinue('mystery', { boxTitle, boxHint1, boxHint2, boxHiddenMessage })
    } else {
      onContinue('standard')
    }
  }

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

          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl" style={{ fontFamily: 'var(--font-outfit)', letterSpacing: '-0.02em', lineHeight: '1.1' }}>
              Design Your Box
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground font-light leading-relaxed">
              Choose how your puzzle box will look when it arrives.
            </p>
          </div>

          <div className="mx-auto max-w-5xl grid md:grid-cols-2 gap-8">
            {/* Left side - Configuration */}
            <div className="space-y-8">
              <Card className="p-8 border-2 shadow-xl">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="box-style" className="text-lg font-semibold">Box Style</Label>
                      <p className="text-sm text-muted-foreground">
                        {boxStyle === 'standard' ? 'Photo on lid (traditional)' : 'Hints on lid (mystery)'}
                      </p>
                    </div>
                    <Switch
                      id="box-style"
                      checked={boxStyle === 'mystery'}
                      onCheckedChange={(checked) => setBoxStyle(checked ? 'mystery' : 'standard')}
                    />
                  </div>

                  {boxStyle === 'mystery' && (
                    <div className="space-y-6 pt-6 border-t border-border">
                      <div className="space-y-2">
                        <Label htmlFor="box-title">Box Title *</Label>
                        <Input
                          id="box-title"
                          value={boxTitle}
                          onChange={(e) => setBoxTitle(e.target.value)}
                          placeholder="e.g., 'Our First Year'"
                          maxLength={50}
                        />
                        <p className="text-xs text-muted-foreground">
                          {boxTitle.length} / 50 characters
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="hint1">Hint #1 *</Label>
                        <Input
                          id="hint1"
                          value={boxHint1}
                          onChange={(e) => setBoxHint1(e.target.value)}
                          placeholder="e.g., 'The location of our first date'"
                          maxLength={80}
                        />
                        <p className="text-xs text-muted-foreground">
                          {boxHint1.length} / 80 characters
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="hint2">Hint #2 *</Label>
                        <Input
                          id="hint2"
                          value={boxHint2}
                          onChange={(e) => setBoxHint2(e.target.value)}
                          placeholder="e.g., 'What you were wearing when we met'"
                          maxLength={80}
                        />
                        <p className="text-xs text-muted-foreground">
                          {boxHint2.length} / 80 characters
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="hidden-message">Hidden Message (Optional)</Label>
                        <Textarea
                          id="hidden-message"
                          value={boxHiddenMessage}
                          onChange={(e) => setBoxHiddenMessage(e.target.value)}
                          placeholder="A secret message revealed when opening the box..."
                          className="min-h-[100px]"
                          maxLength={200}
                        />
                        <p className="text-xs text-muted-foreground">
                          {boxHiddenMessage.length} / 200 characters
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Right side - Preview */}
            <div className="space-y-6">
              <Card className="p-8 border-2 shadow-xl">
                <h3 className="text-lg font-semibold mb-4">Preview</h3>
                <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-border">
                  {boxStyle === 'standard' && photoData ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={photoData} 
                        alt="Box preview" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10" />
                    </div>
                  ) : boxStyle === 'mystery' ? (
                    <div className="relative w-full h-full bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center p-8">
                      {/* Wood texture effect */}
                      <div className="absolute inset-0 opacity-30" 
                        style={{
                          backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
                        }}
                      />
                      <div className="relative text-center space-y-6 w-full">
                        {boxTitle && (
                          <p className="text-amber-100 font-serif text-2xl italic leading-relaxed" 
                            style={{ 
                              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                              fontFamily: 'Georgia, serif'
                            }}>
                            "{boxTitle}"
                          </p>
                        )}
                        {boxHint1 && (
                          <p className="text-amber-200/90 font-serif text-lg italic leading-relaxed" 
                            style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>
                            {boxHint1}
                          </p>
                        )}
                        {boxHint2 && (
                          <p className="text-amber-200/90 font-serif text-lg italic leading-relaxed" 
                            style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>
                            {boxHint2}
                          </p>
                        )}
                        {!boxTitle && !boxHint1 && !boxHint2 && (
                          <p className="text-amber-200/60 text-sm">
                            Your hints will appear here
                          </p>
                        )}
                        <div className="pt-4 text-amber-300/60 text-xs tracking-widest">
                          INTERLOCK
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <p className="text-muted-foreground">No photo uploaded</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <Button
              size="lg"
              onClick={handleContinue}
              className="px-8 py-6 text-base"
            >
              Continue to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

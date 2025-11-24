import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Image as ImageIcon, Palette } from '@phosphor-icons/react'
import { ShapeIcon } from './ShapeIcon'
import { ShapeType } from '@/lib/types'
import { DEFAULT_COLORS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface DesignChoiceProps {
  shapes: ShapeType[]
  onBack: () => void
  onContinue: (designType: 'photo' | 'colors', data: string | Partial<Record<ShapeType, string>>) => void
}

export function DesignChoice({ shapes, onBack, onContinue }: DesignChoiceProps) {
  const [designType, setDesignType] = useState<'photo' | 'colors'>('photo')
  const [photoData, setPhotoData] = useState<string>('')
  const [colorMap, setColorMap] = useState<Partial<Record<ShapeType, string>>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPhotoData(result)
        toast.success('Photo uploaded successfully!')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleColorSelect = (shape: ShapeType, color: string) => {
    setColorMap(prev => ({ ...prev, [shape]: color }))
  }

  const handleContinue = () => {
    if (designType === 'photo') {
      if (!photoData) {
        toast.error('Please upload a photo')
        return
      }
      onContinue('photo', photoData)
    } else {
      if (Object.keys(colorMap).length !== shapes.length) {
        toast.error('Please select a color for each shape')
        return
      }
      onContinue('colors', colorMap)
    }
  }

  const allColorsSelected = Object.keys(colorMap).length === shapes.length

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
              Bring Your Puzzle to Life
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground font-light leading-relaxed">
              Choose a cherished photo or pick colors that feel just right for each piece.
            </p>
          </div>

          <Tabs value={designType} onValueChange={(v) => setDesignType(v as 'photo' | 'colors')} className="mx-auto max-w-5xl">
            <TabsList className="grid w-full grid-cols-2 h-14">
              <TabsTrigger value="photo" className="gap-2 text-base">
                <ImageIcon size={20} />
                Upload Photo
              </TabsTrigger>
              <TabsTrigger value="colors" className="gap-2 text-base">
                <Palette size={20} />
                Choose Colors
              </TabsTrigger>
            </TabsList>

            <TabsContent value="photo" className="mt-8">
              <Card className="p-10 md:p-12 border-2 shadow-xl">
                <div className="space-y-8">
                  <div className="text-center">
                    <p className="mb-6 text-base text-muted-foreground leading-relaxed">
                      Share a photo that means something special to you. We'll use it to design your puzzle.
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-8 py-6 text-base"
                    >
                      <ImageIcon className="mr-2" size={20} />
                      Select Image
                    </Button>
                  </div>

                  {photoData && (
                    <div className="mx-auto max-w-md overflow-hidden rounded-2xl border-2 border-border shadow-xl">
                      <img src={photoData} alt="Uploaded preview" className="h-auto w-full" />
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="colors" className="mt-8">
              <Card className="p-10 md:p-12 border-2 shadow-xl">
                <div className="space-y-8">
                  <p className="text-center text-base text-muted-foreground leading-relaxed">
                    Select a color for each puzzle piece shape
                  </p>

                  <div className="grid gap-8 md:grid-cols-2">
                    {shapes.map((shape, index) => (
                      <div key={`${shape}-${index}`} className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-muted/30 shadow-sm">
                            <ShapeIcon shape={shape} className="h-10 w-10" />
                          </div>
                          <div className="flex-1">
                            <p className="text-base font-medium capitalize">{shape.replace(/-/g, ' ')}</p>
                            {colorMap[shape] && (
                              <div className="mt-1.5 flex items-center gap-2">
                                <div
                                  className="h-5 w-5 rounded-md border border-border shadow-sm"
                                  style={{ backgroundColor: colorMap[shape] }}
                                />
                                <span className="text-xs text-muted-foreground font-mono">{colorMap[shape]}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-10 gap-1.5">
                          {DEFAULT_COLORS.map(color => (
                            <button
                              key={color}
                              onClick={() => handleColorSelect(shape, color)}
                              className={cn(
                                "h-9 w-9 rounded-lg border-2 transition-all hover:scale-110 hover:shadow-md",
                                colorMap[shape] === color ? "border-foreground scale-110 shadow-md" : "border-transparent"
                              )}
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-12 flex justify-center">
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={designType === 'photo' ? !photoData : !allColorsSelected}
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

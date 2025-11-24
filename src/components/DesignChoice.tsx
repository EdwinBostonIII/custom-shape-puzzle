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
              Design Your Puzzle
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Choose between uploading a photo or selecting colors for each piece
            </p>
          </div>

          <Tabs value={designType} onValueChange={(v) => setDesignType(v as 'photo' | 'colors')} className="mx-auto max-w-5xl">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="photo" className="gap-2">
                <ImageIcon size={20} />
                Upload Photo
              </TabsTrigger>
              <TabsTrigger value="colors" className="gap-2">
                <Palette size={20} />
                Choose Colors
              </TabsTrigger>
            </TabsList>

            <TabsContent value="photo" className="mt-8">
              <Card className="p-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="mb-4 text-sm text-muted-foreground">
                      Upload a reference photo that will be used for your puzzle design
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
                    >
                      <ImageIcon className="mr-2" size={20} />
                      Select Image
                    </Button>
                  </div>

                  {photoData && (
                    <div className="mx-auto max-w-md overflow-hidden rounded-lg border-2 border-border">
                      <img src={photoData} alt="Uploaded preview" className="h-auto w-full" />
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="colors" className="mt-8">
              <Card className="p-8">
                <div className="space-y-6">
                  <p className="text-center text-sm text-muted-foreground">
                    Select a color for each puzzle piece shape
                  </p>

                  <div className="grid gap-6 md:grid-cols-2">
                    {shapes.map((shape, index) => (
                      <div key={`${shape}-${index}`} className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-border bg-muted/30">
                            <ShapeIcon shape={shape} className="h-8 w-8" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium capitalize">{shape}</p>
                            {colorMap[shape] && (
                              <div className="mt-1 flex items-center gap-2">
                                <div
                                  className="h-4 w-4 rounded-full border border-border"
                                  style={{ backgroundColor: colorMap[shape] }}
                                />
                                <span className="text-xs text-muted-foreground">{colorMap[shape]}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-10 gap-1">
                          {DEFAULT_COLORS.map(color => (
                            <button
                              key={color}
                              onClick={() => handleColorSelect(shape, color)}
                              className={cn(
                                "h-8 w-8 rounded-md border-2 transition-all hover:scale-110",
                                colorMap[shape] === color ? "border-foreground scale-110" : "border-transparent"
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

          <div className="mt-8 flex justify-center">
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={designType === 'photo' ? !photoData : !allColorsSelected}
            >
              Continue to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

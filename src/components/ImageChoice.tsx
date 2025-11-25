import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Palette, Upload, X, Check } from 'lucide-react'
import { ImageChoice as ImageChoiceType, ShapeType, ComfyColor } from '@/lib/types'
import { COMFY_PALETTE, getShapesForTier, PUZZLE_SHAPES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { ShapeIcon } from './ShapeIcon'

interface ImageChoiceProps {
  imageChoice: ImageChoiceType
  selectedShapes: ShapeType[]
  colorAssignments?: Partial<Record<ShapeType, string>>
  photoUrl?: string
  tier: 'essential' | 'classic' | 'grand' | 'heirloom'
  onImageChoiceChange: (choice: ImageChoiceType) => void
  onPhotoUpload: (url: string) => void
  onColorAssign: (assignments: Partial<Record<ShapeType, string>>) => void
  onContinue: () => void
  onBack: () => void
}

export function ImageChoice({
  imageChoice,
  selectedShapes,
  colorAssignments = {},
  photoUrl,
  tier,
  onImageChoiceChange,
  onPhotoUpload,
  onColorAssign,
  onContinue,
  onBack,
}: ImageChoiceProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedShape, setSelectedShape] = useState<ShapeType | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      onPhotoUpload(url)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleColorSelect = (color: ComfyColor) => {
    if (selectedShape) {
      onColorAssign({
        ...colorAssignments,
        [selectedShape]: color.hex,
      })
      // Auto-advance to next unassigned shape
      const unassignedShape = selectedShapes.find(
        s => s !== selectedShape && !colorAssignments[s]
      )
      setSelectedShape(unassignedShape || null)
    }
  }

  const allColorsAssigned = selectedShapes.every(s => colorAssignments[s])
  const canContinue = imageChoice === 'photo' ? !!photoUrl : allColorsAssigned

  return (
    <div className="min-h-screen bg-cream pt-4">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back button */}
        <button
          onClick={onBack}
          className="mb-6 text-charcoal/60 hover:text-charcoal transition-colors flex items-center gap-1"
        >
          ← Back to Shapes
        </button>
        {/* Intro */}
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
            How should your puzzle look?
          </h2>
          <p className="text-charcoal/70 max-w-xl mx-auto">
            Choose between a photo that captures your memories, or let us create 
            a beautiful color palette for your shapes.
          </p>
        </div>

        {/* Choice Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => onImageChoiceChange('photo')}
            className={cn(
              'flex items-center gap-2 px-6 py-3 rounded-full border-2 transition-all',
              imageChoice === 'photo'
                ? 'border-terracotta bg-terracotta/10 text-terracotta'
                : 'border-charcoal/20 text-charcoal/60 hover:border-charcoal/40'
            )}
          >
            <Camera className="w-5 h-5" />
            Upload Photo
          </button>
          <button
            onClick={() => onImageChoiceChange('comfy-colors')}
            className={cn(
              'flex items-center gap-2 px-6 py-3 rounded-full border-2 transition-all',
              imageChoice === 'comfy-colors'
                ? 'border-terracotta bg-terracotta/10 text-terracotta'
                : 'border-charcoal/20 text-charcoal/60 hover:border-charcoal/40'
            )}
          >
            <Palette className="w-5 h-5" />
            Comfy Colors
          </button>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {imageChoice === 'photo' ? (
            <motion.div
              key="photo"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-lg mx-auto"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileSelect(file)
                }}
              />

              {photoUrl ? (
                <div className="relative rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={photoUrl}
                    alt="Uploaded"
                    className="w-full aspect-square object-cover"
                  />
                  <button
                    onClick={() => onPhotoUpload('')}
                    className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                  >
                    <X className="w-4 h-4 text-charcoal" />
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 text-charcoal px-4 py-2 rounded-full text-sm font-medium shadow-md hover:bg-white transition-colors"
                  >
                    Choose Different Photo
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    'aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all',
                    dragOver
                      ? 'border-terracotta bg-terracotta/10'
                      : 'border-charcoal/20 hover:border-charcoal/40 bg-white'
                  )}
                >
                  <Upload className="w-12 h-12 text-charcoal/40 mb-4" />
                  <p className="text-charcoal font-medium mb-1">
                    Drop your photo here
                  </p>
                  <p className="text-charcoal/60 text-sm">
                    or click to browse
                  </p>
                  <p className="text-charcoal/40 text-xs mt-4">
                    JPG, PNG or WEBP up to 20MB
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="colors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* Shape Selection */}
              <div className="mb-8">
                <p className="text-center text-charcoal/70 mb-4">
                  Select a shape, then choose its color
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {selectedShapes.map((shapeId) => {
                    const shape = PUZZLE_SHAPES.find(s => s.id === shapeId)
                    const assignedColor = colorAssignments[shapeId]
                    
                    return (
                      <button
                        key={shapeId}
                        onClick={() => setSelectedShape(shapeId)}
                        className={cn(
                          'relative w-16 h-16 rounded-xl border-2 flex items-center justify-center transition-all',
                          selectedShape === shapeId
                            ? 'border-terracotta ring-2 ring-terracotta/30'
                            : assignedColor
                            ? 'border-transparent'
                            : 'border-charcoal/20 bg-white hover:border-charcoal/40'
                        )}
                        style={assignedColor ? { backgroundColor: assignedColor } : undefined}
                      >
                        <div className={cn(
                          'w-10 h-10',
                          assignedColor ? 'text-white/90' : 'text-charcoal'
                        )}>
                          <ShapeIcon shape={shapeId} />
                        </div>
                        {assignedColor && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-sage rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Color Palette */}
              <AnimatePresence>
                {selectedShape && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white rounded-2xl p-6 shadow-lg"
                  >
                    <p className="text-center text-charcoal mb-4">
                      Choose a color for <span className="font-medium">
                        {PUZZLE_SHAPES.find(s => s.id === selectedShape)?.name}
                      </span>
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {COMFY_PALETTE.map((color) => {
                        const isUsed = Object.values(colorAssignments).includes(color.hex)
                        const isCurrent = colorAssignments[selectedShape] === color.hex
                        
                        return (
                          <button
                            key={color.id}
                            onClick={() => !isUsed || isCurrent ? handleColorSelect(color) : null}
                            disabled={isUsed && !isCurrent}
                            className={cn(
                              'w-12 h-12 rounded-full transition-all relative',
                              isUsed && !isCurrent
                                ? 'opacity-30 cursor-not-allowed'
                                : 'hover:scale-110 cursor-pointer',
                              isCurrent && 'ring-2 ring-offset-2 ring-terracotta'
                            )}
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                          >
                            {isCurrent && (
                              <Check className="w-5 h-5 text-white absolute inset-0 m-auto" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                    <p className="text-center text-charcoal/50 text-xs mt-4">
                      Each color can only be used once
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Progress */}
              <div className="text-center mt-6 text-charcoal/60 text-sm">
                {Object.keys(colorAssignments).length} of {selectedShapes.length} shapes colored
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Continue Button */}
        <div className="flex justify-center mt-10">
          <motion.button
            whileHover={canContinue ? { scale: 1.02 } : undefined}
            whileTap={canContinue ? { scale: 0.98 } : undefined}
            onClick={onContinue}
            disabled={!canContinue}
            className={cn(
              'px-8 py-4 rounded-full font-medium text-lg transition-all',
              canContinue
                ? 'bg-terracotta text-white shadow-lg hover:shadow-xl'
                : 'bg-charcoal/20 text-charcoal/40 cursor-not-allowed'
            )}
          >
            Continue
          </motion.button>
        </div>
      </main>
    </div>
  )
}

export default ImageChoice

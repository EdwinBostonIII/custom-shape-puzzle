/**
 * Admin Dashboard
 * 
 * Administrative interface for managing puzzle templates, 
 * viewing production queue, and monitoring system health.
 */

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  Download,
  Trash,
  Play,
  Pause,
  Eye,
  Package,
  ChartBar,
  Gear,
  FileCode,
  Lightning,
} from '@phosphor-icons/react'
import { ShapeSilhouette } from './ShapeSilhouette'
import { 
  templateCache, 
  pregeneratePopular,
  POPULAR_COMBINATIONS,
  type PuzzleTemplate,
  type CacheStats,
  generateProductionSVG,
  generateProductionDXF,
} from '@/lib/shapes'
import { PUZZLE_SHAPES } from '@/lib/constants'
import { ShapeType } from '@/lib/types'
import { cn } from '@/lib/utils'

interface AdminDashboardProps {
  onClose: () => void
}

export function AdminDashboard({ onClose }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('templates')
  const [templates, setTemplates] = useState<PuzzleTemplate[]>([])
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null)
  const [isPreloading, setIsPreloading] = useState(false)
  const [preloadProgress, setPreloadProgress] = useState(0)
  const [selectedTemplate, setSelectedTemplate] = useState<PuzzleTemplate | null>(null)

  // Load templates and stats on mount
  useEffect(() => {
    refreshData()
  }, [])

  const refreshData = () => {
    setTemplates(templateCache.getAllTemplates())
    setCacheStats(templateCache.getStats())
  }

  const handlePregenerate = async () => {
    setIsPreloading(true)
    setPreloadProgress(0)
    
    try {
      await pregeneratePopular()
      setPreloadProgress(100)
      refreshData()
    } catch (error) {
      console.error('Error preloading:', error)
    } finally {
      setIsPreloading(false)
    }
  }

  const handleClearCache = () => {
    if (confirm('Are you sure you want to clear all cached templates?')) {
      templateCache.clear()
      refreshData()
    }
  }

  const handleExportTemplate = async (template: PuzzleTemplate, format: 'svg' | 'dxf') => {
    try {
      let content: string
      let filename: string
      let mimeType: string

      if (format === 'svg') {
        content = generateProductionSVG(template)
        filename = `puzzle-${template.id.slice(0, 8)}.svg`
        mimeType = 'image/svg+xml'
      } else {
        content = generateProductionDXF(template)
        filename = `puzzle-${template.id.slice(0, 8)}.dxf`
        mimeType = 'application/dxf'
      }

      // Create download
      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-charcoal text-white">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back
            </Button>
            <div className="h-6 w-px bg-white/20" />
            <h1 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-fraunces)' }}>
              Admin Dashboard
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {cacheStats && (
              <div className="flex gap-4 text-sm">
                <span className="text-white/60">
                  Templates: <span className="text-white font-medium">{cacheStats.totalTemplates}</span>
                </span>
                <span className="text-white/60">
                  Hit Rate: <span className="text-white font-medium">{(cacheStats.hitRate * 100).toFixed(1)}%</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-7xl mx-auto">
          <TabsList className="mb-6">
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Package size={18} />
              Templates
            </TabsTrigger>
            <TabsTrigger value="production" className="flex items-center gap-2">
              <FileCode size={18} />
              Production
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <ChartBar size={18} />
              Statistics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Gear size={18} />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            {/* Actions Bar */}
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={handlePregenerate}
                    disabled={isPreloading}
                    className="flex items-center gap-2"
                  >
                    <Lightning size={18} />
                    {isPreloading ? 'Generating...' : 'Pre-generate Popular'}
                  </Button>
                  
                  {isPreloading && (
                    <div className="flex items-center gap-2 w-48">
                      <Progress value={preloadProgress} className="h-2" />
                      <span className="text-sm text-charcoal/60">{preloadProgress.toFixed(0)}%</span>
                    </div>
                  )}
                </div>
                
                <Button
                  variant="destructive"
                  onClick={handleClearCache}
                  className="flex items-center gap-2"
                >
                  <Trash size={18} />
                  Clear Cache
                </Button>
              </div>
            </Card>

            {/* Templates Grid */}
            {templates.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-charcoal/60 mb-4">No templates cached yet.</p>
                <p className="text-sm text-charcoal/40">
                  Templates are created when customers complete their shape selection.
                </p>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {templates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onView={() => setSelectedTemplate(template)}
                    onExportSVG={() => handleExportTemplate(template, 'svg')}
                    onExportDXF={() => handleExportTemplate(template, 'dxf')}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Production Tab */}
          <TabsContent value="production" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-fraunces)' }}>
                Production Queue
              </h2>
              <p className="text-charcoal/60 mb-6">
                Manage the production queue for laser cutting. Export templates as SVG or DXF files.
              </p>
              
              {templates.length === 0 ? (
                <div className="text-center py-8 text-charcoal/40">
                  No templates in queue
                </div>
              ) : (
                <div className="space-y-4">
                  {templates.map((template, index) => (
                    <div 
                      key={template.id}
                      className="flex items-center justify-between p-4 bg-stone/30 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <span className="w-8 h-8 rounded-full bg-charcoal text-white flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium">Template {template.id.slice(0, 8)}</p>
                          <p className="text-sm text-charcoal/60">
                            {template.pieces.length} pieces • {template.shapes.length} shapes
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleExportTemplate(template, 'svg')}
                        >
                          <Download size={16} className="mr-1" />
                          SVG
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleExportTemplate(template, 'dxf')}
                        >
                          <Download size={16} className="mr-1" />
                          DXF
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-fraunces)' }}>
                Batch Export
              </h2>
              <p className="text-charcoal/60 mb-4">
                Export all templates at once for batch laser cutting.
              </p>
              <div className="flex gap-3">
                <Button 
                  disabled={templates.length === 0}
                  onClick={() => {
                    templates.forEach(t => handleExportTemplate(t, 'svg'))
                  }}
                >
                  Export All SVG
                </Button>
                <Button 
                  variant="outline"
                  disabled={templates.length === 0}
                  onClick={() => {
                    templates.forEach(t => handleExportTemplate(t, 'dxf'))
                  }}
                >
                  Export All DXF
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats" className="space-y-6">
            {cacheStats && (
              <div className="grid gap-4 md:grid-cols-4">
                <StatCard
                  label="Cached Templates"
                  value={cacheStats.totalTemplates}
                  icon={<Package size={24} />}
                />
                <StatCard
                  label="Total Pieces"
                  value={cacheStats.totalPieces}
                  icon={<FileCode size={24} />}
                />
                <StatCard
                  label="Cache Hits"
                  value={cacheStats.hitCount}
                  icon={<Lightning size={24} />}
                />
                <StatCard
                  label="Hit Rate"
                  value={`${(cacheStats.hitRate * 100).toFixed(1)}%`}
                  icon={<ChartBar size={24} />}
                />
              </div>
            )}
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-fraunces)' }}>
                Shape Usage
              </h2>
              <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-4">
                {PUZZLE_SHAPES.map((shape) => (
                  <div key={shape.id} className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 text-charcoal/70">
                      <ShapeSilhouette shapeId={shape.id} />
                    </div>
                    <p className="text-xs text-charcoal/60">{shape.name}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-fraunces)' }}>
                Template Generation Settings
              </h2>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Pieces per Puzzle</label>
                    <input 
                      type="number" 
                      defaultValue={150}
                      disabled
                      className="w-full px-3 py-2 border rounded-md bg-stone/30"
                    />
                    <p className="text-xs text-charcoal/50 mt-1">150 pieces (15 × 10 shapes)</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Cell Size (mm)</label>
                    <input 
                      type="number" 
                      defaultValue={50}
                      disabled
                      className="w-full px-3 py-2 border rounded-md bg-stone/30"
                    />
                    <p className="text-xs text-charcoal/50 mt-1">Size of each puzzle piece cell</p>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-fraunces)' }}>
                Popular Combinations
              </h2>
              <p className="text-charcoal/60 mb-4">
                Pre-defined shape combinations for occasion packs. These can be pre-generated for faster load times.
              </p>
              <div className="space-y-2">
                {['Anniversary', 'Best Friends', 'Family', 'Adventure'].map((pack, i) => (
                  <div key={pack} className="flex items-center justify-between p-3 bg-stone/30 rounded-lg">
                    <span className="font-medium">{pack}</span>
                    <Badge variant="outline">{10} shapes</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <TemplatePreviewModal
          template={selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
        />
      )}
    </div>
  )
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface TemplateCardProps {
  template: PuzzleTemplate
  onView: () => void
  onExportSVG: () => void
  onExportDXF: () => void
}

function TemplateCard({ template, onView, onExportSVG, onExportDXF }: TemplateCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-medium">Template</p>
          <p className="text-xs text-charcoal/50 font-mono">{template.id.slice(0, 12)}...</p>
        </div>
        <Badge variant="outline">{template.pieces.length} pcs</Badge>
      </div>
      
      {/* Shape preview grid */}
      <div className="grid grid-cols-5 gap-1 mb-4">
        {template.shapes.slice(0, 10).map((shapeId, i) => (
          <div key={i} className="aspect-square bg-stone/30 rounded p-1">
            <ShapeSilhouette shapeId={shapeId as ShapeType} className="text-charcoal/60" />
          </div>
        ))}
      </div>
      
      <div className="flex gap-2">
        <Button size="sm" variant="outline" className="flex-1" onClick={onView}>
          <Eye size={14} className="mr-1" />
          View
        </Button>
        <Button size="sm" variant="outline" onClick={onExportSVG}>
          SVG
        </Button>
        <Button size="sm" variant="outline" onClick={onExportDXF}>
          DXF
        </Button>
      </div>
    </Card>
  )
}

interface StatCardProps {
  label: string
  value: number | string
  icon: React.ReactNode
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className="text-terracotta">{icon}</div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-charcoal/60">{label}</p>
        </div>
      </div>
    </Card>
  )
}

interface TemplatePreviewModalProps {
  template: PuzzleTemplate
  onClose: () => void
}

function TemplatePreviewModal({ template, onClose }: TemplatePreviewModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-fraunces)' }}>
            Template Preview
          </h2>
          <Button variant="ghost" onClick={onClose}>×</Button>
        </div>
        
        <div className="p-6">
          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <div>
              <p className="text-sm text-charcoal/60">Template ID</p>
              <p className="font-mono text-sm">{template.id}</p>
            </div>
            <div>
              <p className="text-sm text-charcoal/60">Total Pieces</p>
              <p className="font-medium">{template.pieces.length}</p>
            </div>
          </div>
          
          <h3 className="font-semibold mb-3">Shapes Used</h3>
          <div className="grid grid-cols-5 gap-3 mb-6">
            {template.shapes.map((shapeId, i) => {
              const shape = PUZZLE_SHAPES.find(s => s.id === shapeId)
              return (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 bg-stone/30 rounded-lg p-2">
                    <ShapeSilhouette shapeId={shapeId as ShapeType} className="text-charcoal" />
                  </div>
                  <p className="text-xs">{shape?.name || shapeId}</p>
                </div>
              )
            })}
          </div>
          
          <h3 className="font-semibold mb-3">Piece Placement</h3>
          <div 
            className="border rounded-lg p-4 bg-stone/10 overflow-auto"
            style={{ maxHeight: '300px' }}
          >
            <div 
              className="grid gap-1"
              style={{ 
                gridTemplateColumns: `repeat(${template.gridWidth}, 1fr)`,
                width: `${template.gridWidth * 32}px`
              }}
            >
              {Array.from({ length: template.gridWidth * template.gridHeight }).map((_, i) => {
                const piece = template.pieces.find(
                  p => p.x === i % template.gridWidth && p.y === Math.floor(i / template.gridWidth)
                )
                // Extract base shape from variantId (format: "shapeId_variant")
                const baseShapeId = piece?.variantId.split('_')[0]
                return (
                  <div 
                    key={i}
                    className={cn(
                      "w-8 h-8 rounded flex items-center justify-center text-[8px]",
                      piece ? "bg-terracotta/20" : "bg-stone/30"
                    )}
                    title={piece ? `${baseShapeId} (${piece.variantId})` : 'Empty'}
                  >
                    {piece && baseShapeId && (
                      <ShapeSilhouette 
                        shapeId={baseShapeId as ShapeType} 
                        className="w-6 h-6 text-charcoal/70"
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

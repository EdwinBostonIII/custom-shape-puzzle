/**
 * SHAPE DEFINITIONS
 * 
 * This file contains the actual SVG paths and anchor points for all 40 shapes.
 * Each shape is defined as a silhouette that will become a physical puzzle piece.
 * 
 * All shapes use a 100x100 normalized coordinate system.
 * Anchor points are positioned along the perimeter where connectors attach.
 */

import { BaseShape, AnchorPoint } from './shapeSystem'

// ============================================================================
// HELPER: Calculate anchor points along a path
// ============================================================================

/**
 * Create evenly-spaced anchor points along the perimeter
 * For now, we manually define them based on shape geometry
 */
function createAnchors(points: Array<{ id: string; x: number; y: number; angle: number; edge: string }>): AnchorPoint[] {
  return points.map(p => ({
    id: p.id,
    x: p.x,
    y: p.y,
    angle: p.angle,
    edgeSegment: p.edge
  }))
}

// ============================================================================
// ANIMALS CATEGORY
// ============================================================================

export const dolphinShape: BaseShape = {
  id: 'dolphin',
  name: 'Dolphin',
  category: 'animals',
  // Simplified dolphin silhouette
  outlinePath: `
    M 15 50
    Q 10 35, 25 30
    Q 35 25, 45 20
    Q 55 15, 70 20
    Q 80 25, 85 35
    Q 90 45, 88 55
    Q 85 65, 75 70
    Q 65 75, 50 72
    Q 40 70, 35 65
    L 25 75
    Q 20 78, 18 72
    L 28 60
    Q 20 55, 15 50
    Z
  `,
  anchors: createAnchors([
    { id: 'nose', x: 15, y: 50, angle: 180, edge: 'front' },
    { id: 'top', x: 50, y: 18, angle: 270, edge: 'dorsal' },
    { id: 'tail-top', x: 88, y: 45, angle: 0, edge: 'tail' },
    { id: 'tail-bottom', x: 85, y: 65, angle: 45, edge: 'tail' },
    { id: 'belly', x: 50, y: 72, angle: 90, edge: 'bottom' },
    { id: 'fin', x: 22, y: 75, angle: 135, edge: 'flipper' },
  ]),
  boundingBox: { width: 78, height: 60, offsetX: 10, offsetY: 15 },
  area: 2800
}

export const butterflyShape: BaseShape = {
  id: 'butterfly',
  name: 'Butterfly',
  category: 'animals',
  outlinePath: `
    M 50 15
    Q 55 10, 65 12
    Q 80 15, 88 28
    Q 95 42, 85 55
    Q 75 65, 65 60
    L 55 52
    L 55 75
    Q 58 82, 62 88
    Q 55 90, 50 85
    Q 45 90, 38 88
    Q 42 82, 45 75
    L 45 52
    L 35 60
    Q 25 65, 15 55
    Q 5 42, 12 28
    Q 20 15, 35 12
    Q 45 10, 50 15
    Z
  `,
  anchors: createAnchors([
    { id: 'top', x: 50, y: 12, angle: 270, edge: 'head' },
    { id: 'right-wing-top', x: 88, y: 30, angle: 0, edge: 'right-wing' },
    { id: 'right-wing-bottom', x: 75, y: 62, angle: 90, edge: 'right-wing' },
    { id: 'bottom', x: 50, y: 88, angle: 90, edge: 'tail' },
    { id: 'left-wing-bottom', x: 25, y: 62, angle: 90, edge: 'left-wing' },
    { id: 'left-wing-top', x: 12, y: 30, angle: 180, edge: 'left-wing' },
  ]),
  boundingBox: { width: 90, height: 80, offsetX: 5, offsetY: 10 },
  area: 3200
}

export const catShape: BaseShape = {
  id: 'cat',
  name: 'Cat',
  category: 'animals',
  outlinePath: `
    M 35 8
    L 25 25
    Q 20 30, 20 40
    Q 18 55, 22 70
    Q 25 80, 28 88
    L 38 88
    Q 40 80, 42 78
    Q 50 82, 58 78
    Q 60 80, 62 88
    L 72 88
    Q 75 80, 78 70
    Q 82 55, 80 40
    Q 80 30, 75 25
    L 65 8
    Q 60 12, 55 14
    Q 50 16, 45 14
    Q 40 12, 35 8
    Z
    M 35 40
    Q 32 38, 32 42
    Q 32 46, 35 44
    Z
    M 65 40
    Q 62 38, 62 42
    Q 62 46, 65 44
    Z
  `,
  anchors: createAnchors([
    { id: 'left-ear', x: 30, y: 12, angle: 315, edge: 'ear' },
    { id: 'right-ear', x: 70, y: 12, angle: 45, edge: 'ear' },
    { id: 'left-side', x: 18, y: 50, angle: 180, edge: 'body' },
    { id: 'right-side', x: 82, y: 50, angle: 0, edge: 'body' },
    { id: 'left-foot', x: 32, y: 88, angle: 90, edge: 'feet' },
    { id: 'right-foot', x: 68, y: 88, angle: 90, edge: 'feet' },
  ]),
  boundingBox: { width: 65, height: 82, offsetX: 18, offsetY: 8 },
  area: 2900
}

export const turtleShape: BaseShape = {
  id: 'turtle',
  name: 'Turtle',
  category: 'animals',
  outlinePath: `
    M 20 55
    Q 15 55, 10 52
    Q 8 50, 10 48
    Q 15 45, 22 48
    Q 25 35, 40 28
    Q 55 22, 70 28
    Q 85 35, 88 50
    Q 90 55, 85 58
    L 82 65
    Q 88 68, 90 72
    Q 88 75, 82 72
    Q 78 70, 75 68
    Q 65 75, 50 78
    Q 35 75, 25 68
    Q 22 70, 18 72
    Q 12 75, 10 72
    Q 12 68, 18 65
    L 15 58
    Q 18 55, 20 55
    Z
  `,
  anchors: createAnchors([
    { id: 'head', x: 8, y: 50, angle: 180, edge: 'head' },
    { id: 'shell-top', x: 55, y: 25, angle: 270, edge: 'shell' },
    { id: 'shell-right', x: 88, y: 50, angle: 0, edge: 'shell' },
    { id: 'right-foot', x: 88, y: 72, angle: 90, edge: 'feet' },
    { id: 'bottom', x: 50, y: 78, angle: 90, edge: 'shell' },
    { id: 'left-foot', x: 12, y: 72, angle: 135, edge: 'feet' },
  ]),
  boundingBox: { width: 85, height: 55, offsetX: 8, offsetY: 22 },
  area: 2600
}

export const birdShape: BaseShape = {
  id: 'bird',
  name: 'Bird',
  category: 'animals',
  outlinePath: `
    M 10 50
    L 5 48
    L 15 45
    Q 25 35, 40 32
    Q 55 30, 65 35
    Q 75 40, 80 50
    Q 85 60, 80 70
    L 85 75
    L 75 72
    Q 65 78, 50 80
    Q 35 78, 25 72
    Q 18 65, 15 55
    L 10 50
    Z
  `,
  anchors: createAnchors([
    { id: 'beak', x: 5, y: 48, angle: 180, edge: 'head' },
    { id: 'top', x: 50, y: 30, angle: 270, edge: 'back' },
    { id: 'tail', x: 82, y: 72, angle: 45, edge: 'tail' },
    { id: 'belly', x: 50, y: 80, angle: 90, edge: 'bottom' },
    { id: 'chest', x: 20, y: 65, angle: 180, edge: 'front' },
  ]),
  boundingBox: { width: 82, height: 52, offsetX: 5, offsetY: 30 },
  area: 2200
}

export const fishShape: BaseShape = {
  id: 'fish',
  name: 'Fish',
  category: 'animals',
  outlinePath: `
    M 90 50
    L 78 40
    L 82 50
    L 78 60
    L 90 50
    M 78 50
    Q 70 35, 55 30
    Q 40 28, 28 35
    Q 18 42, 12 50
    Q 18 58, 28 65
    Q 40 72, 55 70
    Q 70 65, 78 50
    Z
    M 25 48
    Q 22 45, 22 50
    Q 22 55, 25 52
    Z
  `,
  anchors: createAnchors([
    { id: 'mouth', x: 12, y: 50, angle: 180, edge: 'head' },
    { id: 'top', x: 45, y: 28, angle: 270, edge: 'dorsal' },
    { id: 'tail-top', x: 88, y: 42, angle: 45, edge: 'tail' },
    { id: 'tail-bottom', x: 88, y: 58, angle: 315, edge: 'tail' },
    { id: 'bottom', x: 45, y: 72, angle: 90, edge: 'belly' },
  ]),
  boundingBox: { width: 82, height: 46, offsetX: 10, offsetY: 28 },
  area: 2100
}

// ============================================================================
// LOVE & CELEBRATION CATEGORY
// ============================================================================

export const heartShape: BaseShape = {
  id: 'heart',
  name: 'Heart',
  category: 'love',
  outlinePath: `
    M 50 88
    Q 20 65, 12 45
    Q 5 25, 25 15
    Q 40 10, 50 25
    Q 60 10, 75 15
    Q 95 25, 88 45
    Q 80 65, 50 88
    Z
  `,
  anchors: createAnchors([
    { id: 'top-left', x: 25, y: 15, angle: 315, edge: 'left-lobe' },
    { id: 'top-right', x: 75, y: 15, angle: 45, edge: 'right-lobe' },
    { id: 'left-side', x: 12, y: 45, angle: 180, edge: 'left' },
    { id: 'right-side', x: 88, y: 45, angle: 0, edge: 'right' },
    { id: 'bottom-left', x: 30, y: 72, angle: 225, edge: 'bottom' },
    { id: 'bottom-right', x: 70, y: 72, angle: 315, edge: 'bottom' },
  ]),
  boundingBox: { width: 88, height: 78, offsetX: 5, offsetY: 10 },
  area: 3000
}

export const starShape: BaseShape = {
  id: 'star',
  name: 'Star',
  category: 'celebration',
  outlinePath: `
    M 50 5
    L 61 35
    L 95 38
    L 70 58
    L 78 90
    L 50 72
    L 22 90
    L 30 58
    L 5 38
    L 39 35
    Z
  `,
  anchors: createAnchors([
    { id: 'top', x: 50, y: 5, angle: 270, edge: 'point-1' },
    { id: 'top-right', x: 95, y: 38, angle: 0, edge: 'point-2' },
    { id: 'bottom-right', x: 78, y: 90, angle: 45, edge: 'point-3' },
    { id: 'bottom-left', x: 22, y: 90, angle: 135, edge: 'point-4' },
    { id: 'top-left', x: 5, y: 38, angle: 180, edge: 'point-5' },
  ]),
  boundingBox: { width: 92, height: 87, offsetX: 4, offsetY: 5 },
  area: 2800
}

export const balloonShape: BaseShape = {
  id: 'balloon',
  name: 'Balloon',
  category: 'celebration',
  outlinePath: `
    M 50 8
    Q 25 8, 18 30
    Q 12 50, 20 68
    Q 30 82, 50 85
    Q 70 82, 80 68
    Q 88 50, 82 30
    Q 75 8, 50 8
    Z
    M 50 85
    L 48 92
    Q 50 94, 52 92
    L 50 85
    Z
  `,
  anchors: createAnchors([
    { id: 'top', x: 50, y: 8, angle: 270, edge: 'top' },
    { id: 'right', x: 85, y: 45, angle: 0, edge: 'right' },
    { id: 'bottom-right', x: 70, y: 78, angle: 45, edge: 'bottom' },
    { id: 'bottom-left', x: 30, y: 78, angle: 135, edge: 'bottom' },
    { id: 'left', x: 15, y: 45, angle: 180, edge: 'left' },
  ]),
  boundingBox: { width: 75, height: 88, offsetX: 12, offsetY: 8 },
  area: 3100
}

export const giftShape: BaseShape = {
  id: 'gift',
  name: 'Gift Box',
  category: 'celebration',
  outlinePath: `
    M 15 35
    L 85 35
    L 85 88
    L 15 88
    Z
    M 15 35
    L 15 22
    L 45 22
    L 50 15
    L 55 22
    L 85 22
    L 85 35
    Z
    M 45 35
    L 45 88
    M 55 35
    L 55 88
  `,
  anchors: createAnchors([
    { id: 'top-left', x: 30, y: 18, angle: 270, edge: 'ribbon' },
    { id: 'top-right', x: 70, y: 18, angle: 270, edge: 'ribbon' },
    { id: 'left', x: 15, y: 60, angle: 180, edge: 'left' },
    { id: 'right', x: 85, y: 60, angle: 0, edge: 'right' },
    { id: 'bottom-left', x: 30, y: 88, angle: 90, edge: 'bottom' },
    { id: 'bottom-right', x: 70, y: 88, angle: 90, edge: 'bottom' },
  ]),
  boundingBox: { width: 72, height: 75, offsetX: 14, offsetY: 14 },
  area: 3400
}

// ============================================================================
// NATURE CATEGORY
// ============================================================================

export const treeShape: BaseShape = {
  id: 'tree',
  name: 'Tree',
  category: 'nature',
  outlinePath: `
    M 50 5
    Q 25 25, 20 40
    Q 15 55, 30 60
    Q 22 65, 22 75
    Q 22 85, 40 85
    L 40 95
    L 60 95
    L 60 85
    Q 78 85, 78 75
    Q 78 65, 70 60
    Q 85 55, 80 40
    Q 75 25, 50 5
    Z
  `,
  anchors: createAnchors([
    { id: 'top', x: 50, y: 5, angle: 270, edge: 'crown' },
    { id: 'left', x: 18, y: 55, angle: 180, edge: 'left' },
    { id: 'right', x: 82, y: 55, angle: 0, edge: 'right' },
    { id: 'left-bottom', x: 25, y: 80, angle: 180, edge: 'foliage' },
    { id: 'right-bottom', x: 75, y: 80, angle: 0, edge: 'foliage' },
    { id: 'trunk', x: 50, y: 95, angle: 90, edge: 'trunk' },
  ]),
  boundingBox: { width: 68, height: 92, offsetX: 16, offsetY: 5 },
  area: 2700
}

export const flowerShape: BaseShape = {
  id: 'flower',
  name: 'Flower',
  category: 'nature',
  outlinePath: `
    M 50 10
    Q 60 5, 65 15
    Q 70 5, 80 15
    Q 90 25, 82 35
    Q 95 40, 88 52
    Q 95 65, 82 70
    Q 90 80, 78 85
    Q 80 95, 65 90
    Q 60 95, 50 90
    Q 40 95, 35 90
    Q 20 95, 22 85
    Q 10 80, 18 70
    Q 5 65, 12 52
    Q 5 40, 18 35
    Q 10 25, 20 15
    Q 30 5, 35 15
    Q 40 5, 50 10
    Z
    M 50 35
    Q 40 35, 40 50
    Q 40 65, 50 65
    Q 60 65, 60 50
    Q 60 35, 50 35
    Z
  `,
  anchors: createAnchors([
    { id: 'top', x: 50, y: 8, angle: 270, edge: 'petal-top' },
    { id: 'top-right', x: 85, y: 30, angle: 315, edge: 'petal-tr' },
    { id: 'right', x: 92, y: 52, angle: 0, edge: 'petal-right' },
    { id: 'bottom-right', x: 80, y: 82, angle: 45, edge: 'petal-br' },
    { id: 'bottom', x: 50, y: 92, angle: 90, edge: 'petal-bottom' },
    { id: 'bottom-left', x: 20, y: 82, angle: 135, edge: 'petal-bl' },
    { id: 'left', x: 8, y: 52, angle: 180, edge: 'petal-left' },
    { id: 'top-left', x: 15, y: 30, angle: 225, edge: 'petal-tl' },
  ]),
  boundingBox: { width: 90, height: 90, offsetX: 5, offsetY: 5 },
  area: 3500
}

export const sunShape: BaseShape = {
  id: 'sun',
  name: 'Sun',
  category: 'nature',
  outlinePath: `
    M 50 5 L 55 20 L 50 25 L 45 20 Z
    M 80 15 L 75 28 L 68 25 L 72 18 Z
    M 95 50 L 80 55 L 75 50 L 80 45 Z
    M 80 85 L 72 82 L 68 75 L 75 72 Z
    M 50 95 L 45 80 L 50 75 L 55 80 Z
    M 20 85 L 28 82 L 32 75 L 25 72 Z
    M 5 50 L 20 45 L 25 50 L 20 55 Z
    M 20 15 L 25 28 L 32 25 L 28 18 Z
    M 50 25
    Q 70 25, 75 50
    Q 75 75, 50 75
    Q 25 75, 25 50
    Q 25 25, 50 25
    Z
  `,
  anchors: createAnchors([
    { id: 'ray-top', x: 50, y: 5, angle: 270, edge: 'ray' },
    { id: 'ray-tr', x: 80, y: 15, angle: 315, edge: 'ray' },
    { id: 'ray-right', x: 95, y: 50, angle: 0, edge: 'ray' },
    { id: 'ray-br', x: 80, y: 85, angle: 45, edge: 'ray' },
    { id: 'ray-bottom', x: 50, y: 95, angle: 90, edge: 'ray' },
    { id: 'ray-bl', x: 20, y: 85, angle: 135, edge: 'ray' },
    { id: 'ray-left', x: 5, y: 50, angle: 180, edge: 'ray' },
    { id: 'ray-tl', x: 20, y: 15, angle: 225, edge: 'ray' },
  ]),
  boundingBox: { width: 92, height: 92, offsetX: 4, offsetY: 4 },
  area: 3200
}

export const leafShape: BaseShape = {
  id: 'leaf',
  name: 'Leaf',
  category: 'nature',
  outlinePath: `
    M 50 8
    Q 75 15, 88 35
    Q 95 55, 85 72
    Q 70 88, 50 92
    Q 30 88, 15 72
    Q 5 55, 12 35
    Q 25 15, 50 8
    Z
    M 50 20
    L 50 85
    M 35 45
    L 50 55
    M 65 45
    L 50 55
    M 30 65
    L 50 72
    M 70 65
    L 50 72
  `,
  anchors: createAnchors([
    { id: 'top', x: 50, y: 8, angle: 270, edge: 'tip' },
    { id: 'right-upper', x: 88, y: 35, angle: 0, edge: 'right' },
    { id: 'right-lower', x: 78, y: 78, angle: 45, edge: 'right' },
    { id: 'bottom', x: 50, y: 92, angle: 90, edge: 'stem' },
    { id: 'left-lower', x: 22, y: 78, angle: 135, edge: 'left' },
    { id: 'left-upper', x: 12, y: 35, angle: 180, edge: 'left' },
  ]),
  boundingBox: { width: 88, height: 86, offsetX: 6, offsetY: 6 },
  area: 2900
}

export const mountainShape: BaseShape = {
  id: 'mountain',
  name: 'Mountain',
  category: 'nature',
  outlinePath: `
    M 5 85
    L 35 25
    L 45 40
    L 55 20
    L 95 85
    Z
    M 55 20
    L 65 35
    L 75 28
    L 95 85
  `,
  anchors: createAnchors([
    { id: 'left-base', x: 5, y: 85, angle: 180, edge: 'base' },
    { id: 'left-slope', x: 25, y: 48, angle: 315, edge: 'left-slope' },
    { id: 'peak', x: 55, y: 20, angle: 270, edge: 'peak' },
    { id: 'right-slope', x: 80, y: 48, angle: 45, edge: 'right-slope' },
    { id: 'right-base', x: 95, y: 85, angle: 0, edge: 'base' },
    { id: 'bottom', x: 50, y: 85, angle: 90, edge: 'base' },
  ]),
  boundingBox: { width: 92, height: 67, offsetX: 4, offsetY: 18 },
  area: 2400
}

// ============================================================================
// HOBBIES & INTERESTS CATEGORY
// ============================================================================

export const musicNoteShape: BaseShape = {
  id: 'musicNote',
  name: 'Music Note',
  category: 'hobbies',
  outlinePath: `
    M 30 75
    Q 15 75, 15 85
    Q 15 95, 30 95
    Q 45 95, 45 85
    Q 45 78, 40 75
    L 40 20
    L 75 10
    L 75 60
    Q 60 60, 60 70
    Q 60 80, 75 80
    Q 90 80, 90 70
    Q 90 62, 85 58
    L 85 5
    L 40 15
    L 40 75
    Z
  `,
  anchors: createAnchors([
    { id: 'top-left', x: 40, y: 18, angle: 270, edge: 'stem' },
    { id: 'top-right', x: 85, y: 5, angle: 270, edge: 'flag' },
    { id: 'right', x: 90, y: 70, angle: 0, edge: 'right-note' },
    { id: 'bottom-right', x: 75, y: 80, angle: 90, edge: 'right-note' },
    { id: 'bottom-left', x: 30, y: 95, angle: 90, edge: 'left-note' },
    { id: 'left', x: 15, y: 85, angle: 180, edge: 'left-note' },
  ]),
  boundingBox: { width: 78, height: 92, offsetX: 14, offsetY: 4 },
  area: 2300
}

export const soccerBallShape: BaseShape = {
  id: 'soccerBall',
  name: 'Soccer Ball',
  category: 'hobbies',
  outlinePath: `
    M 50 5
    Q 80 5, 92 35
    Q 100 60, 85 82
    Q 65 100, 35 95
    Q 10 88, 5 60
    Q 2 35, 20 15
    Q 40 2, 50 5
    Z
    M 50 20
    L 65 35 L 55 50 L 35 45 L 38 28 Z
    M 75 55
    L 85 45 L 90 60 L 80 72 L 68 62 Z
    M 30 70
    L 22 58 L 32 48 L 45 55 L 40 68 Z
    M 58 80
    L 50 68 L 62 65 L 72 78 L 60 88 Z
  `,
  anchors: createAnchors([
    { id: 'top', x: 50, y: 5, angle: 270, edge: 'top' },
    { id: 'top-right', x: 88, y: 25, angle: 315, edge: 'upper-right' },
    { id: 'right', x: 95, y: 55, angle: 0, edge: 'right' },
    { id: 'bottom-right', x: 75, y: 90, angle: 45, edge: 'lower-right' },
    { id: 'bottom', x: 45, y: 95, angle: 90, edge: 'bottom' },
    { id: 'bottom-left', x: 15, y: 80, angle: 135, edge: 'lower-left' },
    { id: 'left', x: 5, y: 50, angle: 180, edge: 'left' },
    { id: 'top-left', x: 20, y: 18, angle: 225, edge: 'upper-left' },
  ]),
  boundingBox: { width: 96, height: 94, offsetX: 2, offsetY: 3 },
  area: 3600
}

export const cameraShape: BaseShape = {
  id: 'camera',
  name: 'Camera',
  category: 'hobbies',
  outlinePath: `
    M 10 30
    L 30 30
    L 35 20
    L 65 20
    L 70 30
    L 90 30
    L 90 75
    L 10 75
    Z
    M 50 35
    Q 65 35, 65 52
    Q 65 68, 50 68
    Q 35 68, 35 52
    Q 35 35, 50 35
    Z
    M 50 42
    Q 58 42, 58 52
    Q 58 62, 50 62
    Q 42 62, 42 52
    Q 42 42, 50 42
    Z
    M 78 38
    L 85 38
    L 85 45
    L 78 45
    Z
  `,
  anchors: createAnchors([
    { id: 'top-left', x: 35, y: 20, angle: 270, edge: 'viewfinder' },
    { id: 'top-right', x: 65, y: 20, angle: 270, edge: 'viewfinder' },
    { id: 'left', x: 10, y: 52, angle: 180, edge: 'body' },
    { id: 'right', x: 90, y: 52, angle: 0, edge: 'body' },
    { id: 'bottom-left', x: 25, y: 75, angle: 90, edge: 'base' },
    { id: 'bottom-right', x: 75, y: 75, angle: 90, edge: 'base' },
  ]),
  boundingBox: { width: 82, height: 57, offsetX: 9, offsetY: 19 },
  area: 3000
}

export const bookShape: BaseShape = {
  id: 'book',
  name: 'Book',
  category: 'hobbies',
  outlinePath: `
    M 15 15
    L 85 15
    Q 88 15, 88 18
    L 88 85
    Q 88 88, 85 88
    L 15 88
    Q 12 88, 12 85
    L 12 18
    Q 12 15, 15 15
    Z
    M 50 15
    L 50 88
    M 18 25
    L 45 25
    M 18 35
    L 45 35
    M 55 25
    L 82 25
    M 55 35
    L 82 35
  `,
  anchors: createAnchors([
    { id: 'top-left', x: 30, y: 15, angle: 270, edge: 'top' },
    { id: 'top-right', x: 70, y: 15, angle: 270, edge: 'top' },
    { id: 'left', x: 12, y: 52, angle: 180, edge: 'spine' },
    { id: 'right', x: 88, y: 52, angle: 0, edge: 'edge' },
    { id: 'bottom-left', x: 30, y: 88, angle: 90, edge: 'bottom' },
    { id: 'bottom-right', x: 70, y: 88, angle: 90, edge: 'bottom' },
  ]),
  boundingBox: { width: 78, height: 75, offsetX: 11, offsetY: 14 },
  area: 3200
}

export const paletteShape: BaseShape = {
  id: 'palette',
  name: 'Palette',
  category: 'hobbies',
  outlinePath: `
    M 50 15
    Q 80 15, 90 40
    Q 95 60, 85 75
    Q 70 90, 45 90
    Q 20 90, 12 70
    Q 5 50, 15 32
    Q 28 15, 50 15
    Z
    M 25 45
    Q 20 45, 20 50
    Q 20 55, 25 55
    Q 30 55, 30 50
    Q 30 45, 25 45
    Z
    M 40 30
    Q 35 30, 35 35
    Q 35 40, 40 40
    Q 45 40, 45 35
    Q 45 30, 40 30
    Z
    M 60 28
    Q 55 28, 55 33
    Q 55 38, 60 38
    Q 65 38, 65 33
    Q 65 28, 60 28
    Z
    M 75 45
    Q 70 45, 70 50
    Q 70 55, 75 55
    Q 80 55, 80 50
    Q 80 45, 75 45
    Z
    M 70 70
    Q 60 70, 60 78
    Q 60 86, 70 86
    Q 80 86, 80 78
    Q 80 70, 70 70
    Z
  `,
  anchors: createAnchors([
    { id: 'top', x: 50, y: 15, angle: 270, edge: 'top' },
    { id: 'right', x: 92, y: 50, angle: 0, edge: 'right' },
    { id: 'bottom-right', x: 70, y: 88, angle: 90, edge: 'bottom' },
    { id: 'bottom-left', x: 30, y: 88, angle: 90, edge: 'bottom' },
    { id: 'left', x: 8, y: 55, angle: 180, edge: 'left' },
    { id: 'top-left', x: 22, y: 25, angle: 225, edge: 'upper-left' },
  ]),
  boundingBox: { width: 88, height: 77, offsetX: 6, offsetY: 13 },
  area: 3400
}

// ============================================================================
// TRAVEL & ADVENTURE CATEGORY
// ============================================================================

export const airplaneShape: BaseShape = {
  id: 'airplane',
  name: 'Airplane',
  category: 'travel',
  outlinePath: `
    M 8 50
    L 25 48
    L 35 25
    L 45 25
    L 42 45
    L 75 42
    L 85 22
    L 92 25
    L 85 48
    L 95 50
    L 85 52
    L 92 75
    L 85 78
    L 75 58
    L 42 55
    L 45 75
    L 35 75
    L 25 52
    L 8 50
    Z
  `,
  anchors: createAnchors([
    { id: 'nose', x: 95, y: 50, angle: 0, edge: 'nose' },
    { id: 'top-wing', x: 40, y: 25, angle: 270, edge: 'wing' },
    { id: 'top-tail', x: 88, y: 25, angle: 315, edge: 'tail' },
    { id: 'bottom-tail', x: 88, y: 75, angle: 45, edge: 'tail' },
    { id: 'bottom-wing', x: 40, y: 75, angle: 90, edge: 'wing' },
    { id: 'back', x: 8, y: 50, angle: 180, edge: 'back' },
  ]),
  boundingBox: { width: 89, height: 55, offsetX: 6, offsetY: 22 },
  area: 2500
}

export const carShape: BaseShape = {
  id: 'car',
  name: 'Car',
  category: 'travel',
  outlinePath: `
    M 10 55
    L 10 65
    Q 10 70, 15 70
    L 22 70
    Q 22 78, 30 78
    Q 38 78, 38 70
    L 62 70
    Q 62 78, 70 78
    Q 78 78, 78 70
    L 85 70
    Q 90 70, 90 65
    L 90 55
    Q 90 50, 85 48
    L 75 45
    L 68 30
    Q 65 25, 58 25
    L 35 25
    Q 28 25, 25 32
    L 20 45
    L 15 48
    Q 10 50, 10 55
    Z
    M 25 50
    L 35 32
    L 48 32
    L 48 50
    Z
    M 52 50
    L 52 32
    L 65 32
    L 72 50
    Z
  `,
  anchors: createAnchors([
    { id: 'hood', x: 20, y: 35, angle: 315, edge: 'front' },
    { id: 'roof', x: 50, y: 25, angle: 270, edge: 'roof' },
    { id: 'trunk', x: 75, y: 38, angle: 45, edge: 'back' },
    { id: 'right', x: 90, y: 58, angle: 0, edge: 'side' },
    { id: 'right-wheel', x: 70, y: 78, angle: 90, edge: 'wheel' },
    { id: 'left-wheel', x: 30, y: 78, angle: 90, edge: 'wheel' },
    { id: 'left', x: 10, y: 58, angle: 180, edge: 'side' },
  ]),
  boundingBox: { width: 82, height: 55, offsetX: 9, offsetY: 24 },
  area: 2800
}

export const compassShape: BaseShape = {
  id: 'compass',
  name: 'Compass',
  category: 'travel',
  outlinePath: `
    M 50 5
    Q 85 5, 92 40
    Q 98 75, 65 92
    Q 35 98, 12 70
    Q -2 40, 15 18
    Q 30 2, 50 5
    Z
    M 50 20
    L 55 45
    L 80 50
    L 55 55
    L 50 80
    L 45 55
    L 20 50
    L 45 45
    Z
    M 50 10
    L 52 18
    L 50 15
    L 48 18
    Z
  `,
  anchors: createAnchors([
    { id: 'north', x: 50, y: 5, angle: 270, edge: 'north' },
    { id: 'east', x: 95, y: 50, angle: 0, edge: 'east' },
    { id: 'south', x: 50, y: 95, angle: 90, edge: 'south' },
    { id: 'west', x: 5, y: 50, angle: 180, edge: 'west' },
    { id: 'ne', x: 82, y: 20, angle: 315, edge: 'ne' },
    { id: 'se', x: 82, y: 80, angle: 45, edge: 'se' },
    { id: 'sw', x: 18, y: 80, angle: 135, edge: 'sw' },
    { id: 'nw', x: 18, y: 20, angle: 225, edge: 'nw' },
  ]),
  boundingBox: { width: 94, height: 94, offsetX: 3, offsetY: 3 },
  area: 3500
}

export const anchorShape: BaseShape = {
  id: 'anchor',
  name: 'Anchor',
  category: 'travel',
  outlinePath: `
    M 50 8
    Q 42 8, 42 16
    Q 42 24, 50 24
    Q 58 24, 58 16
    Q 58 8, 50 8
    Z
    M 47 24
    L 47 38
    L 25 38
    L 25 45
    L 47 45
    L 47 75
    Q 30 72, 18 60
    L 10 68
    L 22 78
    Q 35 88, 50 90
    Q 65 88, 78 78
    L 90 68
    L 82 60
    Q 70 72, 53 75
    L 53 45
    L 75 45
    L 75 38
    L 53 38
    L 53 24
    Z
  `,
  anchors: createAnchors([
    { id: 'top', x: 50, y: 8, angle: 270, edge: 'ring' },
    { id: 'left-arm', x: 25, y: 42, angle: 180, edge: 'crossbar' },
    { id: 'right-arm', x: 75, y: 42, angle: 0, edge: 'crossbar' },
    { id: 'left-fluke', x: 10, y: 68, angle: 180, edge: 'fluke' },
    { id: 'right-fluke', x: 90, y: 68, angle: 0, edge: 'fluke' },
    { id: 'bottom', x: 50, y: 90, angle: 90, edge: 'crown' },
  ]),
  boundingBox: { width: 82, height: 84, offsetX: 9, offsetY: 7 },
  area: 2200
}

// ============================================================================
// ADDITIONAL SHAPES - FLORA
// ============================================================================

export const roseShape: BaseShape = {
  id: 'rose',
  name: 'Rose',
  category: 'flora',
  outlinePath: `
    M 50 10
    Q 60 15, 65 25
    Q 75 20, 80 30
    Q 90 35, 85 48
    Q 95 55, 85 65
    Q 80 75, 65 75
    L 55 85
    L 55 95
    L 45 95
    L 45 85
    L 35 75
    Q 20 75, 15 65
    Q 5 55, 15 48
    Q 10 35, 20 30
    Q 25 20, 35 25
    Q 40 15, 50 10
    Z
  `,
  anchors: createAnchors([
    { id: 'top', x: 50, y: 10, angle: 270, edge: 'petal' },
    { id: 'right', x: 90, y: 50, angle: 0, edge: 'petal' },
    { id: 'bottom-right', x: 65, y: 75, angle: 45, edge: 'petal' },
    { id: 'stem', x: 50, y: 95, angle: 90, edge: 'stem' },
    { id: 'bottom-left', x: 35, y: 75, angle: 135, edge: 'petal' },
    { id: 'left', x: 10, y: 50, angle: 180, edge: 'petal' },
  ]),
  boundingBox: { width: 85, height: 87, offsetX: 8, offsetY: 8 },
  area: 3100
}

export const lotusShape: BaseShape = {
  id: 'lotus',
  name: 'Lotus',
  category: 'flora',
  outlinePath: `
    M 50 15
    Q 55 8, 60 15
    Q 65 10, 68 20
    Q 80 15, 82 30
    Q 95 35, 88 50
    Q 92 60, 80 65
    Q 75 75, 60 78
    L 50 85
    L 40 78
    Q 25 75, 20 65
    Q 8 60, 12 50
    Q 5 35, 18 30
    Q 20 15, 32 20
    Q 35 10, 40 15
    Q 45 8, 50 15
    Z
  `,
  anchors: createAnchors([
    { id: 'top', x: 50, y: 10, angle: 270, edge: 'center' },
    { id: 'top-right', x: 75, y: 22, angle: 315, edge: 'petal' },
    { id: 'right', x: 90, y: 50, angle: 0, edge: 'petal' },
    { id: 'bottom', x: 50, y: 85, angle: 90, edge: 'base' },
    { id: 'left', x: 10, y: 50, angle: 180, edge: 'petal' },
    { id: 'top-left', x: 25, y: 22, angle: 225, edge: 'petal' },
  ]),
  boundingBox: { width: 88, height: 78, offsetX: 6, offsetY: 8 },
  area: 2800
}

export const sunflowerShape: BaseShape = {
  id: 'sunflower',
  name: 'Sunflower',
  category: 'flora',
  outlinePath: `
    M 50 5
    L 55 18 L 62 8 L 65 22 L 75 15 L 75 28
    L 88 25 L 82 38 L 95 42 L 85 52
    L 95 62 L 82 65 L 88 78 L 75 75
    L 75 88 L 62 82 L 65 95 L 55 85
    L 50 95 L 45 85 L 35 95 L 38 82
    L 25 88 L 25 75 L 12 78 L 18 65
    L 5 62 L 15 52 L 5 42 L 18 38
    L 12 25 L 25 28 L 25 15 L 35 22
    L 38 8 L 45 18 L 50 5
    Z
    M 50 35
    Q 65 35, 65 50
    Q 65 65, 50 65
    Q 35 65, 35 50
    Q 35 35, 50 35
    Z
  `,
  anchors: createAnchors([
    { id: 'top', x: 50, y: 5, angle: 270, edge: 'petal' },
    { id: 'top-right', x: 88, y: 25, angle: 315, edge: 'petal' },
    { id: 'right', x: 95, y: 52, angle: 0, edge: 'petal' },
    { id: 'bottom-right', x: 88, y: 78, angle: 45, edge: 'petal' },
    { id: 'bottom', x: 50, y: 95, angle: 90, edge: 'petal' },
    { id: 'bottom-left', x: 12, y: 78, angle: 135, edge: 'petal' },
    { id: 'left', x: 5, y: 52, angle: 180, edge: 'petal' },
    { id: 'top-left', x: 12, y: 25, angle: 225, edge: 'petal' },
  ]),
  boundingBox: { width: 92, height: 92, offsetX: 4, offsetY: 4 },
  area: 3800
}

// ============================================================================
// ADDITIONAL SHAPES - FAUNA
// ============================================================================

export const foxShape: BaseShape = {
  id: 'fox',
  name: 'Fox',
  category: 'fauna',
  outlinePath: `
    M 20 20
    L 30 5
    L 40 25
    L 50 15
    L 60 25
    L 70 5
    L 80 20
    Q 90 30, 88 45
    Q 95 50, 95 55
    Q 90 58, 85 55
    Q 85 70, 75 80
    L 65 90
    L 50 85
    L 35 90
    L 25 80
    Q 15 70, 15 55
    Q 10 58, 5 55
    Q 5 50, 12 45
    Q 10 30, 20 20
    Z
    M 35 45
    Q 32 42, 32 48
    Q 35 52, 38 48
    Z
    M 65 45
    Q 62 42, 62 48
    Q 65 52, 68 48
    Z
  `,
  anchors: createAnchors([
    { id: 'left-ear', x: 30, y: 8, angle: 315, edge: 'ear' },
    { id: 'right-ear', x: 70, y: 8, angle: 45, edge: 'ear' },
    { id: 'right-cheek', x: 92, y: 52, angle: 0, edge: 'face' },
    { id: 'right-body', x: 75, y: 80, angle: 45, edge: 'body' },
    { id: 'chin', x: 50, y: 88, angle: 90, edge: 'chin' },
    { id: 'left-body', x: 25, y: 80, angle: 135, edge: 'body' },
    { id: 'left-cheek', x: 8, y: 52, angle: 180, edge: 'face' },
  ]),
  boundingBox: { width: 92, height: 87, offsetX: 4, offsetY: 4 },
  area: 3200
}

export const dogShape: BaseShape = {
  id: 'dog',
  name: 'Dog',
  category: 'fauna',
  outlinePath: `
    M 25 25
    Q 15 20, 12 30
    Q 8 40, 15 45
    Q 12 55, 18 65
    Q 15 75, 22 85
    L 32 85
    Q 35 78, 40 78
    Q 50 80, 60 78
    Q 65 78, 68 85
    L 78 85
    Q 85 75, 82 65
    Q 88 55, 85 45
    Q 92 40, 88 30
    Q 85 20, 75 25
    Q 70 15, 60 18
    Q 50 12, 40 18
    Q 30 15, 25 25
    Z
    M 35 42
    Q 32 40, 32 45
    Q 35 48, 38 45
    Z
    M 65 42
    Q 62 40, 62 45
    Q 65 48, 68 45
    Z
    M 50 55
    Q 45 52, 45 58
    Q 50 62, 55 58
    Q 55 52, 50 55
    Z
  `,
  anchors: createAnchors([
    { id: 'left-ear', x: 12, y: 32, angle: 225, edge: 'ear' },
    { id: 'top', x: 50, y: 14, angle: 270, edge: 'head' },
    { id: 'right-ear', x: 88, y: 32, angle: 315, edge: 'ear' },
    { id: 'right', x: 85, y: 60, angle: 0, edge: 'body' },
    { id: 'right-leg', x: 72, y: 85, angle: 90, edge: 'leg' },
    { id: 'left-leg', x: 28, y: 85, angle: 90, edge: 'leg' },
    { id: 'left', x: 15, y: 60, angle: 180, edge: 'body' },
  ]),
  boundingBox: { width: 82, height: 75, offsetX: 9, offsetY: 10 },
  area: 3000
}

export const owlShape: BaseShape = {
  id: 'owl',
  name: 'Owl',
  category: 'fauna',
  outlinePath: `
    M 20 20
    L 15 10
    L 25 18
    L 35 8
    L 40 22
    L 50 15
    L 60 22
    L 65 8
    L 75 18
    L 85 10
    L 80 20
    Q 92 30, 90 50
    Q 88 70, 75 82
    L 65 90
    L 50 88
    L 35 90
    L 25 82
    Q 12 70, 10 50
    Q 8 30, 20 20
    Z
    M 30 40
    Q 25 40, 25 50
    Q 25 58, 35 58
    Q 42 58, 42 50
    Q 42 40, 30 40
    Z
    M 70 40
    Q 58 40, 58 50
    Q 58 58, 65 58
    Q 75 58, 75 50
    Q 75 40, 70 40
    Z
  `,
  anchors: createAnchors([
    { id: 'left-ear', x: 15, y: 12, angle: 270, edge: 'ear' },
    { id: 'top', x: 50, y: 10, angle: 270, edge: 'head' },
    { id: 'right-ear', x: 85, y: 12, angle: 270, edge: 'ear' },
    { id: 'right', x: 90, y: 50, angle: 0, edge: 'wing' },
    { id: 'bottom-right', x: 65, y: 90, angle: 90, edge: 'body' },
    { id: 'bottom-left', x: 35, y: 90, angle: 90, edge: 'body' },
    { id: 'left', x: 10, y: 50, angle: 180, edge: 'wing' },
  ]),
  boundingBox: { width: 84, height: 82, offsetX: 8, offsetY: 8 },
  area: 3400
}

export const whaleShape: BaseShape = {
  id: 'whale',
  name: 'Whale',
  category: 'fauna',
  outlinePath: `
    M 10 50
    Q 5 45, 8 40
    Q 12 35, 20 38
    Q 30 30, 50 28
    Q 70 28, 82 40
    Q 88 48, 88 55
    L 95 48
    L 98 55
    L 92 58
    L 95 65
    L 88 60
    Q 85 70, 70 75
    Q 50 80, 30 75
    Q 18 70, 12 60
    Q 8 55, 10 50
    Z
    M 25 48
    Q 22 45, 22 50
    Q 25 52, 28 50
    Z
  `,
  anchors: createAnchors([
    { id: 'head', x: 8, y: 42, angle: 180, edge: 'head' },
    { id: 'top', x: 50, y: 28, angle: 270, edge: 'back' },
    { id: 'tail-top', x: 96, y: 52, angle: 0, edge: 'tail' },
    { id: 'tail-bottom', x: 95, y: 64, angle: 45, edge: 'tail' },
    { id: 'belly', x: 50, y: 78, angle: 90, edge: 'belly' },
    { id: 'chin', x: 15, y: 65, angle: 135, edge: 'chin' },
  ]),
  boundingBox: { width: 92, height: 52, offsetX: 4, offsetY: 26 },
  area: 2600
}

export const penguinShape: BaseShape = {
  id: 'penguin',
  name: 'Penguin',
  category: 'fauna',
  outlinePath: `
    M 50 8
    Q 62 8, 68 20
    Q 75 32, 72 45
    L 82 55
    Q 88 60, 85 68
    L 72 62
    Q 70 78, 62 88
    L 55 92
    L 50 88
    L 45 92
    L 38 88
    Q 30 78, 28 62
    L 15 68
    Q 12 60, 18 55
    L 28 45
    Q 25 32, 32 20
    Q 38 8, 50 8
    Z
    M 42 30
    Q 38 28, 38 34
    Q 42 38, 46 34
    Z
    M 58 30
    Q 54 28, 54 34
    Q 58 38, 62 34
    Z
  `,
  anchors: createAnchors([
    { id: 'head', x: 50, y: 8, angle: 270, edge: 'head' },
    { id: 'right-wing', x: 85, y: 62, angle: 0, edge: 'wing' },
    { id: 'right-foot', x: 58, y: 92, angle: 90, edge: 'foot' },
    { id: 'left-foot', x: 42, y: 92, angle: 90, edge: 'foot' },
    { id: 'left-wing', x: 15, y: 62, angle: 180, edge: 'wing' },
    { id: 'left-body', x: 28, y: 45, angle: 180, edge: 'body' },
    { id: 'right-body', x: 72, y: 45, angle: 0, edge: 'body' },
  ]),
  boundingBox: { width: 75, height: 86, offsetX: 12, offsetY: 6 },
  area: 2400
}

export const deerShape: BaseShape = {
  id: 'deer',
  name: 'Deer',
  category: 'fauna',
  outlinePath: `
    M 30 5
    L 25 15
    L 20 8
    L 25 22
    L 15 18
    L 28 30
    Q 20 35, 18 45
    Q 15 60, 22 75
    L 25 90
    L 35 90
    L 38 78
    Q 45 82, 55 82
    Q 62 82, 65 78
    L 68 90
    L 78 90
    L 80 75
    Q 88 60, 85 45
    Q 82 35, 72 30
    L 85 18
    L 75 22
    L 80 8
    L 75 15
    L 70 5
    L 60 18
    Q 50 12, 40 18
    L 30 5
    Z
    M 35 42
    Q 32 40, 32 45
    Z
    M 68 42
    Q 65 40, 65 45
    Z
  `,
  anchors: createAnchors([
    { id: 'left-antler', x: 18, y: 12, angle: 270, edge: 'antler' },
    { id: 'right-antler', x: 82, y: 12, angle: 270, edge: 'antler' },
    { id: 'top', x: 50, y: 14, angle: 270, edge: 'head' },
    { id: 'right', x: 88, y: 55, angle: 0, edge: 'body' },
    { id: 'right-leg', x: 72, y: 90, angle: 90, edge: 'leg' },
    { id: 'left-leg', x: 30, y: 90, angle: 90, edge: 'leg' },
    { id: 'left', x: 15, y: 55, angle: 180, edge: 'body' },
  ]),
  boundingBox: { width: 75, height: 88, offsetX: 12, offsetY: 4 },
  area: 2800
}

export const rabbitShape: BaseShape = {
  id: 'rabbit',
  name: 'Rabbit',
  category: 'fauna',
  outlinePath: `
    M 35 5
    L 30 35
    Q 25 38, 25 42
    Q 25 50, 35 48
    L 40 40
    L 50 35
    L 60 40
    L 65 48
    Q 75 50, 75 42
    Q 75 38, 70 35
    L 65 5
    Q 55 15, 50 15
    Q 45 15, 35 5
    Z
    M 50 48
    Q 40 55, 35 65
    Q 30 80, 38 90
    L 48 90
    Q 50 85, 52 90
    L 62 90
    Q 70 80, 65 65
    Q 60 55, 50 48
    Z
    M 40 55
    Q 38 53, 38 58
    Z
    M 62 55
    Q 60 53, 60 58
    Z
  `,
  anchors: createAnchors([
    { id: 'left-ear', x: 32, y: 8, angle: 270, edge: 'ear' },
    { id: 'right-ear', x: 68, y: 8, angle: 270, edge: 'ear' },
    { id: 'right-cheek', x: 75, y: 45, angle: 0, edge: 'face' },
    { id: 'right-body', x: 68, y: 75, angle: 0, edge: 'body' },
    { id: 'bottom', x: 50, y: 90, angle: 90, edge: 'feet' },
    { id: 'left-body', x: 32, y: 75, angle: 180, edge: 'body' },
    { id: 'left-cheek', x: 25, y: 45, angle: 180, edge: 'face' },
  ]),
  boundingBox: { width: 52, height: 87, offsetX: 24, offsetY: 4 },
  area: 2200
}

export const bearShape: BaseShape = {
  id: 'bear',
  name: 'Bear',
  category: 'fauna',
  outlinePath: `
    M 25 25
    Q 18 20, 15 28
    Q 12 35, 18 40
    Q 10 50, 12 65
    Q 15 80, 28 88
    L 38 90
    Q 42 85, 50 85
    Q 58 85, 62 90
    L 72 88
    Q 85 80, 88 65
    Q 90 50, 82 40
    Q 88 35, 85 28
    Q 82 20, 75 25
    Q 70 15, 60 18
    Q 50 12, 40 18
    Q 30 15, 25 25
    Z
    M 38 40
    Q 35 38, 35 43
    Q 38 46, 42 43
    Z
    M 62 40
    Q 58 38, 58 43
    Q 62 46, 65 43
    Z
    M 50 52
    Q 45 50, 45 55
    Q 50 60, 55 55
    Q 55 50, 50 52
    Z
  `,
  anchors: createAnchors([
    { id: 'left-ear', x: 15, y: 28, angle: 225, edge: 'ear' },
    { id: 'top', x: 50, y: 14, angle: 270, edge: 'head' },
    { id: 'right-ear', x: 85, y: 28, angle: 315, edge: 'ear' },
    { id: 'right', x: 90, y: 58, angle: 0, edge: 'body' },
    { id: 'right-leg', x: 68, y: 90, angle: 90, edge: 'leg' },
    { id: 'left-leg', x: 32, y: 90, angle: 90, edge: 'leg' },
    { id: 'left', x: 10, y: 58, angle: 180, edge: 'body' },
  ]),
  boundingBox: { width: 80, height: 80, offsetX: 10, offsetY: 10 },
  area: 3500
}

export const elephantShape: BaseShape = {
  id: 'elephant',
  name: 'Elephant',
  category: 'fauna',
  outlinePath: `
    M 15 30
    Q 8 35, 5 50
    L 5 75
    L 15 75
    L 15 60
    Q 18 55, 25 55
    Q 22 70, 25 85
    L 35 85
    L 38 70
    Q 45 75, 55 75
    Q 62 75, 68 70
    L 72 85
    L 82 85
    Q 85 70, 82 55
    Q 90 55, 92 60
    L 92 75
    L 98 75
    L 98 50
    Q 95 35, 88 30
    Q 80 22, 65 22
    Q 50 22, 40 28
    Q 30 25, 20 28
    Q 12 28, 15 30
    Z
    M 78 35
    Q 75 33, 75 38
    Z
  `,
  anchors: createAnchors([
    { id: 'trunk-top', x: 5, y: 50, angle: 180, edge: 'trunk' },
    { id: 'top', x: 50, y: 22, angle: 270, edge: 'back' },
    { id: 'right-ear', x: 95, y: 40, angle: 0, edge: 'ear' },
    { id: 'right-leg', x: 78, y: 85, angle: 90, edge: 'leg' },
    { id: 'belly', x: 55, y: 78, angle: 90, edge: 'belly' },
    { id: 'left-leg', x: 30, y: 85, angle: 90, edge: 'leg' },
    { id: 'trunk-bottom', x: 5, y: 75, angle: 180, edge: 'trunk' },
  ]),
  boundingBox: { width: 95, height: 65, offsetX: 3, offsetY: 20 },
  area: 3200
}

// ============================================================================
// ADDITIONAL SHAPES - CELESTIAL
// ============================================================================

export const moonShape: BaseShape = {
  id: 'moon',
  name: 'Moon',
  category: 'celestial',
  outlinePath: `
    M 70 10
    Q 40 15, 25 40
    Q 10 65, 25 85
    Q 45 105, 75 90
    Q 55 80, 50 60
    Q 48 40, 60 25
    Q 72 12, 70 10
    Z
  `,
  anchors: createAnchors([
    { id: 'top', x: 55, y: 12, angle: 270, edge: 'outer' },
    { id: 'inner-top', x: 58, y: 30, angle: 315, edge: 'inner' },
    { id: 'inner-middle', x: 50, y: 55, angle: 0, edge: 'inner' },
    { id: 'inner-bottom', x: 60, y: 78, angle: 45, edge: 'inner' },
    { id: 'bottom', x: 45, y: 92, angle: 90, edge: 'outer' },
    { id: 'left', x: 18, y: 60, angle: 180, edge: 'outer' },
  ]),
  boundingBox: { width: 65, height: 85, offsetX: 10, offsetY: 8 },
  area: 2200
}

export const cloudShape: BaseShape = {
  id: 'cloud',
  name: 'Cloud',
  category: 'celestial',
  outlinePath: `
    M 20 60
    Q 8 60, 8 48
    Q 8 35, 22 35
    Q 22 22, 38 22
    Q 48 15, 62 22
    Q 75 18, 82 30
    Q 95 32, 95 48
    Q 95 62, 80 62
    L 20 62
    Z
  `,
  anchors: createAnchors([
    { id: 'left', x: 8, y: 50, angle: 180, edge: 'left' },
    { id: 'top-left', x: 28, y: 22, angle: 270, edge: 'puff' },
    { id: 'top', x: 55, y: 18, angle: 270, edge: 'puff' },
    { id: 'top-right', x: 82, y: 28, angle: 315, edge: 'puff' },
    { id: 'right', x: 95, y: 52, angle: 0, edge: 'right' },
    { id: 'bottom', x: 50, y: 62, angle: 90, edge: 'base' },
  ]),
  boundingBox: { width: 90, height: 47, offsetX: 5, offsetY: 15 },
  area: 2400
}

export const waveShape: BaseShape = {
  id: 'wave',
  name: 'Wave',
  category: 'celestial',
  outlinePath: `
    M 5 55
    Q 15 40, 30 45
    Q 45 35, 55 50
    Q 65 38, 80 48
    Q 92 42, 95 55
    L 95 75
    Q 80 70, 65 75
    Q 50 80, 35 72
    Q 20 78, 5 70
    Z
  `,
  anchors: createAnchors([
    { id: 'left', x: 5, y: 55, angle: 180, edge: 'left' },
    { id: 'crest-1', x: 25, y: 42, angle: 270, edge: 'crest' },
    { id: 'crest-2', x: 55, y: 38, angle: 270, edge: 'crest' },
    { id: 'crest-3', x: 82, y: 45, angle: 270, edge: 'crest' },
    { id: 'right', x: 95, y: 60, angle: 0, edge: 'right' },
    { id: 'bottom', x: 50, y: 78, angle: 90, edge: 'base' },
  ]),
  boundingBox: { width: 92, height: 42, offsetX: 4, offsetY: 35 },
  area: 1800
}

// ============================================================================
// ADDITIONAL SHAPES - SYMBOLS
// ============================================================================

export const infinityShape: BaseShape = {
  id: 'infinity',
  name: 'Infinity',
  category: 'symbols',
  outlinePath: `
    M 50 40
    Q 35 25, 20 35
    Q 5 45, 5 55
    Q 5 70, 20 75
    Q 35 80, 50 60
    Q 65 80, 80 75
    Q 95 70, 95 55
    Q 95 45, 80 35
    Q 65 25, 50 40
    Z
    M 50 48
    Q 40 55, 35 50
    Q 28 45, 28 55
    Q 28 65, 40 62
    Q 50 55, 50 48
    Z
    M 50 48
    Q 60 55, 65 50
    Q 72 45, 72 55
    Q 72 65, 60 62
    Q 50 55, 50 48
    Z
  `,
  anchors: createAnchors([
    { id: 'left-top', x: 15, y: 32, angle: 225, edge: 'left-loop' },
    { id: 'center', x: 50, y: 35, angle: 270, edge: 'center' },
    { id: 'right-top', x: 85, y: 32, angle: 315, edge: 'right-loop' },
    { id: 'right-bottom', x: 85, y: 72, angle: 45, edge: 'right-loop' },
    { id: 'left-bottom', x: 15, y: 72, angle: 135, edge: 'left-loop' },
  ]),
  boundingBox: { width: 92, height: 52, offsetX: 4, offsetY: 24 },
  area: 2000
}

export const diamondShape: BaseShape = {
  id: 'diamond',
  name: 'Diamond',
  category: 'symbols',
  outlinePath: `
    M 50 5
    L 95 50
    L 50 95
    L 5 50
    Z
    M 50 20
    L 80 50
    L 50 80
    L 20 50
    Z
  `,
  anchors: createAnchors([
    { id: 'top', x: 50, y: 5, angle: 270, edge: 'top' },
    { id: 'right', x: 95, y: 50, angle: 0, edge: 'right' },
    { id: 'bottom', x: 50, y: 95, angle: 90, edge: 'bottom' },
    { id: 'left', x: 5, y: 50, angle: 180, edge: 'left' },
  ]),
  boundingBox: { width: 92, height: 92, offsetX: 4, offsetY: 4 },
  area: 4000
}

export const keyShape: BaseShape = {
  id: 'key',
  name: 'Key',
  category: 'symbols',
  outlinePath: `
    M 25 15
    Q 10 15, 10 30
    Q 10 45, 25 45
    Q 35 45, 38 38
    L 70 38
    L 70 48
    L 78 48
    L 78 38
    L 85 38
    L 85 48
    L 95 48
    L 95 30
    L 85 30
    L 85 32
    L 78 32
    L 78 30
    L 70 30
    L 38 30
    Q 35 23, 28 20
    Q 25 15, 25 15
    Z
    M 25 28
    Q 20 28, 20 33
    Q 20 38, 25 38
    Q 30 38, 30 33
    Q 30 28, 25 28
    Z
  `,
  anchors: createAnchors([
    { id: 'bow-top', x: 18, y: 18, angle: 270, edge: 'bow' },
    { id: 'bow-bottom', x: 18, y: 42, angle: 90, edge: 'bow' },
    { id: 'shaft-top', x: 55, y: 30, angle: 270, edge: 'shaft' },
    { id: 'bit', x: 95, y: 40, angle: 0, edge: 'bit' },
    { id: 'shaft-bottom', x: 55, y: 48, angle: 90, edge: 'shaft' },
  ]),
  boundingBox: { width: 87, height: 35, offsetX: 8, offsetY: 14 },
  area: 1600
}

// ============================================================================
// ADDITIONAL SHAPES - ADVENTURE
// ============================================================================

export const coffeeShape: BaseShape = {
  id: 'coffee',
  name: 'Coffee',
  category: 'adventure',
  outlinePath: `
    M 20 25
    L 70 25
    Q 75 25, 78 30
    L 85 30
    Q 95 32, 95 45
    Q 95 58, 85 60
    L 78 60
    Q 75 85, 55 90
    L 35 90
    Q 15 85, 18 60
    L 18 30
    Q 18 25, 20 25
    Z
    M 78 38
    L 85 38
    Q 88 40, 88 48
    Q 88 55, 82 55
    L 78 55
    Z
  `,
  anchors: createAnchors([
    { id: 'rim-left', x: 20, y: 25, angle: 270, edge: 'rim' },
    { id: 'rim-right', x: 70, y: 25, angle: 270, edge: 'rim' },
    { id: 'handle', x: 95, y: 48, angle: 0, edge: 'handle' },
    { id: 'bottom-right', x: 65, y: 90, angle: 90, edge: 'base' },
    { id: 'bottom-left', x: 35, y: 90, angle: 90, edge: 'base' },
    { id: 'left', x: 15, y: 55, angle: 180, edge: 'body' },
  ]),
  boundingBox: { width: 82, height: 68, offsetX: 14, offsetY: 23 },
  area: 2600
}

export const hotAirBalloonShape: BaseShape = {
  id: 'hotAirBalloon',
  name: 'Hot Air Balloon',
  category: 'adventure',
  outlinePath: `
    M 50 5
    Q 20 10, 15 35
    Q 10 55, 25 70
    Q 35 80, 42 78
    L 40 85
    L 35 85
    L 35 95
    L 65 95
    L 65 85
    L 60 85
    L 58 78
    Q 65 80, 75 70
    Q 90 55, 85 35
    Q 80 10, 50 5
    Z
    M 38 88
    L 38 92
    L 62 92
    L 62 88
    Z
  `,
  anchors: createAnchors([
    { id: 'top', x: 50, y: 5, angle: 270, edge: 'envelope' },
    { id: 'right', x: 88, y: 40, angle: 0, edge: 'envelope' },
    { id: 'right-bottom', x: 72, y: 72, angle: 45, edge: 'envelope' },
    { id: 'basket', x: 50, y: 95, angle: 90, edge: 'basket' },
    { id: 'left-bottom', x: 28, y: 72, angle: 135, edge: 'envelope' },
    { id: 'left', x: 12, y: 40, angle: 180, edge: 'envelope' },
  ]),
  boundingBox: { width: 80, height: 92, offsetX: 10, offsetY: 4 },
  area: 3200
}

export const houseShape: BaseShape = {
  id: 'house',
  name: 'House',
  category: 'adventure',
  outlinePath: `
    M 50 10
    L 90 45
    L 85 45
    L 85 90
    L 15 90
    L 15 45
    L 10 45
    Z
    M 35 90
    L 35 65
    L 50 65
    L 50 90
    Z
    M 60 50
    L 75 50
    L 75 65
    L 60 65
    Z
  `,
  anchors: createAnchors([
    { id: 'roof-peak', x: 50, y: 10, angle: 270, edge: 'roof' },
    { id: 'roof-right', x: 88, y: 45, angle: 0, edge: 'roof' },
    { id: 'right', x: 85, y: 70, angle: 0, edge: 'wall' },
    { id: 'bottom-right', x: 70, y: 90, angle: 90, edge: 'base' },
    { id: 'bottom-left', x: 30, y: 90, angle: 90, edge: 'base' },
    { id: 'left', x: 15, y: 70, angle: 180, edge: 'wall' },
    { id: 'roof-left', x: 12, y: 45, angle: 180, edge: 'roof' },
  ]),
  boundingBox: { width: 82, height: 82, offsetX: 9, offsetY: 9 },
  area: 3400
}

export const lighthouseShape: BaseShape = {
  id: 'lighthouse',
  name: 'Lighthouse',
  category: 'adventure',
  outlinePath: `
    M 35 25
    L 40 25
    L 40 18
    L 42 18
    L 42 12
    Q 50 8, 58 12
    L 58 18
    L 60 18
    L 60 25
    L 65 25
    L 68 35
    L 65 35
    L 62 90
    L 38 90
    L 35 35
    L 32 35
    Z
    M 45 30
    L 55 30
    L 55 38
    L 45 38
    Z
    M 44 50
    L 56 50
    L 55 60
    L 45 60
    Z
    M 43 72
    L 57 72
    L 56 82
    L 44 82
    Z
  `,
  anchors: createAnchors([
    { id: 'light', x: 50, y: 8, angle: 270, edge: 'light' },
    { id: 'right-top', x: 68, y: 35, angle: 0, edge: 'top' },
    { id: 'right-body', x: 62, y: 65, angle: 0, edge: 'body' },
    { id: 'bottom-right', x: 58, y: 90, angle: 90, edge: 'base' },
    { id: 'bottom-left', x: 42, y: 90, angle: 90, edge: 'base' },
    { id: 'left-body', x: 38, y: 65, angle: 180, edge: 'body' },
    { id: 'left-top', x: 32, y: 35, angle: 180, edge: 'top' },
  ]),
  boundingBox: { width: 38, height: 84, offsetX: 31, offsetY: 6 },
  area: 2000
}

export const bicycleShape: BaseShape = {
  id: 'bicycle',
  name: 'Bicycle',
  category: 'adventure',
  outlinePath: `
    M 25 70
    Q 10 70, 10 55
    Q 10 40, 25 40
    Q 40 40, 40 55
    Q 40 70, 25 70
    Z
    M 75 70
    Q 60 70, 60 55
    Q 60 40, 75 40
    Q 90 40, 90 55
    Q 90 70, 75 70
    Z
    M 25 55
    L 45 35
    L 55 35
    L 50 55
    L 75 55
    M 45 35
    L 42 25
    L 52 25
    M 55 35
    L 75 55
  `,
  anchors: createAnchors([
    { id: 'handlebar', x: 47, y: 25, angle: 270, edge: 'handlebar' },
    { id: 'front-wheel', x: 25, y: 70, angle: 90, edge: 'wheel' },
    { id: 'rear-wheel', x: 75, y: 70, angle: 90, edge: 'wheel' },
    { id: 'left', x: 10, y: 55, angle: 180, edge: 'wheel' },
    { id: 'right', x: 90, y: 55, angle: 0, edge: 'wheel' },
    { id: 'seat', x: 55, y: 35, angle: 0, edge: 'frame' },
  ]),
  boundingBox: { width: 82, height: 47, offsetX: 9, offsetY: 24 },
  area: 1800
}

export const featherShape: BaseShape = {
  id: 'feather',
  name: 'Feather',
  category: 'adventure',
  outlinePath: `
    M 85 15
    Q 80 18, 75 25
    Q 60 35, 50 50
    Q 40 65, 30 75
    Q 20 85, 15 90
    L 12 88
    Q 18 82, 25 72
    Q 22 70, 20 65
    Q 25 68, 30 68
    Q 38 60, 45 50
    Q 42 48, 38 45
    Q 45 48, 50 48
    Q 58 40, 65 32
    Q 62 30, 58 28
    Q 65 30, 72 28
    Q 78 22, 85 15
    Z
  `,
  anchors: createAnchors([
    { id: 'tip', x: 85, y: 15, angle: 315, edge: 'tip' },
    { id: 'upper-right', x: 70, y: 30, angle: 0, edge: 'vane' },
    { id: 'middle-right', x: 48, y: 48, angle: 45, edge: 'vane' },
    { id: 'lower-right', x: 28, y: 70, angle: 45, edge: 'vane' },
    { id: 'quill', x: 12, y: 88, angle: 135, edge: 'quill' },
  ]),
  boundingBox: { width: 75, height: 77, offsetX: 10, offsetY: 13 },
  area: 1400
}

export const ringShape: BaseShape = {
  id: 'ring',
  name: 'Ring',
  category: 'adventure',
  outlinePath: `
    M 50 10
    Q 80 10, 90 40
    Q 95 60, 85 78
    Q 70 95, 50 95
    Q 30 95, 15 78
    Q 5 60, 10 40
    Q 20 10, 50 10
    Z
    M 50 30
    Q 35 30, 28 48
    Q 22 65, 32 78
    Q 42 88, 50 88
    Q 58 88, 68 78
    Q 78 65, 72 48
    Q 65 30, 50 30
    Z
    M 45 12
    L 40 5
    L 50 8
    L 60 5
    L 55 12
    Z
  `,
  anchors: createAnchors([
    { id: 'gem', x: 50, y: 5, angle: 270, edge: 'gem' },
    { id: 'right', x: 92, y: 50, angle: 0, edge: 'band' },
    { id: 'bottom', x: 50, y: 95, angle: 90, edge: 'band' },
    { id: 'left', x: 8, y: 50, angle: 180, edge: 'band' },
  ]),
  boundingBox: { width: 88, height: 92, offsetX: 6, offsetY: 4 },
  area: 2400
}

// ============================================================================
// NEW FLORA SHAPES
// ============================================================================

export const cherryBlossomShape: BaseShape = {
  id: 'cherry-blossom',
  name: 'Cherry Blossom',
  category: 'flora',
  outlinePath: `
    M 50 15
    Q 60 10, 68 18
    Q 75 25, 70 35
    Q 78 32, 85 38
    Q 92 45, 88 55
    Q 84 65, 75 68
    Q 80 75, 78 85
    Q 72 92, 62 88
    Q 55 85, 50 78
    Q 45 85, 38 88
    Q 28 92, 22 85
    Q 20 75, 25 68
    Q 16 65, 12 55
    Q 8 45, 15 38
    Q 22 32, 30 35
    Q 25 25, 32 18
    Q 40 10, 50 15
    Z
    M 50 35
    Q 55 40, 55 50
    Q 55 60, 50 65
    Q 45 60, 45 50
    Q 45 40, 50 35
    Z
  `,
  anchors: createAnchors([
    { id: 'top', x: 50, y: 12, angle: 270, edge: 'petal' },
    { id: 'top-right', x: 72, y: 25, angle: 315, edge: 'petal' },
    { id: 'right', x: 90, y: 50, angle: 0, edge: 'petal' },
    { id: 'bottom-right', x: 72, y: 85, angle: 45, edge: 'petal' },
    { id: 'bottom-left', x: 28, y: 85, angle: 135, edge: 'petal' },
    { id: 'left', x: 10, y: 50, angle: 180, edge: 'petal' },
    { id: 'top-left', x: 28, y: 25, angle: 225, edge: 'petal' },
  ]),
  boundingBox: { width: 84, height: 82, offsetX: 8, offsetY: 9 },
  area: 2600
}

export const cactusShape: BaseShape = {
  id: 'cactus',
  name: 'Cactus',
  category: 'flora',
  outlinePath: `
    M 42 90
    L 42 55
    Q 42 50, 35 48
    L 20 48
    Q 15 48, 15 42
    Q 15 35, 20 35
    L 35 35
    Q 42 35, 42 28
    L 42 15
    Q 42 10, 50 10
    Q 58 10, 58 15
    L 58 28
    Q 58 35, 65 35
    L 80 35
    Q 85 35, 85 42
    Q 85 50, 80 50
    L 65 50
    Q 58 50, 58 55
    L 58 90
    Q 58 95, 50 95
    Q 42 95, 42 90
    Z
  `,
  anchors: createAnchors([
    { id: 'top', x: 50, y: 10, angle: 270, edge: 'top' },
    { id: 'left-arm', x: 15, y: 42, angle: 180, edge: 'left' },
    { id: 'right-arm', x: 85, y: 42, angle: 0, edge: 'right' },
    { id: 'bottom', x: 50, y: 95, angle: 90, edge: 'base' },
  ]),
  boundingBox: { width: 70, height: 85, offsetX: 15, offsetY: 10 },
  area: 1800
}

export const mushroomShape: BaseShape = {
  id: 'mushroom',
  name: 'Mushroom',
  category: 'flora',
  outlinePath: `
    M 50 10
    Q 75 10, 88 25
    Q 95 38, 90 52
    Q 82 62, 65 65
    L 60 65
    L 60 88
    Q 60 95, 50 95
    Q 40 95, 40 88
    L 40 65
    L 35 65
    Q 18 62, 10 52
    Q 5 38, 12 25
    Q 25 10, 50 10
    Z
  `,
  anchors: createAnchors([
    { id: 'top', x: 50, y: 10, angle: 270, edge: 'cap' },
    { id: 'right', x: 92, y: 40, angle: 0, edge: 'cap' },
    { id: 'bottom', x: 50, y: 95, angle: 90, edge: 'stem' },
    { id: 'left', x: 8, y: 40, angle: 180, edge: 'cap' },
  ]),
  boundingBox: { width: 87, height: 85, offsetX: 7, offsetY: 10 },
  area: 2200
}

// ============================================================================
// NEW CELESTIAL SHAPES
// ============================================================================

export const rainbowShape: BaseShape = {
  id: 'rainbow',
  name: 'Rainbow',
  category: 'celestial',
  outlinePath: `
    M 5 80
    Q 5 30, 50 20
    Q 95 30, 95 80
    L 85 80
    Q 85 42, 50 35
    Q 15 42, 15 80
    Z
  `,
  anchors: createAnchors([
    { id: 'top', x: 50, y: 20, angle: 270, edge: 'arc' },
    { id: 'right-outer', x: 95, y: 60, angle: 0, edge: 'arc' },
    { id: 'right-base', x: 90, y: 80, angle: 90, edge: 'base' },
    { id: 'left-base', x: 10, y: 80, angle: 90, edge: 'base' },
    { id: 'left-outer', x: 5, y: 60, angle: 180, edge: 'arc' },
  ]),
  boundingBox: { width: 90, height: 60, offsetX: 5, offsetY: 20 },
  area: 2000
}

export const snowflakeShape: BaseShape = {
  id: 'snowflake',
  name: 'Snowflake',
  category: 'celestial',
  outlinePath: `
    M 50 5
    L 53 25
    L 65 15
    L 60 30
    L 75 25
    L 65 38
    L 85 35
    L 70 45
    L 90 50
    L 70 55
    L 85 65
    L 65 62
    L 75 75
    L 60 70
    L 65 85
    L 53 75
    L 50 95
    L 47 75
    L 35 85
    L 40 70
    L 25 75
    L 35 62
    L 15 65
    L 30 55
    L 10 50
    L 30 45
    L 15 35
    L 35 38
    L 25 25
    L 40 30
    L 35 15
    L 47 25
    L 50 5
    Z
  `,
  anchors: createAnchors([
    { id: 'top', x: 50, y: 5, angle: 270, edge: 'arm' },
    { id: 'top-right', x: 85, y: 35, angle: 315, edge: 'arm' },
    { id: 'right', x: 90, y: 50, angle: 0, edge: 'arm' },
    { id: 'bottom-right', x: 85, y: 65, angle: 45, edge: 'arm' },
    { id: 'bottom', x: 50, y: 95, angle: 90, edge: 'arm' },
    { id: 'bottom-left', x: 15, y: 65, angle: 135, edge: 'arm' },
    { id: 'left', x: 10, y: 50, angle: 180, edge: 'arm' },
    { id: 'top-left', x: 15, y: 35, angle: 225, edge: 'arm' },
  ]),
  boundingBox: { width: 80, height: 90, offsetX: 10, offsetY: 5 },
  area: 1500
}

// ============================================================================
// NEW SYMBOL SHAPES
// ============================================================================

export const crownShape: BaseShape = {
  id: 'crown',
  name: 'Crown',
  category: 'symbols',
  outlinePath: `
    M 10 75
    L 10 40
    L 25 55
    L 40 30
    L 50 50
    L 60 30
    L 75 55
    L 90 40
    L 90 75
    Q 90 85, 50 85
    Q 10 85, 10 75
    Z
  `,
  anchors: createAnchors([
    { id: 'left-peak', x: 10, y: 40, angle: 225, edge: 'peak' },
    { id: 'center-left-peak', x: 40, y: 30, angle: 270, edge: 'peak' },
    { id: 'center-peak', x: 50, y: 50, angle: 270, edge: 'peak' },
    { id: 'center-right-peak', x: 60, y: 30, angle: 270, edge: 'peak' },
    { id: 'right-peak', x: 90, y: 40, angle: 315, edge: 'peak' },
    { id: 'bottom', x: 50, y: 85, angle: 90, edge: 'base' },
  ]),
  boundingBox: { width: 80, height: 55, offsetX: 10, offsetY: 30 },
  area: 2200
}

export const cloverShape: BaseShape = {
  id: 'clover',
  name: 'Four-Leaf Clover',
  category: 'symbols',
  outlinePath: `
    M 50 48
    Q 55 35, 65 28
    Q 80 20, 85 35
    Q 88 50, 75 55
    Q 62 58, 52 52
    Q 58 62, 55 75
    Q 50 88, 35 85
    Q 20 80, 25 65
    Q 30 52, 48 52
    Q 38 58, 25 55
    Q 12 50, 15 35
    Q 20 20, 35 28
    Q 45 35, 50 48
    Z
    M 50 52
    L 50 95
    Q 48 95, 48 90
    L 48 55
    Q 50 52, 52 55
    L 52 90
    Q 52 95, 50 95
    L 50 52
    Z
  `,
  anchors: createAnchors([
    { id: 'top', x: 50, y: 20, angle: 270, edge: 'leaf' },
    { id: 'right', x: 88, y: 45, angle: 0, edge: 'leaf' },
    { id: 'bottom-leaf', x: 50, y: 88, angle: 90, edge: 'leaf' },
    { id: 'left', x: 12, y: 45, angle: 180, edge: 'leaf' },
    { id: 'stem', x: 50, y: 95, angle: 90, edge: 'stem' },
  ]),
  boundingBox: { width: 78, height: 77, offsetX: 11, offsetY: 18 },
  area: 2000
}

// ============================================================================
// NEW ADVENTURE SHAPES
// ============================================================================

export const globeShape: BaseShape = {
  id: 'globe',
  name: 'Globe',
  category: 'adventure',
  outlinePath: `
    M 50 5
    Q 85 5, 95 50
    Q 95 95, 50 95
    Q 5 95, 5 50
    Q 5 5, 50 5
    Z
    M 50 5
    Q 65 25, 65 50
    Q 65 75, 50 95
    M 50 5
    Q 35 25, 35 50
    Q 35 75, 50 95
    M 8 35
    Q 50 35, 92 35
    M 8 65
    Q 50 65, 92 65
  `,
  anchors: createAnchors([
    { id: 'top', x: 50, y: 5, angle: 270, edge: 'meridian' },
    { id: 'right', x: 95, y: 50, angle: 0, edge: 'equator' },
    { id: 'bottom', x: 50, y: 95, angle: 90, edge: 'meridian' },
    { id: 'left', x: 5, y: 50, angle: 180, edge: 'equator' },
  ]),
  boundingBox: { width: 90, height: 90, offsetX: 5, offsetY: 5 },
  area: 6400
}

export const tentShape: BaseShape = {
  id: 'tent',
  name: 'Tent',
  category: 'adventure',
  outlinePath: `
    M 50 10
    L 95 85
    L 5 85
    Z
    M 50 10
    L 50 5
    L 52 5
    L 55 8
    Q 52 10, 50 10
    Z
    M 40 85
    L 40 60
    Q 42 55, 50 55
    Q 58 55, 60 60
    L 60 85
    Z
  `,
  anchors: createAnchors([
    { id: 'peak', x: 50, y: 5, angle: 270, edge: 'peak' },
    { id: 'left-slope', x: 28, y: 48, angle: 245, edge: 'slope' },
    { id: 'right-slope', x: 72, y: 48, angle: 295, edge: 'slope' },
    { id: 'bottom-left', x: 5, y: 85, angle: 180, edge: 'base' },
    { id: 'bottom-right', x: 95, y: 85, angle: 0, edge: 'base' },
  ]),
  boundingBox: { width: 90, height: 80, offsetX: 5, offsetY: 5 },
  area: 3000
}

// ============================================================================
// BABY CATEGORY - NEW
// ============================================================================

export const babyBottleShape: BaseShape = {
  id: 'baby-bottle',
  name: 'Baby Bottle',
  category: 'baby',
  outlinePath: `
    M 40 10
    Q 40 5, 50 5
    Q 60 5, 60 10
    L 60 15
    Q 68 18, 68 28
    L 68 75
    Q 68 90, 50 90
    Q 32 90, 32 75
    L 32 28
    Q 32 18, 40 15
    L 40 10
    Z
    M 38 30
    L 62 30
    M 38 45
    L 62 45
    M 38 60
    L 62 60
  `,
  anchors: createAnchors([
    { id: 'nipple', x: 50, y: 5, angle: 270, edge: 'nipple' },
    { id: 'right', x: 68, y: 50, angle: 0, edge: 'body' },
    { id: 'bottom', x: 50, y: 90, angle: 90, edge: 'base' },
    { id: 'left', x: 32, y: 50, angle: 180, edge: 'body' },
  ]),
  boundingBox: { width: 36, height: 85, offsetX: 32, offsetY: 5 },
  area: 2100
}

export const pacifierShape: BaseShape = {
  id: 'pacifier',
  name: 'Pacifier',
  category: 'baby',
  outlinePath: `
    M 50 20
    Q 70 20, 78 35
    Q 85 50, 78 65
    Q 70 80, 50 80
    Q 30 80, 22 65
    Q 15 50, 22 35
    Q 30 20, 50 20
    Z
    M 50 35
    Q 60 35, 65 45
    Q 68 55, 65 62
    Q 58 70, 50 70
    Q 42 70, 35 62
    Q 32 55, 35 45
    Q 40 35, 50 35
    Z
    M 78 50
    L 95 50
    Q 98 50, 98 55
    Q 98 60, 95 60
    L 78 60
    Q 78 55, 78 50
    Z
  `,
  anchors: createAnchors([
    { id: 'top', x: 50, y: 20, angle: 270, edge: 'shield' },
    { id: 'handle', x: 98, y: 55, angle: 0, edge: 'handle' },
    { id: 'bottom', x: 50, y: 80, angle: 90, edge: 'shield' },
    { id: 'left', x: 15, y: 50, angle: 180, edge: 'shield' },
  ]),
  boundingBox: { width: 85, height: 60, offsetX: 13, offsetY: 20 },
  area: 2200
}

export const strollerShape: BaseShape = {
  id: 'stroller',
  name: 'Stroller',
  category: 'baby',
  outlinePath: `
    M 20 25
    L 25 25
    Q 30 25, 30 30
    L 30 55
    L 75 55
    L 80 30
    Q 82 25, 88 25
    L 90 25
    Q 92 25, 92 28
    L 85 60
    L 85 70
    Q 85 75, 80 75
    L 35 75
    Q 30 75, 30 70
    L 30 60
    L 20 60
    Q 15 60, 15 55
    L 15 30
    Q 15 25, 20 25
    Z
    M 30 80
    Q 30 92, 20 92
    Q 10 92, 10 82
    Q 10 72, 20 72
    Q 30 72, 30 80
    Z
    M 80 80
    Q 80 92, 70 92
    Q 60 92, 60 82
    Q 60 72, 70 72
    Q 80 72, 80 80
    Z
  `,
  anchors: createAnchors([
    { id: 'handle', x: 90, y: 25, angle: 270, edge: 'handle' },
    { id: 'canopy', x: 20, y: 25, angle: 270, edge: 'canopy' },
    { id: 'front-wheel', x: 20, y: 92, angle: 90, edge: 'wheel' },
    { id: 'back-wheel', x: 70, y: 92, angle: 90, edge: 'wheel' },
  ]),
  boundingBox: { width: 82, height: 67, offsetX: 10, offsetY: 25 },
  area: 2500
}

export const rattleShape: BaseShape = {
  id: 'rattle',
  name: 'Baby Rattle',
  category: 'baby',
  outlinePath: `
    M 50 15
    Q 72 15, 80 35
    Q 85 55, 75 72
    Q 62 85, 50 80
    L 50 95
    Q 45 95, 45 90
    L 45 80
    Q 38 85, 25 72
    Q 15 55, 20 35
    Q 28 15, 50 15
    Z
    M 40 35
    Q 35 35, 35 40
    Q 35 45, 40 45
    Q 45 45, 45 40
    Q 45 35, 40 35
    Z
    M 60 35
    Q 55 35, 55 40
    Q 55 45, 60 45
    Q 65 45, 65 40
    Q 65 35, 60 35
    Z
    M 50 55
    Q 45 55, 45 60
    Q 45 65, 50 65
    Q 55 65, 55 60
    Q 55 55, 50 55
    Z
  `,
  anchors: createAnchors([
    { id: 'top', x: 50, y: 15, angle: 270, edge: 'head' },
    { id: 'right', x: 82, y: 45, angle: 0, edge: 'head' },
    { id: 'handle', x: 48, y: 95, angle: 90, edge: 'handle' },
    { id: 'left', x: 18, y: 45, angle: 180, edge: 'head' },
  ]),
  boundingBox: { width: 67, height: 80, offsetX: 15, offsetY: 15 },
  area: 2400
}

export const onesieShape: BaseShape = {
  id: 'onesie',
  name: 'Baby Onesie',
  category: 'baby',
  outlinePath: `
    M 35 10
    Q 42 5, 50 5
    Q 58 5, 65 10
    L 80 20
    Q 85 22, 85 28
    L 85 35
    Q 85 40, 80 40
    L 70 38
    L 70 75
    Q 70 85, 60 88
    L 55 90
    L 55 85
    Q 55 80, 50 80
    Q 45 80, 45 85
    L 45 90
    L 40 88
    Q 30 85, 30 75
    L 30 38
    L 20 40
    Q 15 40, 15 35
    L 15 28
    Q 15 22, 20 20
    L 35 10
    Z
  `,
  anchors: createAnchors([
    { id: 'collar', x: 50, y: 5, angle: 270, edge: 'collar' },
    { id: 'left-sleeve', x: 15, y: 32, angle: 180, edge: 'sleeve' },
    { id: 'right-sleeve', x: 85, y: 32, angle: 0, edge: 'sleeve' },
    { id: 'left-leg', x: 45, y: 90, angle: 90, edge: 'leg' },
    { id: 'right-leg', x: 55, y: 90, angle: 90, edge: 'leg' },
  ]),
  boundingBox: { width: 70, height: 85, offsetX: 15, offsetY: 5 },
  area: 2600
}

export const teddyBearShape: BaseShape = {
  id: 'teddy-bear',
  name: 'Teddy Bear',
  category: 'baby',
  outlinePath: `
    M 25 25
    Q 20 15, 28 10
    Q 38 8, 40 18
    Q 42 25, 50 28
    Q 58 25, 60 18
    Q 62 8, 72 10
    Q 80 15, 75 25
    Q 72 32, 75 42
    Q 85 50, 82 62
    Q 78 72, 70 75
    L 70 82
    Q 70 90, 65 92
    L 55 92
    Q 52 92, 52 88
    L 52 82
    Q 50 82, 48 82
    L 48 88
    Q 48 92, 45 92
    L 35 92
    Q 30 90, 30 82
    L 30 75
    Q 22 72, 18 62
    Q 15 50, 25 42
    Q 28 32, 25 25
    Z
    M 40 45
    Q 38 45, 38 48
    Q 38 52, 42 52
    Q 45 52, 45 48
    Q 45 45, 40 45
    Z
    M 60 45
    Q 58 45, 58 48
    Q 58 52, 62 52
    Q 65 52, 65 48
    Q 65 45, 60 45
    Z
    M 50 58
    Q 48 58, 48 62
    Q 48 65, 52 65
    Q 55 65, 55 62
    Q 55 58, 50 58
    Z
  `,
  anchors: createAnchors([
    { id: 'left-ear', x: 25, y: 12, angle: 225, edge: 'ear' },
    { id: 'right-ear', x: 75, y: 12, angle: 315, edge: 'ear' },
    { id: 'left-arm', x: 18, y: 55, angle: 180, edge: 'arm' },
    { id: 'right-arm', x: 82, y: 55, angle: 0, edge: 'arm' },
    { id: 'left-leg', x: 35, y: 92, angle: 90, edge: 'leg' },
    { id: 'right-leg', x: 65, y: 92, angle: 90, edge: 'leg' },
  ]),
  boundingBox: { width: 67, height: 84, offsetX: 15, offsetY: 8 },
  area: 3200
}

// ============================================================================
// CELEBRATION CATEGORY - NEW
// ============================================================================

export const cakeShape: BaseShape = {
  id: 'cake',
  name: 'Birthday Cake',
  category: 'celebration',
  outlinePath: `
    M 50 5
    L 52 5
    Q 54 8, 54 12
    Q 54 18, 50 22
    Q 46 18, 46 12
    Q 46 8, 48 5
    L 50 5
    Z
    M 48 22
    L 52 22
    L 52 30
    L 48 30
    Z
    M 20 30
    L 80 30
    Q 88 30, 88 40
    L 88 50
    L 12 50
    L 12 40
    Q 12 30, 20 30
    Z
    M 10 50
    L 90 50
    Q 95 50, 95 58
    L 95 80
    Q 95 88, 88 88
    L 12 88
    Q 5 88, 5 80
    L 5 58
    Q 5 50, 10 50
    Z
  `,
  anchors: createAnchors([
    { id: 'candle', x: 50, y: 5, angle: 270, edge: 'candle' },
    { id: 'top-layer-right', x: 88, y: 40, angle: 0, edge: 'layer' },
    { id: 'bottom-right', x: 95, y: 70, angle: 0, edge: 'layer' },
    { id: 'bottom', x: 50, y: 88, angle: 90, edge: 'base' },
    { id: 'bottom-left', x: 5, y: 70, angle: 180, edge: 'layer' },
    { id: 'top-layer-left', x: 12, y: 40, angle: 180, edge: 'layer' },
  ]),
  boundingBox: { width: 90, height: 83, offsetX: 5, offsetY: 5 },
  area: 3800
}

export const confettiShape: BaseShape = {
  id: 'confetti',
  name: 'Confetti',
  category: 'celebration',
  outlinePath: `
    M 15 20
    L 25 15
    L 28 25
    L 18 30
    Z
    M 45 10
    L 55 12
    L 52 22
    L 42 20
    Z
    M 75 18
    L 85 22
    L 82 32
    L 72 28
    Z
    M 50 40
    Q 65 35, 75 50
    Q 80 65, 70 78
    Q 55 88, 40 82
    Q 25 75, 28 58
    Q 30 42, 50 40
    Z
    M 20 55
    L 28 50
    L 32 60
    L 24 65
    Z
    M 80 60
    L 90 58
    L 88 68
    L 78 70
    Z
    M 35 85
    L 42 90
    L 38 95
    L 30 92
    Z
    M 65 88
    L 75 92
    L 70 98
    L 60 95
    Z
  `,
  anchors: createAnchors([
    { id: 'top-left', x: 20, y: 15, angle: 270, edge: 'piece' },
    { id: 'top-center', x: 50, y: 10, angle: 270, edge: 'piece' },
    { id: 'top-right', x: 80, y: 20, angle: 270, edge: 'piece' },
    { id: 'center', x: 55, y: 60, angle: 0, edge: 'burst' },
    { id: 'bottom', x: 50, y: 95, angle: 90, edge: 'piece' },
  ]),
  boundingBox: { width: 78, height: 86, offsetX: 12, offsetY: 8 },
  area: 1800
}

export const partyHatShape: BaseShape = {
  id: 'party-hat',
  name: 'Party Hat',
  category: 'celebration',
  outlinePath: `
    M 50 5
    L 50 8
    Q 55 10, 55 15
    Q 55 20, 50 22
    Q 45 20, 45 15
    Q 45 10, 50 8
    L 50 5
    Z
    M 50 22
    L 85 85
    Q 88 90, 82 92
    L 18 92
    Q 12 90, 15 85
    L 50 22
    Z
  `,
  anchors: createAnchors([
    { id: 'pom-pom', x: 50, y: 5, angle: 270, edge: 'top' },
    { id: 'right-edge', x: 70, y: 55, angle: 330, edge: 'cone' },
    { id: 'bottom-right', x: 82, y: 92, angle: 45, edge: 'brim' },
    { id: 'bottom', x: 50, y: 92, angle: 90, edge: 'brim' },
    { id: 'bottom-left', x: 18, y: 92, angle: 135, edge: 'brim' },
    { id: 'left-edge', x: 30, y: 55, angle: 210, edge: 'cone' },
  ]),
  boundingBox: { width: 76, height: 87, offsetX: 12, offsetY: 5 },
  area: 2200
}

export const candleShape: BaseShape = {
  id: 'candle',
  name: 'Candle',
  category: 'celebration',
  outlinePath: `
    M 50 5
    Q 55 8, 55 15
    Q 58 22, 55 28
    Q 52 32, 50 28
    Q 48 32, 45 28
    Q 42 22, 45 15
    Q 45 8, 50 5
    Z
    M 48 28
    L 48 35
    L 52 35
    L 52 28
    Z
    M 35 35
    L 65 35
    Q 70 35, 70 42
    L 70 88
    Q 70 95, 50 95
    Q 30 95, 30 88
    L 30 42
    Q 30 35, 35 35
    Z
  `,
  anchors: createAnchors([
    { id: 'flame', x: 50, y: 5, angle: 270, edge: 'flame' },
    { id: 'right', x: 70, y: 65, angle: 0, edge: 'body' },
    { id: 'bottom', x: 50, y: 95, angle: 90, edge: 'base' },
    { id: 'left', x: 30, y: 65, angle: 180, edge: 'body' },
  ]),
  boundingBox: { width: 40, height: 90, offsetX: 30, offsetY: 5 },
  area: 2000
}

// ============================================================================
// SHAPE REGISTRY - All shapes indexed by ID
// ============================================================================

export const SHAPE_DEFINITIONS: Record<string, BaseShape> = {
  // Animals
  dolphin: dolphinShape,
  butterfly: butterflyShape,
  cat: catShape,
  turtle: turtleShape,
  bird: birdShape,
  fish: fishShape,
  fox: foxShape,
  dog: dogShape,
  owl: owlShape,
  whale: whaleShape,
  penguin: penguinShape,
  deer: deerShape,
  rabbit: rabbitShape,
  bear: bearShape,
  elephant: elephantShape,
  
  // Love & Celebration
  heart: heartShape,
  star: starShape,
  balloon: balloonShape,
  gift: giftShape,
  
  // Nature / Flora
  tree: treeShape,
  flower: flowerShape,
  sun: sunShape,
  leaf: leafShape,
  mountain: mountainShape,
  rose: roseShape,
  lotus: lotusShape,
  sunflower: sunflowerShape,
  cherryBlossom: cherryBlossomShape,
  cactus: cactusShape,
  mushroom: mushroomShape,
  
  // Celestial
  moon: moonShape,
  cloud: cloudShape,
  wave: waveShape,
  rainbow: rainbowShape,
  snowflake: snowflakeShape,
  
  // Symbols
  infinity: infinityShape,
  diamond: diamondShape,
  key: keyShape,
  anchor: anchorShape,
  compass: compassShape,
  crown: crownShape,
  clover: cloverShape,
  
  // Hobbies
  musicNote: musicNoteShape,
  soccerBall: soccerBallShape,
  camera: cameraShape,
  book: bookShape,
  palette: paletteShape,
  
  // Travel / Adventure
  airplane: airplaneShape,
  car: carShape,
  coffee: coffeeShape,
  hotAirBalloon: hotAirBalloonShape,
  house: houseShape,
  lighthouse: lighthouseShape,
  bicycle: bicycleShape,
  feather: featherShape,
  ring: ringShape,
  globe: globeShape,
  tent: tentShape,
  
  // Baby
  babyBottle: babyBottleShape,
  pacifier: pacifierShape,
  stroller: strollerShape,
  rattle: rattleShape,
  onesie: onesieShape,
  teddyBear: teddyBearShape,
  
  // Celebration
  cake: cakeShape,
  confetti: confettiShape,
  partyHat: partyHatShape,
  candle: candleShape,
}

// Helper to get all shape IDs
export const ALL_SHAPE_IDS = Object.keys(SHAPE_DEFINITIONS)

// Helper to get shapes by category
export function getShapesByCategory(category: string): BaseShape[] {
  return Object.values(SHAPE_DEFINITIONS).filter(s => s.category === category)
}

// Alias mappings for constants.ts shape IDs to actual shape definitions
// Some IDs in constants.ts use different naming conventions (hyphenated vs camelCase)
export const SHAPE_ID_ALIASES: Record<string, string> = {
  'leaf-simple': 'leaf',
  'music-note': 'musicNote',
  'hot-air-balloon': 'hotAirBalloon',
  'cherry-blossom': 'cherryBlossom',
  'baby-bottle': 'babyBottle',
  'teddy-bear': 'teddyBear',
  'party-hat': 'partyHat',
  'gray-wash': 'grayWash',
  'white-wash': 'whiteWash',
}

/**
 * Get a shape definition by ID, handling aliases
 */
export function getShapeById(id: string): BaseShape | undefined {
  const actualId = SHAPE_ID_ALIASES[id] || id
  return SHAPE_DEFINITIONS[actualId]
}

/**
 * Check if a shape ID is valid (exists in definitions)
 */
export function isValidShapeId(id: string): boolean {
  const actualId = SHAPE_ID_ALIASES[id] || id
  return actualId in SHAPE_DEFINITIONS
}

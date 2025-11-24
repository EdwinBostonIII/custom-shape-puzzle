import { Shape } from './types'

export const PUZZLE_SHAPES: Shape[] = [
  { id: 'heart', name: 'Heart', category: 'nature', availableFor: ['couple', 'solo', 'children'] },
  { id: 'star', name: 'Star', category: 'nature', availableFor: ['couple', 'solo', 'children'] },
  { id: 'flower', name: 'Flower', category: 'nature', availableFor: ['couple', 'solo', 'children'] },
  { id: 'butterfly', name: 'Butterfly', category: 'nature', availableFor: ['couple', 'solo', 'children'] },
  { id: 'moon', name: 'Moon', category: 'nature', availableFor: ['couple', 'solo', 'children'] },
  { id: 'sun', name: 'Sun', category: 'nature', availableFor: ['couple', 'solo', 'children'] },
  { id: 'cloud', name: 'Cloud', category: 'nature', availableFor: ['couple', 'solo', 'children'] },
  { id: 'rainbow', name: 'Rainbow', category: 'nature', availableFor: ['couple', 'solo', 'children'] },
  { id: 'tree', name: 'Tree', category: 'nature', availableFor: ['couple', 'solo', 'children'] },
  
  { id: 'dolphin', name: 'Dolphin', category: 'animals', availableFor: ['couple', 'solo'] },
  { id: 'turtle', name: 'Turtle', category: 'animals', availableFor: ['couple', 'solo'] },
  { id: 'cat', name: 'Cat', category: 'animals', availableFor: ['couple', 'solo', 'children'] },
  { id: 'dog', name: 'Dog', category: 'animals', availableFor: ['couple', 'solo', 'children'] },
  { id: 'bear', name: 'Bear', category: 'animals', availableFor: ['couple', 'solo', 'children'] },
  { id: 'elephant', name: 'Elephant', category: 'animals', availableFor: ['couple', 'solo', 'children'] },
  { id: 'giraffe', name: 'Giraffe', category: 'animals', availableFor: ['couple', 'solo', 'children'] },
  
  { id: 'circle', name: 'Circle', category: 'geometric', availableFor: ['couple', 'solo', 'children'] },
  { id: 'hexagon', name: 'Hexagon', category: 'geometric', availableFor: ['couple', 'solo'] },
  { id: 'triangle', name: 'Triangle', category: 'geometric', availableFor: ['couple', 'solo', 'children'] },
  { id: 'square', name: 'Square', category: 'geometric', availableFor: ['couple', 'solo', 'children'] },
  { id: 'diamond', name: 'Diamond', category: 'geometric', availableFor: ['couple', 'solo'] },
  { id: 'spiral', name: 'Spiral', category: 'geometric', availableFor: ['couple', 'solo'] },
  
  { id: 'car', name: 'Car', category: 'transport', availableFor: ['children'] },
  { id: 'train', name: 'Train', category: 'transport', availableFor: ['children'] },
  { id: 'airplane', name: 'Airplane', category: 'transport', availableFor: ['children'] },
  { id: 'boat', name: 'Boat', category: 'transport', availableFor: ['children'] },
  { id: 'rocket', name: 'Rocket', category: 'transport', availableFor: ['children'] },
  
  { id: 'mountain', name: 'Mountain', category: 'nature', availableFor: ['couple', 'solo'] },
  { id: 'wave', name: 'Wave', category: 'nature', availableFor: ['couple', 'solo'] },
]

export const PRICING = {
  couple: 65,
  solo: 65,
  children: 85,
}

export const DEFAULT_COLORS = [
  '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16',
  '#22C55E', '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9',
  '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF',
  '#EC4899', '#F43F5E', '#64748B', '#475569', '#1E293B',
]

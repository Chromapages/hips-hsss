'use client'

import { useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { cn } from '@hips/ui'

interface AvatarStyle {
  id: number
  label: string
  primaryColor: string
  accentColor: string
}

const AVATAR_STYLES: AvatarStyle[] = [
  { id: 1,  label: 'Coral Wave',    primaryColor: '#E07A5F', accentColor: '#F2CC8F' },
  { id: 2,  label: 'Sage Circle',  primaryColor: '#81B29A', accentColor: '#F2CC8F' },
  { id: 3,  label: 'Deep Ocean',   primaryColor: '#3D405B', accentColor: '#81B29A' },
  { id: 4,  label: 'Sunrise Glow', primaryColor: '#F2CC8F', accentColor: '#E07A5F' },
  { id: 5,  label: 'Twilight',     primaryColor: '#5C6B73', accentColor: '#9DB4C0' },
  { id: 6,  label: 'Forest',       primaryColor: '#2D6A4F', accentColor: '#95D5B2' },
  { id: 7,  label: 'Midnight',      primaryColor: '#1B263B', accentColor: '#415A77' },
  { id: 8,  label: 'Amber',         primaryColor: '#D4A373', accentColor: '#CCD5AE' },
  { id: 9,  label: 'Dusty Rose',    primaryColor: '#BC6C25', accentColor: '#D4A373' },
  { id: 10, label: 'Slate',         primaryColor: '#6C757D', accentColor: '#ADB5BD' },
  { id: 11, label: 'Violet',        primaryColor: '#7B2D8E', accentColor: '#C77DFF' },
  { id: 12, label: 'Teal',          primaryColor: '#0077B6', accentColor: '#00B4D8' },
]

const COLOR_PALETTES = [
  { primary: '#2D5A8E', secondary: '#4A8FA8', label: 'Brand Blue' },
  { primary: '#E07A5F', secondary: '#F2CC8F', label: 'Warm Coral' },
  { primary: '#81B29A', secondary: '#3D405B', label: 'Sage' },
  { primary: '#1B263B', secondary: '#415A77', label: 'Deep Navy' },
]

interface AvatarSelectorProps {
  onSelect: (styleId: number, paletteId: number) => void
  onLock?: () => void
  locked?: boolean
  currentStyleId?: number
  currentPaletteId?: number
  disabled?: boolean
}

export function AvatarSelector({
  onSelect,
  onLock,
  locked = false,
  currentStyleId,
  currentPaletteId,
  disabled = false,
}: AvatarSelectorProps) {
  const [selectedStyleId, setSelectedStyleId] = useState<number | null>(currentStyleId ?? null)
  const [selectedPaletteId, setSelectedPaletteId] = useState<number>(currentPaletteId ?? 0)
  const [step, setStep] = useState<'style' | 'color'>('style')

  const handleStyleConfirm = useCallback(() => {
    if (selectedStyleId !== null) setStep('color')
  }, [selectedStyleId])

  const handleColorConfirm = useCallback(() => {
    if (selectedStyleId !== null) {
      onSelect(selectedStyleId, selectedPaletteId)
      onLock?.()
    }
  }, [selectedStyleId, selectedPaletteId, onSelect, onLock])

  const activeStyle = AVATAR_STYLES.find((s) => s.id === selectedStyleId) ?? AVATAR_STYLES[0]
  const activePalette = COLOR_PALETTES[selectedPaletteId] ?? COLOR_PALETTES[0]

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-white">
          {step === 'style' ? 'Choose Your Avatar' : 'Choose Your Color'}
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          {locked ? 'Avatar locked for this session.' : step === 'style' ? 'Step 1 of 2' : 'Step 2 of 2'}
        </p>
      </div>

      {/* Avatar preview */}
      <div className="relative h-48 w-48 rounded-full overflow-hidden border-2 border-slate-600 bg-slate-800">
        <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
          <ambientLight intensity={0.8} />
          <pointLight position={[2, 2, 2]} intensity={1.2} color={activePalette.secondary} />
          <group>
            <mesh position={[0, 0.6, 0]}>
              <sphereGeometry args={[0.5, 32, 32]} />
              <meshStandardMaterial color={activeStyle.primaryColor} roughness={0.4} metalness={0.2} />
            </mesh>
            <mesh position={[0, -0.3, 0]}>
              <capsuleGeometry args={[0.35, 0.7, 8, 16]} />
              <meshStandardMaterial color={activeStyle.accentColor} roughness={0.5} metalness={0.1} />
            </mesh>
          </group>
        </Canvas>
        {locked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="font-mono text-xs text-slate-300 uppercase tracking-widest">LOCKED</span>
          </div>
        )}
      </div>

      {step === 'style' && (
        <>
          <div className="grid grid-cols-6 gap-3 max-w-md">
            {AVATAR_STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => !locked && setSelectedStyleId(style.id)}
                disabled={disabled || locked}
                className={cn(
                  'flex flex-col items-center gap-1.5 p-2 rounded-lg border-2 transition-all duration-200',
                  selectedStyleId === style.id
                    ? 'border-brand-accent bg-slate-800 scale-105'
                    : 'border-slate-700 bg-slate-900 hover:border-slate-500',
                  (disabled || locked) && 'opacity-40 cursor-not-allowed'
                )}
                aria-label={`Select ${style.label}`}
                aria-pressed={selectedStyleId === style.id}
              >
                <div className="h-8 w-8 rounded-full" style={{ background: style.primaryColor }} />
                <span className="text-xs text-slate-300 leading-tight text-center">{style.label}</span>
              </button>
            ))}
          </div>
          <button
            onClick={handleStyleConfirm}
            disabled={selectedStyleId === null || locked}
            className={cn(
              'px-6 py-2.5 rounded-lg font-medium transition-all',
              selectedStyleId !== null && !locked
                ? 'bg-brand-accent text-brand-deep hover:bg-brand-accent/90'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            )}
          >
            Confirm Style →
          </button>
        </>
      )}

      {step === 'color' && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4 max-w-xs">
            {COLOR_PALETTES.map((palette, idx) => (
              <button
                key={idx}
                onClick={() => !locked && setSelectedPaletteId(idx)}
                disabled={locked}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg border-2 transition-all',
                  selectedPaletteId === idx
                    ? 'border-brand-accent bg-slate-800'
                    : 'border-slate-700 bg-slate-900 hover:border-slate-500',
                  locked && 'opacity-40 cursor-not-allowed'
                )}
                aria-label={`Select ${palette.label}`}
                aria-pressed={selectedPaletteId === idx}
              >
                <div className="flex gap-1">
                  <div className="h-6 w-6 rounded-full" style={{ background: palette.primary }} />
                  <div className="h-6 w-6 rounded-full" style={{ background: palette.secondary }} />
                </div>
                <span className="text-sm text-slate-300">{palette.label}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setStep('style')}
              className="px-6 py-2.5 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={handleColorConfirm}
              disabled={locked}
              className={cn(
                'px-6 py-2.5 rounded-lg font-medium transition-all',
                !locked
                  ? 'bg-brand-accent text-brand-deep hover:bg-brand-accent/90'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              )}
            >
              {locked ? 'Avatar Locked' : 'Lock Avatar →'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export { AVATAR_STYLES, COLOR_PALETTES }
export type { AvatarStyle }

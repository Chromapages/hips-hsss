'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface AvatarConfigState {
  styleId: number | null
  paletteId: number
  locked: boolean
}

interface UseAvatarConfigOptions {
  sessionId: string
  sessionToken: string
  initialStyleId?: number
  initialPaletteId?: number
  onLockChange?: (locked: boolean) => void
}

/**
 * Persists avatar selection to session token storage.
 * Locks the avatar once the session begins so it cannot be changed mid-session.
 * Uses session token as the storage key — avatar config persists
 * for the duration of the anonymous session, cleared on session end.
 */
export function useAvatarConfig({
  sessionId,
  sessionToken,
  initialStyleId,
  initialPaletteId,
  onLockChange,
}: UseAvatarConfigOptions) {
  const [config, setConfig] = useState<AvatarConfigState>({
    styleId: initialStyleId ?? null,
    paletteId: initialPaletteId ?? 0,
    locked: false,
  })

  const lockRef = useRef(false)

  // Load persisted config from session storage on mount
  useEffect(() => {
    if (!sessionToken) return
    try {
      const stored = sessionStorage.getItem(`avatar_${sessionToken}`)
      if (stored) {
        const parsed = JSON.parse(stored) as AvatarConfigState
        setConfig(parsed)
        onLockChange?.(parsed.locked)
      }
    } catch {
      // sessionStorage unavailable or corrupted — start fresh
    }
  }, [sessionToken, onLockChange])

  // Persist config changes to session storage
  useEffect(() => {
    if (!sessionToken) return
    try {
      sessionStorage.setItem(`avatar_${sessionToken}`, JSON.stringify(config))
    } catch {
      // sessionStorage unavailable — ignore
    }
  }, [sessionToken, config])

  const selectStyle = useCallback((styleId: number) => {
    if (config.locked) return
    setConfig((c) => ({ ...c, styleId }))
  }, [config.locked])

  const selectPalette = useCallback((paletteId: number) => {
    if (config.locked) return
    setConfig((c) => ({ ...c, paletteId }))
  }, [config.locked])

  const lock = useCallback(() => {
    if (lockRef.current) return
    lockRef.current = true
    setConfig((c) => ({ ...c, locked: true }))
    onLockChange?.(true)
  }, [onLockChange])

  const clear = useCallback(() => {
    if (!sessionToken) return
    try {
      sessionStorage.removeItem(`avatar_${sessionToken}`)
    } catch {
      // ignore
    }
    setConfig({ styleId: null, paletteId: 0, locked: false })
    lockRef.current = false
    onLockChange?.(false)
  }, [sessionToken, onLockChange])

  return {
    styleId: config.styleId,
    paletteId: config.paletteId,
    locked: config.locked,
    selectStyle,
    selectPalette,
    lock,
    clear,
  }
}

export type { AvatarConfigState, UseAvatarConfigOptions }
'use client'

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Environment, Text } from '@react-three/drei'
import * as THREE from 'three'
import { cn, AVATAR_COLORS } from '@hips/ui'

interface Participant {
  id: string
  avatarStyleId: number
  paletteId: number
  displayName: string
  isMuted: boolean
  isSpeaking: boolean
  isFacilitator: boolean
  position: [number, number, number]
}

interface GesturePreset {
  participantId: string
  gesture: 'Wave' | 'Raise Hand' | 'Nod' | 'Shrug' | 'Lean Forward'
  timestamp: number
}

interface VirtualOfficeProps {
  sessionId: string
  participants: Participant[]
  localParticipantId: string
  gestures?: GesturePreset[]
  onParticipantClick?: (participantId: string) => void
  className?: string
}

// Avatar geometry component
function AvatarMesh({
  primaryColor,
  accentColor,
  isSpeaking,
  isFacilitator,
}: {
  primaryColor: string
  accentColor: string
  isSpeaking: boolean
  isFacilitator: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const targetScale = useRef(1)

  useFrame((state) => {
    if (!meshRef.current) return
    // Breathing/speaking animation
    if (isSpeaking) {
      targetScale.current = 1.08 + Math.sin(state.clock.elapsedTime * 8) * 0.02
    } else {
      targetScale.current = 1
    }
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale.current, targetScale.current, targetScale.current),
      0.1
    )
  })

  return (
    <group>
      {/* Head */}
      <mesh ref={meshRef} position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color={primaryColor} roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Body */}
      <mesh position={[0, -0.2, 0]}>
        <capsuleGeometry args={[0.28, 0.6, 8, 16]} />
        <meshStandardMaterial color={accentColor} roughness={0.5} metalness={0.1} />
      </mesh>
      {/* Facilitator ring */}
      {isFacilitator && (
        <mesh position={[0, 0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.55, 0.65, 32]} />
          <meshStandardMaterial color="#F2CC8F" roughness={0.3} metalness={0.5} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  )
}

// Floor grid
function OfficeFloor() {
  const gridRef = useRef<THREE.GridHelper>(null)
  return (
    <gridHelper
      ref={gridRef}
      args={[20, 20, '#3D405B', '#2D405B']}
      position={[0, -1.5, 0]}
    />
  )
}

// Seating circle arrangement
function getSeatingPosition(index: number, total: number): [number, number, number] {
  if (total === 1) return [0, 0, 0]
  const radius = 4
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2
  return [Math.cos(angle) * radius, 0, Math.sin(angle) * radius]
}

// Participant avatar in the scene
function ParticipantAvatar({
  participant,
  onClick,
}: {
  participant: Participant
  onClick?: (id: string) => void
}) {
  const groupRef = useRef<THREE.Group>(null)
  const nameplateRef = useRef<THREE.Mesh>(null)

  // Use default colors for unmapped style IDs
  const colors = AVATAR_COLORS[(participant.avatarStyleId - 1) % AVATAR_COLORS.length]
  const [x, y, z] = participant.position

  return (
    <group
      ref={groupRef}
      position={[x, y, z]}
      onClick={() => onClick?.(participant.id)}
    >
      <AvatarMesh
        primaryColor={colors.primary}
        accentColor={colors.accent}
        isSpeaking={participant.isSpeaking}
        isFacilitator={participant.isFacilitator}
      />
      {/* Speaking indicator ring */}
      {participant.isSpeaking && (
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.6, 0.75, 32]} />
          <meshStandardMaterial color="#81B29A" transparent opacity={0.7} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  )
}

// Camera controller
function FixedIsometricCamera() {
  const { camera } = useThree()
  useEffect(() => {
    camera.position.set(8, 8, 8)
    camera.lookAt(0, 0, 0)
  }, [camera])
  return null
}

// Main scene content
function SceneContent({
  participants,
  gestures,
  onParticipantClick,
}: {
  participants: Participant[]
  gestures?: GesturePreset[]
  onParticipantClick?: (id: string) => void
}) {
  return (
    <>
      <FixedIsometricCamera />
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#F2CC8F" />
      <pointLight position={[-10, 5, -10]} intensity={0.6} color="#81B29A" />

      {/* Office room shell */}
      <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#1B263B" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 2, -10]}>
        <planeGeometry args={[30, 15]} />
        <meshStandardMaterial color="#2D405B" roughness={0.8} metalness={0.05} />
      </mesh>

      {/* Side walls */}
      <mesh position={[-10, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[20, 15]} />
        <meshStandardMaterial color="#253347" roughness={0.8} metalness={0.05} />
      </mesh>
      <mesh position={[10, 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[20, 15]} />
        <meshStandardMaterial color="#253347" roughness={0.8} metalness={0.05} />
      </mesh>

      <OfficeFloor />

      {/* Participants */}
      {participants.map((p) => (
        <ParticipantAvatar
          key={p.id}
          participant={p}
          onClick={onParticipantClick}
        />
      ))}
    </>
  )
}

export function VirtualOffice({
  sessionId,
  participants,
  localParticipantId,
  gestures,
  onParticipantClick,
  className,
}: VirtualOfficeProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full h-full min-h-[400px] rounded-2xl overflow-hidden bg-[#1B263B]',
        className
      )}
    >
      {/* Session ID badge */}
      <div className="absolute top-3 left-3 z-10 px-3 py-1.5 bg-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-700">
        <span className="text-xs font-mono text-slate-300">{sessionId}</span>
      </div>

      {/* Participant count */}
      <div className="absolute top-3 right-3 z-10 px-3 py-1.5 bg-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-700">
        <span className="text-xs text-slate-300">
          {participants.length} participant{participants.length !== 1 ? 's' : ''}
        </span>
      </div>

      <Canvas
        camera={{ position: [8, 8, 8], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#1B263B' }}
      >
        <SceneContent
          participants={participants}
          gestures={gestures}
          onParticipantClick={onParticipantClick}
        />
      </Canvas>

      {/* Gesture hint bar */}
      {gestures && gestures.length > 0 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {gestures.slice(-3).map((g) => (
            <div
              key={`${g.participantId}-${g.timestamp}`}
              className="px-3 py-1 bg-slate-900/80 backdrop-blur-sm rounded-full border border-slate-600"
            >
              <span className="text-xs text-slate-300">{g.gesture}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export type { Participant, GesturePreset }
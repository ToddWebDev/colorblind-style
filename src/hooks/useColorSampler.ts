import { useState, useRef, useCallback } from 'react'
import { CameraState } from '../types'
import { ColorSample } from '../types'
import { rgbToHsl, getColorName, analyzeMatch } from '../color/engine'
import { useMatchStore } from '../store/useMatchStore'

const ACQUIRING_DURATION = 1500
const SAMPLE_INTERVAL = 100

export function useColorSampler() {
  const [cameraState, setCameraState] = useState<CameraState>('idle')
  const [liveColorName, setLiveColorName] = useState<string>('')
  const [color1, setColor1] = useState<ColorSample | null>(null)
  const acquiringTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sampleTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const { setCurrentMatch } = useMatchStore()

  const simulateLiveSampling = useCallback(
    (targetRgb: { r: number; g: number; b: number }) => {
      if (sampleTimer.current) clearInterval(sampleTimer.current)
      sampleTimer.current = setInterval(() => {
        const hsl = rgbToHsl(targetRgb)
        const name = getColorName(hsl)
        setLiveColorName(name)
      }, SAMPLE_INTERVAL)
    },
    [],
  )

  const startAcquiring = useCallback(
    (targetRgb: { r: number; g: number; b: number }) => {
      if (cameraState === 'idle') {
        setCameraState('acquiring_1')
      } else if (cameraState === 'color1_locked') {
        setCameraState('acquiring_2')
      }

      if (acquiringTimer.current) clearTimeout(acquiringTimer.current)

      acquiringTimer.current = setTimeout(() => {
        const hsl = rgbToHsl(targetRgb)
        const name = getColorName(hsl)
        const sample: ColorSample = { rgb: targetRgb, hsl, name }

        if (cameraState === 'idle' || cameraState === 'acquiring_1') {
          setColor1(sample)
          setCameraState('color1_locked')
          if (sampleTimer.current) clearInterval(sampleTimer.current)
        } else if (
          cameraState === 'color1_locked' ||
          cameraState === 'acquiring_2'
        ) {
          if (color1) {
            const result = analyzeMatch(targetRgb, color1.rgb)
            setCurrentMatch(result)
            setCameraState('color2_locked')
            if (sampleTimer.current) clearInterval(sampleTimer.current)
          }
        }
      }, ACQUIRING_DURATION)
    },
    [cameraState, color1, setCurrentMatch],
  )

  const cancelAcquiring = useCallback(() => {
    if (acquiringTimer.current) clearTimeout(acquiringTimer.current)
    if (cameraState === 'acquiring_1') setCameraState('idle')
    if (cameraState === 'acquiring_2') setCameraState('color1_locked')
  }, [cameraState])

  const reset = useCallback(() => {
    if (acquiringTimer.current) clearTimeout(acquiringTimer.current)
    if (sampleTimer.current) clearInterval(sampleTimer.current)
    setCameraState('idle')
    setLiveColorName('')
    setColor1(null)
  }, [])

  return {
    cameraState,
    liveColorName,
    color1,
    startAcquiring,
    cancelAcquiring,
    simulateLiveSampling,
    reset,
  }
}

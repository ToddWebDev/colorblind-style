import { useState, useRef, useCallback } from 'react'
import { router } from 'expo-router'
import { ColorSample } from '../types'
import { rgbToHsl, getColorName, analyzeMatch } from '../color/engine'
import { useMatchStore } from '../store/useMatchStore'

const ACQUIRING_DURATION = 1500
const SAMPLE_INTERVAL = 100

export function useColorSampler() {
  const {
    cameraState,
    setCameraState,
    color1: storedColor1,
    setColor1: storeSetColor1,
    setCurrentMatch,
  } = useMatchStore()

  const [liveColorName, setLiveColorName] = useState<string>('')
  const [liveHsl, setLiveHsl] = useState<{
    h: number
    s: number
    l: number
  } | null>(null)
  const acquiringTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sampleTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  const simulateLiveSampling = useCallback(
    (targetRgb: { r: number; g: number; b: number }) => {
      if (sampleTimer.current) clearInterval(sampleTimer.current)
      sampleTimer.current = setInterval(() => {
        const hsl = rgbToHsl(targetRgb)
        const name = getColorName(hsl)
        setLiveColorName(name)
        setLiveHsl(hsl)
      }, SAMPLE_INTERVAL)
    },
    [],
  )

  const startAcquiring = useCallback(
    (targetRgb: { r: number; g: number; b: number }) => {
      console.log(
        'startAcquiring called, cameraState:',
        cameraState,
        'storedColor1:',
        storedColor1?.name,
      )

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
          storeSetColor1(sample)
          setCameraState('color1_locked')
          if (sampleTimer.current) clearInterval(sampleTimer.current)
          router.replace('/color-detail')
        } else if (
          cameraState === 'color1_locked' ||
          cameraState === 'acquiring_2'
        ) {
          if (storedColor1) {
            const result = analyzeMatch(storedColor1.rgb, targetRgb)
            setCurrentMatch(result)
            setCameraState('color2_locked')
            if (sampleTimer.current) clearInterval(sampleTimer.current)
            router.replace('/color-match-results')
          }
        }
      }, ACQUIRING_DURATION)
    },
    [
      cameraState,
      storedColor1,
      setCurrentMatch,
      storeSetColor1,
      setCameraState,
    ],
  )

  const cancelAcquiring = useCallback(() => {
    if (acquiringTimer.current) clearTimeout(acquiringTimer.current)
    if (cameraState === 'acquiring_1') setCameraState('idle')
    if (cameraState === 'acquiring_2') setCameraState('color1_locked')
  }, [cameraState, setCameraState])

  const reset = useCallback(() => {
    if (acquiringTimer.current) clearTimeout(acquiringTimer.current)
    if (sampleTimer.current) clearInterval(sampleTimer.current)
    setCameraState('idle')
    setLiveColorName('')
    setLiveHsl(null)
  }, [setCameraState])

  return {
    cameraState,
    liveColorName,
    liveHsl,
    storedColor1,
    startAcquiring,
    cancelAcquiring,
    simulateLiveSampling,
    reset,
  }
}

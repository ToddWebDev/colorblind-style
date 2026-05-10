import { create } from 'zustand'
import { ColorSample, MatchResult, CameraState } from '../types'
import { insertMatch, insertSingleColor } from '../db/queries'

type MatchStore = {
  color1: ColorSample | null
  color2: ColorSample | null
  currentMatch: MatchResult | null
  cameraState: CameraState
  setCameraState: (state: CameraState) => void
  setColor1: (sample: ColorSample) => void
  setColor2: (sample: ColorSample) => void
  setCurrentMatch: (match: MatchResult) => void
  saveCurrentMatch: () => void
  saveSingleColor: () => void
  clearCurrentMatch: () => void
  clearColor1: () => void
}

export const useMatchStore = create<MatchStore>((set, get) => ({
  color1: null,
  color2: null,
  currentMatch: null,
  cameraState: 'idle',

  setCameraState: (state) => set({ cameraState: state }),
  setColor1: (sample) => set({ color1: sample }),
  setColor2: (sample) => set({ color2: sample }),
  setCurrentMatch: (match) => set({ currentMatch: match }),

  saveCurrentMatch: () => {
    const { currentMatch } = get()
    if (!currentMatch) return
    insertMatch(currentMatch)
  },

  saveSingleColor: () => {
    const { color1 } = get()
    if (!color1) return
    insertSingleColor(color1)
  },

  clearCurrentMatch: () =>
    set({
      currentMatch: null,
      color1: null,
      color2: null,
      cameraState: 'idle',
    }),

  clearColor1: () =>
    set({
      color1: null,
      cameraState: 'idle',
    }),
}))

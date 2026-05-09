import { create } from 'zustand'
import { ColorSample, MatchResult } from '../types'

type MatchStore = {
  color1: ColorSample | null
  color2: ColorSample | null
  currentMatch: MatchResult | null
  savedMatches: MatchResult[]
  setColor1: (sample: ColorSample) => void
  setColor2: (sample: ColorSample) => void
  setCurrentMatch: (match: MatchResult) => void
  saveCurrentMatch: () => void
  clearCurrentMatch: () => void
}

export const useMatchStore = create<MatchStore>((set, get) => ({
  color1: null,
  color2: null,
  currentMatch: null,
  savedMatches: [],

  setColor1: (sample) => set({ color1: sample }),
  setColor2: (sample) => set({ color2: sample }),

  setCurrentMatch: (match) => set({ currentMatch: match }),

  saveCurrentMatch: () => {
    const { currentMatch, savedMatches } = get()
    if (!currentMatch) return
    set({ savedMatches: [currentMatch, ...savedMatches] })
  },

  clearCurrentMatch: () =>
    set({
      currentMatch: null,
      color1: null,
      color2: null,
    }),
}))

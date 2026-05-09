import { RGB, HSL, ColorSample, ColorRelationship, MatchResult } from '../types'
import colorNames from './names.json'

export function rgbToHsl({ r, g, b }: RGB): HSL {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1))

    switch (max) {
      case r:
        h = ((g - b) / delta) % 6
        break
      case g:
        h = (b - r) / delta + 2
        break
      case b:
        h = (r - g) / delta + 4
        break
    }

    h = Math.round(h * 60)
    if (h < 0) h += 360
  }

  return {
    h,
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

export function getColorName(hsl: HSL): string {
  const entries = colorNames as Array<{
    name: string
    hMin: number
    hMax: number
    sMin: number
    sMax: number
    lMin: number
    lMax: number
  }>

  const exactMatch = entries.find(
    ({ hMin, hMax, sMin, sMax, lMin, lMax }) =>
      hsl.h >= hMin &&
      hsl.h <= hMax &&
      hsl.s >= sMin &&
      hsl.s <= sMax &&
      hsl.l >= lMin &&
      hsl.l <= lMax,
  )

  if (exactMatch) return exactMatch.name

  // fallback: find closest match by hue alone
  const closest = entries.reduce((prev, curr) => {
    const prevMidHue = (prev.hMin + prev.hMax) / 2
    const currMidHue = (curr.hMin + curr.hMax) / 2
    const prevDist = Math.min(
      Math.abs(hsl.h - prevMidHue),
      360 - Math.abs(hsl.h - prevMidHue),
    )
    const currDist = Math.min(
      Math.abs(hsl.h - currMidHue),
      360 - Math.abs(hsl.h - currMidHue),
    )
    return currDist < prevDist ? curr : prev
  })

  return closest.name
}

export function hueDistance(h1: number, h2: number): number {
  const diff = Math.abs(h1 - h2)
  return Math.min(diff, 360 - diff)
}

export function classifyRelationship(
  distance: number,
  s1: number,
  s2: number,
): ColorRelationship {
  const avgSaturation = (s1 + s2) / 2
  if (avgSaturation < 15) return 'neutral'
  if (distance <= 30) return 'analogous'
  if (distance >= 150 && distance <= 210) return 'complementary'
  if (distance >= 110 && distance <= 130) return 'triadic'
  if (distance >= 140 && distance <= 150) return 'split-complementary'
  return 'neutral'
}

export function scoreMatch(
  distance: number,
  relationship: ColorRelationship,
  s1: number,
  s2: number,
): number {
  const avgSaturation = (s1 + s2) / 2
  if (avgSaturation < 15) return Math.round(avgSaturation * 2)

  switch (relationship) {
    case 'complementary':
      return 95
    case 'analogous':
      return Math.round(90 - (distance / 30) * 20)
    case 'triadic':
      return 80
    case 'split-complementary':
      return 75
    case 'neutral':
      return Math.round(Math.max(10, 70 - (distance / 180) * 40))
  }
}

export function analyzeMatch(rgb1: RGB, rgb2: RGB): MatchResult {
  const hsl1 = rgbToHsl(rgb1)
  const hsl2 = rgbToHsl(rgb2)

  const name1 = getColorName(hsl1)
  const name2 = getColorName(hsl2)

  const distance = hueDistance(hsl1.h, hsl2.h)
  const relationship = classifyRelationship(distance, hsl1.s, hsl2.s)
  const score = scoreMatch(distance, relationship, hsl1.s, hsl2.s)

  return {
    score,
    relationship,
    color1: { rgb: rgb1, hsl: hsl1, name: name1 },
    color2: { rgb: rgb2, hsl: hsl2, name: name2 },
  }
}

export function suggestColors(
  hsl1: HSL,
  hsl2: HSL,
): Array<{ name: string; hsl: HSL }> {
  const avgHue = (hsl1.h + hsl2.h) / 2
  const saturation = 60
  const lightness = 50

  const candidates = [
    { hue: (avgHue + 180) % 360, label: 'complementary' },
    { hue: (avgHue + 120) % 360, label: 'triadic-1' },
    { hue: (avgHue + 240) % 360, label: 'triadic-2' },
  ]

  return candidates.map(({ hue }) => {
    const hsl: HSL = { h: Math.round(hue), s: saturation, l: lightness }
    return {
      name: getColorName(hsl),
      hsl,
    }
  })
}

export type CameraState =
  | 'idle'
  | 'acquiring_1'
  | 'color1_locked'
  | 'acquiring_2'
  | 'color2_locked'
  | 'low_light'

export type RGB = {
  r: number
  g: number
  b: number
}

export type HSL = {
  h: number
  s: number
  l: number
}

export type ColorSample = {
  rgb: RGB
  hsl: HSL
  name: string
}

export type ColorRelationship =
  | 'analogous'
  | 'complementary'
  | 'triadic'
  | 'split-complementary'
  | 'neutral'

export type MatchResult = {
  score: number
  relationship: ColorRelationship
  color1: ColorSample
  color2: ColorSample
  createdAt?: number
}

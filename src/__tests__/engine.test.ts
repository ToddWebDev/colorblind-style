import {
  rgbToHsl,
  hueDistance,
  classifyRelationship,
  scoreMatch,
  analyzeMatch,
  suggestColors,
} from '../color/engine'

describe('rgbToHsl', () => {
  it('converts red correctly', () => {
    expect(rgbToHsl({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, l: 50 })
  })

  it('converts white correctly', () => {
    expect(rgbToHsl({ r: 255, g: 255, b: 255 })).toEqual({ h: 0, s: 0, l: 100 })
  })

  it('converts black correctly', () => {
    expect(rgbToHsl({ r: 0, g: 0, b: 0 })).toEqual({ h: 0, s: 0, l: 0 })
  })

  it('converts a mustard-like color correctly', () => {
    const result = rgbToHsl({ r: 204, g: 173, b: 82 })
    expect(result.h).toBeGreaterThanOrEqual(42)
    expect(result.h).toBeLessThanOrEqual(55)
  })
})

describe('hueDistance', () => {
  it('computes direct distance', () => {
    expect(hueDistance(30, 60)).toBe(30)
  })

  it('computes wraparound distance', () => {
    expect(hueDistance(10, 350)).toBe(20)
  })

  it('returns 0 for identical hues', () => {
    expect(hueDistance(120, 120)).toBe(0)
  })
})

describe('classifyRelationship', () => {
  it('classifies analogous', () => {
    expect(classifyRelationship(35, 60, 60)).toBe('analogous')
  })

  it('classifies complementary', () => {
    expect(classifyRelationship(180, 60, 60)).toBe('complementary')
  })

  it('classifies triadic', () => {
    expect(classifyRelationship(120, 60, 60)).toBe('triadic')
  })

  it('classifies split-complementary', () => {
    expect(classifyRelationship(155, 60, 60)).toBe('split-complementary')
  })

  it('classifies neutral by distance', () => {
    expect(classifyRelationship(90, 60, 60)).toBe('neutral')
  })

  it('classifies neutral by low saturation', () => {
    expect(classifyRelationship(20, 10, 10)).toBe('neutral')
  })
})

describe('scoreMatch', () => {
  it('scores complementary highly', () => {
    expect(scoreMatch(180, 'complementary', 60, 60)).toBe(95)
  })

  it('scores analogous colors at close distance highly', () => {
    expect(scoreMatch(0, 'analogous', 60, 60)).toBe(90)
  })

  it('scores neutral matches above 0', () => {
    expect(scoreMatch(90, 'neutral', 60, 60)).toBeGreaterThan(0)
  })

  it('scores low saturation colors very low', () => {
    expect(scoreMatch(0, 'neutral', 10, 10)).toBeLessThan(30)
  })
})

describe('analyzeMatch', () => {
  it('returns a valid match result', () => {
    const result = analyzeMatch(
      { r: 204, g: 173, b: 82 },
      { r: 210, g: 105, b: 80 },
    )
    expect(result.score).toBeGreaterThan(0)
    expect(result.score).toBeLessThanOrEqual(100)
    expect(result.relationship).toBeDefined()
    expect(result.color1.name).toBeDefined()
    expect(result.color2.name).toBeDefined()
  })
})

describe('suggestColors', () => {
  it('returns three suggestions', () => {
    const hsl1: HSL = { h: 45, s: 60, l: 50 }
    const hsl2: HSL = { h: 50, s: 55, l: 45 }
    const suggestions = suggestColors(hsl1, hsl2)
    expect(suggestions).toHaveLength(3)
  })

  it('suggestion names are defined', () => {
    const hsl1: HSL = { h: 45, s: 60, l: 50 }
    const hsl2: HSL = { h: 50, s: 55, l: 45 }
    const suggestions = suggestColors(hsl1, hsl2)
    suggestions.forEach((s) => expect(s.name).toBeDefined())
  })
})

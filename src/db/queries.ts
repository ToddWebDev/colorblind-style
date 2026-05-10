import { db } from './schema'
import { MatchResult } from '../types'
import { ColorSample } from '../types'

export function insertMatch(match: MatchResult): void {
  db.runSync(
    `INSERT INTO saved_matches (
      type, score, relationship,
      color1_h, color1_s, color1_l, color1_name,
      color2_h, color2_s, color2_l, color2_name,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'match',
      match.score,
      match.relationship,
      match.color1.hsl.h,
      match.color1.hsl.s,
      match.color1.hsl.l,
      match.color1.name,
      match.color2.hsl.h,
      match.color2.hsl.s,
      match.color2.hsl.l,
      match.color2.name,
      Date.now(),
    ],
  )
}

export function insertSingleColor(sample: ColorSample): void {
  db.runSync(
    `INSERT INTO saved_matches (
      type,
      color1_h, color1_s, color1_l, color1_name,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      'single',
      sample.hsl.h,
      sample.hsl.s,
      sample.hsl.l,
      sample.name,
      Date.now(),
    ],
  )
}

export type SavedEntry = {
  id: number
  type: 'single' | 'match'
  score?: number
  relationship?: string
  color1: ColorSample
  color2?: ColorSample
  createdAt: number
}

export function fetchMatches(): SavedEntry[] {
  const rows = db.getAllSync<{
    id: number
    type: string
    score: number | null
    relationship: string | null
    color1_h: number
    color1_s: number
    color1_l: number
    color1_name: string
    color2_h: number | null
    color2_s: number | null
    color2_l: number | null
    color2_name: string | null
    created_at: number
  }>('SELECT * FROM saved_matches ORDER BY created_at DESC')

  return rows.map((row) => ({
    id: row.id,
    type: row.type as 'single' | 'match',
    score: row.score ?? undefined,
    relationship: row.relationship ?? undefined,
    color1: {
      rgb: { r: 0, g: 0, b: 0 },
      hsl: { h: row.color1_h, s: row.color1_s, l: row.color1_l },
      name: row.color1_name,
    },
    color2: row.color2_name
      ? {
          rgb: { r: 0, g: 0, b: 0 },
          hsl: { h: row.color2_h!, s: row.color2_s!, l: row.color2_l! },
          name: row.color2_name,
        }
      : undefined,
    createdAt: row.created_at,
  }))
}

export function deleteEntry(id: number): void {
  db.runSync('DELETE FROM saved_matches WHERE id = ?', [id])
}

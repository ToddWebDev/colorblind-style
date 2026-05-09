import { db } from './schema'
import { MatchResult } from '../types'

export function insertMatch(match: MatchResult): void {
  db.runSync(
    `INSERT INTO saved_matches (
      score, relationship,
      color1_h, color1_s, color1_l, color1_name,
      color2_h, color2_s, color2_l, color2_name,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
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

export function fetchMatches(): MatchResult[] {
  const rows = db.getAllSync<{
    score: number
    relationship: string
    color1_h: number
    color1_s: number
    color1_l: number
    color1_name: string
    color2_h: number
    color2_s: number
    color2_l: number
    color2_name: string
    created_at: number
  }>('SELECT * FROM saved_matches ORDER BY created_at DESC')

  return rows.map((row) => ({
    score: row.score,
    relationship: row.relationship as MatchResult['relationship'],
    color1: {
      rgb: { r: 0, g: 0, b: 0 },
      hsl: { h: row.color1_h, s: row.color1_s, l: row.color1_l },
      name: row.color1_name,
    },
    color2: {
      rgb: { r: 0, g: 0, b: 0 },
      hsl: { h: row.color2_h, s: row.color2_s, l: row.color2_l },
      name: row.color2_name,
    },
  }))
}

export function deleteMatch(score: number, createdAt: number): void {
  db.runSync('DELETE FROM saved_matches WHERE score = ? AND created_at = ?', [
    score,
    createdAt,
  ])
}

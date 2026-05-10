import * as SQLite from 'expo-sqlite'

export const db = SQLite.openDatabaseSync('colorblind-style.db')

export function initDatabase() {
  db.execSync(`DROP TABLE IF EXISTS saved_matches;`)
  db.execSync(`
    CREATE TABLE IF NOT EXISTS saved_matches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL DEFAULT 'match',
      score INTEGER,
      relationship TEXT,
      color1_h INTEGER NOT NULL,
      color1_s INTEGER NOT NULL,
      color1_l INTEGER NOT NULL,
      color1_name TEXT NOT NULL,
      color2_h INTEGER,
      color2_s INTEGER,
      color2_l INTEGER,
      color2_name TEXT,
      created_at INTEGER NOT NULL
    );
  `)
}

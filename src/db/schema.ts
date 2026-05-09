import * as SQLite from 'expo-sqlite'

export const db = SQLite.openDatabaseSync('colorblind-style.db')

export function initDatabase() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS saved_matches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      score INTEGER NOT NULL,
      relationship TEXT NOT NULL,
      color1_h INTEGER NOT NULL,
      color1_s INTEGER NOT NULL,
      color1_l INTEGER NOT NULL,
      color1_name TEXT NOT NULL,
      color2_h INTEGER NOT NULL,
      color2_s INTEGER NOT NULL,
      color2_l INTEGER NOT NULL,
      color2_name TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
  `)
}

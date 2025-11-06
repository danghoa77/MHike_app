//db/database.ts
import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

let db: SQLite.SQLiteDatabase;

if (Platform.OS === 'web') {
    console.warn('[SQLite] Web platform detected — using mock database (no persistence).');


    const mockDb: any = {
        execAsync: async () => { },
        runAsync: async () => { },
        getAllAsync: async () => [],
        getFirstAsync: async () => null,
        closeAsync: async () => { },
    };

    db = mockDb;
} else {

    db = SQLite.openDatabaseSync('mhike.db');
}

export const setupDatabase = async () => {
    if (Platform.OS === 'web') {
        console.log('[SQLite] Skipping table creation on web (mock mode).');
        return;
    }

    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS Hike (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      location TEXT,
      date TEXT,
      parkingAvailable INTEGER,
      length REAL,
      difficulty TEXT,
      description TEXT,
      images TEXT
    );

    CREATE TABLE IF NOT EXISTS Observation (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      description TEXT,
      hikeId INTEGER,
      FOREIGN KEY (hikeId) REFERENCES Hike(id) ON DELETE CASCADE
    );
  `);
};

export default db;

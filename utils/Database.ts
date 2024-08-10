import { SQLiteDatabase } from "expo-sqlite/next";
import * as FileSystem from "expo-file-system";

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  console.log(FileSystem.documentDirectory);

  const DATABASE_VERSION = 1;
  let result = await db.getFirstAsync<{ userVersion: number }>(
    "PRAGMA user_version"
  );
  let currentDbVersion = result?.userVersion ?? 0;

  if (currentDbVersion >= DATABASE_VERSION) {
    console.log("Database is up to date");
    return;
  }
  if (currentDbVersion === 0) {
    const result = await db.execAsync(`
        PRAGMA journal_mode = 'wal';
        
        CREATE TABLE chats (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL);

        CREATE TABLE messages (
        id INTEGER PRIMARY KEY NOT NULL, 
        chat_id INTEGER NOT NULL, 
        content TEXT NOT NULL, 
        imageUrl TEXT, 
        role TEXT, 
        prompt TEXT, 
        FOREIGN KEY (chat_id) REFERENCES chats (id) ON DELETE CASCADE
        );
    `);

    console.log(result);

    currentDbVersion = 1;
  }
  // if (currentDbVersion === 1) {
  //   Add more migrations
  // }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

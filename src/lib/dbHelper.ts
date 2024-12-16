import { openDB } from 'idb';


const CACHE_EXPIRY = 48 * 60 * 60 * 1000; // 48 hours

export type CachedData = {
    blob: Blob,
    arrayBuffer: ArrayBuffer
}

type CachedValue = {
    data: CachedData,
    timestamp: number
}

const DB_NAME = 'ytAudioStreamsDB';
const STORE_NAME = 'streams';

const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
};
// key = videoId
export const getFromCache = async (key:string):Promise<CachedData | null> => {
  const db = await initDB();
  const cachedValue = await db.get(STORE_NAME, key);
  if (cachedValue) {
    const isExpired = Date.now() - cachedValue.timestamp > CACHE_EXPIRY;
    if (isExpired) {
      await db.delete(STORE_NAME, key); // Clear expired data
      return null;
    }
    return cachedValue.data;
  }
  return null;
};

export const saveToCache = async (key:string, value:CachedData) => {
  const db = await initDB();
  const cachedValue:CachedValue = { data: value, timestamp: Date.now() };
  return db.put(STORE_NAME, cachedValue, key);
};

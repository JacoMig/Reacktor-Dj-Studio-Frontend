import { openDB } from 'idb'
import { DB_NAME, PLAYLIST_TABLE, YTSTREAMS_TABLE } from '../constants'

const CACHE_EXPIRY = 48 * 60 * 60 * 1000 // 48 hours

export type CachedData = {
    blob: Blob
    arrayBuffer: ArrayBuffer
}


const initDB = async () => {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(YTSTREAMS_TABLE)) {
                const store = db.createObjectStore(YTSTREAMS_TABLE, {
                    keyPath: 'id',
                    autoIncrement: true,
                })
                store.createIndex('videoIdIndex', 'videoId', { unique: true });
            }
            if (!db.objectStoreNames.contains(PLAYLIST_TABLE)) {
                db.createObjectStore(PLAYLIST_TABLE, {
                    keyPath: 'id',
                    autoIncrement: true,
                })
            }
        },
    })
}

// key = videoId
export const getRecordByKey = async <T>(
    key: string,
    STORE_NAME: string
): Promise<T | null> => {
    const db = await initDB()

    const cachedValue = await db.get(STORE_NAME, key)
   
    if (cachedValue) {
        const isExpired = Date.now() - cachedValue.timestamp > CACHE_EXPIRY
        if (isExpired) {
            await db.delete(STORE_NAME, key) // Clear expired data
            return null
        }
        return cachedValue.data
    }
    return null
}



export const getAllFromCache = async (STORE_NAME: string) => {
    const db = await initDB()
    return await db.getAll(STORE_NAME)
}

export const getRecordById = async (STORE_NAME:string, id: number) => {
  try {
    const db = await initDB()
    
    const record = await db.get(STORE_NAME, id);
    
    if (record) {
      console.log('Record found:', record);
        return record
    } else {
      console.log('Record not found.');
    }
  } catch (error) {
    console.error('Error retrieving record:', error);
  }
};

export const saveToCache = async <T>(
    key: string,
    value: T,
    STORE_NAME: string
) => {
    const db = await initDB()
    console.log(value);
   
    
    if (STORE_NAME === PLAYLIST_TABLE)
        return db.add(STORE_NAME, { data: value, timestamp: Date.now() })
    else {
        return db.add(STORE_NAME, { data: value, timestamp: Date.now() }, key)
    } 
}

export const removeRecordById = async (STORE_NAME: string, id: number) => {
    try {
      const db = await initDB()
      await db.delete(STORE_NAME, id)
      console.log(`Record with ID ${id} removed from ${STORE_NAME}`)
    } catch (error) {
      console.error('Error removing record:', error)
    }
  }

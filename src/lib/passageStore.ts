import type { PassageContent } from './bibleApi'

const DB_NAME = 'abide-passages-v1'
const STORE = 'passages'
const MAX_ENTRIES = 120

type StoredPassage = {
  key: string
  content: PassageContent
  savedAt: number
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB unavailable'))
      return
    }
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'key' })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error ?? new Error('IndexedDB open failed'))
  })
}

export async function readStoredPassage(key: string): Promise<PassageContent | null> {
  try {
    const db = await openDb()
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly')
      const req = tx.objectStore(STORE).get(key)
      req.onsuccess = () => {
        const row = req.result as StoredPassage | undefined
        resolve(row?.content ?? null)
      }
      req.onerror = () => reject(req.error)
    })
  } catch {
    return null
  }
}

export async function writeStoredPassage(key: string, content: PassageContent): Promise<void> {
  try {
    const db = await openDb()
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite')
      tx.objectStore(STORE).put({ key, content, savedAt: Date.now() } satisfies StoredPassage)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
    await trimStore(db)
  } catch {
    // Persistence is best-effort
  }
}

async function trimStore(db: IDBDatabase): Promise<void> {
  const all = await new Promise<StoredPassage[]>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).getAll()
    req.onsuccess = () => resolve((req.result as StoredPassage[]) ?? [])
    req.onerror = () => reject(req.error)
  })
  if (all.length <= MAX_ENTRIES) return
  all.sort((a, b) => a.savedAt - b.savedAt)
  const drop = all.slice(0, all.length - MAX_ENTRIES)
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    const store = tx.objectStore(STORE)
    for (const row of drop) store.delete(row.key)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function clearStoredPassages(): Promise<void> {
  try {
    const db = await openDb()
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite')
      tx.objectStore(STORE).clear()
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch {
    /* ignore */
  }
}

/** True when the browser reports offline (may still have cached content). */
export function isBrowserOffline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine === false
}

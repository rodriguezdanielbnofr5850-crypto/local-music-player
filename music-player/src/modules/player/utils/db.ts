const DB_NAME = 'CyberAudioDB';
const DB_VER = 2;
const STORE_SONGS = 'songs';
const STORE_DIRS = 'dirs';
interface SongRecord {
    id: string;
    signature: string;
    name: string;
    artist: string;
    originalFileName: string;
    directoryId: string;
    file: File;
}
interface DirRecord {
    id: string;
    name: string;
}
function openDB(): Promise<IDBDatabase>{
    return new Promise((resolve, reject) => {
        const r = indexedDB.open(DB_NAME, DB_VER);
        r.onupgradeneeded = (e: IDBVersionChangeEvent) => {
            const db = (e.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_SONGS)) {
                db.createObjectStore(STORE_SONGS, { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains(STORE_DIRS)) {
                db.createObjectStore(STORE_DIRS, { keyPath: 'id' });
            }
        };
        r.onsuccess = (e : Event) => resolve((e.target as IDBOpenDBRequest).result);
        r.onerror = (e: Event) => reject((e.target as IDBOpenDBRequest).result);
    }
    )
}
export async function saveSong(s: SongRecord): Promise<void>{
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const t = db.transaction(STORE_SONGS, 'readwrite');
        t.objectStore(STORE_SONGS).put({
            id: s.id,
            signature: s.signature,
            name: s.name,
            artist: s.artist,
            originalFileName: s.originalFileName,
            directoryId: s.directoryId,
            file: s.file
        })
        t.oncomplete = () => resolve();
        t.onerror = (e: Event) => reject((e.target as IDBOpenDBRequest).error);
    }
    )
}
export async function loadSongs(): Promise<SongRecord[]>{
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const r = db.transaction(STORE_SONGS, 'readonly').objectStore(STORE_SONGS).getAll();
        r.onsuccess = (e: Event) => {
            const out = (e.target as IDBRequest<SongRecord[]>).result.map((item :any) => ({
                id: item.id,
                signature: item.signature || '',
                name: item.name,
                artist: item.artist,
                originalFileName: item.originalFileName,
                directoryId: item.directoryId,
                file: item.file
            }));
            resolve(out);
        };
        r.onerror = e => reject((e.target as IDBOpenDBRequest).error);
    })
}
export async function updateSongDir(id: string, dirId: string): Promise<void>{
    const db = await openDB();
    return new Promise((res, rej) => {
        const t = db.transaction(STORE_SONGS, 'readwrite'), st = t.objectStore(STORE_SONGS);
        const g = st.get(id);
        g.onsuccess = () => {
            const d = g.result;
            if (d) {
                d.directoryId = dirId;
                st.put(d);
            }
            res();
        };
        g.onerror = (e: Event) => rej((e.target as IDBOpenDBRequest).error);
    });
}
export async function delSong(id: string): Promise<void>{
    const db = await openDB();
    return new Promise((res, rej) => {
        const t = db.transaction(STORE_SONGS, 'readwrite');
        t.objectStore(STORE_SONGS).delete(id);
        t.oncomplete = () =>res();
        t.onerror = (e: Event) => rej((e.target as IDBOpenDBRequest).error);
    });
}
export async function saveDirs(dirs: DirRecord[]): Promise<void>{
    const db = await openDB();
    return new Promise((res, rej) => {
        const t = db.transaction(STORE_DIRS, 'readwrite');
        const st = t.objectStore(STORE_DIRS);
        st.clear();
        dirs.forEach(d => {
            st.put(d);
        });
        t.oncomplete = () => res();
        t.onerror = (e: Event) => rej((e.target as IDBOpenDBRequest).error);
    });
}


export async function loadDirs(): Promise<DirRecord[]>{
    const db = await openDB();
    return new Promise((res, rej) => {
        const t = db.transaction(STORE_DIRS, 'readonly');
        const st = t.objectStore(STORE_DIRS);
        const req = st.getAll();
        req.onsuccess = e => res((e.target as IDBRequest<DirRecord[]>).result);
        req.onerror = e => rej((e.target as IDBOpenDBRequest).error);
    });
}
/**
 * Lightweight IndexedDB helper — no external dependencies.
 * Stores: MeetingPrep | CommunicationDraft | Record | _outbox
 */

const DB_NAME    = 'navigator-offline-db';
const DB_VERSION = 1;
const STORES     = ['MeetingPrep', 'CommunicationDraft', 'Record', '_outbox'];

let _db = null;

function openDB() {
  if (_db) return Promise.resolve(_db);
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      STORES.forEach(name => {
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name, { keyPath: 'id' });
        }
      });
    };
    req.onsuccess  = (e) => { _db = e.target.result; resolve(_db); };
    req.onerror    = (e) => reject(e.target.error);
  });
}

function tx(storeName, mode = 'readonly') {
  return openDB().then(db => {
    const transaction = db.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);
    return store;
  });
}

function promisify(req) {
  return new Promise((res, rej) => {
    req.onsuccess = e => res(e.target.result);
    req.onerror   = e => rej(e.target.error);
  });
}

export async function getAll(storeName) {
  const store = await tx(storeName);
  return promisify(store.getAll());
}

export async function getById(storeName, id) {
  const store = await tx(storeName);
  return promisify(store.get(id));
}

export async function putOne(storeName, record) {
  const store = await tx(storeName, 'readwrite');
  return promisify(store.put(record));
}

export async function putMany(storeName, records) {
  const db    = await openDB();
  const txn   = db.transaction(storeName, 'readwrite');
  const store = txn.objectStore(storeName);
  return new Promise((res, rej) => {
    records.forEach(r => store.put(r));
    txn.oncomplete = () => res();
    txn.onerror    = e => rej(e.target.error);
  });
}

export async function removeOne(storeName, id) {
  const store = await tx(storeName, 'readwrite');
  return promisify(store.delete(id));
}

export async function clearStore(storeName) {
  const store = await tx(storeName, 'readwrite');
  return promisify(store.clear());
}

// ── Outbox helpers ────────────────────────────────────────────────────────────
let _outboxSeq = Date.now();

export async function addToOutbox(entry) {
  _outboxSeq++;
  const store = await tx('_outbox', 'readwrite');
  return promisify(store.put({ ...entry, id: String(_outboxSeq) }));
}

export async function getOutbox() {
  return getAll('_outbox');
}

export async function removeFromOutbox(id) {
  return removeOne('_outbox', id);
}
/**
 * Outbox-based sync manager.
 * Called automatically when the app goes online.
 */

import { base44 } from '@/api/base44Client';
import {
  getOutbox,
  removeFromOutbox,
  putMany,
  clearStore,
  getAll,
} from './offlineDB';

export const OFFLINE_ENTITIES = ['MeetingPrep', 'CommunicationDraft', 'Record'];

// ── Sync outbox to server ─────────────────────────────────────────────────────
export async function syncOutbox() {
  if (!navigator.onLine) return { synced: 0, failed: 0 };

  const items  = await getOutbox();
  if (!items.length) return { synced: 0, failed: 0 };

  let synced = 0, failed = 0;

  for (const item of items) {
    try {
      const { entity, operation, data, targetId } = item;
      const entityAPI = base44.entities[entity];

      if (operation === 'create') {
        const payload = { ...data };
        delete payload._offline;
        delete payload._pending;
        delete payload.id; // let server assign real id
        await entityAPI.create(payload);

      } else if (operation === 'update') {
        const payload = { ...data };
        delete payload._offline;
        delete payload._pending;
        delete payload.id;
        await entityAPI.update(targetId, payload);

      } else if (operation === 'delete') {
        await entityAPI.delete(targetId);
      }

      await removeFromOutbox(item.id);
      synced++;
    } catch (err) {
      console.warn('[Sync] Failed to sync item', item, err);
      failed++;
    }
  }

  return { synced, failed };
}

// ── Refresh local cache from server for all offline entities ─────────────────
export async function refreshLocalCache() {
  if (!navigator.onLine) return;

  for (const entityName of OFFLINE_ENTITIES) {
    try {
      const fresh = await base44.entities[entityName].list('-updated_date', 200);
      await clearStore(entityName);
      if (fresh?.length) await putMany(entityName, fresh);
    } catch (err) {
      console.warn(`[Sync] Failed to refresh cache for ${entityName}`, err);
    }
  }
}

// ── Full sync: push outbox then pull fresh data ───────────────────────────────
export async function fullSync(onProgress) {
  onProgress?.('syncing');
  const result = await syncOutbox();
  await refreshLocalCache();
  onProgress?.('done', result);
  return result;
}
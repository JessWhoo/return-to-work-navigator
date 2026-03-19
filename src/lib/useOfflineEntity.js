/**
 * Hook that wraps base44 entity calls with an offline-aware layer.
 * - Online:  calls base44 directly, then mirrors result to IndexedDB.
 * - Offline: reads from / writes to IndexedDB and queues mutations in the outbox.
 */

import { useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import {
  getAll,
  getById,
  putOne,
  putMany,
  removeOne,
  addToOutbox,
} from './offlineDB';

function tempId() {
  return `_local_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function useOfflineEntity(entityName) {
  const entityAPI = base44.entities[entityName];

  const list = useCallback(async (sort = '-updated_date', limit = 200) => {
    if (navigator.onLine) {
      const data = await entityAPI.list(sort, limit);
      if (data?.length) await putMany(entityName, data);
      return data ?? [];
    }
    return getAll(entityName);
  }, [entityName]);

  const get = useCallback(async (id) => {
    if (navigator.onLine) {
      const data = await entityAPI.get(id);
      if (data) await putOne(entityName, data);
      return data;
    }
    return getById(entityName, id);
  }, [entityName]);

  const create = useCallback(async (payload) => {
    if (navigator.onLine) {
      const created = await entityAPI.create(payload);
      if (created) await putOne(entityName, created);
      return created;
    }
    // Offline: store locally with a temp id and queue
    const localRecord = { ...payload, id: tempId(), _offline: true, _pending: 'create' };
    await putOne(entityName, localRecord);
    await addToOutbox({ entity: entityName, operation: 'create', data: localRecord });
    return localRecord;
  }, [entityName]);

  const update = useCallback(async (id, payload) => {
    if (navigator.onLine) {
      const updated = await entityAPI.update(id, payload);
      if (updated) await putOne(entityName, updated);
      return updated;
    }
    // Offline: optimistically update local record
    const existing = await getById(entityName, id) ?? {};
    const localRecord = { ...existing, ...payload, id, _offline: true, _pending: 'update' };
    await putOne(entityName, localRecord);
    await addToOutbox({ entity: entityName, operation: 'update', targetId: id, data: payload });
    return localRecord;
  }, [entityName]);

  const remove = useCallback(async (id) => {
    if (navigator.onLine) {
      await entityAPI.delete(id);
      await removeOne(entityName, id);
      return;
    }
    await removeOne(entityName, id);
    await addToOutbox({ entity: entityName, operation: 'delete', targetId: id });
  }, [entityName]);

  return { list, get, create, update, remove };
}
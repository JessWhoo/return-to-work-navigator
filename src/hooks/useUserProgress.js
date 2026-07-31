import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';

/**
 * Single source of truth for reading the signed-in user's UserProgress record.
 *
 * The query never fires until auth has fully resolved AND a real user id
 * exists. Firing earlier races the token load and produces the 401 on
 * /User/me + 403 on POST /UserProgress cascade (which surfaced as repeating
 * "Script error" unhandled rejections).
 *
 * @param {object|null} defaults - when provided and no record exists yet, a
 *   record is created with these fields. Pass null for read-only usage.
 */
export function useUserProgress(defaults = null) {
  const { isAuthenticated, user, isLoadingAuth } = useAuth();

  return useQuery({
    queryKey: ['userProgress'],
    enabled: !isLoadingAuth && !!isAuthenticated && !!user?.id,
    queryFn: async () => {
      const list = await base44.entities.UserProgress.list();
      if (list.length > 0) return list[0];
      if (!defaults) return null;

      // No record yet — create one. If the create is rejected (transient
      // token race with another tab/component), re-read rather than surfacing
      // the race as a hard error.
      try {
        return await base44.entities.UserProgress.create(defaults);
      } catch {
        const retry = await base44.entities.UserProgress.list().catch(() => []);
        return retry[0] || null;
      }
    },
    retry: (failureCount, err) => {
      const status = err?.response?.status ?? err?.status;
      return (status === 401 || status === 403) && failureCount < 1;
    },
    staleTime: 60_000,
  });
}

export default useUserProgress;
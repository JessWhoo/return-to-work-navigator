import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { isUnauthorizedError, reportUnauthorized } from '@/lib/sessionGuard';

export const queryClientInstance = new QueryClient({
	// An expired session surfaces once, as a "sign in again" notice, instead of
	// as a page of failed requests.
	queryCache: new QueryCache({
		onError: (error) => reportUnauthorized(error),
	}),
	mutationCache: new MutationCache({
		onError: (error) => reportUnauthorized(error),
	}),
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			// One retry for transient failures; a 401 cannot succeed on a retry.
			retry: (failureCount, error) => failureCount < 1 && !isUnauthorizedError(error),
		},
	},
});
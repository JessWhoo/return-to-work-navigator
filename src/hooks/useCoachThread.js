import { useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function useCoachThread(conversationId, onUpdate) {
  const queryClient = useQueryClient();
  const updateRef = useRef(onUpdate);
  updateRef.current = onUpdate;
  const thread = useQuery({
    queryKey: ['coach-thread', conversationId],
    queryFn: () => base44.agents.getConversation(conversationId),
    enabled: !!conversationId,
    refetchOnWindowFocus: 'always',
    refetchOnReconnect: 'always',
  });
  useEffect(() => {
    if (thread.data) updateRef.current(thread.data);
  }, [thread.data]);
  useEffect(() => {
    if (!conversationId) return;
    return base44.agents.subscribeToConversation(conversationId, data => {
      queryClient.setQueryData(['coach-thread', conversationId], data);
      updateRef.current(data);
    });
  }, [conversationId, queryClient]);
  return thread;
}
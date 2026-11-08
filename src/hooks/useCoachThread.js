import { useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

// Loads one saved coaching conversation and keeps it in sync. Replies are
// written by the platform agent in the background, and the realtime socket is
// not guaranteed to deliver inside every embed, so while a reply is pending we
// also re-read the thread until it lands.
export default function useCoachThread(conversationId, onUpdate, awaitingReply) {
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
  const { refetch } = thread;

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

  useEffect(() => {
    if (!conversationId || !awaitingReply) return;
    let attempts = 0;
    const timer = setInterval(() => {
      attempts += 1;
      if (attempts > 40) {
        clearInterval(timer);
        return;
      }
      refetch();
    }, 3000);
    return () => clearInterval(timer);
  }, [conversationId, awaitingReply, refetch]);

  return thread;
}
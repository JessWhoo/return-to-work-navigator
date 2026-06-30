import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import MessagesPanel from './MessagesPanel';
import { MessageCircle } from 'lucide-react';

export default function MessagesTab() {
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: allPeers = [] } = useQuery({
    queryKey: ['peerConnections'],
    queryFn: () => base44.entities.PeerConnection.filter({ is_active: true }),
    enabled: !!currentUser,
  });

  const myPeerProfile = allPeers.find(p => p.created_by === currentUser?.email) || null;

  return (
    <div className="space-y-4 py-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-teal-700/50 rounded-xl p-2.5">
          <MessageCircle className="h-5 w-5 text-teal-300" />
        </div>
        <div>
          <h2 className="text-white font-bold text-lg">Direct Messages</h2>
          <p className="text-slate-400 text-sm">Chat privately with your matched peers.</p>
        </div>
      </div>

      <MessagesPanel
        myPeerProfile={myPeerProfile}
        allPeers={allPeers}
      />
    </div>
  );
}
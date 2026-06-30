import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, ArrowLeft, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';

// Build a stable conversation key from two profile IDs
function convKey(a, b) {
  return [a, b].sort().join('_');
}

function MessageBubble({ msg, myProfileId }) {
  const isMe = msg.sender_profile_id === myProfileId;
  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
        isMe
          ? 'bg-teal-600 text-white rounded-br-sm'
          : 'bg-slate-700 text-slate-200 rounded-bl-sm'
      }`}>
        {!isMe && (
          <p className="text-xs font-semibold text-teal-300 mb-0.5">{msg.sender_display_name}</p>
        )}
        <p className="leading-relaxed">{msg.content}</p>
        <p className={`text-xs mt-1 ${isMe ? 'text-teal-200' : 'text-slate-500'}`}>
          {format(new Date(msg.created_date), 'h:mm a')}
        </p>
      </div>
    </div>
  );
}

function ConversationView({ myProfile, otherProfile, onBack }) {
  const queryClient = useQueryClient();
  const [text, setText] = useState('');
  const bottomRef = useRef(null);
  const key = convKey(myProfile.id, otherProfile.id);

  const { data: messages = [] } = useQuery({
    queryKey: ['directMessages', key],
    queryFn: () => base44.entities.DirectMessage.filter({ conversation_key: key }, 'created_date', 200),
    refetchInterval: 3000,
  });

  // Real-time subscription
  useEffect(() => {
    const unsub = base44.entities.DirectMessage.subscribe((event) => {
      if (event.data?.conversation_key === key) {
        queryClient.invalidateQueries(['directMessages', key]);
        queryClient.invalidateQueries(['dmConversations']);
      }
    });
    return unsub;
  }, [key, queryClient]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMutation = useMutation({
    mutationFn: () => base44.entities.DirectMessage.create({
      conversation_key: key,
      sender_profile_id: myProfile.id,
      sender_display_name: myProfile.display_name,
      content: text.trim(),
    }),
    onSuccess: () => {
      setText('');
      queryClient.invalidateQueries(['directMessages', key]);
      queryClient.invalidateQueries(['dmConversations']);
    }
  });

  const handleSend = () => {
    if (!text.trim()) return;
    sendMutation.mutate();
  };

  return (
    <div className="flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-700 bg-slate-800 rounded-t-xl">
        <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {otherProfile.display_name?.[0]?.toUpperCase()}
        </div>
        <div>
          <p className="text-white font-semibold text-sm">{otherProfile.display_name}</p>
          <p className="text-slate-400 text-xs">{otherProfile.industry}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 bg-slate-900/60">
        {messages.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <MessageCircle className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Send a message to start the conversation!</p>
          </div>
        )}
        {messages.map(msg => (
          <MessageBubble key={msg.id} msg={msg} myProfileId={myProfile.id} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-slate-700 bg-slate-800 rounded-b-xl flex gap-2">
        <Input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="Type a message…"
          className="bg-slate-900 border-slate-600 text-slate-200 placeholder:text-slate-500 flex-1"
        />
        <Button
          onClick={handleSend}
          disabled={!text.trim() || sendMutation.isPending}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default function MessagesPanel({ myPeerProfile, allPeers }) {
  const [openConv, setOpenConv] = useState(null); // { myProfile, otherProfile }

  const myProfile = myPeerProfile;

  const matchedProfiles = React.useMemo(() => {
    const results = [];
    if (myPeerProfile) {
      const sentIds = myPeerProfile.connection_requests_sent || [];
      const receivedIds = myPeerProfile.connection_requests_received || [];
      const matchedIds = new Set([...sentIds, ...receivedIds]);
      allPeers.forEach(p => {
        if (matchedIds.has(p.id)) results.push({ profile: p });
      });
    }
    // Deduplicate by profile id
    const seen = new Set();
    return results.filter(r => {
      if (seen.has(r.profile.id)) return false;
      seen.add(r.profile.id);
      return true;
    });
  }, [myPeerProfile, allPeers]);

  // Unread counts per conversation
  const queryClient = useQueryClient();
  const { data: recentMessages = [] } = useQuery({
    queryKey: ['dmConversations'],
    queryFn: () => base44.entities.DirectMessage.list('-created_date', 100),
    enabled: !!myProfile,
    refetchInterval: 5000,
  });

  const getUnread = (otherProfile) => {
    if (!myProfile) return 0;
    const key = convKey(myProfile.id, otherProfile.id);
    return recentMessages.filter(m =>
      m.conversation_key === key &&
      m.sender_profile_id !== myProfile.id &&
      !m.is_read
    ).length;
  };

  if (openConv) {
    return (
      <ConversationView
        myProfile={openConv.myProfile}
        otherProfile={openConv.otherProfile}
        onBack={() => setOpenConv(null)}
      />
    );
  }

  if (!myProfile) {
    return (
      <div className="text-center py-16 text-slate-400">
        <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
        <p className="font-medium">No profile yet</p>
        <p className="text-sm mt-1">Join the Peers program to start messaging matched connections.</p>
      </div>
    );
  }

  if (matchedProfiles.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
        <p className="font-medium">No connections yet</p>
        <p className="text-sm mt-1">Send connection requests in the Peers tab to unlock messaging.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-slate-400 text-sm">{matchedProfiles.length} connection{matchedProfiles.length !== 1 ? 's' : ''}</p>
      {matchedProfiles.map(({ profile }) => {
        const unread = getUnread(profile);
        return (
          <button
            key={profile.id}
            onClick={() => setOpenConv({ myProfile: myPeerProfile, otherProfile: profile })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-teal-500 transition-all text-left"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-bold flex-shrink-0">
              {profile.display_name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm">{profile.display_name}</p>
              <p className="text-slate-400 text-xs truncate">{profile.industry} · Peer</p>
            </div>
            {unread > 0 && (
              <span className="bg-teal-500 text-white text-xs font-bold rounded-full px-2 py-0.5 flex-shrink-0">
                {unread}
              </span>
            )}
            <Send className="h-4 w-4 text-slate-500 flex-shrink-0" />
          </button>
        );
      })}
    </div>
  );
}
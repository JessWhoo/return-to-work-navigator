import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Plus, Trash2, RefreshCw, Loader2, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

function getConversationPreview(conv) {
  const msgs = conv.messages || [];
  // Get the first user message as the title, then last assistant reply as preview
  const firstUser = msgs.find(m => m.role === 'user');
  const lastAssistant = [...msgs].reverse().find(m => m.role === 'assistant');
  return {
    title: firstUser?.content?.slice(0, 50) || conv.metadata?.name || 'New Conversation',
    preview: lastAssistant?.content?.slice(0, 80) || 'No reply yet',
    lastActivity: conv.updated_date || conv.created_date,
    msgCount: msgs.length,
  };
}

export default function ConversationHistory({
  conversations,
  selectedConversation,
  onSelect,
  onNew,
  onDelete,
  onRefresh,
  loading,
  error,
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-purple-400" />
          <span className="text-sm font-semibold text-slate-200">Conversations</span>
          {conversations.length > 0 && (
            <Badge className="bg-purple-700 text-purple-100 text-xs px-1.5 py-0">
              {conversations.length}
            </Badge>
          )}
        </div>
        <div className="flex gap-1">
          {onRefresh && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onRefresh}
              className="h-7 w-7 p-0 text-slate-400 hover:text-slate-200"
              title="Refresh"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            size="sm"
            onClick={onNew}
            className="h-7 px-2 bg-purple-600 hover:bg-purple-700 text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            New
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
          </div>
        ) : error ? (
          <div className="text-center py-6 text-red-400 text-xs space-y-2">
            <p>Failed to load conversations</p>
            <Button size="sm" onClick={onRefresh} className="bg-slate-600 hover:bg-slate-500 text-xs h-7">
              <RefreshCw className="h-3 w-3 mr-1" /> Retry
            </Button>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No conversations yet.<br />Start one below!
          </div>
        ) : (
          conversations.map((conv) => {
            const { title, preview, lastActivity, msgCount } = getConversationPreview(conv);
            const isActive = selectedConversation === conv.id;
            return (
              <div
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onSelect(conv.id)}
                className={`w-full text-left p-3 rounded-xl transition-all group relative cursor-pointer ${
                  isActive
                    ? 'bg-purple-700/80 border border-purple-500 shadow-lg shadow-purple-900/30'
                    : 'bg-slate-800/60 border border-slate-700/50 hover:bg-slate-700/60 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between gap-1.5">
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold truncate leading-snug ${isActive ? 'text-white' : 'text-slate-200'}`}>
                      {title.length > 48 ? title.slice(0, 48) + '\u2026' : title}
                    </p>
                    <p className={`text-xs mt-0.5 truncate leading-snug ${isActive ? 'text-purple-200/70' : 'text-slate-500'}`}>
                      {preview.length > 65 ? preview.slice(0, 65) + '\u2026' : preview}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      {lastActivity && (
                        <span className={`text-[10px] flex items-center gap-0.5 ${isActive ? 'text-purple-300/60' : 'text-slate-600'}`}>
                          <Clock className="h-2.5 w-2.5" />
                          {formatDistanceToNow(new Date(lastActivity), { addSuffix: true })}
                        </span>
                      )}
                      <span className={`text-[10px] ${isActive ? 'text-purple-300/60' : 'text-slate-600'}`}>
                        {msgCount} msg{msgCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  {isActive && onDelete && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
                      className="flex-shrink-0 p-1 rounded hover:bg-red-700/60 text-purple-300 hover:text-red-300 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete conversation"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
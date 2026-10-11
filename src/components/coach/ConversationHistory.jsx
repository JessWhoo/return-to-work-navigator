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
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Conversations</span>
          {conversations.length > 0 && (
            <Badge variant="secondary" className="px-1.5 py-0 text-xs">
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
              className="h-7 w-7 p-0"
              title="Refresh"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            size="sm"
            onClick={onNew}
            className="h-7 px-2 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            New
          </Button>
        </div>
      </div>

      <div className="flex-1 space-y-1.5 overflow-y-auto pr-1">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="space-y-2 py-6 text-center text-xs text-destructive">
            <p>Failed to load conversations</p>
            <Button size="sm" onClick={onRefresh} className="h-7 text-xs">
              <RefreshCw className="h-3 w-3" /> Retry
            </Button>
          </div>
        ) : conversations.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
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
                className={`group relative w-full cursor-pointer rounded-brand p-3 text-left transition-all ${
                  isActive
                    ? 'border border-primary bg-muted'
                    : 'border border-border bg-brand-surface hover:bg-muted'
                }`}
              >
                <div className="flex items-start justify-between gap-1.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-foreground">
                      {title.length > 48 ? title.slice(0, 48) + '\u2026' : title}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {preview.length > 65 ? preview.slice(0, 65) + '\u2026' : preview}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      {lastActivity && (
                        <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                          <Clock className="h-2.5 w-2.5" />
                          {formatDistanceToNow(new Date(lastActivity), { addSuffix: true })}
                        </span>
                      )}
                      <span className="text-[10px] text-muted-foreground">
                        {msgCount} msg{msgCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  {isActive && onDelete && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
                      className="nv-btn nv-btn--text nv-btn--icon shrink-0 text-destructive"
                      title="Delete conversation"
                      aria-label="Delete conversation"
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
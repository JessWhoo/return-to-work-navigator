import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';
import AgentMessageBubble from './AgentMessageBubble';

const STARTERS = [
  'Does cancer count as a disability under the ADA?',
  'Am I eligible for FMLA leave?',
  'My accommodation request was denied — what are my options?',
  'What should I be documenting right now?',
];

export default function LegalRightsAgentChat() {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    base44.agents
      .createConversation({
        agent_name: 'legal_rights_advisor',
        metadata: { name: 'Legal Rights Guidance', description: 'Workplace rights conversation' },
      })
      .then(setConversation);
  }, []);

  useEffect(() => {
    if (!conversation?.id) return;
    const unsubscribe = base44.agents.subscribeToConversation(conversation.id, (data) => {
      setMessages(data.messages || []);
    });
    return () => unsubscribe();
  }, [conversation?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text) => {
    const content = (text ?? input).trim();
    if (!content || !conversation || sending) return;
    setInput('');
    setSending(true);
    try {
      await base44.agents.addMessage(conversation, { role: 'user', content });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-16rem)] min-h-[28rem] bg-slate-50 border-2 border-slate-300 rounded-2xl overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-slate-700 font-semibold">Ask about your workplace rights, or start here:</p>
            <div className="grid gap-2">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  disabled={!conversation}
                  className="text-left text-sm bg-white border-2 border-slate-300 rounded-xl px-4 py-3 hover:border-violet-400 transition-colors font-medium"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <AgentMessageBubble key={i} message={m} />
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="border-t-2 border-slate-300 bg-white p-3 flex gap-2 items-end">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="Ask a question about your legal rights…"
          className="min-h-[44px] max-h-32 resize-none"
        />
        <Button onClick={() => send()} disabled={!conversation || sending || !input.trim()} className="h-11">
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
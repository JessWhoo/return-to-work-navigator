import ReactMarkdown from 'react-markdown';
import { Scale, User } from 'lucide-react';

export default function AgentMessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-violet-600 to-emerald-600 flex items-center justify-center">
          <Scale className="h-4 w-4 text-white" />
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 border-2 ${
          isUser
            ? 'bg-violet-600 border-violet-700 text-white'
            : 'bg-white border-slate-300 text-slate-900'
        }`}
      >
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        ) : (
          <ReactMarkdown className="prose prose-sm max-w-none prose-headings:font-bold prose-p:my-2">
            {message.content || '…'}
          </ReactMarkdown>
        )}
      </div>
      {isUser && (
        <div className="h-8 w-8 shrink-0 rounded-full bg-slate-200 flex items-center justify-center">
          <User className="h-4 w-4 text-slate-700" />
        </div>
      )}
    </div>
  );
}
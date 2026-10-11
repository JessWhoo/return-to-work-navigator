import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from "@/components/ui/button";
import { Copy, Zap, CheckCircle2, AlertCircle, Loader2, ChevronRight, Clock } from 'lucide-react';
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import ResponseRating from './ResponseRating';

const FunctionDisplay = ({ toolCall }) => {
    const [expanded, setExpanded] = useState(false);
    const name = toolCall?.name || 'Function';
    const status = toolCall?.status || 'pending';
    const results = toolCall?.results;
    
    const parsedResults = (() => {
        if (!results) return null;
        try {
            return typeof results === 'string' ? JSON.parse(results) : results;
        } catch {
            return results;
        }
    })();
    
    const isError = results && (
        (typeof results === 'string' && /error|failed/i.test(results)) ||
        (parsedResults?.success === false)
    );
    
    const statusConfig = {
        pending: { icon: Clock, color: 'text-muted-foreground', text: 'Pending' },
        running: { icon: Loader2, color: 'text-muted-foreground', text: 'Running...', spin: true },
        in_progress: { icon: Loader2, color: 'text-muted-foreground', text: 'Running...', spin: true },
        completed: isError ? 
            { icon: AlertCircle, color: 'text-destructive', text: 'Failed' } : 
            { icon: CheckCircle2, color: 'text-brand-secondary', text: 'Success' },
        success: { icon: CheckCircle2, color: 'text-brand-secondary', text: 'Success' },
        failed: { icon: AlertCircle, color: 'text-destructive', text: 'Failed' },
        error: { icon: AlertCircle, color: 'text-destructive', text: 'Failed' }
    }[status] || { icon: Zap, color: 'text-muted-foreground', text: '' };
    
    const Icon = statusConfig.icon;
    const formattedName = name.split('.').reverse().join(' ').toLowerCase();
    
    return (
        <div className="mt-2 text-xs">
            <button
                onClick={() => setExpanded(!expanded)}
                className={cn(
                    "flex min-h-11 flex-wrap items-center gap-2 rounded-brand border px-3 py-2 transition-colors",
                    "hover:bg-muted",
                    expanded ? "border-primary bg-muted" : "border-border bg-brand-surface"
                )}
            >
                <Icon className={cn("h-3 w-3", statusConfig.color, statusConfig.spin && "animate-spin")} />
                <span className="text-foreground">{formattedName}</span>
                {statusConfig.text && (
                    <span className={cn("text-muted-foreground", isError && "text-destructive")}>
                        • {statusConfig.text}
                    </span>
                )}
                {!statusConfig.spin && (toolCall.arguments_string || results) && (
                    <ChevronRight className={cn("ml-auto h-3 w-3 text-muted-foreground transition-transform", 
                        expanded && "rotate-90")} />
                )}
            </button>
            
            {expanded && !statusConfig.spin && (
                <div className="mt-1.5 ml-3 space-y-2 border-l-2 border-border pl-3">
                    {toolCall.arguments_string && (
                        <div>
                            <div className="mb-1 text-xs text-muted-foreground">Parameters:</div>
                            <pre className="whitespace-pre-wrap rounded-brand bg-muted p-2 text-xs text-foreground">
                                {(() => {
                                    try {
                                        return JSON.stringify(JSON.parse(toolCall.arguments_string), null, 2);
                                    } catch {
                                        return toolCall.arguments_string;
                                    }
                                })()}
                            </pre>
                        </div>
                    )}
                    {parsedResults && (
                        <div>
                            <div className="mb-1 text-xs text-muted-foreground">Result:</div>
                            <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-brand bg-muted p-2 text-xs text-foreground">
                                {typeof parsedResults === 'object' ? 
                                    JSON.stringify(parsedResults, null, 2) : parsedResults}
                            </pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default function MessageBubble({ message, messageIndex, conversationId, detectedSentiment }) {
    const isUser = message.role === 'user';
    
    return (
        <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
            {!isUser && (
                <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-brand bg-muted">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                </div>
            )}
            <div className={cn("min-w-0 max-w-[85%] [overflow-wrap:anywhere]", isUser && "flex flex-col items-end")}>
                {message.content && (
                    <div className={cn(
                        "rounded-brand-lg px-4 py-2.5",
                        isUser ? "bg-primary text-primary-foreground" : "border border-border bg-brand-surface text-foreground"
                    )}>
                        {isUser ? (
                            <p className="text-sm">{message.content}</p>
                        ) : (
                            <ReactMarkdown 
                                className="max-w-none text-sm prose prose-sm [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                                components={{
                                    code: (props) => {
                                        // @ts-ignore
                                        const inline = props.inline;
                                        const { className, children, ...restProps } = props;
                                        const match = /language-(\w+)/.exec(className || '');
                                        return !inline && match ? (
                                            <div className="group/code relative">
                                                <pre className="my-2 overflow-x-auto rounded-brand bg-muted p-3 text-foreground">
                                                    <code className={className} {...restProps}>{children}</code>
                                                </pre>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="absolute right-2 top-2 h-6 w-6 opacity-0 group-hover/code:opacity-100"
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
                                                        toast.success('Code copied');
                                                    }}
                                                >
                                                    <Copy className="h-3 w-3 text-muted-foreground" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <code className="rounded bg-muted px-1 py-0.5 text-xs text-foreground">
                                                {children}
                                            </code>
                                        );
                                    },
                                    a: ({ children, ...props }) => (
                                        <a {...props} target="_blank" rel="noopener noreferrer">{children}</a>
                                    ),
                                    p: ({ children }) => <p className="my-1">{children}</p>,
                                    ul: ({ children }) => <ul className="my-1 ml-4 list-disc">{children}</ul>,
                                    ol: ({ children }) => <ol className="my-1 ml-4 list-decimal">{children}</ol>,
                                    li: ({ children }) => <li className="my-0.5">{children}</li>,
                                    h1: ({ children }) => <h1 className="text-lg font-semibold my-2">{children}</h1>,
                                    h2: ({ children }) => <h2 className="text-base font-semibold my-2">{children}</h2>,
                                    h3: ({ children }) => <h3 className="text-sm font-semibold my-2">{children}</h3>,
                                    blockquote: ({ children }) => (
                                        <blockquote className="border-l-2 border-border pl-3 my-2 text-muted-foreground">
                                            {children}
                                        </blockquote>
                                    ),
                                }}
                            >
                                {message.content}
                            </ReactMarkdown>
                        )}
                    </div>
                )}
                
                {message.tool_calls?.length > 0 && (
                    <div className="space-y-1">
                        {message.tool_calls.map((toolCall, idx) => (
                            <FunctionDisplay key={idx} toolCall={toolCall} />
                        ))}
                    </div>
                )}

                {/* Rating — only for assistant messages */}
                {!isUser && conversationId && (
                    <ResponseRating
                        conversationId={conversationId}
                        messageIndex={messageIndex}
                        messageSnippet={message.content}
                        detectedSentiment={detectedSentiment}
                    />
                )}
            </div>
        </div>
    );
}
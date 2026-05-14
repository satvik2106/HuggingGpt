'use client';

import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface StreamedMarkdownProps {
  /** The content to render — grows in real-time as tokens arrive */
  content: string;
  /** Whether tokens are still arriving */
  isStreaming: boolean;
}

/**
 * Premium markdown renderer for the DualMind chat.
 *
 * Unlike the previous version, this component no longer fakes streaming
 * with setInterval.  It simply renders whatever `content` is passed in.
 * The Zustand store appends tokens to the message content, and React
 * re-renders this component with the growing string.
 */
function StreamedMarkdown({ content, isStreaming }: StreamedMarkdownProps) {
  return (
    <div className="prose prose-invert prose-p:leading-relaxed prose-pre:p-0 max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, className, children, ...props }: React.ComponentPropsWithoutRef<'code'> & { inline?: boolean }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <div className="rounded-xl overflow-hidden my-4 border border-white/10 shadow-lg">
                <div className="bg-[#1e1e1e] px-4 py-2 text-xs text-gray-400 font-mono border-b border-white/5 flex justify-between items-center">
                  <span>{match[1]}</span>
                </div>
                <SyntaxHighlighter
                  {...(props as Record<string, unknown>)}
                  style={vscDarkPlus as Record<string, React.CSSProperties>}
                  language={match[1]}
                  PreTag="div"
                  className="!m-0 !bg-[#1e1e1e]"
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code {...props} className={`${className || ''} bg-white/10 px-1.5 py-0.5 rounded-md text-accent-cyan font-mono text-sm`}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
      {isStreaming && (
        <span className="inline-block w-2 h-5 ml-0.5 bg-accent-cyan animate-pulse align-middle rounded-sm" />
      )}
    </div>
  );
}

export default memo(StreamedMarkdown);

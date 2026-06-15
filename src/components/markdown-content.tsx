"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownContentProps = {
  compact?: boolean;
  value: string;
};

export function MarkdownContent({ compact = false, value }: MarkdownContentProps) {
  return (
    <div className={compact ? "text-sm leading-7 text-muted-foreground" : "text-base leading-8 text-muted-foreground"}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ children, href }) => (
            <a
              href={href}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-2 border-border/80 pl-4 text-foreground/80">{children}</blockquote>
          ),
          code: ({ children }) => (
            <code className="border border-border/70 bg-secondary px-1.5 py-0.5 font-mono text-[0.88em] text-foreground">
              {children}
            </code>
          ),
          h1: ({ children }) => (
            <h1 className={compact ? "mb-2 mt-3 text-lg font-semibold text-foreground" : "mb-3 mt-6 text-2xl font-semibold text-foreground"}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className={compact ? "mb-2 mt-3 text-base font-semibold text-foreground" : "mb-3 mt-6 text-xl font-semibold text-foreground"}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 mt-4 text-base font-semibold text-foreground">{children}</h3>
          ),
          li: ({ children }) => <li className="pl-1">{children}</li>,
          ol: ({ children }) => (
            <ol className={compact ? "my-2 list-decimal space-y-1 pl-5" : "my-4 list-decimal space-y-2 pl-6"}>
              {children}
            </ol>
          ),
          p: ({ children }) => <p className={compact ? "mb-2 last:mb-0" : "mb-4 last:mb-0"}>{children}</p>,
          pre: ({ children }) => (
            <pre className="my-4 overflow-x-auto border border-border/70 bg-secondary p-4 font-mono text-sm leading-6 text-foreground">
              {children}
            </pre>
          ),
          ul: ({ children }) => (
            <ul className={compact ? "my-2 list-disc space-y-1 pl-5" : "my-4 list-disc space-y-2 pl-6"}>
              {children}
            </ul>
          ),
        }}
      >
        {value}
      </ReactMarkdown>
    </div>
  );
}

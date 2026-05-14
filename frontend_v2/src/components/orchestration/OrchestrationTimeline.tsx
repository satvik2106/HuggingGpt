'use client';

import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, Wrench } from 'lucide-react';
import type { ToolRecord } from '@/types/streaming';

interface Props {
  records: ToolRecord[];
}

const TOOL_LABELS: Record<string, string> = {
  wikipedia_search:    'Wikipedia Search',
  arxiv_summarizer:    'ArXiv Papers',
  semantic_scholar:    'Semantic Scholar',
  pubmed_search:       'PubMed Search',
  news_fetcher:        'News Fetcher',
  qa_engine:           'QA Engine',
  data_plotter:        'Data Plotter',
  document_writer:     'Document Writer',
  sentiment_analyzer:  'Sentiment Analyzer',
  pdf_parser:          'PDF Parser',
};

function OrchestrationTimeline({ records = [] }: Props) {
  if (records.length === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t border-white/10">
      <div className="flex items-center gap-2 mb-3 text-xs font-mono text-accent-purple">
        <Wrench className="w-3 h-3" />
        <span>Execution Pipeline ({records.length} tools)</span>
      </div>

      <div className="space-y-1">
        <AnimatePresence mode="popLayout">
          {records.map((record) => (
            <motion.div
              key={record.step}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              layout
              className="flex items-center gap-2 text-xs font-mono"
            >
              {/* Status icon */}
              {record.status === 'running' ? (
                <Loader2 className="w-3.5 h-3.5 text-accent-cyan animate-spin shrink-0" />
              ) : record.status === 'success' ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
              )}

              {/* Tool name */}
              <span className={
                record.status === 'running' ? 'text-accent-cyan' :
                record.status === 'success' ? 'text-emerald-400' : 'text-red-400'
              }>
                {TOOL_LABELS[record.tool] || record.tool}
              </span>

              {/* Execution time */}
              {record.executionTime !== undefined && record.executionTime > 0 && (
                <span className="text-foreground-muted ml-auto">
                  {record.executionTime.toFixed(1)}s
                </span>
              )}

              {/* Running pulse */}
              {record.status === 'running' && (
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-accent-cyan/50 ml-auto"
                >
                  processing...
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default memo(OrchestrationTimeline);

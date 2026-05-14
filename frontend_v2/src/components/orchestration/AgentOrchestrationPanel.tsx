'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Search, Code2, ShieldCheck, Sparkles } from 'lucide-react';
import type { AgentState } from '@/types/streaming';

const AGENT_ICONS: Record<string, React.ReactNode> = {
  planner:     <BrainCircuit className="w-4 h-4" />,
  verifier:    <ShieldCheck  className="w-4 h-4" />,
  researcher:  <Search       className="w-4 h-4" />,
  coder:       <Code2        className="w-4 h-4" />,
  synthesizer: <Sparkles     className="w-4 h-4" />,
};

const STATUS_STYLES: Record<AgentState['status'], string> = {
  idle:      'border-white/10 bg-white/5 text-white/40',
  active:    'border-accent-cyan/60 bg-accent-cyan/10 text-accent-cyan shadow-[0_0_15px_rgba(0,229,255,0.25)]',
  completed: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400',
  error:     'border-red-500/50 bg-red-500/10 text-red-400',
};

interface Props {
  agents: AgentState[];
  activePhase: string | null;
}

function AgentOrchestrationPanel({ agents, activePhase }: Props) {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground-muted mb-2">
        <BrainCircuit className="w-3.5 h-3.5 text-accent-purple" />
        <span>Neural Orchestration</span>
        {activePhase && (
          <motion.span
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className="ml-auto text-accent-cyan font-mono text-[10px] normal-case tracking-normal"
          >
            {activePhase}
          </motion.span>
        )}
      </div>

      <div className="space-y-1.5">
        {agents.map((agent) => (
          <motion.div
            key={agent.name}
            layout
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-300
              ${STATUS_STYLES[agent.status]}
            `}
          >
            <div className="shrink-0">
              {AGENT_ICONS[agent.name] || <BrainCircuit className="w-4 h-4" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium">{agent.label}</div>
              {agent.detail && (
                <div className="text-[10px] opacity-60 truncate">{agent.detail}</div>
              )}
            </div>

            {/* Status indicator */}
            {agent.status === 'active' && (
              <div className="relative flex items-center justify-center w-4 h-4">
                <motion.div
                  animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute inset-0 rounded-full bg-accent-cyan/40"
                />
                <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
              </div>
            )}
            {agent.status === 'completed' && (
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            )}
            {agent.status === 'error' && (
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default memo(AgentOrchestrationPanel);

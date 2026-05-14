'use client';

import { motion } from 'framer-motion';
import { BrainCircuit, Sparkles, Shield, Zap } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-12 relative"
      >
        <div className="absolute inset-0 bg-accent-cyan/20 blur-[100px] rounded-full" />
        <BrainCircuit className="w-24 h-24 text-accent-cyan relative z-10" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-4 border border-accent-cyan/20 rounded-full border-dashed"
        />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl md:text-5xl font-bold mb-6 tracking-tight bg-gradient-to-r from-white via-accent-cyan to-accent-purple bg-clip-text text-transparent"
      >
        Neural Link Established.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-foreground-muted text-lg mb-12 leading-relaxed"
      >
        Welcome to DualMind OS. Your persistent AGI workspace is ready. 
        Start a new intelligence cycle below or restore a previous memory from the timeline.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {[
          { icon: <Sparkles className="w-4 h-4 text-accent-cyan" />, title: "Orchestration", desc: "Multi-agent planning" },
          { icon: <Shield className="w-4 h-4 text-emerald-400" />, title: "Verification", desc: "Automated logic checks" },
          { icon: <Zap className="w-4 h-4 text-accent-purple" />, title: "Persistence", desc: "Continuous AI memory" }
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + (i * 0.1) }}
            className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center text-center group hover:bg-white/10 transition-colors"
          >
            <div className="mb-3 p-2 rounded-xl bg-white/5 group-hover:scale-110 transition-transform">
              {item.icon}
            </div>
            <div className="text-sm font-bold mb-1">{item.title}</div>
            <div className="text-[10px] text-foreground-muted">{item.desc}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

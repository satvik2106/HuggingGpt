'use client';

import { motion } from 'framer-motion';
import { Network, BrainCircuit, Search, Code2, ShieldCheck, Layers } from 'lucide-react';

const agents = [
  { id: 'planner', name: 'Planner', icon: BrainCircuit, color: 'text-accent-cyan', bg: 'bg-accent-cyan/10', border: 'border-accent-cyan/30' },
  { id: 'researcher', name: 'Researcher', icon: Search, color: 'text-accent-blue', bg: 'bg-accent-blue/10', border: 'border-accent-blue/30' },
  { id: 'coder', name: 'Coder', icon: Code2, color: 'text-accent-purple', bg: 'bg-accent-purple/10', border: 'border-accent-purple/30' },
  { id: 'verifier', name: 'Verifier', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30' },
  { id: 'synthesizer', name: 'Synthesizer', icon: Layers, color: 'text-accent-deep-purple', bg: 'bg-accent-deep-purple/10', border: 'border-accent-deep-purple/30' },
];

export default function MultiAgentVisualizer() {
  return (
    <section id="agents" className="py-32 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Watching Intelligence <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-purple">Think</span></h2>
          <p className="text-xl text-foreground-muted max-w-2xl mx-auto">
            DualMind orchestrates a neural network of specialized AI agents working autonomously to solve complex problems.
          </p>
        </div>

        <div className="relative h-[600px] glass-panel rounded-3xl overflow-hidden border border-white/5">
          {/* Background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          {/* Central orchestration node */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
            <motion.div 
              animate={{ boxShadow: ['0 0 20px rgba(0,229,255,0.2)', '0 0 60px rgba(0,229,255,0.6)', '0 0 20px rgba(0,229,255,0.2)'] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-24 h-24 rounded-full bg-background border border-accent-cyan flex items-center justify-center relative"
            >
              <Network className="w-10 h-10 text-accent-cyan" />
              {/* Pulse rings */}
              <div className="absolute inset-0 rounded-full border border-accent-cyan/50 animate-ping" style={{ animationDuration: '3s' }} />
            </motion.div>
            <div className="mt-4 text-lg font-bold text-foreground bg-background/80 px-4 py-1 rounded-full backdrop-blur-sm border border-white/10">
              Orchestrator
            </div>
          </div>

          {/* Surrounding Agents */}
          {agents.map((agent, i) => {
            const angle = (i * 360) / agents.length;
            const radius = 220; // distance from center
            const rad = angle * (Math.PI / 180);
            
            // Calculate absolute positions (assuming 50% 50% is center)
            const top = `calc(50% + ${Math.sin(rad) * radius}px)`;
            const left = `calc(50% + ${Math.cos(rad) * radius}px)`;

            return (
              <motion.div 
                key={agent.id}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.15 }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group"
                style={{ top, left }}
              >
                {/* Connecting Line (SVG SVG) */}
                <svg className="absolute w-[400px] h-[400px] pointer-events-none -z-10" style={{
                    top: '50%', left: '50%', transform: `translate(-50%, -50%) rotate(${angle + 180}deg)`
                }}>
                  <line x1="200" y1="200" x2="350" y2="200" stroke="url(#gradient)" strokeWidth="2" strokeDasharray="5,5" className="opacity-30 group-hover:opacity-100 transition-opacity" />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#00E5FF" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                  {/* Flowing particle */}
                  <circle r="3" fill="#00E5FF" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <animate attributeName="cx" values="200; 350" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="cy" values="200; 200" dur="2s" repeatCount="indefinite" />
                  </circle>
                </svg>

                <div className={`w-16 h-16 rounded-2xl ${agent.bg} border ${agent.border} flex items-center justify-center backdrop-blur-md shadow-lg transition-transform hover:scale-110 cursor-pointer relative`}>
                  <agent.icon className={`w-8 h-8 ${agent.color}`} />
                </div>
                <div className="mt-3 text-sm font-semibold text-foreground-muted bg-background/90 px-3 py-1 rounded-full border border-white/5 backdrop-blur-sm">
                  {agent.name}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  BrainCircuit, 
  User, 
  Plus, 
  Menu, 
  Settings, 
  LogOut,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import Link from 'next/link';
import { useChatStore } from '@/lib/store/chatStore';
import { streamChat } from '@/lib/streaming/sseClient';
import StreamedMarkdown from '@/components/chat/StreamedMarkdown';
import OrchestrationTimeline from '@/components/orchestration/OrchestrationTimeline';
import TelemetryPanel from '@/components/chat/TelemetryPanel';
import ErrorSurface from '@/components/chat/ErrorSurface';
import MemoryTimeline from '@/components/chat/MemoryTimeline';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/lib/firebase/auth';
import { 
  createConversation, 
  getUserConversations, 
  getConversationMessages,
  deleteConversation,
  togglePinConversation,
  Conversation
} from '@/lib/firebase/firestore';

function ChatApp() {
  const { signOut } = useAuth();
  const activeUser = { uid: 'dualmind_global_user', email: 'anonymous@dualmind.ai' };
  
  const messages    = useChatStore(s => s.messages);
  const isStreaming = useChatStore(s => s.isStreaming);
  const activeConversationId = useChatStore(s => s.activeConversationId);
  const setActiveConversationId = useChatStore(s => s.setActiveConversationId);
  const setMessages = useChatStore(s => s.setMessages);
  const clearMessages = useChatStore(s => s.clearMessages);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load conversations
  useEffect(() => {
    getUserConversations(activeUser.uid).then(setConversations);
  }, []);

  const handleNewInstance = () => {
    setActiveConversationId(null);
    clearMessages();
  };

  const loadConversation = async (id: string) => {
    setActiveConversationId(id);
    const msgs = await getConversationMessages(id);
    setMessages(msgs);
    setIsSidebarOpen(false);
  };

  const handleSend = async () => {
    const value = inputRef.current?.value.trim();
    if (!value || isStreaming) return;
    
    if (inputRef.current) inputRef.current.value = '';
    
    let currentConvId = activeConversationId;
    if (!currentConvId) {
      currentConvId = await createConversation(activeUser.uid, value.substring(0, 30));
      setActiveConversationId(currentConvId);
      getUserConversations(activeUser.uid).then(setConversations);
    }

    await streamChat(value);
    getUserConversations(activeUser.uid).then(setConversations);
  };

  return (
    <div className="flex h-screen bg-[#050B14] text-white overflow-hidden">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#0A0F1C] border-r border-white/5 transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 flex flex-col`}>
        <div className="p-6 border-b border-white/5 font-bold text-xl flex items-center gap-3">
          <BrainCircuit className="text-accent-cyan" /> DualMind OS
        </div>
        <div className="p-4">
          <button onClick={handleNewInstance} className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 flex items-center justify-center gap-2 transition-all">
            <Plus className="w-4 h-4 text-accent-cyan" /> New Cycle
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <MemoryTimeline 
            conversations={conversations} 
            activeId={activeConversationId} 
            onSelect={loadConversation}
            onDelete={async (id) => { await deleteConversation(id); getUserConversations(activeUser.uid).then(setConversations); }}
            onPin={async (id, p) => { await togglePinConversation(id, p); getUserConversations(activeUser.uid).then(setConversations); }}
          />
        </div>
        <div className="p-4 border-t border-white/5 text-xs text-foreground-muted">
          v3.1 Stable | Global Mode
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <TelemetryPanel />
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-12 space-y-8 scrollbar-none">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-40">
              <BrainCircuit className="w-16 h-16 mb-4" />
              <p>Neural Link Ready. Send a command to begin.</p>
            </div>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className={`max-w-4xl mx-auto flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${msg.role === 'user' ? 'bg-accent-purple/20 text-accent-purple' : 'bg-accent-cyan/20 text-accent-cyan'}`}>
                {msg.role === 'user' ? <User size={16} /> : <BrainCircuit size={16} />}
              </div>
              <div className={`flex-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                <div className="prose prose-invert max-w-none">
                  {msg.role === 'assistant' ? <StreamedMarkdown content={msg.content} isStreaming={msg.status === 'streaming'} /> : <p className="bg-white/5 p-4 rounded-2xl inline-block text-left">{msg.content}</p>}
                </div>
                {msg.toolRecords.length > 0 && msg.role === 'assistant' && (
                  <div className="mt-4">
                    <OrchestrationTimeline records={msg.toolRecords} />
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 md:p-8">
          <div className="max-w-4xl mx-auto relative group">
            <textarea
              ref={inputRef}
              rows={1}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Command the AGI..."
              className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-6 py-4 pr-16 focus:outline-none focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/20 transition-all resize-none shadow-2xl"
            />
            <button 
              onClick={handleSend}
              disabled={isStreaming}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-accent-cyan text-black hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-center text-[10px] text-foreground-muted mt-4 uppercase tracking-[0.2em]">
            DualMind Orchestration Engine v3.1.0-RC
          </p>
        </div>
      </div>

      <ErrorSurface />
    </div>
  );
}

export default function ChatPage() {
  return (
    <AuthGuard>
      <ChatApp />
    </AuthGuard>
  );
}

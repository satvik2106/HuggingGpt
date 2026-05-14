import { collection, doc, setDoc, getDocs, getDoc, query, where, orderBy, serverTimestamp, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './config';
import type { ChatMessage } from '../store/chatStore';

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  lastMessage?: string;
  isPinned?: boolean;
}

// --- LocalStorage Fallback Helper ---
const LS_CONVS_KEY = 'dualmind_fallback_conversations';
const LS_MSGS_KEY = 'dualmind_fallback_messages_';

function saveToLocalStorage(key: string, data: any) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn("LocalStorage save failed", e);
  }
}

function getFromLocalStorage(key: string) {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

// --- Timeout Wrapper ---
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 500): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), timeoutMs))
  ]);
}

// --- Resilient Firestore Wrappers ---

export async function createConversation(userId: string, title: string = "New Conversation"): Promise<string> {
  try {
    const convRef = doc(collection(db, 'conversations'));
    const now = new Date().toISOString();
    await withTimeout(setDoc(convRef, {
      userId,
      title,
      createdAt: now,
      updatedAt: now,
    }));
    return convRef.id;
  } catch (err) {
    console.warn("Firestore createConversation failed/timed out, using LocalStorage:", err);
    const id = 'local_' + Date.now();
    const now = new Date().toISOString();
    const conv: Conversation = { id, userId, title, createdAt: now, updatedAt: now };
    const convs = getFromLocalStorage(LS_CONVS_KEY) || [];
    saveToLocalStorage(LS_CONVS_KEY, [conv, ...convs]);
    return id;
  }
}

export async function togglePinConversation(conversationId: string, isPinned: boolean) {
  try {
    const docRef = doc(db, 'conversations', conversationId);
    await withTimeout(updateDoc(docRef, { isPinned, updatedAt: new Date().toISOString() }));
  } catch (err) {
    const convs = getFromLocalStorage(LS_CONVS_KEY) || [];
    const updated = convs.map((c: Conversation) => c.id === conversationId ? { ...c, isPinned, updatedAt: new Date().toISOString() } : c);
    saveToLocalStorage(LS_CONVS_KEY, updated);
  }
}

export async function deleteConversation(conversationId: string) {
  try {
    await withTimeout(deleteDoc(doc(db, 'conversations', conversationId)));
  } catch (err) {
    const convs = getFromLocalStorage(LS_CONVS_KEY) || [];
    saveToLocalStorage(LS_CONVS_KEY, convs.filter((c: Conversation) => c.id !== conversationId));
    if (typeof window !== 'undefined') localStorage.removeItem(LS_MSGS_KEY + conversationId);
  }
}

export async function getUserConversations(userId: string): Promise<Conversation[]> {
  try {
    const q = query(
      collection(db, 'conversations'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    const snap = await withTimeout(getDocs(q));
    const remote = snap.docs.map(d => ({ id: d.id, ...d.data() } as Conversation));
    return remote;
  } catch (err) {
    console.warn("Firestore getUserConversations failed/timed out, using LocalStorage:", err);
    return getFromLocalStorage(LS_CONVS_KEY) || [];
  }
}

export async function saveMessageToFirestore(conversationId: string, message: ChatMessage) {
  if (message.status === 'streaming') return;

  try {
    const msgRef = doc(db, 'messages', message.id);
    await withTimeout(setDoc(msgRef, {
      conversationId,
      role: message.role,
      content: message.content,
      timestamp: new Date().toISOString(),
      status: message.status,
      toolRecords: message.toolRecords || [],
      plan: message.plan || null,
    }, { merge: true }));

    const convRef = doc(db, 'conversations', conversationId);
    await withTimeout(updateDoc(convRef, {
      updatedAt: new Date().toISOString(),
      lastMessage: message.content.substring(0, 100)
    }));
  } catch (err) {
    console.warn("Firestore saveMessage failed/timed out, using LocalStorage fallback");
    const msgs = getFromLocalStorage(LS_MSGS_KEY + conversationId) || [];
    // Ensure we don't save duplicate IDs
    const filtered = msgs.filter((m: ChatMessage) => m.id !== message.id);
    saveToLocalStorage(LS_MSGS_KEY + conversationId, [...filtered, message]);
    
    // Update local conversation list's updatedAt
    const convs = getFromLocalStorage(LS_CONVS_KEY) || [];
    const updated = convs.map((c: Conversation) => c.id === conversationId ? { 
      ...c, 
      updatedAt: new Date().toISOString(),
      lastMessage: message.content.substring(0, 100)
    } : c);
    saveToLocalStorage(LS_CONVS_KEY, updated);
  }
}

export async function getConversationMessages(conversationId: string): Promise<ChatMessage[]> {
  try {
    const q = query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId),
      orderBy('timestamp', 'asc')
    );
    const snap = await withTimeout(getDocs(q));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as ChatMessage));
  } catch (err) {
    return getFromLocalStorage(LS_MSGS_KEY + conversationId) || [];
  }
}

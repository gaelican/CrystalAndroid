import { create } from 'zustand';
import { Session, CreateSessionRequest } from '../types';

interface SessionStore {
  sessions: Session[];
  activeSessionId: string | null;
  
  // Actions
  addSession: (session: Session) => void;
  updateSession: (id: string, updates: Partial<Session>) => void;
  removeSession: (id: string) => void;
  setActiveSession: (id: string | null) => void;
  getSessionById: (id: string) => Session | undefined;
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  sessions: [],
  activeSessionId: null,
  
  addSession: (session) => 
    set((state) => ({ sessions: [...state.sessions, session] })),
  
  updateSession: (id, updates) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    })),
  
  removeSession: (id) =>
    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== id),
      activeSessionId: state.activeSessionId === id ? null : state.activeSessionId,
    })),
  
  setActiveSession: (id) => set({ activeSessionId: id }),
  
  getSessionById: (id) => get().sessions.find((s) => s.id === id),
}));
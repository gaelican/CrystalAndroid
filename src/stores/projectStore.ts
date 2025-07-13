import { create } from 'zustand';
import { Project, CreateProjectRequest } from '../types';

interface ProjectStore {
  projects: Project[];
  activeProjectId: number | null;
  
  // Actions
  addProject: (project: Project) => void;
  updateProject: (id: number, updates: Partial<Project>) => void;
  removeProject: (id: number) => void;
  setActiveProject: (id: number | null) => void;
  getProjectById: (id: number) => Project | undefined;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  activeProjectId: null,
  
  addProject: (project) => 
    set((state) => ({ projects: [...state.projects, project] })),
  
  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),
  
  removeProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      activeProjectId: state.activeProjectId === id ? null : state.activeProjectId,
    })),
  
  setActiveProject: (id) => set({ activeProjectId: id }),
  
  getProjectById: (id) => get().projects.find((p) => p.id === id),
}));
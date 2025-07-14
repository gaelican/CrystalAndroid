import RNFS from 'react-native-fs';
import { Project, Session } from '../types';

interface StorageData {
  projects: Project[];
  sessions: Session[];
}

export class DatabaseService {
  private static instance: DatabaseService;
  private storageFilePath: string;
  private data: StorageData = {
    projects: [],
    sessions: []
  };

  private constructor() {
    // Store data in the documents directory
    this.storageFilePath = `${RNFS.DocumentDirectoryPath}/crystal_data.json`;
  }

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  async initialize(): Promise<void> {
    try {
      // Check if the storage file exists
      const fileExists = await RNFS.exists(this.storageFilePath);
      
      if (fileExists) {
        // Load existing data
        const fileContent = await RNFS.readFile(this.storageFilePath, 'utf8');
        this.data = JSON.parse(fileContent);
        
        // Ensure data structure is correct
        if (!this.data.projects) this.data.projects = [];
        if (!this.data.sessions) this.data.sessions = [];
      } else {
        // Create initial data file
        await this.saveData();
      }
    } catch (error) {
      console.error('Failed to initialize database:', error);
      // If file is corrupted, start fresh
      this.data = { projects: [], sessions: [] };
      await this.saveData();
    }
  }

  private async saveData(): Promise<void> {
    try {
      const jsonData = JSON.stringify(this.data, null, 2);
      await RNFS.writeFile(this.storageFilePath, jsonData, 'utf8');
    } catch (error) {
      console.error('Failed to save data:', error);
      throw error;
    }
  }

  // Project methods
  async getAllProjects(): Promise<Project[]> {
    return [...this.data.projects].sort((a, b) => {
      // Sort by display order first, then by created_at
      if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
        return a.displayOrder - b.displayOrder;
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }

  async createProject(project: Partial<Project>): Promise<number> {
    const now = new Date().toISOString();
    const newProject: Project = {
      id: Date.now(), // Simple ID generation using timestamp
      name: project.name || '',
      path: project.path || '',
      system_prompt: project.system_prompt || undefined,
      run_script: project.run_script || undefined,
      build_script: project.build_script || undefined,
      main_branch: project.main_branch || undefined,
      active: project.active || false,
      created_at: now,
      updated_at: now,
      open_ide_command: project.open_ide_command || undefined,
      displayOrder: project.displayOrder || undefined,
      worktree_folder: project.worktree_folder || undefined,
    };

    this.data.projects.push(newProject);
    await this.saveData();
    
    return newProject.id;
  }

  async updateProject(id: number, updates: Partial<Project>): Promise<void> {
    const projectIndex = this.data.projects.findIndex(p => p.id === id);
    if (projectIndex === -1) {
      throw new Error(`Project with id ${id} not found`);
    }

    this.data.projects[projectIndex] = {
      ...this.data.projects[projectIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };

    await this.saveData();
  }

  async deleteProject(id: number): Promise<void> {
    this.data.projects = this.data.projects.filter(p => p.id !== id);
    // Also delete associated sessions
    this.data.sessions = this.data.sessions.filter(s => s.projectId !== id);
    await this.saveData();
  }

  async getProjectById(id: number): Promise<Project | undefined> {
    return this.data.projects.find(p => p.id === id);
  }

  // Session methods
  async getAllSessions(): Promise<Session[]> {
    return [...this.data.sessions].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  async createSession(session: Partial<Session>): Promise<string> {
    const id = `session_${Date.now()}`;
    const now = new Date().toISOString();
    
    const newSession: Session = {
      id,
      name: session.name || '',
      worktreePath: session.worktreePath || '',
      prompt: session.prompt || '',
      status: session.status || 'initializing',
      createdAt: now,
      output: session.output || [],
      jsonMessages: session.jsonMessages || [],
      pid: session.pid,
      lastActivity: session.lastActivity,
      error: session.error,
      isRunning: session.isRunning,
      lastViewedAt: session.lastViewedAt,
      projectId: session.projectId,
      folderId: session.folderId,
      permissionMode: session.permissionMode,
      runStartedAt: session.runStartedAt,
      isMainRepo: session.isMainRepo,
      displayOrder: session.displayOrder,
      isFavorite: session.isFavorite,
      autoCommit: session.autoCommit,
    };

    this.data.sessions.push(newSession);
    await this.saveData();
    
    return id;
  }

  async updateSession(id: string, updates: Partial<Session>): Promise<void> {
    const sessionIndex = this.data.sessions.findIndex(s => s.id === id);
    if (sessionIndex === -1) {
      throw new Error(`Session with id ${id} not found`);
    }

    this.data.sessions[sessionIndex] = {
      ...this.data.sessions[sessionIndex],
      ...updates,
      lastActivity: new Date().toISOString()
    };

    await this.saveData();
  }

  async deleteSession(id: string): Promise<void> {
    this.data.sessions = this.data.sessions.filter(s => s.id !== id);
    await this.saveData();
  }

  async getSessionById(id: string): Promise<Session | undefined> {
    return this.data.sessions.find(s => s.id === id);
  }

  async getSessionsByProjectId(projectId: number): Promise<Session[]> {
    return this.data.sessions.filter(s => s.projectId === projectId);
  }

  // Utility method to export data (useful for debugging)
  async exportData(): Promise<string> {
    return JSON.stringify(this.data, null, 2);
  }

  // Utility method to import data (useful for migration)
  async importData(jsonData: string): Promise<void> {
    try {
      const importedData = JSON.parse(jsonData);
      if (importedData.projects && Array.isArray(importedData.projects) &&
          importedData.sessions && Array.isArray(importedData.sessions)) {
        this.data = importedData;
        await this.saveData();
      } else {
        throw new Error('Invalid data format');
      }
    } catch (error) {
      console.error('Failed to import data:', error);
      throw error;
    }
  }

  // No need for close method with file-based storage
  async close(): Promise<void> {
    // Ensure any pending data is saved
    await this.saveData();
  }
}
import SQLite from 'react-native-sqlite-storage';
import { Project, Session } from '../types';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

export class DatabaseService {
  private static instance: DatabaseService;
  private database: SQLite.SQLiteDatabase | null = null;

  private constructor() {}

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  async initialize(): Promise<void> {
    try {
      this.database = await SQLite.openDatabase({
        name: 'crystal.db',
        location: 'default',
      });
      await this.createTables();
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.database) throw new Error('Database not initialized');

    const queries = [
      `CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        path TEXT NOT NULL,
        system_prompt TEXT,
        run_script TEXT,
        build_script TEXT,
        main_branch TEXT,
        active INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        open_ide_command TEXT,
        display_order INTEGER,
        worktree_folder TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        worktree_path TEXT NOT NULL,
        prompt TEXT NOT NULL,
        status TEXT NOT NULL,
        pid INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_activity DATETIME,
        output TEXT,
        json_messages TEXT,
        error TEXT,
        last_viewed_at DATETIME,
        project_id INTEGER,
        folder_id TEXT,
        permission_mode TEXT,
        run_started_at DATETIME,
        is_main_repo INTEGER DEFAULT 0,
        display_order INTEGER,
        is_favorite INTEGER DEFAULT 0,
        auto_commit INTEGER DEFAULT 0,
        FOREIGN KEY (project_id) REFERENCES projects(id)
      )`,
    ];

    for (const query of queries) {
      await this.database.executeSql(query);
    }
  }

  // Project methods
  async getAllProjects(): Promise<Project[]> {
    if (!this.database) throw new Error('Database not initialized');
    
    const [results] = await this.database.executeSql(
      'SELECT * FROM projects ORDER BY display_order, created_at DESC'
    );
    
    const projects: Project[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      projects.push(results.rows.item(i));
    }
    return projects;
  }

  async createProject(project: Partial<Project>): Promise<number> {
    if (!this.database) throw new Error('Database not initialized');
    
    const [result] = await this.database.executeSql(
      `INSERT INTO projects (name, path, system_prompt, run_script, build_script, active)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        project.name || '',
        project.path || '',
        project.system_prompt || null,
        project.run_script || null,
        project.build_script || null,
        project.active ? 1 : 0,
      ]
    );
    
    return result.insertId;
  }

  // Session methods
  async getAllSessions(): Promise<Session[]> {
    if (!this.database) throw new Error('Database not initialized');
    
    const [results] = await this.database.executeSql(
      'SELECT * FROM sessions ORDER BY created_at DESC'
    );
    
    const sessions: Session[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      sessions.push({
        ...row,
        output: JSON.parse(row.output || '[]'),
        jsonMessages: JSON.parse(row.json_messages || '[]'),
        isMainRepo: !!row.is_main_repo,
        isFavorite: !!row.is_favorite,
        autoCommit: !!row.auto_commit,
      });
    }
    return sessions;
  }

  async createSession(session: Partial<Session>): Promise<string> {
    if (!this.database) throw new Error('Database not initialized');
    
    const id = `session_${Date.now()}`;
    await this.database.executeSql(
      `INSERT INTO sessions (id, name, worktree_path, prompt, status, output, json_messages)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        session.name || '',
        session.worktreePath || '',
        session.prompt || '',
        session.status || 'initializing',
        JSON.stringify(session.output || []),
        JSON.stringify(session.jsonMessages || []),
      ]
    );
    
    return id;
  }

  async close(): Promise<void> {
    if (this.database) {
      await this.database.close();
      this.database = null;
    }
  }
}
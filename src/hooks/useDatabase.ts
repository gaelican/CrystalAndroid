import { useEffect, useState } from 'react';
import { DatabaseService } from '../services';
import { useProjectStore } from '../stores/projectStore';
import { useSessionStore } from '../stores/sessionStore';

export const useDatabase = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const db = DatabaseService.getInstance();
        await db.initialize();

        // Load existing data into stores
        const projects = await db.getAllProjects();
        const sessions = await db.getAllSessions();

        // Clear existing store data first
        const projectStore = useProjectStore.getState();
        const sessionStore = useSessionStore.getState();

        // Reset stores to avoid duplicates
        projectStore.projects.length = 0;
        sessionStore.sessions.length = 0;

        // Populate stores with existing data
        projects.forEach(project => {
          projectStore.addProject(project);
        });

        sessions.forEach(session => {
          sessionStore.addSession(session);
        });

        setIsInitialized(true);
      } catch (err) {
        console.error('Failed to initialize database:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    initializeDatabase();
  }, []);

  return { isInitialized, error };
};
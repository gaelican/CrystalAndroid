import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { DatabaseService } from '../services';
import { useProjectStore } from '../stores/projectStore';
import { useSessionStore } from '../stores/sessionStore';

export const DatabaseTestScreen: React.FC = () => {
  const [projectName, setProjectName] = useState('');
  const [projectPath, setProjectPath] = useState('');
  const [sessionName, setSessionName] = useState('');
  const [sessionPrompt, setSessionPrompt] = useState('');

  const projects = useProjectStore((state) => state.projects);
  const sessions = useSessionStore((state) => state.sessions);
  const addProject = useProjectStore((state) => state.addProject);
  const addSession = useSessionStore((state) => state.addSession);

  const handleCreateProject = async () => {
    if (!projectName || !projectPath) {
      Alert.alert('Error', 'Please fill in project name and path');
      return;
    }

    try {
      const db = DatabaseService.getInstance();
      const projectId = await db.createProject({
        name: projectName,
        path: projectPath,
        active: true,
      });

      const newProject = await db.getProjectById(projectId);
      if (newProject) {
        addProject(newProject);
        setProjectName('');
        setProjectPath('');
        Alert.alert('Success', 'Project created successfully');
      }
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create project');
    }
  };

  const handleCreateSession = async () => {
    if (!sessionName || !sessionPrompt) {
      Alert.alert('Error', 'Please fill in session name and prompt');
      return;
    }

    try {
      const db = DatabaseService.getInstance();
      const sessionId = await db.createSession({
        name: sessionName,
        prompt: sessionPrompt,
        worktreePath: '/tmp/test',
        status: 'ready',
      });

      const newSession = await db.getSessionById(sessionId);
      if (newSession) {
        addSession(newSession);
        setSessionName('');
        setSessionPrompt('');
        Alert.alert('Success', 'Session created successfully');
      }
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create session');
    }
  };

  const handleExportData = async () => {
    try {
      const db = DatabaseService.getInstance();
      const data = await db.exportData();
      Alert.alert('Export Data', data);
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Create Project</Text>
        <TextInput
          style={styles.input}
          placeholder="Project Name"
          value={projectName}
          onChangeText={setProjectName}
        />
        <TextInput
          style={styles.input}
          placeholder="Project Path"
          value={projectPath}
          onChangeText={setProjectPath}
        />
        <TouchableOpacity style={styles.button} onPress={handleCreateProject}>
          <Text style={styles.buttonText}>Create Project</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Create Session</Text>
        <TextInput
          style={styles.input}
          placeholder="Session Name"
          value={sessionName}
          onChangeText={setSessionName}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Session Prompt"
          value={sessionPrompt}
          onChangeText={setSessionPrompt}
          multiline
          numberOfLines={3}
        />
        <TouchableOpacity style={styles.button} onPress={handleCreateSession}>
          <Text style={styles.buttonText}>Create Session</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Projects ({projects.length})</Text>
        {projects.map((project) => (
          <View key={project.id} style={styles.item}>
            <Text style={styles.itemTitle}>{project.name}</Text>
            <Text style={styles.itemSubtitle}>{project.path}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sessions ({sessions.length})</Text>
        {sessions.map((session) => (
          <View key={session.id} style={styles.item}>
            <Text style={styles.itemTitle}>{session.name}</Text>
            <Text style={styles.itemSubtitle}>{session.prompt}</Text>
            <Text style={styles.itemStatus}>Status: {session.status}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.exportButton} onPress={handleExportData}>
        <Text style={styles.buttonText}>Export Data</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  exportButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    margin: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  item: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  itemStatus: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
});
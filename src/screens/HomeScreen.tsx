import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useProjectStore } from '../stores/projectStore';
import { useSessionStore } from '../stores/sessionStore';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const projects = useProjectStore((state) => state.projects);
  const sessions = useSessionStore((state) => state.sessions);
  const recentSessions = sessions.slice(0, 5);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Crystal Mobile</Text>
          <Text style={styles.subtitle}>AI-powered development assistant</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('CreateSession' as never)}
            >
              <Text style={styles.actionButtonText}>New Session</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Projects' as never)}
            >
              <Text style={styles.actionButtonText}>Projects</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('GitTest' as never)}
            >
              <Text style={styles.actionButtonText}>Git Test</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('DatabaseTest' as never)}
            >
              <Text style={styles.actionButtonText}>Database Test</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Sessions</Text>
          {recentSessions.length === 0 ? (
            <Text style={styles.emptyText}>No sessions yet</Text>
          ) : (
            recentSessions.map((session) => (
              <TouchableOpacity
                key={session.id}
                style={styles.sessionItem}
                onPress={() => navigation.navigate('Session', { sessionId: session.id } as never)}
              >
                <Text style={styles.sessionName}>{session.name}</Text>
                <Text style={styles.sessionStatus}>{session.status}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Projects</Text>
          {projects.filter(p => p.active).length === 0 ? (
            <Text style={styles.emptyText}>No active projects</Text>
          ) : (
            projects.filter(p => p.active).map((project) => (
              <TouchableOpacity
                key={project.id}
                style={styles.projectItem}
                onPress={() => navigation.navigate('ProjectDetail', { projectId: project.id } as never)}
              >
                <Text style={styles.projectName}>{project.name}</Text>
                <Text style={styles.projectPath}>{project.path}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#2196F3',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sessionItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sessionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  sessionStatus: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  projectItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  projectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  projectPath: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
});
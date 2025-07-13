import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { GitService } from '../services/GitService';
import RNFS from 'react-native-fs';

export const GitTestScreen: React.FC = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [repoName, setRepoName] = useState('test-repo');
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [repoPath, setRepoPath] = useState('');

  const addLog = (message: string) => {
    setLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const getRepoPath = () => {
    return `${RNFS.DocumentDirectoryPath}/repos/${repoName}`;
  };

  const testInit = async () => {
    try {
      setLoading(true);
      const path = getRepoPath();
      setRepoPath(path);
      
      // Create directory if it doesn't exist
      await RNFS.mkdir(`${RNFS.DocumentDirectoryPath}/repos`, { NSURLIsExcludedFromBackupKey: true });
      await RNFS.mkdir(path, { NSURLIsExcludedFromBackupKey: true });
      
      addLog(`Initializing repo at: ${path}`);
      const result = await GitService.init(path);
      addLog(`Init result: ${result}`);
    } catch (error: any) {
      addLog(`Error: ${error.message}`);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const testClone = async () => {
    if (!repoUrl) {
      Alert.alert('Error', 'Please enter a repository URL');
      return;
    }

    try {
      setLoading(true);
      const path = getRepoPath();
      setRepoPath(path);
      
      // Clean up if directory exists
      if (await RNFS.exists(path)) {
        await RNFS.unlink(path);
      }
      
      // Create parent directory
      await RNFS.mkdir(`${RNFS.DocumentDirectoryPath}/repos`, { NSURLIsExcludedFromBackupKey: true });
      
      addLog(`Cloning ${repoUrl} to ${path}`);
      const result = await GitService.clone(repoUrl, path);
      addLog(`Clone result: ${result}`);
    } catch (error: any) {
      addLog(`Error: ${error.message}`);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const testStatus = async () => {
    if (!repoPath) {
      Alert.alert('Error', 'No repository initialized');
      return;
    }

    try {
      setLoading(true);
      addLog('Getting repository status...');
      const status = await GitService.status(repoPath);
      addLog(`Status: ${JSON.stringify(status, null, 2)}`);
    } catch (error: any) {
      addLog(`Error: ${error.message}`);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const testCreateFile = async () => {
    if (!repoPath) {
      Alert.alert('Error', 'No repository initialized');
      return;
    }

    try {
      setLoading(true);
      const testFile = `${repoPath}/test-${Date.now()}.txt`;
      addLog(`Creating file: ${testFile}`);
      await RNFS.writeFile(testFile, 'This is a test file created by Crystal Android', 'utf8');
      addLog('File created successfully');
    } catch (error: any) {
      addLog(`Error: ${error.message}`);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const testCommit = async () => {
    if (!repoPath) {
      Alert.alert('Error', 'No repository initialized');
      return;
    }

    try {
      setLoading(true);
      
      // First add all files
      addLog('Adding all files...');
      await GitService.add(repoPath, ['.']);
      
      // Then commit
      addLog('Committing changes...');
      const commitHash = await GitService.commit(repoPath, 'Test commit from Crystal Android');
      addLog(`Commit successful: ${commitHash}`);
    } catch (error: any) {
      addLog(`Error: ${error.message}`);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const testBranches = async () => {
    if (!repoPath) {
      Alert.alert('Error', 'No repository initialized');
      return;
    }

    try {
      setLoading(true);
      addLog('Getting branches...');
      const branches = await GitService.getBranches(repoPath);
      addLog(`Branches: ${JSON.stringify(branches, null, 2)}`);
      
      const currentBranch = await GitService.getCurrentBranch(repoPath);
      addLog(`Current branch: ${currentBranch}`);
    } catch (error: any) {
      addLog(`Error: ${error.message}`);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const clearLog = () => {
    setLog([]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Git Operations Test</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Repository URL (for clone)"
          value={repoUrl}
          onChangeText={setRepoUrl}
          autoCapitalize="none"
          autoCorrect={false}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Repository name"
          value={repoName}
          onChangeText={setRepoName}
          autoCapitalize="none"
          autoCorrect={false}
        />
        
        <View style={styles.buttonGrid}>
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={testInit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Init Repo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={testClone}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Clone Repo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={testStatus}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Get Status</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={testCreateFile}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Create File</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={testCommit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Commit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={testBranches}
            disabled={loading}
          >
            <Text style={styles.buttonText}>List Branches</Text>
          </TouchableOpacity>
        </View>
        
        {loading && <ActivityIndicator size="large" color="#2196F3" style={styles.loader} />}
      </View>
      
      <View style={styles.section}>
        <View style={styles.logHeader}>
          <Text style={styles.sectionTitle}>Log</Text>
          <TouchableOpacity onPress={clearLog}>
            <Text style={styles.clearButton}>Clear</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.logContainer}>
          {log.map((entry, index) => (
            <Text key={index} style={styles.logEntry}>{entry}</Text>
          ))}
          {log.length === 0 && (
            <Text style={styles.emptyLog}>No log entries yet</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    width: '48%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  loader: {
    marginTop: 20,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  clearButton: {
    color: '#2196F3',
    fontSize: 16,
  },
  logContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    maxHeight: 300,
  },
  logEntry: {
    fontSize: 12,
    marginBottom: 5,
    fontFamily: 'monospace',
    color: '#333',
  },
  emptyLog: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
});
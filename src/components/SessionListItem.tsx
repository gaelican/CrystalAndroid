import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Session } from '../types';

interface SessionListItemProps {
  session: Session;
  onPress: () => void;
}

export const SessionListItem: React.FC<SessionListItemProps> = ({
  session,
  onPress,
}) => {
  const getStatusColor = (status: Session['status']) => {
    switch (status) {
      case 'running':
        return '#4CAF50';
      case 'error':
        return '#F44336';
      case 'completed_unviewed':
        return '#FF9800';
      case 'stopped':
        return '#9E9E9E';
      default:
        return '#2196F3';
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>
          {session.name}
        </Text>
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: getStatusColor(session.status) },
          ]}
        />
      </View>
      <Text style={styles.prompt} numberOfLines={2}>
        {session.prompt}
      </Text>
      <View style={styles.footer}>
        <Text style={styles.date}>
          {new Date(session.createdAt).toLocaleString()}
        </Text>
        <Text style={styles.status}>{session.status}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  prompt: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  status: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
});
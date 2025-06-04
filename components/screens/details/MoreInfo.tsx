import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type MoreInfoProps = {
  type: 'movie' | 'tv';
  releaseDate: string;
  seasonsCount?: number;
};

const MoreInfo: React.FC<MoreInfoProps> = ({ type, releaseDate, seasonsCount }) => (
  <View style={styles.container}>
    <Text style={styles.title}>More Info</Text>
    <View style={styles.infoRow}>
      <MaterialIcons name="live-tv" size={18} color="#aaa" />
      <Text style={styles.text}>
        {type === 'movie' ? 'Movie' : `TV Series (${seasonsCount} Seasons)`}
      </Text>
    </View>
    
    <View style={styles.infoRow}>
      <MaterialIcons name="date-range" size={18} color="#aaa" />
      <Text style={styles.text}>
        Released: {new Date(releaseDate || '').toLocaleDateString()}
      </Text>
    </View>
    
    <View style={styles.sourceRow}>
      <Text style={styles.sourceNote}>
        Content sources provided by external services. Quality may vary.
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  text: {
    color: '#ddd',
    marginLeft: 8,
    fontSize: 14,
  },
  sourceRow: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  sourceNote: {
    color: '#aaa',
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export default MoreInfo;

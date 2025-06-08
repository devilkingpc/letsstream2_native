import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type OverviewProps = {
  overview: string;
};

const Overview: React.FC<OverviewProps> = ({ overview }) => {
  if (!overview) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Overview</Text>
      <Text style={styles.overview}>{overview}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  overview: {
    fontSize: 15,
    color: '#CCCCCC',
    lineHeight: 22,
  },
});

export default Overview;

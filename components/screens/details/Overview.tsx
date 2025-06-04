import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type OverviewProps = {
  title: string;
  overview: string;
};

const Overview: React.FC<OverviewProps> = ({ title, overview }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.overview}>{overview}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  overview: {
    fontSize: 14,
    lineHeight: 20,
    color: '#ddd',
  },
});

export default Overview;

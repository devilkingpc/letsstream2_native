import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ContentInfoProps = {
  title: string;
  year: string;
  runtime?: string;
  voteAverage: number;
  voteCount: number;
  genres: Array<{ id: number; name: string }>;
  onPlayPress: () => void;
};

const ContentInfo: React.FC<ContentInfoProps> = ({
  title,
  year,
  runtime,
  voteAverage,
  voteCount,
  genres,
  onPlayPress
}) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    <View style={styles.infoRow}>
      <Text style={styles.year}>{year}</Text>
      {runtime && (
        <>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.runtime}>{runtime}</Text>
        </>
      )}
      <Text style={styles.dot}>•</Text>
      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={16} color="#FFD700" />
        <Text style={styles.rating}>
          {voteAverage.toFixed(1)} ({voteCount} votes)
        </Text>
      </View>
    </View>
    
    <View style={styles.genreContainer}>
      {genres.map(genre => (
        <View key={genre.id} style={styles.genreBadge}>
          <Text style={styles.genreText}>{genre.name}</Text>
        </View>
      ))}
    </View>
    
    <TouchableOpacity 
      style={styles.playButton}
      onPress={onPlayPress}
    >
      <Ionicons name="play" size={20} color="#000" />
      <Text style={styles.playButtonText}>Play</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  year: {
    fontSize: 14,
    color: '#aaa',
  },
  dot: {
    fontSize: 14,
    color: '#aaa',
    marginHorizontal: 4,
  },
  runtime: {
    fontSize: 14,
    color: '#aaa',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: '#aaa',
    marginLeft: 4,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  genreBadge: {
    backgroundColor: 'rgba(100, 100, 100, 0.5)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    color: '#fff',
    fontSize: 12,
  },
  playButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  playButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 4,
  },
});

export default ContentInfo;

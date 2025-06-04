import React from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';
import { IMAGE_BASE_URL } from '../types/content';

type ContentPosterProps = {
  path: string | null;
  rating?: number;
  size?: {
    width: number;
    height: number;
  };
};

export const ContentPoster: React.FC<ContentPosterProps> = ({ 
  path,
  rating,
  size = { width: 120, height: 180 }
}) => {
  const imageUri = path 
    ? `${IMAGE_BASE_URL}${path}` 
    : `https://via.placeholder.com/${size.width}x${size.height}/333333/FFFFFF?text=No+Image`;

  return (
    <View style={styles.posterContainer}>
      <Image
        source={{ uri: imageUri }}
        style={[styles.poster, size]}
        resizeMode="cover"
      />
      {rating !== undefined && (
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  posterContainer: {
    position: 'relative',
    marginBottom: 6,
  },
  poster: {
    borderRadius: 6,
  },
  ratingBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  ratingText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

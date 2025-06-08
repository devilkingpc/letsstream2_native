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
  size = { width: 160, height: 240 }  // Updated default size for better presentation
}) => {
  const imageUri = path 
    ? `${IMAGE_BASE_URL}${path}` 
    : `https://via.placeholder.com/${size.width}x${size.height}/333333/FFFFFF?text=No+Image`;

  return (
    <View style={[styles.posterContainer, size]}>
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: imageUri }}
          style={[styles.poster, size]}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
      </View>
      {rating !== undefined && rating > 0 && (
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>
            {rating.toFixed(1)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  posterContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  imageWrapper: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  poster: {
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#1a1a1a',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  ratingText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

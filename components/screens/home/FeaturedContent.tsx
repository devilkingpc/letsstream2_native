import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BACKDROP_IMAGE_BASE_URL } from '../../../types/content';
import { Movie, TvShow } from '../../../types/content';

type FeaturedContentProps = {
  content: Movie | TvShow;
  onPlayPress: () => void;
  onInfoPress: () => void;
};

const FeaturedContent: React.FC<FeaturedContentProps> = ({
  content,
  onPlayPress,
  onInfoPress
}) => {
  const isMovie = 'title' in content;
  const title = isMovie ? content.title : content.name;
  const releaseDate = isMovie 
    ? (content as Movie).release_date 
    : (content as TvShow).first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';

  return (
    <View style={styles.container}>
      <Image
        source={{ 
          uri: content.backdrop_path 
            ? `${BACKDROP_IMAGE_BASE_URL}${content.backdrop_path}` 
            : 'https://via.placeholder.com/500x281/333333/FFFFFF?text=No+Image' 
        }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.gradient} />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.year}>{year}</Text>
        <Text style={styles.overview} numberOfLines={2}>
          {content.overview}
        </Text>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.playButton} onPress={onPlayPress}>
            <Ionicons name="play" size={20} color="#000" />
            <Text style={styles.playButtonText}>Play</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.infoButton} onPress={onInfoPress}>
            <Ionicons name="information-circle-outline" size={20} color="#fff" />
            <Text style={styles.infoButtonText}>Info</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 500,
    position: 'relative',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
    backgroundColor: 'rgba(18, 18, 18, 0)',
    backgroundImage: 'linear-gradient(to bottom, rgba(18, 18, 18, 0), rgba(18, 18, 18, 1))',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  year: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 8,
  },
  overview: {
    fontSize: 14,
    color: '#ddd',
    marginBottom: 12,
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  playButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  playButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 4,
  },
  infoButton: {
    backgroundColor: 'rgba(100, 100, 100, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 4,
  },
});

export default FeaturedContent;

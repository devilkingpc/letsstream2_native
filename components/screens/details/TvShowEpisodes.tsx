import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Episode = {
  episode_number: number;
  name: string;
  still_path: string | null;
  overview: string;
};

type SeasonControlsProps = {
  seasons: Array<{ season_number: number; episode_count: number }>;
  selectedSeason: number;
  onSeasonChange: (season: number) => void;
};

type EpisodesListProps = {
  episodes: Episode[];
  selectedEpisode: number;
  onEpisodePress: (episodeNumber: number) => void;
  imageBaseUrl: string;
};

export const SeasonControls: React.FC<SeasonControlsProps> = ({
  seasons,
  selectedSeason,
  onSeasonChange,
}) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.seasonsScrollView}>
    {seasons.filter(s => s.season_number > 0).map(season => (
      <TouchableOpacity 
        key={`season-${season.season_number}`}
        style={[
          styles.seasonButton,
          selectedSeason === season.season_number && styles.selectedSeasonButton
        ]}
        onPress={() => onSeasonChange(season.season_number)}
      >
        <Text 
          style={[
            styles.seasonButtonText,
            selectedSeason === season.season_number && styles.selectedSeasonButtonText
          ]}
        >
          Season {season.season_number}
        </Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
);

export const EpisodesList: React.FC<EpisodesListProps> = ({
  episodes,
  selectedEpisode,
  onEpisodePress,
  imageBaseUrl,
}) => (
  <View style={styles.episodesList}>
    {episodes.map(episode => (
      <TouchableOpacity 
        key={`episode-${episode.episode_number}`}
        style={[
          styles.episodeItem,
          selectedEpisode === episode.episode_number && styles.selectedEpisodeItem
        ]}
        onPress={() => onEpisodePress(episode.episode_number)}
      >
        <View style={styles.episodeNumberContainer}>
          <Text style={styles.episodeNumber}>{episode.episode_number}</Text>
        </View>
        <View style={styles.episodeImageContainer}>
          {episode.still_path ? (
            <Image 
              source={{ uri: `${imageBaseUrl}${episode.still_path}` }}
              style={styles.episodeImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.episodeImagePlaceholder}>
              <Ionicons name="image-outline" size={24} color="#aaa" />
            </View>
          )}
        </View>
        <View style={styles.episodeInfo}>
          <Text style={styles.episodeTitle} numberOfLines={2}>
            {episode.name}
          </Text>
          <Text style={styles.episodeOverview} numberOfLines={2}>
            {episode.overview}
          </Text>
        </View>
        <Ionicons 
          name="play-circle-outline" 
          size={32} 
          color="#E50914" 
          style={styles.episodePlayIcon}
        />
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  seasonsScrollView: {
    marginBottom: 16,
  },
  seasonButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  selectedSeasonButton: {
    backgroundColor: '#E50914',
  },
  seasonButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  selectedSeasonButtonText: {
    fontWeight: 'bold',
  },
  episodesList: {
    marginTop: 16,
  },
  episodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
  },
  selectedEpisodeItem: {
    backgroundColor: 'rgba(229, 9, 20, 0.2)',
  },
  episodeNumberContainer: {
    width: 30,
    alignItems: 'center',
  },
  episodeNumber: {
    color: '#aaa',
    fontSize: 16,
    fontWeight: 'bold',
  },
  episodeImageContainer: {
    width: 120,
    height: 68,
    borderRadius: 4,
    overflow: 'hidden',
    marginHorizontal: 12,
  },
  episodeImage: {
    width: '100%',
    height: '100%',
  },
  episodeImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  episodeInfo: {
    flex: 1,
    marginRight: 12,
  },
  episodeTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  episodeOverview: {
    color: '#aaa',
    fontSize: 12,
    lineHeight: 16,
  },
  episodePlayIcon: {
    marginLeft: 8,
  },
});

export default {
  SeasonControls,
  EpisodesList,
};

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PlayerCornerControlsProps {
  onBack: () => void;
  onPrevEpisode?: () => void;
  onNextEpisode?: () => void;
  onShowSources: () => void;
  onControlPress: () => void;
  showEpisodeControls: boolean;
  sourceName: string;
  controlsOpacity: number;
}

const PlayerCornerControls: React.FC<PlayerCornerControlsProps> = ({
  onBack,
  onPrevEpisode,
  onNextEpisode,
  onShowSources,
  onControlPress,
  showEpisodeControls,
  sourceName,
  controlsOpacity,
}) => (
  <View style={[styles.cornerControls, { opacity: controlsOpacity }]}> 
    <TouchableOpacity
      style={styles.backButton}
      onPress={onBack}
      onPressIn={onControlPress}
    >
      <Ionicons name="arrow-back" size={24} color="#fff" />
    </TouchableOpacity>
    <View style={styles.rightControls}>
      {showEpisodeControls && (
        <View style={styles.episodeControls}>
          <TouchableOpacity 
            style={styles.episodeNavButton} 
            onPress={onPrevEpisode}
            onPressIn={onControlPress}
          >
            <Ionicons name="play-skip-back" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.episodeNavButton} 
            onPress={onNextEpisode}
            onPressIn={onControlPress}
          >
            <Ionicons name="play-skip-forward" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity
        style={styles.sourceButton}
        onPress={onShowSources}
        onPressIn={onControlPress}
      >
        <Ionicons name="swap-horizontal" size={20} color="#fff" />
        <Text style={styles.sourceButtonText} numberOfLines={1}>
          {sourceName}
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  cornerControls: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    pointerEvents: 'box-none',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
  },
  rightControls: {
    alignItems: 'flex-end',
  },
  episodeControls: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  episodeNavButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    marginLeft: 8,
  },
  sourceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    maxWidth: 200,
  },
  sourceButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
  },
});

export default PlayerCornerControls;

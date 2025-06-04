import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  Modal,
  FlatList,
  Alert,
  BackHandler
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

type VideoSource = {
  key: string;
  name: string;
  movieUrlPattern: string;
  tvUrlPattern: string;
};

type SeasonMeta = { season_number: number; episode_count: number };

type RouteParams = {
  id: number;
  type: 'movie' | 'tv';
  title: string;
  season?: number;
  episode?: number;
  seasonsData?: SeasonMeta[];
  sourceUrl: string;
  sources: VideoSource[];
};

const PlayerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { 
    id, 
    type, 
    title,
    season = 1,
    episode = 1,
    seasonsData = [],
    sourceUrl: initialSourceUrl,
    sources 
  } = route.params as RouteParams;

  const [currentSourceUrl, setCurrentSourceUrl] = useState<string>(initialSourceUrl);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showControls, setShowControls] = useState<boolean>(false);
  const [showSourcesModal, setShowSourcesModal] = useState<boolean>(false);
  const [currentSourceIndex, setCurrentSourceIndex] = useState<number>(0);
  const [currentSeason, setCurrentSeason] = useState<number>(season);
  const [currentEpisode, setCurrentEpisode] = useState<number>(episode);
  const webViewRef = useRef<WebView>(null);

  // Handle Android back button
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (showSourcesModal) {
          setShowSourcesModal(false);
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, [showSourcesModal])
  );

  const handleWebViewLoad = () => {
    setIsLoading(false);
  };

  const handleWebViewError = () => {
    setIsLoading(false);
    Alert.alert(
      "Playback Error",
      "There was an error loading this source. Please try a different source.",
      [
        { text: "Try Another Source", onPress: () => setShowSourcesModal(true) },
        { text: "Go Back", onPress: () => navigation.goBack() }
      ]
    );
  };

  const toggleControls = () => {
    setShowControls(prev => !prev);
    // Auto-hide controls after 5 seconds
    if (!showControls) {
      setTimeout(() => {
        setShowControls(false);
      }, 5000);
    }
  };

  const buildUrl = (sourceItem: VideoSource, s: number, e: number) => {
    if (type === 'movie') {
      return sourceItem.movieUrlPattern.replace('{id}', id.toString());
    }
    return sourceItem.tvUrlPattern
      .replace('{id}', id.toString())
      .replace('{season}', s.toString())
      .replace('{episode}', e.toString());
  };

  const updateUrl = (srcIdx: number, s: number, e: number) => {
    const srcObj = sources[srcIdx];
    setIsLoading(true);
    setCurrentSourceUrl(buildUrl(srcObj, s, e));
  };

  const switchSource = (index: number, sourceItem: VideoSource) => {
    setIsLoading(true);
    setShowSourcesModal(false);
    setCurrentSourceIndex(index);
    updateUrl(index, currentSeason, currentEpisode);
  };

  const goToNextEpisode = () => {
    if (type !== 'tv') return;
    
    const currentSeasonMeta = seasonsData.find(s => s.season_number === currentSeason);
    const maxEpisode = currentSeasonMeta?.episode_count ?? currentEpisode;
    
    if (currentEpisode < maxEpisode) {
      const nextEp = currentEpisode + 1;
      setCurrentEpisode(nextEp);
      updateUrl(currentSourceIndex, currentSeason, nextEp);
    } else {
      // Move to next season if available
      const seasonNumbers = seasonsData.filter(s => s.season_number > 0).map(s => s.season_number).sort((a,b)=>a-b);
      const currentSeasonIndex = seasonNumbers.indexOf(currentSeason);
      if (currentSeasonIndex >= 0 && currentSeasonIndex < seasonNumbers.length - 1) {
        const nextSeasonNumber = seasonNumbers[currentSeasonIndex + 1];
        setCurrentSeason(nextSeasonNumber);
        setCurrentEpisode(1);
        updateUrl(currentSourceIndex, nextSeasonNumber, 1);
      } else {
        Alert.alert('End of Series', 'No more episodes available.');
      }
    }
  };

  const goToPrevEpisode = () => {
    if (type !== 'tv') return;
    
    if (currentEpisode > 1) {
      const prevEp = currentEpisode - 1;
      setCurrentEpisode(prevEp);
      updateUrl(currentSourceIndex, currentSeason, prevEp);
    } else {
      // Move to previous season's last episode if exists
      const seasonNumbers = seasonsData.filter(s => s.season_number > 0).map(s => s.season_number).sort((a,b)=>a-b);
      const currentSeasonIndex = seasonNumbers.indexOf(currentSeason);
      if (currentSeasonIndex > 0) {
        const prevSeasonNumber = seasonNumbers[currentSeasonIndex - 1];
        const prevSeasonMeta = seasonsData.find(s => s.season_number === prevSeasonNumber);
        const lastEpisodePrevSeason = prevSeasonMeta?.episode_count ?? 1;
        setCurrentSeason(prevSeasonNumber);
        setCurrentEpisode(lastEpisodePrevSeason);
        updateUrl(currentSourceIndex, prevSeasonNumber, lastEpisodePrevSeason);
      } else {
        Alert.alert('Start of Series', 'This is the first episode.');
      }
    }
  };

  const renderSourceItem = ({ item, index }: { item: VideoSource, index: number }) => {
    const isSelected = index === currentSourceIndex;
    
    return (
      <TouchableOpacity
        style={[styles.sourceItem, isSelected && styles.selectedSourceItem]}
        onPress={() => switchSource(index, item)}
      >
        <Text style={[styles.sourceName, isSelected && styles.selectedSourceName]}>
          {item.name}
        </Text>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={20} color="#E50914" />
        )}
      </TouchableOpacity>
    );
  };

  const renderSourcesModal = () => (
    <Modal
      visible={showSourcesModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowSourcesModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Source</Text>
          <Text style={styles.modalSubtitle}>
            {type === 'movie' ? title : `${title} - S${currentSeason}:E${currentEpisode}`}
          </Text>
          
          <FlatList
            data={sources}
            renderItem={renderSourceItem}
            keyExtractor={(item) => item.key}
            style={styles.sourcesList}
          />
          
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowSourcesModal(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar hidden />
      <View style={styles.playerContainer}>
        <WebView
          ref={webViewRef}
          source={{ uri: currentSourceUrl }}
          style={styles.webview}
          onLoadEnd={handleWebViewLoad}
          onError={handleWebViewError}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsFullscreenVideo={true}
          injectedJavaScript={INJECTED_JAVASCRIPT}
        />
        
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={toggleControls}
        >
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#E50914" />
            </View>
          )}
          
          {showControls && (
            <View style={styles.controlsOverlay}>
              <View style={styles.topControls}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => navigation.goBack()}
                >
                  <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.titleText}>
                  {type === 'movie' ? title : `${title} - S${currentSeason}:E${currentEpisode}`}
                </Text>
              </View>
              
              <View style={styles.centerControls}>
                {/* Empty for now, could add play/pause controls if needed */}
              </View>
              
              <View style={styles.bottomControls}>
                {/* Prev / Next episode controls for TV */}
                {type === 'tv' && (
                  <TouchableOpacity style={styles.episodeNavButton} onPress={goToPrevEpisode}>
                    <Ionicons name="play-skip-back" size={24} color="#fff" />
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity
                  style={styles.sourceButton}
                  onPress={() => setShowSourcesModal(true)}
                >
                  <Ionicons name="swap-horizontal" size={20} color="#fff" />
                  <Text style={styles.sourceButtonText}>
                    Source: {sources[currentSourceIndex]?.name || "Unknown"}
                  </Text>
                </TouchableOpacity>
                
                {type === 'tv' && (
                  <TouchableOpacity style={styles.episodeNavButton} onPress={goToNextEpisode}>
                    <Ionicons name="play-skip-forward" size={24} color="#fff" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </TouchableOpacity>
      </View>
      
      {renderSourcesModal()}
    </SafeAreaView>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  playerContainer: {
    width,
    height: '100%',
    backgroundColor: '#000',
    position: 'relative',
  },
  webview: {
    flex: 1,
  },
  overlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  titleText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  centerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  episodeNavButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  sourceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  sourceButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: height * 0.7,
    backgroundColor: '#1c1c1c',
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  modalSubtitle: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 16,
  },
  sourcesList: {
    maxHeight: height * 0.5,
  },
  sourceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  selectedSourceItem: {
    backgroundColor: 'rgba(229, 9, 20, 0.15)',
  },
  sourceName: {
    color: '#ddd',
    fontSize: 16,
  },
  selectedSourceName: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#333',
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// A harmless script so injectedJavaScript prop is always defined
const INJECTED_JAVASCRIPT = 'true;';

export default PlayerScreen;
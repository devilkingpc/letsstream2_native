import React, { useState, useRef } from 'react';
import { View, Alert, BackHandler, StatusBar, StyleSheet, Dimensions } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PlayerWebView from '../components/player/PlayerWebView';
import PlayerCornerControls from '../components/player/PlayerCornerControls';
import PlayerSourcesModal, { VideoSource } from '../components/player/PlayerSourcesModal';



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


const POPUP_BLOCKER_SCRIPT = `
(function() {
  window.open = function() { return null; };
  setInterval(() => {
    const frames = document.getElementsByTagName('iframe');
    for(let i = 0; i < frames.length; i++) {
      try {
        frames[i].contentWindow.open = function() { return null; };
      } catch(e) {}
    }
  }, 100);
})();
`;

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
  const [controlsOpacity, setControlsOpacity] = useState<number>(1);
  let controlsTimer: NodeJS.Timeout | null = null;
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
      'Playback Error',
      'There was an error loading this source. Please try a different source.',
      [
        { text: 'Try Another Source', onPress: () => setShowSourcesModal(true) },
        { text: 'Go Back', onPress: () => navigation.goBack() },
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

  const startControlsTimer = () => {
    if (controlsTimer) {
      clearTimeout(controlsTimer);
    }
    setControlsOpacity(1);
    controlsTimer = setTimeout(() => {
      setControlsOpacity(0.3);
    }, 5000);
  };

  // Cleanup timer on unmount
  React.useEffect(() => {
    startControlsTimer();
    return () => {
      if (controlsTimer) {
        clearTimeout(controlsTimer);
      }
    };
  }, []);

  const handleControlPress = () => {
    startControlsTimer();
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


  const handleNavigationStateChange = (navState: any) => {
    if (navState.url !== currentSourceUrl) {
      webViewRef.current?.stopLoading();
      return false;
    }
    return true;
  };

  const handleShouldStartLoadWithRequest = (event: any) => {
    if (event.url !== currentSourceUrl) {
      return false;
    }
    return true;
  };


  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar hidden />
      <View style={styles.playerContainer}>
        <PlayerWebView
          webViewRef={webViewRef}
          sourceUrl={currentSourceUrl}
          isLoading={isLoading}
          onLoadEnd={handleWebViewLoad}
          onError={handleWebViewError}
          injectedJavaScript={`${POPUP_BLOCKER_SCRIPT}${INJECTED_JAVASCRIPT || ''}`}
          handleNavigationStateChange={handleNavigationStateChange}
          handleShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
        />
        <PlayerCornerControls
          onBack={() => navigation.goBack()}
          onPrevEpisode={goToPrevEpisode}
          onNextEpisode={goToNextEpisode}
          onShowSources={() => setShowSourcesModal(true)}
          onControlPress={handleControlPress}
          showEpisodeControls={type === 'tv'}
          sourceName={sources[currentSourceIndex]?.name || 'Unknown'}
          controlsOpacity={controlsOpacity}
        />
      </View>
      <PlayerSourcesModal
        visible={showSourcesModal}
        onClose={() => setShowSourcesModal(false)}
        sources={sources}
        currentSourceIndex={currentSourceIndex}
        onSelectSource={switchSource}
        type={type}
        title={title}
        currentSeason={currentSeason}
        currentEpisode={currentEpisode}
      />
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
});

// Script to improve iframe interaction and ensure proper video playback
const INJECTED_JAVASCRIPT = `
  (function() {
    // Allow inline playback
    document.body.style.position = 'relative';
    document.body.style.width = '100vw';
    document.body.style.height = '100vh';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    
    // Find all iframes and make them fullscreen
    const iframes = document.getElementsByTagName('iframe');
    for (let i = 0; i < iframes.length; i++) {
      const iframe = iframes[i];
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      iframe.style.position = 'absolute';
      iframe.style.top = '0';
      iframe.style.left = '0';
      
      // Add allow attributes for better compatibility
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
      iframe.allowFullscreen = true;
    }
    
    // Prevent scrolling of the main document
    document.body.style.overflow = 'hidden';
    
    true;
  })();
`;

export default PlayerScreen;
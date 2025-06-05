import React, { RefObject } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

interface PlayerWebViewProps {
  webViewRef: RefObject<WebView>;
  sourceUrl: string;
  isLoading: boolean;
  onLoadEnd: () => void;
  onError: () => void;
  injectedJavaScript: string;
  handleNavigationStateChange: (navState: any) => boolean;
  handleShouldStartLoadWithRequest: (event: any) => boolean;
}

const PlayerWebView: React.FC<PlayerWebViewProps> = ({
  webViewRef,
  sourceUrl,
  isLoading,
  onLoadEnd,
  onError,
  injectedJavaScript,
  handleNavigationStateChange,
  handleShouldStartLoadWithRequest,
}) => (
  <>
    <WebView
      ref={webViewRef}
      source={{ uri: sourceUrl }}
      style={styles.webview}
      onLoadEnd={onLoadEnd}
      onError={onError}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      allowsFullscreenVideo={true}
      mediaPlaybackRequiresUserAction={false}
      allowsInlineMediaPlayback={true}
      mixedContentMode="compatibility"
      scalesPageToFit={true}
      bounces={false}
      startInLoadingState={true}
      originWhitelist={['*']}
      injectedJavaScript={injectedJavaScript}
      onNavigationStateChange={handleNavigationStateChange}
      onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
      setSupportMultipleWindows={false}
    />
    {isLoading && (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    )}
  </>
);

const styles = StyleSheet.create({
  webview: {
    flex: 1,
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
});

export default PlayerWebView;

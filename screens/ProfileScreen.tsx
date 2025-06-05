import React, { useState } from 'react';
import { View, Alert, ScrollView, StatusBar, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileInfo from '../components/profile/ProfileInfo';
import ProfileSection from '../components/profile/ProfileSection';
import MenuItem from '../components/profile/MenuItem';
import LoginModal from '../components/profile/LoginModal';
import SettingsModal from '../components/profile/SettingsModal';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState('Auto');
  const [autoplay, setAutoplay] = useState(true);
  const [downloadWifiOnly, setDownloadWifiOnly] = useState(true);
  
  // Mock user data
  const [userData, setUserData] = useState({
    name: 'Guest User',
    email: 'user@example.com',
    avatarUrl: 'https://api.a0.dev/assets/image?text=User+Profile&aspect=1:1&seed=123',
    memberSince: '2023',
    watchlist: [],
    downloads: [],
    preferences: {
      language: 'English',
      subtitles: true,
      quality: 'Auto'
    }
  });
  
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsLoggedIn(true);
      setShowLoginModal(false);
      Alert.alert("Success", "Signed in successfully!");
      setUserData({
        ...userData,
        name: 'John Doe',
        email: email,
        memberSince: '2025'
      });
    } catch (error) {
      Alert.alert("Error", "Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
      setEmail('');
      setPassword('');
    }
  };
  
  const handleLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Sign Out", 
          onPress: () => {
            setIsLoggedIn(false);
            setUserData({
              ...userData,
              name: 'Guest User',
              email: 'user@example.com'
            });
            Alert.alert("Success", "Signed out successfully!");
          },
          style: "destructive" 
        }
      ]
    );
  };
  
  const toggleDarkMode = () => {
    setDarkMode(previousState => !previousState);
    Alert.alert("Theme Changed", darkMode ? "Light mode enabled" : "Dark mode enabled");
  };
  
  const toggleNotifications = () => {
    setNotifications(previousState => !previousState);
    Alert.alert("Notifications", notifications ? "Notifications disabled" : "Notifications enabled");
  };
  
  const handleAbout = () => {
    Alert.alert(
      "Let's Stream",
      "A feature-rich mobile streaming app powered by TMDB API.\n\nVersion 1.0.0\nDeveloped by Your Name\n\nAll content provided by TMDB API\n© 2025 Let's Stream",
      [{ text: "OK" }]
    );
  };
  
  const handleClearCache = () => {
    Alert.alert(
      "Clear Cache",
      "This will clear all temporary data. Your downloads won't be affected.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear", 
          onPress: async () => {
            setIsLoading(true);
            // Simulate cache clearing
            await new Promise(resolve => setTimeout(resolve, 1000));
            setIsLoading(false);
            Alert.alert("Success", "Cache cleared successfully");
          }
        }
      ]
    );
  };

  const handleDownloads = () => {
    if (!isLoggedIn) {
      Alert.alert("Sign In Required", "Please sign in to access your downloads.");
      return;
    }
    // Navigate to downloads screen (to be implemented)
    Alert.alert("Downloads", "Downloads feature coming soon!");
  };

  const handleWatchlist = () => {
    if (!isLoggedIn) {
      Alert.alert("Sign In Required", "Please sign in to access your watchlist.");
      return;
    }
    // Navigate to watchlist screen (to be implemented)
    Alert.alert("Watchlist", "Watchlist feature coming soon!");
  };



  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />
      <ProfileHeader />
      <ScrollView style={styles.scrollView}>
        <ProfileInfo
          avatarUrl={userData.avatarUrl}
          name={userData.name}
          email={userData.email}
          memberSince={userData.memberSince}
          isLoggedIn={isLoggedIn}
        />
        <ProfileSection title="Account">
          {!isLoggedIn ? (
            <MenuItem
              icon={<Ionicons name="log-in-outline" size={24} color="#fff" />}
              text="Sign In"
              onPress={() => setShowLoginModal(true)}
              rightIcon={<Ionicons name="chevron-forward" size={24} color="#666" />}
            />
          ) : (
            <>
              <MenuItem
                icon={<Ionicons name="bookmark-outline" size={24} color="#fff" />}
                text="My Watchlist"
                onPress={handleWatchlist}
                rightIcon={<Ionicons name="chevron-forward" size={24} color="#666" />}
              />
              <MenuItem
                icon={<Ionicons name="download-outline" size={24} color="#fff" />}
                text="Downloads"
                onPress={handleDownloads}
                rightIcon={<Ionicons name="chevron-forward" size={24} color="#666" />}
              />
            </>
          )}
        </ProfileSection>
        <ProfileSection title="Preferences">
          <MenuItem
            icon={<Ionicons name="settings-outline" size={24} color="#fff" />}
            text="Playback Settings"
            onPress={() => setShowSettings(true)}
            rightIcon={<Ionicons name="chevron-forward" size={24} color="#666" />}
          />
          <MenuItem
            icon={<Ionicons name={darkMode ? 'moon' : 'sunny'} size={24} color="#fff" />}
            text="Dark Mode"
            switchProps={{
              value: darkMode,
              onValueChange: toggleDarkMode,
              trackColor: { false: '#767577', true: '#E50914' },
              thumbColor: darkMode ? '#fff' : '#f4f3f4',
            }}
          />
          <MenuItem
            icon={<Ionicons name={notifications ? 'notifications' : 'notifications-off'} size={24} color="#fff" />}
            text="Notifications"
            switchProps={{
              value: notifications,
              onValueChange: toggleNotifications,
              trackColor: { false: '#767577', true: '#E50914' },
              thumbColor: notifications ? '#fff' : '#f4f3f4',
            }}
          />
        </ProfileSection>
        <ProfileSection title="App">
          <MenuItem
            icon={<MaterialIcons name="cleaning-services" size={24} color="#fff" />}
            text="Clear Cache"
            onPress={handleClearCache}
            rightIcon={<Ionicons name="chevron-forward" size={24} color="#666" />}
          />
          <MenuItem
            icon={<Ionicons name="information-circle-outline" size={24} color="#fff" />}
            text="About"
            onPress={handleAbout}
            rightIcon={<Ionicons name="chevron-forward" size={24} color="#666" />}
          />
          {isLoggedIn && (
            <MenuItem
              icon={<Ionicons name="log-out-outline" size={24} color="#E50914" />}
              text="Sign Out"
              onPress={handleLogout}
              textStyle={styles.logoutText}
              style={styles.logoutItem}
            />
          )}
        </ProfileSection>
      </ScrollView>
      <LoginModal
        visible={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        email={email}
        password={password}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onLogin={handleLogin}
        isLoading={isLoading}
      />
      <SettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        selectedQuality={selectedQuality}
        setSelectedQuality={setSelectedQuality}
        autoplay={autoplay}
        setAutoplay={setAutoplay}
        downloadWifiOnly={downloadWifiOnly}
        setDownloadWifiOnly={setDownloadWifiOnly}
      />
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#E50914" />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#333',
  },
  profileInfo: {
    marginLeft: 20,
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  menuItemText: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
    marginLeft: 16,
  },
  logoutItem: {
    marginTop: 20,
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#E50914',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 4,
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: '#fff',
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#E50914',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingItem: {
    marginBottom: 24,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
  },
  qualityOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  qualityOption: {
    flex: 1,
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#333',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  qualityOptionSelected: {
    backgroundColor: '#E50914',
    borderColor: '#E50914',
  },
  qualityOptionText: {
    color: '#fff',
  },
  qualityOptionTextSelected: {
    fontWeight: 'bold',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;
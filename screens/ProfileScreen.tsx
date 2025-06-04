import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
  Image,
  Platform,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Mock user data
  const userData = {
    name: 'Guest User',
    email: 'user@example.com',
    avatarUrl: 'https://api.a0.dev/assets/image?text=User+Profile&aspect=1:1&seed=123',
    memberSince: '2023'
  };
  
  const handleLogin = () => {
    // In a real app, this would navigate to a login screen or show a login modal
    Alert.alert(
      "Sign In",
      "This would normally take you to a login screen with Firebase Authentication.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Mock Login", 
          onPress: () => {
            setIsLoggedIn(true);
            Alert.alert("Success", "Signed in successfully!");
          }
        }
      ]
    );
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
            Alert.alert("Success", "Signed out successfully!");
          },
          style: "destructive" 
        }
      ]
    );
  };
  
  const toggleDarkMode = () => {
    setDarkMode(previousState => !previousState);
    Alert.alert("Info", darkMode ? "Light mode enabled" : "Dark mode enabled");
  };
  
  const toggleNotifications = () => {
    setNotifications(previousState => !previousState);
    Alert.alert("Info", notifications ? "Notifications disabled" : "Notifications enabled");
  };
  
  const handleAbout = () => {
    Alert.alert(
      "Let's Stream",
      "A feature-rich mobile streaming app powered by TMDB API.\n\nVersion 1.0.0",
      [{ text: "OK" }]
    );
  };
  
  const handleClearCache = () => {
    Alert.alert(
      "Clear Cache",
      "Are you sure you want to clear the app cache?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear", 
          onPress: () => {
            // In a real app, this would clear the cache
            Alert.alert("Success", "Cache cleared successfully");
          }
        }
      ]
    );
  };
  
  const renderProfileHeader = () => (
    <View style={styles.profileHeader}>
      <View style={styles.profileImageContainer}>
        <Image
          source={{ uri: userData.avatarUrl }}
          style={styles.profileImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>{isLoggedIn ? userData.name : "Guest User"}</Text>
        {isLoggedIn && <Text style={styles.profileEmail}>{userData.email}</Text>}
        {isLoggedIn && (
          <Text style={styles.memberSince}>Member since {userData.memberSince}</Text>
        )}
      </View>
    </View>
  );
  
  const renderSettingItem = (
    icon: string, 
    title: string, 
    onPress?: () => void,
    rightElement?: React.ReactNode
  ) => (
    <TouchableOpacity 
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeftContent}>
        <Ionicons name={icon as any} size={24} color="#E50914" style={styles.settingIcon} />
        <Text style={styles.settingTitle}>{title}</Text>
      </View>
      <View style={styles.settingRightContent}>
        {rightElement || (
          onPress ? <Ionicons name="chevron-forward" size={20} color="#aaa" /> : null
        )}
      </View>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      
      <ScrollView style={styles.content}>
        {renderProfileHeader()}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          {!isLoggedIn ? (
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Sign In / Register</Text>
            </TouchableOpacity>
          ) : (
            <>
              {renderSettingItem("person-outline", "Edit Profile")}
              {renderSettingItem("bookmark-outline", "Watchlist")}
              {renderSettingItem("time-outline", "Viewing History")}
              {renderSettingItem("log-out-outline", "Sign Out", handleLogout)}
            </>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          {renderSettingItem(
            "contrast-outline", 
            "Dark Mode", 
            undefined,
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#767577', true: '#E50914' }}
              thumbColor="#f4f3f4"
            />
          )}
          
          {renderSettingItem(
            "notifications-outline", 
            "Notifications", 
            undefined,
            <Switch
              value={notifications}
              onValueChange={toggleNotifications}
              trackColor={{ false: '#767577', true: '#E50914' }}
              thumbColor="#f4f3f4"
            />
          )}
          
          {renderSettingItem("language-outline", "Language")}
          {renderSettingItem("play-outline", "Playback Settings")}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          {renderSettingItem("help-circle-outline", "Help Center")}
          {renderSettingItem("document-text-outline", "Terms of Service")}
          {renderSettingItem("shield-checkmark-outline", "Privacy Policy")}
          {renderSettingItem("trash-outline", "Clear Cache", handleClearCache)}
          {renderSettingItem("information-circle-outline", "About", handleAbout)}
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Let's Stream v1.0.0</Text>
          <Text style={styles.footerSubtext}>Powered by TMDB</Text>
        </View>
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    marginRight: 16,
    backgroundColor: '#333',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 4,
  },
  memberSince: {
    color: '#aaa',
    fontSize: 12,
  },
  loginButton: {
    backgroundColor: '#E50914',
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  settingLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingTitle: {
    color: '#fff',
    fontSize: 16,
  },
  settingRightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  footerText: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 4,
  },
  footerSubtext: {
    color: '#777',
    fontSize: 12,
  },
});

export default ProfileScreen;
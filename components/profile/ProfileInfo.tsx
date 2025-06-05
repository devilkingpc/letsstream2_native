import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface ProfileInfoProps {
  avatarUrl: string;
  name: string;
  email: string;
  memberSince?: string;
  isLoggedIn: boolean;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ avatarUrl, name, email, memberSince, isLoggedIn }) => (
  <View style={styles.profileSection}>
    <Image source={{ uri: avatarUrl }} style={styles.avatar} />
    <View style={styles.profileInfo}>
      <Text style={styles.userName}>{name}</Text>
      <Text style={styles.userEmail}>{email}</Text>
      {isLoggedIn && memberSince && (
        <Text style={styles.memberSince}>Member since {memberSince}</Text>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
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
});

export default ProfileInfo;

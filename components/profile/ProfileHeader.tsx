import React from 'react';
import { View, StyleSheet } from 'react-native';
import Logo from '../Logo';

const ProfileHeader: React.FC = () => (
  <View style={styles.header}>
    <Logo />
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
});

export default ProfileHeader;

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../../Logo';

type HomeHeaderProps = {
  onSearchPress: () => void;
  onProfilePress: () => void;
};

const HomeHeader: React.FC<HomeHeaderProps> = ({
  onSearchPress,
  onProfilePress
}) => (
  <View style={styles.header}>
    <Logo />
    <View style={styles.headerRight}>
      <TouchableOpacity 
        style={styles.headerButton}
        onPress={onSearchPress}
      >
        <Ionicons name="search" size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.headerButton}
        onPress={onProfilePress}
      >
        <Ionicons name="person-circle-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingRight: 16,
  },
  headerRight: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 15,
  },
});

export default HomeHeader;

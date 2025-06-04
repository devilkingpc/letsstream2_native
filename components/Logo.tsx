import React, { useState } from 'react';
import { View, Text, Pressable, Animated, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface LogoProps {
  style?: any;
}

/**
 * A distinctive, monochromatic logo component for the Let's Stream navigation bar.
 * Features overlapping letters and animation effects.
 */
export const Logo: React.FC<LogoProps> = ({ style = {} }) => {
  const navigation = useNavigation();
  const [scaleAnim] = useState(new Animated.Value(0));
  
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const underlineStyle = {
    transform: [{
      scaleX: scaleAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      })
    }]
  };

  const letterStyle = {
    transform: [{
      scale: scaleAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.05],
      })
    }]
  };

  return (
    <Pressable
      style={[styles.container, style]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={() => navigation.navigate('Home' as never)}
    >
      <View style={styles.lettersContainer}>
        <Animated.Text style={[styles.letter, styles.letterL, letterStyle]}>
          L
        </Animated.Text>
        <Animated.Text style={[styles.letter, styles.letterS, letterStyle]}>
          S
        </Animated.Text>
      </View>
      <Animated.View style={[styles.underline, underlineStyle]} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    position: 'relative',
  },
  lettersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  letter: {
    fontSize: 28,
    fontWeight: '700',
    color: '#E50914',
  },
  letterL: {
    zIndex: 2,
  },
  letterS: {
    marginLeft: -6,
    zIndex: 1,
  },
  underline: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 2,
    height: 2,
    backgroundColor: '#E50914',
    opacity: 0.5,
    borderRadius: 1,
  },
});

export default Logo;

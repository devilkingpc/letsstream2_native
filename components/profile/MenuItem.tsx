import React from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';

interface MenuItemProps {
  icon: React.ReactNode;
  text: string;
  onPress?: () => void;
  rightIcon?: React.ReactNode;
  switchProps?: {
    value: boolean;
    onValueChange: (value: boolean) => void;
    trackColor?: { false: string; true: string };
    thumbColor?: string;
  };
  textStyle?: object;
  style?: object;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  text,
  onPress,
  rightIcon,
  switchProps,
  textStyle,
  style,
}) => (
  <TouchableOpacity
    style={[styles.menuItem, style]}
    onPress={onPress}
    activeOpacity={onPress ? 0.7 : 1}
    disabled={!onPress && !switchProps}
  >
    {icon}
    <Text style={[styles.menuItemText, textStyle]}>{text}</Text>
    {switchProps ? (
      <Switch
        value={switchProps.value}
        onValueChange={switchProps.onValueChange}
        trackColor={switchProps.trackColor}
        thumbColor={switchProps.thumbColor}
      />
    ) : rightIcon ? (
      rightIcon
    ) : null}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
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
});

export default MenuItem;

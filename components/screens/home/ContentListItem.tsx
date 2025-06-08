import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ContentItem, ContentType } from '../../../types/content';
import { ContentPoster } from '../../ContentPoster';

type ContentListItemProps = {
  item: ContentItem;
  contentType: ContentType;
  onPress: () => void;
};

const ContentListItem: React.FC<ContentListItemProps> = ({
  item,
  contentType,
  onPress,
}) => {
  const title = contentType === 'movie' 
    ? (item as { title: string }).title 
    : (item as { name: string }).name;

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <ContentPoster
        path={item.poster_path}
        rating={item.vote_average}
        size={{ width: 160, height: 240 }}
      />
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 16,
    width: 160,
  },
  titleContainer: {
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 14,
    color: '#FAFAFA',
    marginTop: 8,
    fontWeight: '500',
    letterSpacing: 0.2,
    lineHeight: 18,
  },
});

export default ContentListItem;

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
    >
      <ContentPoster
        path={item.poster_path}
        rating={item.vote_average}
      />
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 10,
    width: 120,
  },
  title: {
    fontSize: 14,
    color: '#ddd',
    marginTop: 4,
    width: 120,
  },
});

export default ContentListItem;

import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { ContentItem, ContentType } from '../../../types/content';
import ContentListItem from './ContentListItem';
import { ContentSectionProps } from './types';

const ContentSection: React.FC<ContentSectionProps> = ({
  title,
  data,
  contentType,
  onItemPress,
}) => (
  <View style={styles.section}>
    <Text style={styles.title}>{title}</Text>
    <FlatList
      data={data}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => `${contentType}-${item.id}`}
      renderItem={({ item }) => (
        <ContentListItem
          item={item}
          contentType={contentType}
          onPress={() => onItemPress(item, contentType)}
        />
      )}
      contentContainerStyle={styles.list}
    />
  </View>
);

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  list: {
    paddingRight: 16,
  },
});

export default ContentSection;

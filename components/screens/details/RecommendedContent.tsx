import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { ContentPoster } from '../../ContentPoster';
import { ContentType, API_KEY, BASE_URL, Movie, TvShow } from '../../../types/content';
import { RootStackParamList } from '../../../types/navigation';
import { navigateToDetails } from '../../../utils/navigation';

type RecommendedContentProps = {
  contentId: number;
  contentType: ContentType;
};

const RecommendedContent: React.FC<RecommendedContentProps> = ({
  contentId,
  contentType,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [recommendations, setRecommendations] = useState<(Movie | TvShow)[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/${contentType}/${contentId}/recommendations?api_key=${API_KEY}&page=1`
        );
        const data = await response.json();
        setRecommendations(data.results.slice(0, 10));
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [contentId, contentType]);

  const handleContentPress = async (item: Movie | TvShow) => {
    try {
      // Fetch full details before navigation
      const response = await fetch(
        `${BASE_URL}/${contentType}/${item.id}?api_key=${API_KEY}&append_to_response=videos,credits`
      );
      const fullContent = await response.json();

      navigateToDetails(navigation, {
        id: item.id,
        type: contentType,
        content: fullContent,
      }, true);
      
    } catch (error) {
      console.error('Error fetching content details:', error);
      // Navigate with basic info if fetch fails
      navigateToDetails(navigation, {
        id: item.id,
        type: contentType,
        content: item,
      }, true);
    }
  };

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Recommended</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {recommendations.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.itemContainer}
            onPress={() => handleContentPress(item)}
            activeOpacity={0.7}
          >
            <ContentPoster
              path={item.poster_path}
              rating={item.vote_average}
              size={{ width: 160, height: 240 }}
            />
            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={2}>
                {contentType === 'movie' 
                  ? (item as Movie).title 
                  : (item as TvShow).name}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FAFAFA',
    marginBottom: 16,
    paddingHorizontal: 16,
    letterSpacing: 0.3,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  itemContainer: {
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

export default RecommendedContent;

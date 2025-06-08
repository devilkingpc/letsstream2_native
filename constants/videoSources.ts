export interface VideoSource {
  key: string;
  name: string;
  movieUrlPattern: string;
  tvUrlPattern: string;
}

// Default video sources as fallback
const defaultVideoSources: VideoSource[] = [
  {
    key: 'default',
    name: 'Default Source',
    movieUrlPattern: 'https://example.com/movies/{id}',
    tvUrlPattern:
      'https://example.com/tv/{id}/season/{season}/episode/{episode}',
  },
];

// Fetch video sources from remote JSON
export async function fetchVideoSources(): Promise<VideoSource[]> {
  const url = 'https://raw.githubusercontent.com/chintan992/letsstream2/refs/heads/main/src/utils/video-sources.json';
  console.log('Attempting to fetch video sources from:', url);
  
  try {
    console.log('Sending fetch request...');
    const response = await fetch(url);
    console.log('Fetch response status:', response.status);
    console.log('Fetch response ok:', response.ok);
    
    if (!response.ok) {
      console.warn('Failed to fetch video sources, using default sources. Status:', response.status);
      console.log('Default sources:', JSON.stringify(defaultVideoSources, null, 2));
      return defaultVideoSources;
    }

    const responseText = await response.text();
    console.log('Raw response:', responseText);

    const parsed = JSON.parse(responseText);
    console.log('Parsed response:', JSON.stringify(parsed, null, 2));

    // Check if the response has a videoSources array
    if (parsed && Array.isArray(parsed.videoSources) && parsed.videoSources.length > 0) {
      console.log('Successfully loaded', parsed.videoSources.length, 'video sources');
      return parsed.videoSources;
    }

    console.warn('Invalid response format or empty sources array, using default sources');
    console.log('Default sources:', JSON.stringify(defaultVideoSources, null, 2));
    return defaultVideoSources;
  } catch (error) {
    console.warn('Error fetching video sources:', error);
    console.log('Using default sources:', JSON.stringify(defaultVideoSources, null, 2));
    return defaultVideoSources;
  }
}

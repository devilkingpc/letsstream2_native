
export interface VideoSource {
  key: string; // to match navigation type
  name: string;
  movieUrlPattern: string;
  tvUrlPattern: string;
}

// Fetch video sources from remote JSON
export async function fetchVideoSources(): Promise<VideoSource[]> {
  const response = await fetch(
    'https://raw.githubusercontent.com/chintan992/letsstream2/refs/heads/main/src/utils/video-sources.json'
  );
  if (!response.ok) {
    throw new Error('Failed to fetch video sources');
  }
  return response.json();
}

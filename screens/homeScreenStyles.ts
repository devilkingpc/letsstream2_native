import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const FEATURED_CARD_WIDTH = width * 0.85;
const CONTENT_CARD_WIDTH = width * 0.38;

const homeScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A', // Darker background for more cinematic feel
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: 'rgba(10, 10, 10, 0.98)', // Slightly transparent for depth
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    borderBottomWidth: 1,
  },
  logo: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20, // Modern spacing between icons
  },
  headerIcon: {
    opacity: 0.9, // Subtle transparency
  },
  headerIconText: {
    fontSize: 22,
    color: '#FAFAFA',
  },
  scrollView: {
    flex: 1,
  },
  featuredCarouselContainer: {
    marginTop: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  featuredCard: {
    width: FEATURED_CARD_WIDTH,
    marginRight: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#141414',
  },
  categorySection: {
    marginBottom: 32,
    paddingTop: 8,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  categoryTitle: {
    color: '#FAFAFA',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.3, // Subtle letter spacing for modern typography
  },
  chevron: {
    color: '#FAFAFA',
    fontSize: 22,
    marginLeft: 8,
    opacity: 0.8,
  },
  categoryCard: {
    width: CONTENT_CARD_WIDTH,
    marginRight: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#141414',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 64,
    backgroundColor: 'rgba(18, 18, 18, 0.98)', // Slightly transparent
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 8,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 8,
  },
  navIcon: {
    fontSize: 22,
    color: '#FAFAFA',
    opacity: 0.9,
  },
  navLabel: {
    color: '#FAFAFA',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
    opacity: 0.8,
    letterSpacing: 0.2,
  },
});

export default homeScreenStyles;

import { StyleSheet } from 'react-native';

const homeScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#121212',
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: 16,
  },
  headerIconText: {
    fontSize: 24,
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  featuredCarouselContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  featuredCard: {
    width: 320,
    marginRight: 16,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  categoryTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  chevron: {
    color: '#fff',
    fontSize: 24,
    marginLeft: 8,
  },
  categoryCard: {
    width: 140,
    marginRight: 12,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#181818',
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navIcon: {
    fontSize: 24,
    color: '#fff',
  },
  navLabel: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
  },
});

export default homeScreenStyles;

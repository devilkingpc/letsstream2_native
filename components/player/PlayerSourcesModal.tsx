import React from 'react';
import { Modal, View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export type VideoSource = {
  key: string;
  name: string;
  movieUrlPattern: string;
  tvUrlPattern: string;
};

interface PlayerSourcesModalProps {
  visible: boolean;
  onClose: () => void;
  sources: VideoSource[];
  currentSourceIndex: number;
  onSelectSource: (index: number, source: VideoSource) => void;
  type: 'movie' | 'tv';
  title: string;
  currentSeason: number;
  currentEpisode: number;
}

const PlayerSourcesModal: React.FC<PlayerSourcesModalProps> = ({
  visible,
  onClose,
  sources,
  currentSourceIndex,
  onSelectSource,
  type,
  title,
  currentSeason,
  currentEpisode,
}) => {
  const renderSourceItem = ({ item, index }: { item: VideoSource; index: number }) => {
    const isSelected = index === currentSourceIndex;
    return (
      <TouchableOpacity
        style={[styles.sourceItem, isSelected && styles.selectedSourceItem]}
        onPress={() => onSelectSource(index, item)}
      >
        <Text style={[styles.sourceName, isSelected && styles.selectedSourceName]}>
          {item.name}
        </Text>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={20} color="#E50914" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Source</Text>
          <Text style={styles.modalSubtitle}>
            {type === 'movie' ? title : `${title} - S${currentSeason}:E${currentEpisode}`}
          </Text>
          <FlatList
            data={sources}
            renderItem={renderSourceItem}
            keyExtractor={(item) => item.key}
            style={styles.sourcesList}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: height * 0.7,
    backgroundColor: '#1c1c1c',
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  modalSubtitle: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 16,
  },
  sourcesList: {
    maxHeight: height * 0.5,
  },
  sourceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  selectedSourceItem: {
    backgroundColor: 'rgba(229, 9, 20, 0.15)',
  },
  sourceName: {
    color: '#ddd',
    fontSize: 16,
  },
  selectedSourceName: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#333',
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PlayerSourcesModal;

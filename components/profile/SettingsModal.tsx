import React from 'react';
import { View, Text, TouchableOpacity, Modal, Switch, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  selectedQuality: string;
  setSelectedQuality: (quality: string) => void;
  autoplay: boolean;
  setAutoplay: (value: boolean) => void;
  downloadWifiOnly: boolean;
  setDownloadWifiOnly: (value: boolean) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  onClose,
  selectedQuality,
  setSelectedQuality,
  autoplay,
  setAutoplay,
  downloadWifiOnly,
  setDownloadWifiOnly,
}) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Playback Settings</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Video Quality</Text>
          <View style={styles.qualityOptions}>
            {['Auto', 'High', 'Medium', 'Low'].map(quality => (
              <TouchableOpacity
                key={quality}
                style={[
                  styles.qualityOption,
                  selectedQuality === quality && styles.qualityOptionSelected
                ]}
                onPress={() => setSelectedQuality(quality)}
              >
                <Text style={[
                  styles.qualityOptionText,
                  selectedQuality === quality && styles.qualityOptionTextSelected
                ]}>
                  {quality}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.settingItem}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Autoplay Next Episode</Text>
            <Switch
              value={autoplay}
              onValueChange={setAutoplay}
              trackColor={{ false: '#767577', true: '#E50914' }}
              thumbColor={autoplay ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>
        <View style={styles.settingItem}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Download on Wi-Fi Only</Text>
            <Switch
              value={downloadWifiOnly}
              onValueChange={setDownloadWifiOnly}
              trackColor={{ false: '#767577', true: '#E50914' }}
              thumbColor={downloadWifiOnly ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 4,
  },
  settingItem: {
    marginBottom: 24,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
  },
  qualityOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  qualityOption: {
    flex: 1,
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#333',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  qualityOptionSelected: {
    backgroundColor: '#E50914',
    borderColor: '#E50914',
  },
  qualityOptionText: {
    color: '#fff',
  },
  qualityOptionTextSelected: {
    fontWeight: 'bold',
  },
});

export default SettingsModal;

// components/AddObservationModal.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Observation } from '../db/models/Observation';
import { useTheme } from '../theme/ThemeContext';
import { verticalScaleFn } from 'constants/Layout';

interface AddObservationModalProps {
  visible: boolean;
  onClose: () => void;
  hikeId: number;
  onSave: (obs: Observation) => void;
  initialData: Observation | null;
}

const AddObservationModal: React.FC<AddObservationModalProps> = ({
  visible,
  onClose,
  hikeId,
  onSave,
  initialData,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
    } else {
      setName('');
      setDescription('');
    }
  }, [initialData, visible]);

  const handleSave = () => {
    if (!name.trim() || !description.trim()) {
      Alert.alert(t('addObs.error'), t('addObs.validation'));
      return;
    }

    const newObservation: Observation = {
      id: initialData?.id,
      hikeId: hikeId,
      name: name.trim(),
      description: description.trim(),
    };

    onSave(newObservation);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <View
        className="flex-1 items-center justify-center bg-black/50 p-5"
        style={{ paddingHorizontal: 20 }}>
        <View
          className="w-full rounded-xl shadow-2xl"
          style={{
            backgroundColor: theme === 'light' ? 'white' : '#1f2937',
            maxHeight: verticalScaleFn(844) * 0.8,
          }}>
          <View className="flex-row items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
            <Text className="text-xl font-bold text-gray-900 dark:text-white">
              {initialData ? t('addObs.edit') : t('addObs.add')}
            </Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <Ionicons
                name="close-circle-outline"
                size={28}
                color={theme === 'light' ? '#6b7280' : '#9ca3af'}
              />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Text className="mb-2 mt-2 text-base font-semibold text-gray-800 dark:text-gray-200">
              {t('addObs.name')} <Text className="text-red-500"></Text>
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={t('addObs.observationNamePlaceholder') || 'Tên quan sát'}
              placeholderTextColor={theme === 'light' ? '#9ca3af' : '#6b7280'}
              className="rounded-xl border border-gray-300 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />

            <Text className="mb-2 mt-4 text-base font-semibold text-gray-800 dark:text-gray-200">
              {t('addObs.description')} <Text className="text-red-500"></Text>
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder={t('addObs.descriptionPlaceholder')}
              placeholderTextColor={theme === 'light' ? '#9ca3af' : '#6b7280'}
              multiline
              numberOfLines={4}
              className="text-top h-32 rounded-xl border border-gray-300 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              textAlignVertical="top"
            />
          </ScrollView>

          <View className="flex-row justify-end border-t border-gray-200 p-4 dark:border-gray-700">
            <Button mode="outlined" onPress={onClose} className="mr-3">
              {t('addObs.cancel')}
            </Button>
            <Button
              mode="contained"
              onPress={handleSave}
              icon={() => <Ionicons name="save" size={20} color="white" />}
              style={{ backgroundColor: '#10b981' }}
              labelStyle={{ color: 'white' }}>
              {t('addObs.save')}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddObservationModal;

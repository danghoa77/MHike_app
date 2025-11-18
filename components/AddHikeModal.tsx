import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Switch,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Hike, HikeDifficulty } from '../db/models/Hike';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import MapPickerModal from './MapPickerModal';
import { verticalScaleFn } from 'constants/Layout';

import { ThemeProvider, useTheme } from 'theme/ThemeContext';
interface AddHikeModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (hike: Hike) => void;
  initialData?: Hike | null;
}

export default function AddHikeModal({ visible, onClose, onSave, initialData }: AddHikeModalProps) {
  const { t } = useTranslation();
  const [form, setForm] = useState<Hike>({
    name: '',
    location: '',
    date: '',
    parkingAvailable: false,
    length: 0,
    difficulty: HikeDifficulty.EASY,
    description: '',
    images: [],
  });
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { theme } = useTheme();
  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        name: '',
        location: '',
        date: '',
        parkingAvailable: false,
        length: 0,
        difficulty: HikeDifficulty.EASY,
        description: '',
        images: [],
      });
    }
  }, [initialData, visible]);

  const showDatePicker = () => setDatePickerVisible(true);
  const hideDatePicker = () => setDatePickerVisible(false);
  const handleConfirm = (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0];
    setForm({ ...form, date: formattedDate });
    hideDatePicker();
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert(t('addHike.permissionError'));
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setForm({ ...form, images: [...form.images, uri] });
    }
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.location.trim() || !form.date.trim() || form.length <= 0) {
      Alert.alert(t('addHike.alertTitle'), t('addHike.alertMessage'));
      return;
    }
    onSave(form);
    onClose();
  };

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert(t('addHike.permissionError'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);
      setForm({ ...form, images: uris });
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 items-center justify-center bg-black/40">
        <View
          className="w-11/12 rounded-2xl bg-white p-5 dark:bg-gray-700"
          style={{ maxHeight: verticalScaleFn(844) * 0.85 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text className="mb-4 text-center text-xl font-semibold text-neutral-900 dark:text-white">
              {initialData ? t('addHike.editTitle') : t('addHike.title')}
            </Text>

            <Text className="mb-1 text-sm text-neutral-700 dark:text-white">
              {t('addHike.name')}
            </Text>
            <TextInput
              className="mb-3 rounded-lg border border-gray-300  px-3 py-2  text-black  dark:bg-gray-400"
              placeholder={t('addHike.namePlaceholder')}
              value={form.name}
              onChangeText={(t) => setForm({ ...form, name: t })}
            />

            <View className="mb-4">
              <Text className="mb-1 text-sm text-neutral-700 dark:text-white">
                {t('addHike.location')}
              </Text>
              <View className="relative flex-row items-center">
                <TextInput
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 pr-10 text-black dark:bg-gray-400"
                  placeholder={t('addHike.locationPlaceholder')}
                  value={form.location}
                  onChangeText={(t) => setForm({ ...form, location: t })}
                />

                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  className="absolute right-2 rounded-md">
                  <Ionicons name="location-outline" size={20} color={'#000000'} />
                </TouchableOpacity>
              </View>

              <MapPickerModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSelect={(loc) => {
                  setForm({ ...form, location: loc.address });
                  setModalVisible(false);
                }}
              />
            </View>
            <Text className="mb-1 text-sm text-neutral-700 dark:text-white">
              {t('addHike.date')}
            </Text>
            <TouchableOpacity
              className="mb-3 flex-row items-center justify-between rounded-lg border border-gray-300 px-3 py-2 dark:bg-gray-400"
              onPress={showDatePicker}>
              <Text className={form.date ? 'text-black ' : 'dark:gray-400 text-gray-600'}>
                {form.date || t('addHike.datePlaceholder')}
              </Text>
              <Ionicons name="calendar" size={20} color="gray dark:gray-400" />
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />

            <Text className="mb-1 text-sm text-neutral-700  dark:text-white">
              {t('addHike.length')}
            </Text>
            <TextInput
              keyboardType="numeric"
              className="mb-3 rounded-lg border border-gray-300 px-3 py-2 text-black dark:bg-gray-400"
              value={form.length.toString()}
              onChangeText={(t) => setForm({ ...form, length: parseFloat(t) || 0 })}
            />

            <Text className="mb-1 text-sm text-neutral-700 dark:text-white">
              {t('addHike.difficulty')}
            </Text>
            <View className="mb-3 h-10 justify-center rounded-lg border border-gray-300 px-2 dark:bg-gray-400">
              <Picker
                selectedValue={form.difficulty}
                onValueChange={(value) => setForm({ ...form, difficulty: value as HikeDifficulty })}
                style={{ fontSize: 14, borderRadius: 8 }}>
                <Picker.Item label={t('addHike.easy')} value={HikeDifficulty.EASY} />
                <Picker.Item label={t('addHike.medium')} value={HikeDifficulty.MEDIUM} />
                <Picker.Item label={t('addHike.hard')} value={HikeDifficulty.HARD} />
              </Picker>
            </View>

            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-sm text-neutral-700 dark:text-white">
                {t('addHike.parking')}
              </Text>
              <Switch
                value={form.parkingAvailable}
                className=""
                trackColor={{ false: '#d1d5db', true: '#0d9488' }}
                thumbColor={form.parkingAvailable ? '#14b8a6' : '#f4f3f4'}
                onValueChange={(v) => setForm({ ...form, parkingAvailable: v })}
              />
            </View>

            <View>
              <Text className="mb-1 text-sm text-neutral-700 dark:text-white">
                {t('addHike.images')}
              </Text>
              <View className="mb-3 flex-row justify-between">
                <TouchableOpacity
                  className="mr-2 flex-1 items-center justify-center rounded-lg border border-gray-300 px-3 py-2 dark:bg-gray-400"
                  onPress={takePhoto}>
                  <Ionicons name="camera" size={20} color="gray" />
                  <Text className="text-gray-700">{t('addHike.takePhoto')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="ml-2 flex-1 items-center justify-center rounded-lg border border-gray-300 px-3 py-2 dark:bg-gray-400"
                  onPress={pickImages}>
                  <Ionicons name="images" size={20} color="gray" />
                  <Text className="text-gray-700">{t('addHike.selectImages')}</Text>
                </TouchableOpacity>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {form.images.map((uri, index) => (
                  <View key={index} className="relative my-1 mr-2 mt-4 h-20 w-20 pt-1">
                    <Image
                      source={{ uri }}
                      style={{ width: '100%', height: '100%', borderRadius: 8 }}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        setForm({ ...form, images: form.images.filter((_, i) => i !== index) })
                      }
                      className="absolute -right-1.5 -top-1.5 h-6 w-6 items-center justify-center rounded-full bg-red-500">
                      <Text className="text-sm font-bold text-white">×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>

            <Text className="mb-1 mt-5 text-sm text-neutral-700 dark:text-white">
              {t('addHike.description')}
            </Text>
            <TextInput
              multiline
              textAlignVertical="top"
              placeholder={t('addHike.descriptionPlaceholder')}
              value={form.description}
              onChangeText={(t) => setForm({ ...form, description: t })}
              className="mb-3 rounded-lg border border-gray-300 px-3 py-2.5 text-black dark:bg-gray-400"
              style={{ height: 100 }}
            />

            <TouchableOpacity
              className="mt-2 rounded-lg bg-green-600 py-3 dark:bg-green-800"
              onPress={handleSave}>
              <Text className="text-center font-semibold text-white">
                {initialData ? t('addHike.save') : t('addHike.create')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="mt-2 py-2" onPress={onClose}>
              <Text className="text-center text-gray-500">{t('addHike.cancel')}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* <MapPickerModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSelect={(loc) => setLocation(loc.address)}
        /> */}
      </View>
    </Modal>
  );
}

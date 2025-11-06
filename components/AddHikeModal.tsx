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
        <View className="max-h-[85%] w-11/12 rounded-2xl bg-white p-5">
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text className="mb-4 text-center text-xl font-semibold text-neutral-900">
              {initialData ? t('addHike.editTitle') : t('addHike.title')}
            </Text>

            <Text className="mb-1 text-sm text-neutral-700">{t('addHike.name')}</Text>
            <TextInput
              className="mb-3 rounded-lg border border-gray-300 px-3 py-2"
              placeholder={t('addHike.namePlaceholder')}
              value={form.name}
              onChangeText={(t) => setForm({ ...form, name: t })}
            />

            <Text className="mb-1 text-sm text-neutral-700">{t('addHike.location')}</Text>
            <TextInput
              className="mb-3 rounded-lg border border-gray-300 px-3 py-2"
              placeholder={t('addHike.locationPlaceholder')}
              value={form.location}
              onChangeText={(t) => setForm({ ...form, location: t })}
            />

            <Text className="mb-1 text-sm text-neutral-700">{t('addHike.date')}</Text>
            <TouchableOpacity
              className="mb-3 flex-row items-center justify-between rounded-lg border border-gray-300 px-3 py-2"
              onPress={showDatePicker}>
              <Text className={form.date ? 'text-black' : 'text-gray-400'}>
                {form.date || t('addHike.datePlaceholder')}
              </Text>
              <Ionicons name="calendar" size={20} color="gray" />
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />

            <Text className="mb-1 text-sm text-neutral-700">{t('addHike.length')}</Text>
            <TextInput
              keyboardType="numeric"
              className="mb-3 rounded-lg border border-gray-300 px-3 py-2"
              value={form.length.toString()}
              onChangeText={(t) => setForm({ ...form, length: parseFloat(t) || 0 })}
            />

            <Text className="mb-1 text-sm text-neutral-700">{t('addHike.difficulty')}</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#D1D5DB',
                borderRadius: 8,
                marginBottom: 12,
                height: 40,
                justifyContent: 'center',
              }}>
              <Picker
                selectedValue={form.difficulty}
                onValueChange={(value) => setForm({ ...form, difficulty: value as HikeDifficulty })}
                style={{ fontSize: 14, borderRadius: 8 }}>
                <Picker.Item label={t('addHike.easy')} value={HikeDifficulty.EASY} />
                <Picker.Item label={t('addHike.medium')} value={HikeDifficulty.MEDIUM} />
                <Picker.Item label={t('addHike.hard')} value={HikeDifficulty.HARD} />
              </Picker>
            </View>

            {/* parking */}
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-sm text-neutral-700">{t('addHike.parking')}</Text>
              <Switch
                value={form.parkingAvailable}
                onValueChange={(v) => setForm({ ...form, parkingAvailable: v })}
              />
            </View>

            <View>
              <Text className="mb-1 text-sm text-neutral-700">{t('addHike.images')}</Text>
              <TouchableOpacity
                className="mb-3 items-center justify-center rounded-lg border border-gray-300 bg-gray-100 px-3 py-2"
                onPress={pickImages}>
                <Text className="text-gray-700">{t('addHike.selectImages')}</Text>
              </TouchableOpacity>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {form.images.map((uri, index) => (
                  <View
                    key={index}
                    style={{
                      width: 80,
                      height: 80,
                      marginRight: 8,
                      position: 'relative',
                      marginVertical: 4,
                    }}>
                    <Image
                      source={{ uri }}
                      style={{ width: '100%', height: '100%', borderRadius: 8 }}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        setForm({ ...form, images: form.images.filter((_, i) => i !== index) })
                      }
                      style={{
                        position: 'absolute',
                        top: -6,
                        right: -6,
                        backgroundColor: '#EF4444',
                        borderRadius: 12,
                        width: 20,
                        height: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text style={{ color: 'white', fontWeight: 'bold' }}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>

            <Text className="mb-1 mt-5 text-sm text-neutral-700">{t('addHike.description')}</Text>
            <TextInput
              multiline
              textAlignVertical="top"
              placeholder={t('addHike.descriptionPlaceholder')}
              value={form.description}
              onChangeText={(t) => setForm({ ...form, description: t })}
              style={{
                borderWidth: 1,
                borderColor: '#D1D5DB',
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                marginBottom: 12,
                height: 120,
              }}
            />

            <TouchableOpacity className="mt-2 rounded-lg bg-green-600 py-3" onPress={handleSave}>
              <Text className="text-center font-semibold text-white">
                {initialData ? t('addHike.save') : t('addHike.create')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="mt-2 py-2" onPress={onClose}>
              <Text className="text-center text-gray-500">{t('addHike.cancel')}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

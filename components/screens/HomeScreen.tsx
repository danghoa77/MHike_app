// components/screens/HomeScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Hike } from '../../db/models/Hike';
import { hikeService } from '../../db/databaseHelper';
import { horizontalScale, verticalScaleFn, moderateScaleFn } from '../../constants/Layout';
import HikeImageSlider from 'components/HikeImageSlider';
import { useTheme } from '../../theme/ThemeContext';
import { Dialog, Portal, Button } from 'react-native-paper';

interface HomeScreenProps {
  hikes: Hike[];
  loadHikes: () => Promise<void>;
  handleEdit: (id: number) => void;
  onViewDetails: (id: number) => void;
}

export default function HomeScreen({
  hikes,
  loadHikes,
  handleEdit,
  onViewDetails,
}: HomeScreenProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedHikeId, setSelectedHikeId] = useState<number | null>(null);

  const showConfirmDialog = (id: number) => {
    setSelectedHikeId(id);
    setConfirmVisible(true);
  };

  const hideConfirmDialog = () => {
    setConfirmVisible(false);
    setSelectedHikeId(null);
  };

  const confirmDelete = async () => {
    if (selectedHikeId !== null) {
      await hikeService.deleteHike(selectedHikeId);
      await loadHikes();
    }
    hideConfirmDialog();
  };

  const renderHike = (item: Hike) => (
    <View
      key={item.id}
      className="mb-4 rounded-2xl border border-gray-300 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
      style={{ padding: horizontalScale(14) }}>
      <View className="mb-4 flex-row items-center justify-between">
        <Text
          className="text-3xl font-bold text-gray-900 dark:text-gray-100"
          style={{ fontSize: moderateScaleFn(16) }}>
          {item.name}
        </Text>
        <View
          className={`rounded-full px-3 py-1 ${
            item.difficulty === 'Hard'
              ? 'bg-red-200 dark:bg-red-900/40'
              : item.difficulty === 'Medium'
                ? 'bg-yellow-200 dark:bg-yellow-900/40'
                : 'bg-green-200 dark:bg-green-900/40'
          }`}>
          <Text
            className={`text-xs font-semibold ${
              item.difficulty === 'Hard'
                ? 'text-red-800 dark:text-red-300'
                : item.difficulty === 'Medium'
                  ? 'text-yellow-800 dark:text-yellow-300'
                  : 'text-green-800 dark:text-green-300'
            }`}>
            {t(`addHike.${item.difficulty.toLowerCase()}`)}
          </Text>
        </View>
      </View>

      {item.images?.length > 0 && <HikeImageSlider images={item.images} />}

      <View className="mt-1 flex-row items-center">
        <Ionicons
          name="location-outline"
          size={moderateScaleFn(14)}
          color={theme === 'light' ? '#4b5563' : '#d1d5db'}
        />
        <Text
          className="ml-1 text-gray-600 dark:text-gray-300"
          style={{ fontSize: moderateScaleFn(13) }}>
          {item.location}
        </Text>
      </View>

      <View className="mt-1 flex-row items-center">
        <Ionicons
          name="calendar-outline"
          size={moderateScaleFn(14)}
          color={theme === 'light' ? '#4b5563' : '#d1d5db'}
        />
        <Text
          className="ml-1 text-gray-600 dark:text-gray-300"
          style={{ fontSize: moderateScaleFn(13) }}>
          {item.date}
        </Text>
      </View>

      <View className="mt-1 flex-row items-center">
        <Ionicons
          name="walk-outline"
          size={moderateScaleFn(14)}
          color={theme === 'light' ? '#4b5563' : '#d1d5db'}
        />
        <Text
          className="ml-1 text-gray-600 dark:text-gray-300"
          style={{ fontSize: moderateScaleFn(13) }}>
          {item.length} km
        </Text>
      </View>

      <View className="mt-1 flex-row items-center">
        <Ionicons
          name="car-outline"
          size={moderateScaleFn(14)}
          color={theme === 'light' ? '#4b5563' : '#d1d5db'}
        />
        <Text
          className="ml-1 text-gray-600 dark:text-gray-300"
          style={{ fontSize: moderateScaleFn(13) }}>
          {item.parkingAvailable ? t('parkingAvailable') : t('noParking')}
        </Text>
      </View>

      <Text
        className="mt-2 text-gray-700 dark:text-gray-300"
        style={{ fontSize: moderateScaleFn(13) }}>
        {item.description}
      </Text>

      <View className="mt-3 flex-row" style={{ gap: horizontalScale(8) }}>
        <TouchableOpacity
          onPress={() => onViewDetails(item.id!)}
          className="flex-1 flex-row items-center justify-center rounded-xl bg-green-600 dark:bg-green-700"
          style={{ paddingVertical: verticalScaleFn(8) }}>
          <Ionicons name="eye-outline" size={moderateScaleFn(16)} color="white" />
          <Text className="ml-1 font-medium text-white" style={{ fontSize: moderateScaleFn(13) }}>
            {t('viewDetails')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleEdit(item.id!)}
          className="mr-2 flex-row items-center rounded-lg bg-blue-500/10 p-2 dark:bg-blue-300">
          <Ionicons name="create-outline" size={moderateScaleFn(16)} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => showConfirmDialog(item.id!)}
          className="flex-row items-center rounded-lg bg-red-500/10 p-2 dark:bg-red-300">
          <Ionicons name="trash-outline" size={moderateScaleFn(16)} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      {hikes.length === 0 ? (
        <View className=" items-center justify-center bg-white dark:bg-gray-700">
          <Ionicons
            name="location-outline"
            size={moderateScaleFn(70)}
            color="#d1d5db"
            style={{ marginBottom: verticalScaleFn(10), marginTop: verticalScaleFn(100) }}
          />
          <Text
            className="font-semibold text-gray-800 dark:text-white"
            style={{ fontSize: moderateScaleFn(20) }}>
            {t('noHikes')}
          </Text>
          <Text
            className="italic text-gray-400 dark:text-gray-400"
            style={{
              fontSize: moderateScaleFn(10),
              marginTop: verticalScaleFn(4),
              maxWidth: horizontalScale(500),
              marginBottom: verticalScaleFn(200),
            }}>
            {t('noHikesDes')}
          </Text>
        </View>
      ) : (
        hikes.map(renderHike)
      )}

      <Portal>
        <Dialog
          visible={confirmVisible}
          onDismiss={hideConfirmDialog}
          style={{
            borderRadius: 16,
            backgroundColor: theme === 'light' ? 'white' : '#1f2937',
          }}>
          <Dialog.Title style={{ color: theme === 'light' ? '#111' : '#f3f4f6' }}>
            {t('addHike.confirmDeleteTitle')}
          </Dialog.Title>
          <Dialog.Content>
            <Text style={{ color: theme === 'light' ? '#374151' : '#d1d5db' }}>
              {t('addHike.confirmDeleteMessage')}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideConfirmDialog}>{t('addHike.cancel')}</Button>
            <Button onPress={confirmDelete} textColor="red">
              {t('addHike.delete')}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

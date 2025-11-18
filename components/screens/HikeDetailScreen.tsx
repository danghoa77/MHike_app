// components/screens/HikeDetailScreen.tsx (Hoàn chỉnh)
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Hike } from '../../db/models/Hike';
import { Observation } from '../../db/models/Observation';
import { hikeService, observationService } from '../../db/databaseHelper';
import { moderateScaleFn, verticalScaleFn } from '../../constants/Layout';
import { useTheme } from '../../theme/ThemeContext';
import AddObservationModal from 'components/AddObservationModal';
import HikeImageSlider from 'components/HikeImageSlider';

interface HikeDetailScreenProps {
  hikeId: number;
  onGoBack: () => void;
}


export default function HikeDetailScreen({ hikeId, onGoBack }: HikeDetailScreenProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [hike, setHike] = useState<Hike | null>(null);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showObservationModal, setShowObservationModal] = useState(false);
  const [editingObservation, setEditingObservation] = useState<Observation | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const hikeData = await hikeService.getHikeById(hikeId);
      setHike(hikeData);
      const obsData = await observationService.getObservationsByHike(hikeId);
      setObservations(obsData);
    } catch (error) {
      console.error('Failed to load hike details:', error);
      Alert.alert(t('error'), t('detailHike.failedToLoadHike'));
    } finally {
      setLoading(false);
    }
  }, [hikeId, t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaveObservation = async (obs: Observation) => {
    try {
      if (obs.id) {
        await observationService.updateObservation(obs.id, obs);
      } else {
        const newId = await observationService.addObservation(obs);
        obs.id = newId;
      }
      await loadData();
      setShowObservationModal(false);
      setEditingObservation(null);
    } catch (error) {
      console.error('Failed to save observation:', error);
      Alert.alert(t('detailHike.error'), t('detailHike.failedToSaveObservation'));
    }
  };

  const handleEditObservation = async (observationId: number) => {
    try {
      const obs = await observationService.getObservationById(observationId);
      if (obs) {
        setEditingObservation(obs);
        setShowObservationModal(true);
      }
    } catch (error) {
      console.error('Failed to fetch observation for edit:', error);
    }
  };

  const handleDeleteObservation = (observationId: number) => {
    Alert.alert(
      t('detailHike.confirmDeleteTitle'),
      t('detailHike.confirmDeleteMessageObservation'),
      [
        { text: t('detailHike.cancel'), style: 'cancel' },
        {
          text: t('detailHike.delete'),
          onPress: async () => {
            try {
              await observationService.deleteObservation(observationId);
              await loadData();
            } catch (error) {
              console.error('Failed to delete observation:', error);
              Alert.alert(t('error'), t('detailHike.failedToDeleteObservation'));
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (loading || !hike) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Text className="mt-20 text-gray-900 dark:text-white">{t('loading')}...</Text>
      </View>
    );
  }

  const DetailRow = ({
    iconName,
    label,
    value,
  }: {
    iconName: string;
    label: string;
    value: string | number;
  }) => (
    <View className="mb-3 flex-row items-start">
      <Ionicons
        name={iconName as any}
        size={moderateScaleFn(20)}
        className="mr-2 mt-0.5 text-gray-600 dark:text-gray-300"
        color={theme === 'dark' ? '#FFFFFF' : '#111827'}
      />
      <View className="flex-1">
        <Text className="font-semibold text-gray-900 dark:text-white">{label}</Text>
        <Text className="text-gray-700 dark:text-gray-300">{value}</Text>
      </View>
    </View>
  );

  const renderObservation = (observation: Observation) => (
    <View
      key={observation.id}
      className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <Text className="mb-1 text-lg font-bold text-gray-900 dark:text-white">
        {observation.name}
      </Text>
      <Text className="mb-2 text-base text-gray-700 dark:text-gray-300">
        {observation.description}
      </Text>

      <View className="flex-row items-center justify-end border-t border-gray-200 pt-2 dark:border-gray-700">
        <TouchableOpacity
          onPress={() => handleEditObservation(observation.id!)}
          className="mr-2 flex-row items-center rounded-lg bg-blue-500/10 p-2 dark:bg-blue-300">
          <Ionicons name="create-outline" size={moderateScaleFn(16)} className="text-blue-500" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleDeleteObservation(observation.id!)}
          className="flex-row items-center rounded-lg bg-red-500/10 p-2 dark:bg-red-300">
          <Ionicons name="trash-outline" size={moderateScaleFn(16)} className="text-red-500" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <ScrollView className="flex-1 p-4">
        <TouchableOpacity onPress={onGoBack} className="mb-4 flex-row items-center">
          <Ionicons
            name="arrow-back"
            size={moderateScaleFn(24)}
            className="text-gray-900 dark:text-white"
            color={theme === 'dark' ? '#FFFFFF' : '#111827'}
          />
          <Text className="ml-2 text-lg text-gray-900 dark:text-white">
            {t('detailHike.goBack')}
          </Text>
        </TouchableOpacity>

        <View className="mb-6 rounded-xl bg-white p-4 shadow-md dark:bg-gray-800">
          <View className="mb-4 flex-row items-start justify-between">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">{hike.name}</Text>

            <View
              className={`rounded-full px-3 py-1 ${
                hike.difficulty === 'Hard'
                  ? 'bg-red-200 dark:bg-red-900/40'
                  : hike.difficulty === 'Medium'
                    ? 'bg-yellow-200 dark:bg-yellow-900/40'
                    : 'bg-green-200 dark:bg-green-900/40'
              }`}>
              <Text
                className={`text-xs font-semibold ${
                  hike.difficulty === 'Hard'
                    ? 'text-red-800 dark:text-red-300'
                    : hike.difficulty === 'Medium'
                      ? 'text-yellow-800 dark:text-yellow-300'
                      : 'text-green-800 dark:text-green-300'
                }`}>
                {t(`addHike.${hike.difficulty.toLowerCase()}`)}
              </Text>
            </View>
          </View>

          {hike.images?.length > 0 && <HikeImageSlider images={hike.images} />}

          <DetailRow
            iconName="location-outline"
            label={t('detailHike.location')}
            value={hike.location}
          />
          <DetailRow iconName="calendar-outline" label={t('detailHike.date')} value={hike.date} />
          <DetailRow
            iconName="walk-outline"
            label={t('detailHike.length')}
            value={`${hike.length} km`}
          />
          <DetailRow
            iconName="car-outline"
            label={t('detailHike.parking')}
            value={hike.parkingAvailable ? t('detailHike.available') : t('detailHike.unavailable')}
          />

          <View className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
            <Text className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
              {t('detailHike.description')}
            </Text>
            <Text className="text-base text-gray-700 dark:text-gray-300">{hike.description}</Text>
          </View>
        </View>

        <View className="mb-4">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-gray-900 dark:text-white">
              {t('detailHike.observations')} ({observations.length})
            </Text>
            <TouchableOpacity
              onPress={() => {
                setEditingObservation(null);
                setShowObservationModal(true);
              }}
              className="flex-row items-center rounded-xl bg-green-600 px-4 py-2 shadow-sm">
              <Ionicons name="add" size={moderateScaleFn(20)} color="white" />
              <Text className="ml-1 font-semibold text-white">
                {t('detailHike.addObservation')}
              </Text>
            </TouchableOpacity>
          </View>

          {observations.length === 0 ? (
            <View className="items-center justify-center rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <Ionicons
                name="chatbubble-outline"
                size={moderateScaleFn(40)}
                className="mb-3 text-gray-400"
                color={theme === 'dark' ? '#FFFFFF' : '#111827'}
              />
              <Text className="mb-1 text-lg font-bold text-gray-900 dark:text-white">
                {t('detailHike.noObservationsYet')}
              </Text>
              <Text className="max-w-xs text-center text-sm text-gray-600 dark:text-gray-400">
                {t('detailHike.addObservation')}
              </Text>
            </View>
          ) : (
            <View>{observations.map(renderObservation)}</View>
          )}
        </View>

        <View style={{ height: verticalScaleFn(50) }} />
      </ScrollView>

      <AddObservationModal
        visible={showObservationModal}
        onClose={() => {
          setShowObservationModal(false);
          setEditingObservation(null);
        }}
        hikeId={hikeId}
        onSave={handleSaveObservation}
        initialData={editingObservation}
      />
    </>
  );
}

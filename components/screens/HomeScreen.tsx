import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Hike } from '../../db/models/Hike';
import { hikeService } from '../../db/databaseHelper';
import { horizontalScale, verticalScaleFn, moderateScaleFn } from '../../constants/Layout';
import AddHikeModal from 'components/AddHikeModal';

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const [hikes, setHikes] = useState<Hike[]>([]);
  const [lang, setLang] = useState(i18n.language);
  const [showAddModal, setShowAddModal] = useState(false);
  useEffect(() => {
    loadHikes();
  }, []);

  const loadHikes = async () => {
    const data = await hikeService.getAllHikes();
    setHikes(data);
  };

  const handleDelete = async (id: number) => {
    await hikeService.deleteHike(id);
    loadHikes();
  };

  const toggleLanguage = () => {
    const newLang = lang === 'vi' ? 'en' : 'vi';
    i18n.changeLanguage(newLang);
    setLang(newLang);
  };

  const handleAddHike = async (newHike: Omit<Hike, 'id'>) => {
    await hikeService.addHike(newHike);
    loadHikes();
  };

  const renderHike = (item: Hike) => (
    <View
      key={item.id}
      className="mb-4 rounded-2xl border border-gray-100 bg-white shadow-sm"
      style={{ padding: horizontalScale(14) }}>
      <View className="mb-1 flex-row items-center justify-between">
        <Text className="font-semibold text-gray-900" style={{ fontSize: moderateScaleFn(16) }}>
          {item.name}
        </Text>
        <View
          className={`rounded-md px-2 py-0.5 ${
            item.difficulty === 'Easy'
              ? 'bg-green-100'
              : item.difficulty === 'Medium'
                ? 'bg-yellow-100'
                : 'bg-red-100'
          }`}>
          <Text
            style={{ fontSize: moderateScaleFn(11) }}
            className={`font-semibold ${
              item.difficulty === 'Easy'
                ? 'text-green-700'
                : item.difficulty === 'Medium'
                  ? 'text-yellow-700'
                  : 'text-red-700'
            }`}>
            {item.difficulty}
          </Text>
        </View>
      </View>

      <View className="mt-1 flex-row items-center">
        <Ionicons name="location-outline" size={moderateScaleFn(14)} color="#4b5563" />
        <Text className="ml-1 text-gray-600" style={{ fontSize: moderateScaleFn(13) }}>
          {item.location}
        </Text>
      </View>

      <View className="mt-1 flex-row items-center">
        <Ionicons name="calendar-outline" size={moderateScaleFn(14)} color="#4b5563" />
        <Text className="ml-1 text-gray-600" style={{ fontSize: moderateScaleFn(13) }}>
          {item.date}
        </Text>
      </View>

      <View className="mt-1 flex-row items-center">
        <Ionicons name="footsteps-outline" size={moderateScaleFn(14)} color="#4b5563" />
        <Text className="ml-1 text-gray-600" style={{ fontSize: moderateScaleFn(13) }}>
          {item.length} km
        </Text>
      </View>

      <View className="mt-1 flex-row items-center">
        <Ionicons name="car-outline" size={moderateScaleFn(14)} color="#4b5563" />
        <Text className="ml-1 text-gray-600" style={{ fontSize: moderateScaleFn(13) }}>
          {item.parkingAvailable ? t('parkingAvailable') : t('noParking')}
        </Text>
      </View>

      <Text className="mt-2 text-gray-700" style={{ fontSize: moderateScaleFn(13) }}>
        {item.description}
      </Text>

      <View className="mt-3 flex-row" style={{ gap: horizontalScale(8) }}>
        <TouchableOpacity
          className="flex-1 flex-row items-center justify-center rounded-xl bg-green-600"
          style={{ paddingVertical: verticalScaleFn(8) }}>
          <Ionicons name="eye-outline" size={moderateScaleFn(16)} color="white" />
          <Text className="ml-1 font-medium text-white" style={{ fontSize: moderateScaleFn(13) }}>
            {t('viewDetails')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleDelete(item.id!)}
          className="items-center justify-center rounded-xl bg-red-500"
          style={{
            width: horizontalScale(40),
            height: horizontalScale(40),
          }}>
          <Ionicons name="trash-outline" size={moderateScaleFn(16)} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: horizontalScale(16),
          paddingBottom: verticalScaleFn(100),
          paddingTop: verticalScaleFn(16),
        }}>
        <View className="mb-4 flex-row items-center justify-between">
          <View>
            <Text
              className="font-extrabold text-green-800"
              style={{ fontSize: moderateScaleFn(22) }}>
              {t('appTitle')}
            </Text>
            <Text className="text-gray-500" style={{ fontSize: moderateScaleFn(12) }}>
              {t('subtitle')}
            </Text>

            <TouchableOpacity
              onPress={toggleLanguage}
              className="flex-row items-center rounded-xl border border-gray-300 bg-white"
              style={{
                paddingHorizontal: horizontalScale(10),
                paddingVertical: verticalScaleFn(6),
                alignSelf: 'flex-start',
                marginHorizontal: horizontalScale(3),
                marginTop: verticalScaleFn(3),
              }}>
              <Ionicons name="globe-outline" size={moderateScaleFn(16)} color="#374151" />
              <Text
                className="ml-1 font-medium text-gray-700"
                style={{ fontSize: moderateScaleFn(12) }}>
                {lang === 'vi' ? 'EN' : 'VI'}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center" style={{ gap: horizontalScale(2) }}>
            <TouchableOpacity
              className="flex-row items-center rounded-xl border border-gray-300 bg-white"
              style={{
                paddingHorizontal: horizontalScale(10),
                paddingVertical: verticalScaleFn(6),
                maxWidth: horizontalScale(80),
                marginEnd: horizontalScale(4),
              }}>
              <Ionicons name="refresh-outline" size={moderateScaleFn(16)} color="#374151" />
              <Text className="ml-1 flex-1 text-gray-700" style={{ fontSize: moderateScaleFn(12) }}>
                {t('reset')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center rounded-xl bg-green-600"
              onPress={() => setShowAddModal(true)}
              style={{
                paddingHorizontal: horizontalScale(10),
                paddingVertical: verticalScaleFn(6),
                maxWidth: horizontalScale(120),
              }}>
              <Ionicons name="add-outline" size={moderateScaleFn(16)} color="white" />
              <Text
                className="ml-1 flex-1 font-semibold text-white"
                style={{ fontSize: moderateScaleFn(12) }}>
                {t('addHikeButton')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mb-4 flex-row items-center" style={{ gap: horizontalScale(8) }}>
          <View
            className="flex-1 flex-row items-center rounded-xl border border-gray-200 bg-white"
            style={{
              paddingHorizontal: horizontalScale(10),
              paddingVertical: verticalScaleFn(6),
            }}>
            <Ionicons name="search-outline" size={moderateScaleFn(16)} color="#6b7280" />
            <Text className="ml-2 flex-1 text-gray-500" style={{ fontSize: moderateScaleFn(12) }}>
              {t('searchPlaceholder')}
            </Text>
          </View>

          <TouchableOpacity
            className="flex-row items-center rounded-xl border border-gray-200 bg-white"
            style={{
              paddingHorizontal: horizontalScale(10),
              paddingVertical: verticalScaleFn(6),
              maxWidth: horizontalScale(120),
            }}>
            <Ionicons name="filter-outline" size={moderateScaleFn(16)} color="#374151" />
            <Text className="ml-1 flex-1 text-gray-700" style={{ fontSize: moderateScaleFn(12) }}>
              {t('filters')}
            </Text>
          </TouchableOpacity>
        </View>

        {hikes.length === 0 ? (
          <View className="items-center justify-center">
            <Ionicons
              name="location-outline"
              size={moderateScaleFn(70)}
              color="#d1d5db"
              style={{
                marginBottom: verticalScaleFn(10),
                marginTop: verticalScaleFn(100),
              }}
            />

            <Text
              className="bold font-semibold text-gray-800"
              style={{
                fontSize: moderateScaleFn(20),
              }}>
              {t('noHikes')}
            </Text>
            <Text
              className="italic text-gray-400"
              style={{
                fontSize: moderateScaleFn(10),
                marginTop: verticalScaleFn(4),
                maxWidth: horizontalScale(500),
              }}>
              {t('noHikesDes')}
            </Text>
          </View>
        ) : (
          hikes.map(renderHike)
        )}
      </ScrollView>
      <AddHikeModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddHike}
      />
    </SafeAreaView>
  );
}

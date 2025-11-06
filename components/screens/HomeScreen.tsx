import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Hike } from '../../db/models/Hike';
import { hikeService } from '../../db/databaseHelper';
import { horizontalScale, verticalScaleFn, moderateScaleFn } from '../../constants/Layout';
import AddHikeModal from 'components/AddHikeModal';
import HikeImageSlider from 'components/HikeImageSlider';
import { useTheme } from '../../theme/ThemeContext';
export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const [hikes, setHikes] = useState<Hike[]>([]);
  const [lang, setLang] = useState(i18n.language);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHike, setEditingHike] = useState<Hike | null>(null);

  const { theme, toggleTheme } = useTheme();

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

  const handleEdit = (id: number) => {
    const hike = hikes.find((h) => h.id === id);
    if (hike) {
      setEditingHike(hike);
      setShowAddModal(true);
    }
  };

  const handleSaveHike = async (updatedHike: Hike) => {
    if (editingHike?.id) {
      await hikeService.updateHike(editingHike.id, updatedHike);
      setHikes(
        hikes.map((h) => (h.id === editingHike.id ? { ...updatedHike, id: editingHike.id } : h))
      );
    } else {
      const insertedId = await hikeService.addHike(updatedHike);
      setHikes([...hikes, { ...updatedHike, id: insertedId }]);
    }
    setEditingHike(null);
    setShowAddModal(false);
  };

  const renderHike = (item: Hike) => (
    <View
      key={item.id}
      className="mb-4 rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
      style={{ padding: horizontalScale(14) }}>
      {/* Header */}
      <View className="mb-1 flex-row items-center justify-between">
        <Text
          className="font-semibold text-gray-900 dark:text-gray-100"
          style={{ fontSize: moderateScaleFn(16) }}>
          {item.name}
        </Text>

        {/* Difficulty tag */}
        <View
          className={`rounded-md px-2 py-0.5 ${
            item.difficulty === 'Easy'
              ? 'bg-green-100 dark:bg-green-900/30'
              : item.difficulty === 'Medium'
                ? 'bg-yellow-100 dark:bg-yellow-900/30'
                : 'bg-red-100 dark:bg-red-900/30'
          }`}>
          <Text
            style={{ fontSize: moderateScaleFn(11) }}
            className={`font-semibold ${
              item.difficulty === 'Easy'
                ? 'text-green-700 dark:text-green-400'
                : item.difficulty === 'Medium'
                  ? 'text-yellow-700 dark:text-yellow-400'
                  : 'text-red-700 dark:text-red-400'
            }`}>
            {t(`addHike.${item.difficulty.toLowerCase()}`)}
          </Text>
        </View>
      </View>

      {/* Hình ảnh */}
      {item.images && item.images.length > 0 && <HikeImageSlider images={item.images} />}

      {/* Location */}
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

      {/* Date */}
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

      {/* Length */}
      <View className="mt-1 flex-row items-center">
        <Ionicons
          name="footsteps-outline"
          size={moderateScaleFn(14)}
          color={theme === 'light' ? '#4b5563' : '#d1d5db'}
        />
        <Text
          className="ml-1 text-gray-600 dark:text-gray-300"
          style={{ fontSize: moderateScaleFn(13) }}>
          {item.length} km
        </Text>
      </View>

      {/* Parking */}
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

      {/* Description */}
      <Text
        className="mt-2 text-gray-700 dark:text-gray-300"
        style={{ fontSize: moderateScaleFn(13) }}>
        {item.description}
      </Text>

      {/* Buttons */}
      <View className="mt-3 flex-row" style={{ gap: horizontalScale(8) }}>
        {/* View details */}
        <TouchableOpacity
          className="flex-1 flex-row items-center justify-center rounded-xl bg-green-600 dark:bg-green-700"
          style={{ paddingVertical: verticalScaleFn(8) }}>
          <Ionicons name="eye-outline" size={moderateScaleFn(16)} color="white" />
          <Text className="ml-1 font-medium text-white" style={{ fontSize: moderateScaleFn(13) }}>
            {t('viewDetails')}
          </Text>
        </TouchableOpacity>

        {/* Edit */}
        <TouchableOpacity
          onPress={() => handleEdit(item.id!)}
          className="items-center justify-center rounded-xl bg-gray-400 dark:bg-gray-600"
          style={{
            width: horizontalScale(40),
            height: horizontalScale(40),
          }}>
          <Ionicons name="pencil" size={moderateScaleFn(16)} color="white" />
        </TouchableOpacity>

        {/* Delete */}
        <TouchableOpacity
          onPress={() => handleDelete(item.id!)}
          className="items-center justify-center rounded-xl bg-red-400 dark:bg-red-600"
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
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: horizontalScale(16),
          paddingBottom: verticalScaleFn(100),
          paddingTop: verticalScaleFn(16),
        }}>
        {/* Header */}
        <View className="mb-4 flex-row items-center justify-between">
          <View>
            <Text
              className="font-extrabold text-green-800 dark:text-green-400"
              style={{ fontSize: moderateScaleFn(22) }}>
              {t('appTitle')}
            </Text>
            <Text
              className="text-gray-500 dark:text-gray-400"
              style={{ fontSize: moderateScaleFn(12) }}>
              {t('subtitle')}
            </Text>

            {/* Language & Theme Toggles */}
            <View className="mt-1 flex-row">
              {/* Toggle Language */}
              <TouchableOpacity
                onPress={toggleLanguage}
                className="flex-row items-center justify-center rounded-xl border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800"
                style={{
                  width: horizontalScale(75),
                  paddingVertical: verticalScaleFn(6),
                  marginHorizontal: horizontalScale(3),
                }}>
                <Ionicons
                  name="globe-outline"
                  size={moderateScaleFn(16)}
                  color={theme === 'light' ? '#374151' : '#fbbf24'}
                />
                <Text
                  className="ml-1 font-medium text-gray-700 dark:text-gray-200"
                  style={{ fontSize: moderateScaleFn(12) }}>
                  {lang === 'vi' ? 'EN' : 'VI'}
                </Text>
              </TouchableOpacity>

              {/* Toggle Theme */}
              <TouchableOpacity
                onPress={toggleTheme}
                className="flex-row items-center justify-center rounded-xl border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800"
                style={{
                  width: horizontalScale(75),
                  paddingVertical: verticalScaleFn(6),
                  marginHorizontal: horizontalScale(3),
                }}>
                <Ionicons
                  name={theme === 'light' ? 'moon-outline' : 'sunny-outline'}
                  size={moderateScaleFn(16)}
                  color={theme === 'light' ? '#374151' : '#fbbf24'}
                />
                <Text
                  className="ml-1 font-medium text-gray-700 dark:text-gray-200"
                  style={{ fontSize: moderateScaleFn(12) }}>
                  {theme === 'light' ? t('theme.dark') : t('theme.light')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Buttons: Reset + Add */}
          <View className="flex-row items-center" style={{ gap: horizontalScale(4) }}>
            <TouchableOpacity
              className="flex-row items-center rounded-xl border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800"
              style={{
                paddingHorizontal: horizontalScale(10),
                paddingVertical: verticalScaleFn(6),
                maxWidth: horizontalScale(80),
              }}>
              <Ionicons
                name="refresh-outline"
                size={moderateScaleFn(16)}
                color={theme === 'light' ? '#374151' : '#fbbf24'}
              />
              <Text
                className="ml-1 flex-1 text-gray-700 dark:text-gray-200"
                style={{ fontSize: moderateScaleFn(12) }}>
                {t('reset')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center rounded-xl bg-green-600 dark:bg-green-700"
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

        {/* Search & Filter */}
        <View className="mb-4 flex-row items-center" style={{ gap: horizontalScale(8) }}>
          <View
            className="flex-1 flex-row items-center rounded-xl border border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800"
            style={{ paddingHorizontal: horizontalScale(10), paddingVertical: verticalScaleFn(6) }}>
            <Ionicons
              name="search-outline"
              size={moderateScaleFn(16)}
              color={theme === 'light' ? '#6b7280' : '#d1d5db'}
            />
            <Text
              className="ml-2 flex-1 text-gray-500 dark:text-gray-300"
              style={{ fontSize: moderateScaleFn(12) }}>
              {t('searchPlaceholder')}
            </Text>
          </View>

          <TouchableOpacity
            className="flex-row items-center rounded-xl border border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800"
            style={{
              paddingHorizontal: horizontalScale(10),
              paddingVertical: verticalScaleFn(6),
              maxWidth: horizontalScale(120),
            }}>
            <Ionicons
              name="filter-outline"
              size={moderateScaleFn(16)}
              color={theme === 'light' ? '#374151' : '#fbbf24'}
            />
            <Text
              className="ml-1 flex-1 text-gray-700 dark:text-gray-200"
              style={{ fontSize: moderateScaleFn(12) }}>
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
              className="bold dark:text font-semibold text-gray-800"
              style={{
                fontSize: moderateScaleFn(20),
              }}>
              {t('noHikes')}
            </Text>
            <Text
              className="dark:text italic text-gray-400"
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
        onClose={() => {
          setShowAddModal(false);
          setEditingHike(null);
        }}
        onSave={handleSaveHike}
        initialData={editingHike}
      />
    </SafeAreaView>
  );
}

// components/Header.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { horizontalScale, moderateScaleFn, verticalScaleFn } from 'constants/Layout';
import { useTheme } from './../theme/ThemeContext';
import { hikeService } from 'db/databaseHelper';
import { Portal, Dialog, Button } from 'react-native-paper';

interface HeaderProps {
  onAddPress: () => void;
  onResetPress: () => void;
  onOpenFilter?: () => void;
  onSearch?: (query: string) => void;
}

export default function Header({ onAddPress, onResetPress, onOpenFilter, onSearch }: HeaderProps) {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [lang, setLang] = useState(i18n.language);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const toggleLanguage = () => {
    const newLang = lang === 'vi' ? 'en' : 'vi';
    i18n.changeLanguage(newLang);
    setLang(newLang);
  };

  const showConfirmDialog = () => setConfirmVisible(true);
  const hideConfirmDialog = () => setConfirmVisible(false);

  const confirmReset = async () => {
    await hikeService.deleteAllHikes();
    onResetPress();
    hideConfirmDialog();
  };

  return (
    <View
      className="border-b border-gray-100 bg-neutral-100 shadow-lg shadow-black/40 dark:border-gray-700 dark:bg-gray-900 dark:shadow-white/5"
      style={{
        paddingHorizontal: horizontalScale(14),
        paddingTop: verticalScaleFn(10),
        paddingBottom: verticalScaleFn(8),
      }}>
      <Portal>
        <Dialog
          visible={confirmVisible}
          onDismiss={hideConfirmDialog}
          style={{
            borderRadius: 16,
            backgroundColor: theme === 'light' ? 'white' : '#1f2937',
          }}>
          <Dialog.Title style={{ color: theme === 'light' ? '#111' : '#f3f4f6' }}>
            {t('resetAll')}
          </Dialog.Title>
          <Dialog.Content>
            <Text style={{ color: theme === 'light' ? '#374151' : '#d1d5db' }}>
              {t('confirmResetAll')}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideConfirmDialog}>{t('detailHike.cancel')}</Button>
            <Button onPress={confirmReset} textColor="red">
              {t('detailHike.confirm')}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

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

          <View className="mt-1 flex-row">
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

        <View className="flex-row items-center" style={{ gap: horizontalScale(4) }}>
          <TouchableOpacity
            onPress={showConfirmDialog}
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
            onPress={onAddPress}
            className="flex-row items-center rounded-xl bg-green-600 dark:bg-green-700"
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

      <View className="mb-1 flex-row items-center" style={{ gap: horizontalScale(8) }}>
        <View
          className="flex-1 flex-row items-center rounded-xl border border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800"
          style={{ paddingHorizontal: horizontalScale(10), paddingVertical: verticalScaleFn(6) }}>
          <Ionicons
            name="search-outline"
            size={moderateScaleFn(16)}
            color={theme === 'light' ? '#6b7280' : '#d1d5db'}
          />
          <TextInput
            placeholder={t('searchPlaceholder')}
            onChangeText={onSearch}
            className="ml-2 flex-1 text-gray-500 dark:text-gray-300"
            style={{ fontSize: moderateScaleFn(12) }}
            placeholderTextColor="#9ca3af"
          />
        </View>

        <TouchableOpacity
          onPress={onOpenFilter}
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
    </View>
  );
}

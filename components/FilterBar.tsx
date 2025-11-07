import { Ionicons } from '@expo/vector-icons';
import { hikeService } from 'db/databaseHelper';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, TextInput, TouchableOpacity, Modal, Pressable, FlatList } from 'react-native';

interface FilterBarProps {
  onDismiss: () => void;
  onApply: (filters: any) => void;
  reLoad?: () => void;
}

export default function FilterBar({ onDismiss, onApply, reLoad }: FilterBarProps) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [minLength, setMinLength] = useState('0');
  const [maxLength, setMaxLength] = useState('100');
  const [menuVisible, setMenuVisible] = useState(false);

  const { t } = useTranslation();

  const handleApply = () => {
    onApply({
      name: name.trim(),
      location: location.trim(),
      difficulty: difficulty || undefined,
      minLength: parseFloat(minLength) || 0,
      maxLength: parseFloat(maxLength) || 100,
    });
    onDismiss();
  };

  const handleReload = () => {
    if (reLoad) {
      reLoad();
      onDismiss();
    }
  };

  const difficulties = ['Easy', 'Medium', 'Hard'];

  return (
    <View className="rounded-xl bg-white p-5 dark:bg-gray-700">
      <View className="mb-6 flex-row items-center justify-between">
        <Text className="text-xl font-semibold text-gray-800 dark:text-white">
          {t('filter.title')}
        </Text>
        <TouchableOpacity onPress={onDismiss}>
          <Text className="text-2xl text-gray-500 dark:text-gray-300">×</Text>
        </TouchableOpacity>
      </View>

      <View className="mb-4">
        <Text className="mb-1 text-sm text-gray-700 dark:text-gray-300">{t('filter.name')}</Text>
        <TextInput
          placeholder={t('filter.namePlaceholder')}
          value={name}
          onChangeText={setName}
          className="rounded-md border border-gray-300 px-3 py-2 text-gray-800 dark:bg-gray-400"
        />
      </View>

      <View className="mb-4">
        <Text className="mb-1 text-sm text-gray-700 dark:text-gray-300">
          {t('filter.location')}
        </Text>
        <TextInput
          placeholder={t('filter.locationPlaceholder')}
          value={location}
          onChangeText={setLocation}
          className="rounded-md border border-gray-300 px-3 py-2 text-gray-800 dark:bg-gray-400"
        />
      </View>

      <View className="mb-4">
        <Text className="mb-1 text-sm text-gray-700 dark:text-gray-300">
          {t('filter.difficulty')}
        </Text>

        <TouchableOpacity
          onPress={() => setMenuVisible(true)}
          className="flex-row items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-3 dark:border-gray-600 dark:bg-gray-400">
          <Text
            className={`text-base ${
              difficulty ? 'text-gray-800 dark:text-gray-200' : 'text-gray-500 dark:text-gray-800'
            }`}>
            {difficulty || t('filter.anyDifficulty')}
          </Text>
          <Text className="text-base text-gray-500 dark:text-gray-400">▼</Text>
        </TouchableOpacity>

        <Modal transparent visible={menuVisible} animationType="fade">
          <Pressable className="flex-1 bg-black/20" onPress={() => setMenuVisible(false)}>
            <View className="absolute left-8 right-8 top-1/3 rounded-xl border border-gray-200 bg-white p-3 shadow-md dark:border-gray-700 dark:bg-gray-800">
              <FlatList
                data={[t('filter.anyDifficulty'), ...difficulties]}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setDifficulty(item === t('filter.anyDifficulty') ? '' : item);
                      setMenuVisible(false);
                    }}
                    className="rounded px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Text
                      className={`text-base ${
                        item === difficulty
                          ? 'font-medium text-green-600 dark:text-green-500'
                          : 'text-gray-800 dark:text-gray-200'
                      }`}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </Pressable>
        </Modal>
      </View>

      <View className="mb-6 flex-row justify-between">
        <View className="w-[47%]">
          <Text className="mb-1 text-sm text-gray-700 dark:text-gray-300">
            {t('filter.minLength')}
          </Text>
          <TextInput
            keyboardType="numeric"
            value={minLength}
            onChangeText={setMinLength}
            className="rounded-md border border-gray-300 px-2 py-2 text-gray-800 dark:bg-gray-400"
          />
        </View>
        <View className="w-[47%]">
          <Text className="mb-1 text-sm text-gray-700 dark:text-gray-300">
            {t('filter.maxLength')}
          </Text>
          <TextInput
            keyboardType="numeric"
            value={maxLength}
            onChangeText={setMaxLength}
            className="rounded-md border border-gray-300 px-2  py-2 text-gray-800 dark:bg-gray-400"
          />
        </View>
      </View>
      <View className="mb-6 flex-row justify-center">
        <TouchableOpacity
          onPress={handleApply}
          className="flex-row items-center justify-center rounded-lg bg-green-600 py-3 dark:bg-green-700"
          style={{ width: '45%', marginRight: 10 }}>
          <Ionicons name="checkmark-outline" size={18} color="white" />
          <Text className="ml-1 text-center text-base font-medium text-white">
            {t('filter.apply')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleReload}
          className="flex-row items-center justify-center rounded-lg bg-blue-600 py-3 dark:bg-blue-700"
          style={{ width: '45%' }}>
          <Ionicons name="refresh-outline" size={18} color="white" />
          <Text className="ml-1 text-center text-base font-medium text-white">
            {t('filter.reload')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

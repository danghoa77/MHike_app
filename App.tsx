// App.tsx
import './global.css';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { setupDatabase } from './db/database';
import HomeScreen from './components/screens/HomeScreen';
import './i18n/i18n';
import { ThemeProvider, useTheme } from 'theme/ThemeContext';
import { Dialog, Provider as PaperProvider, Portal } from 'react-native-paper';
import Header from 'components/Header';
import { horizontalScale, moderateScaleFn, verticalScaleFn } from 'constants/Layout';
import { ScrollView } from 'react-native';
import { Hike } from 'db/models/Hike';
import { hikeService } from 'db/databaseHelper';
import AddHikeModal from 'components/AddHikeModal';
import HikeDetailScreen from 'components/screens/HikeDetailScreen';
import FilterBar from 'components/FilterBar';

function AppContent() {
  const { theme } = useTheme();
  const [hikes, setHikes] = useState<Hike[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHike, setEditingHike] = useState<Hike | null>(null);
  const [selectedHikeId, setSelectedHikeId] = useState<number | null>(null);
  const [showFilter, setShowFilter] = React.useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setupDatabase();
    loadHikes();
  }, []);
  const handleFilter = async (filters: any) => {
    const all = await hikeService.getAllHikes();
    const filtered = all.filter((hike) => {
      const nameMatch =
        !filters.name || hike.name.toLowerCase().includes(filters.name.toLowerCase());

      const locationMatch =
        !filters.location || hike.location.toLowerCase().includes(filters.location.toLowerCase());

      const diffMatch = !filters.difficulty || hike.difficulty === filters.difficulty;

      const minLen = filters.minLength ?? 0;
      const maxLen = filters.maxLength ?? Infinity;
      const lengthMatch = hike.length >= minLen && hike.length <= maxLen;

      return nameMatch && locationMatch && diffMatch && lengthMatch;
    });

    setHikes(filtered);
    setShowFilter(false);
  };

  const handleSearch = async (query: string) => {
    const all = await hikeService.getAllHikes();
    const filtered = all.filter((hike) => {
      const nameMatch = hike.name.toLowerCase().includes(query.toLowerCase());
      return nameMatch;
    });
    setHikes(filtered);
  };

  const loadHikes = async () => {
    const data = await hikeService.getAllHikes();
    setHikes(data);
  };
  const handleViewDetails = (id: number) => {
    setSelectedHikeId(id);
  };

  const handleGoBackToList = () => {
    setSelectedHikeId(null);
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

  const handleEdit = (id: number) => {
    const hike = hikes.find((h) => h.id === id);
    if (hike) {
      setEditingHike(hike);
       (true);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-100 dark:bg-neutral-900">
      <Header
        onAddPress={() => setShowAddModal(true)}
        onResetPress={loadHikes}
        onOpenFilter={() => setShowFilter(true)}
        onSearch={handleSearch}
      />
      <ScrollView
        className="bg-white dark:bg-gray-700"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: horizontalScale(16),
          paddingBottom: verticalScaleFn(100),
          paddingTop: verticalScaleFn(16),
        }}>
        {selectedHikeId === null ? (
          <HomeScreen
            hikes={hikes}
            loadHikes={loadHikes}
            handleEdit={handleEdit}
            onViewDetails={handleViewDetails}
          />
        ) : (
          <HikeDetailScreen hikeId={selectedHikeId} onGoBack={handleGoBackToList} />
        )}
      </ScrollView>
      <Portal>
        <Dialog
          visible={showFilter}
          onDismiss={() => setShowFilter(false)}
          style={{
            borderRadius: 20,
            backgroundColor: '#fff',
            marginHorizontal: horizontalScale(10),
          }}>
          <FilterBar
            onDismiss={() => setShowFilter(false)}
            onApply={handleFilter}
            reLoad={loadHikes}
          />
        </Dialog>
      </Portal>

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

export default function App() {
  return (
    <PaperProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </PaperProvider>
  );
}

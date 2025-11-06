import './global.css';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect } from 'react';
import { setupDatabase } from './db/database';
import HomeScreen from './components/screens/HomeScreen';
import './i18n/i18n';

export default function App() {
  useEffect(() => {
    setupDatabase();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HomeScreen />
    </SafeAreaView>
  );
}

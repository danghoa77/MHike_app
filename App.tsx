import './global.css';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect } from 'react';
import { setupDatabase } from './db/database';
import HomeScreen from './components/screens/HomeScreen';
import './i18n/i18n';
import { ThemeProvider } from 'theme/ThemeContext';

export default function App() {
  useEffect(() => {
    setupDatabase();
  }, []);

  return (
    <ThemeProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <HomeScreen />
      </SafeAreaView>
    </ThemeProvider>
  );
}

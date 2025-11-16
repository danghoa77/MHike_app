import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import * as Location from 'expo-location';
import { useTranslation } from 'react-i18next';
interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
}

interface MapPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (location: LocationData) => void;
  theme: 'light' | 'dark';
}

export default function MapPickerModal({ visible, onClose, onSelect }: MapPickerModalProps) {
  const mapRef = useRef<MapView>(null);

  const [region, setRegion] = useState({
    latitude: 21.0285,
    longitude: 105.8542,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [marker, setMarker] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    if (!visible) return;

    (async () => {
      try {
        setLoading(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permission error: Location not granted');
          Alert.alert(t('map.error'));
          return;
        }

        const current = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const { latitude, longitude } = current.coords;
        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setRegion(newRegion);
        setMarker({
          latitude,
          longitude,
          address: t('map.getAddress'),
        });

        mapRef.current?.animateToRegion(newRegion, 1000);

        await fetchAddress(latitude, longitude);
      } catch (error) {
        console.error('ERROR IN MAP INIT:', error);
        Alert.alert(t('map.error'));
        throw error;
      } finally {
        setLoading(false);
      }
    })();
  }, [visible]);

  const fetchAddress = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'MapPickerApp/1.0 (danghoabay7@gmail.com)',
            'Accept-Language': 'vi',
          },
        }
      );
      const data = await res.json();
      const address = data.display_name || `${lat}, ${lon}`;
      setMarker({ latitude: lat, longitude: lon, address });
    } catch (err) {
      Alert.alert(t('map.error'));
      console.error('ERROR FETCHING ADDRESS:', err);
      throw new Error('Failed to fetch address');
    } finally {
      setLoading(false);
    }
  };

  const handleMapPress = (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarker({ latitude, longitude, address: t('map.getAddress') });
    fetchAddress(latitude, longitude);
  };

  const handleSelect = useCallback(() => {
    if (marker) onSelect(marker);
    onClose();
  }, [marker]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 items-center justify-center bg-black/25 p-4">
        <View className="w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-neutral-200">
          <View className="flex-row items-center justify-between bg-green-600 p-3 dark:bg-green-800">
            <Text className="text-lg font-bold text-white">{t('map.title')}</Text>
            <TouchableOpacity onPress={onClose} className="p-1.5">
              <Text className="text-lg text-white">✕</Text>
            </TouchableOpacity>
          </View>

          <MapView ref={mapRef} style={styles.map} region={region} onPress={handleMapPress}>
            {marker && (
              <Marker coordinate={{ latitude: marker.latitude, longitude: marker.longitude }} />
            )}
          </MapView>

          {marker && (
            <View className="m-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
              <Text className="font-semibold text-emerald-800">{t('map.address')}:</Text>
              <Text className="text-emerald-900">{marker.address}</Text>
              <Text className="mt-1 text-xs text-gray-500">
                (Lat: {marker.latitude.toFixed(6)}, Lon: {marker.longitude.toFixed(6)})
              </Text>
            </View>
          )}

          {loading && (
            <View className="absolute left-0 right-0 top-[45%] items-center">
              <ActivityIndicator size="large" color="#16a34a" />
            </View>
          )}

          <View className="flex-row justify-end gap-2 border-t border-gray-200 p-3">
            <TouchableOpacity className="rounded-lg bg-gray-500 px-2 py-2" onPress={onClose}>
              <Text className="font-bold text-white">{t('map.cancel')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`rounded-lg px-4 py-2 ${marker ? 'bg-green-600 dark:bg-green-800' : 'bg-gray-400 dark:bg-gray-500'}`}
              onPress={handleSelect}
              disabled={!marker || loading}>
              <Text className="font-bold text-white">{t('map.choose')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 300,
    width: '100%',
  },
});

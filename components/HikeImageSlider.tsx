import React, { useRef, useState } from 'react';
import {
  View,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface Props {
  images: string[];
}

export default function HikeImageSlider({ images }: Props) {
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [errorIndex, setErrorIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<string>>(null);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={images}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        renderItem={({ item, index }) => (
          <View
            style={{
              width,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#000',
            }}>
            {loadingIndex === index && <ActivityIndicator size="large" color="#16a34a" />}

            <Image
              source={{ uri: item }}
              style={{
                width: width * 0.9,
                height: 220,
                borderRadius: 12,
                resizeMode: 'cover',
              }}
              onLoadStart={() => setLoadingIndex(index)}
              onLoadEnd={() => setLoadingIndex(null)}
              onError={() => setErrorIndex(index)}
            />

            {errorIndex === index && (
              <View
                style={{
                  position: 'absolute',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Ionicons name="alert-circle-outline" size={50} color="#aaa" />
              </View>
            )}
          </View>
        )}
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 10,
        }}>
        {images.map((_, i) => (
          <View
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              marginHorizontal: 4,
              backgroundColor: i === activeIndex ? '#16a34a' : '#d1d5db',
            }}
          />
        ))}
      </View>
    </View>
  );
}

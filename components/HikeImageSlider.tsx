import React, { useRef, useState } from 'react';
import {
  View,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
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
  const opacity = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList<string>>(null);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    // SỬA Ở ĐÂY: Chia cho `width` thay vì `width * 0.9`
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  const handleImageLoad = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View className="items-center">
      <FlatList
        ref={flatListRef}
        data={images}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        snapToInterval={width}
        disableIntervalMomentum={true}
        snapToAlignment="center"
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        renderItem={({ item, index }) => (
          <View
            style={{
              width: width * 0.9,
              height: 260,
              overflow: 'hidden',
              backgroundColor: '#000',
              alignItems: 'center',
              justifyContent: 'center',
              marginHorizontal: (width - width * 0.9) / 2,
            }}>
            {loadingIndex === index && <ActivityIndicator size="large" color="#16a34a" />}

            <Animated.Image
              source={{ uri: item }}
              style={{
                width: '100%',
                height: '100%',
                resizeMode: 'cover',
                opacity,
              }}
              onLoadStart={() => {
                setLoadingIndex(index);
                opacity.setValue(0);
              }}
              onLoadEnd={() => {
                setLoadingIndex(null);
                handleImageLoad();
              }}
              onError={() => setErrorIndex(index)}
            />

            {errorIndex === index && (
              <View className="absolute inset-0 items-center justify-center">
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

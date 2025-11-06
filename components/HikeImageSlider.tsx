import React, { useRef, useState } from 'react';
import {
  View,
  Image,
  FlatList,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';

interface Props {
  images: string[];
}

const { width } = Dimensions.get('window');

const HikeImageSlider: React.FC<Props> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<string>>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  return (
    <View className="w-full">
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} className="h-60 w-[100vw] rounded-xl" resizeMode="cover" />
        )}
      />

      {/* Dots */}
      <View className="mt-2 flex-row justify-center">
        {images.map((_, index) => (
          <View
            key={index}
            className={`mx-1 h-2 w-2 rounded-full ${
              activeIndex === index ? 'h-3 w-3 bg-white' : 'bg-gray-400'
            }`}
          />
        ))}
      </View>
    </View>
  );
};

export default HikeImageSlider;

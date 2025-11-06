// src/constants/Layout.ts
import { Dimensions } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const { width, height } = Dimensions.get('window');


const guidelineBaseWidth = 390;
const guidelineBaseHeight = 844;

export const horizontalScale = (size: number) => (width / guidelineBaseWidth) * size;
export const verticalScaleFn = (size: number) => (height / guidelineBaseHeight) * size;
export const moderateScaleFn = (size: number, factor = 0.5) =>
    size + (horizontalScale(size) - size) * factor;

export { scale, verticalScale, moderateScale };

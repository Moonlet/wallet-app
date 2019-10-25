import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const widthPercent = width / 100;
const heightPercent = height / 100;

// percentage of screen width
export const pw = (d: number) => widthPercent * d;

// percentage of screen height
export const ph = (d: number) => heightPercent * d;

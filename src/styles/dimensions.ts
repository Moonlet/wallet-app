import { Platform, Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// based on iPhone 11's scale
const scale = SCREEN_WIDTH / 414;

// can be used for width, height, top, bottom, fontSize, borderRadius, margin, padding, etc.
export const normalize = (size: number) => {
    const newSize = size * scale;
    if (Platform.OS === 'ios') {
        return Math.round(PixelRatio.roundToNearestPixel(newSize));
    } else {
        return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
    }
};

export const BORDER_RADIUS = normalize(8);
export const BASE_DIMENSION = normalize(8);
export const ICON_SIZE = normalize(24);
export const ICON_CONTAINER_SIZE = normalize(44);

export const SCREEN_HEIGHT =
    Platform.OS === 'web' ? Dimensions.get('window').height - 64 : Dimensions.get('window').height;

import { Platform, Dimensions, PixelRatio } from 'react-native';
import DeviceInfo from 'react-native-device-info';

export const { width: SCREEN_WIDTH } = Dimensions.get('window');

// based on iPhone 11's scale
const scale = SCREEN_WIDTH / 414;

// can be used for width, height, top, bottom, fontSize, borderRadius, margin, padding, etc.
export const normalize = (size: number) => Math.round(PixelRatio.roundToNearestPixel(size * scale));

export const normalizeFontAndLineHeight = (size: number) => {
    const fontScale = DeviceInfo.getFontScaleSync();

    if (fontScale && Number(fontScale)) {
        return Math.round(PixelRatio.roundToNearestPixel(size / Number(fontScale)));
    } else {
        return normalize(size);
    }
};

export const normalizeLetterSpacing = (size: number) => Number((size * scale).toFixed(2));

export const BORDER_RADIUS = normalize(8);
export const BASE_DIMENSION = normalize(8);
export const MARGIN_DIMENSION = '16.84%';
export const ICON_SIZE = normalize(24);
export const ICON_CONTAINER_SIZE = normalize(44);
export const LETTER_SPACING = normalizeLetterSpacing(0.38);

export const SCREEN_HEIGHT =
    Platform.OS === 'web' ? Dimensions.get('window').height - 64 : Dimensions.get('window').height;

export const isIphoneXorAbove = () =>
    Platform.OS === 'ios' &&
    ((SCREEN_WIDTH === 375 && SCREEN_HEIGHT === 812) || // iPhone X, XS, 11 Pro
        (SCREEN_WIDTH === 414 && SCREEN_HEIGHT === 896)); // iPhone XS Max, XR, 11, 11 Pro Max

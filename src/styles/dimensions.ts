import { Platform, Dimensions } from 'react-native';

export const BORDER_RADIUS = 8;
export const BASE_DIMENSION = 8;
export const ICON_SIZE = 24;
export const ICON_CONTAINER_SIZE = 44;

export const SCREEN_HEIGHT =
    Platform.OS === 'web' ? Dimensions.get('window').height - 64 : Dimensions.get('window').height;

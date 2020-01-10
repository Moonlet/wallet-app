import { Platform } from 'react-native';

export const BORDER_RADIUS = 8;
export const BASE_DIMENSION = 8;
export const ICON_SIZE = 24;
export const ICON_CONTAINER_SIZE = 44;

export const FULL_HEIGHT = Platform.OS === 'web' ? '100vh' : '100%';
export const HEADER_FOR_WEB = Platform.OS === 'web' ? 64 : 0;

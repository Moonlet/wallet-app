import { createIconSet } from 'react-native-vector-icons';
import * as glyphMap from '../../resources/fonts/icons.json';

Object.keys(glyphMap).map(key => {
    (glyphMap as any)[key] = parseInt(String((glyphMap as any)[key]).replace('\\f', '0xf'), 16);
});

export const Icon = createIconSet(glyphMap, 'icons', 'icons.ttf');
export default Icon;

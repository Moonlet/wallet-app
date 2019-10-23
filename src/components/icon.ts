import { createIconSet } from 'react-native-vector-icons';
import * as map from '../../resources/fonts/icons.json';

const glyphMap = {};
Object.keys((map as any).default).map(key => {
    (glyphMap as any)[key] = parseInt(String((map as any).default[key]).replace('\\f', '0xf'), 16);
});

export const Icon = createIconSet(glyphMap, 'icons', 'icons.ttf');
export default Icon;

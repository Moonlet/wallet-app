import { StyleSheet } from 'react-native';
import { COLORS } from '../../styles/colors';

export default StyleSheet.create({
    container: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: 6,
        height: 60,
        display: 'flex',
        justifyContent: 'center',
        marginHorizontal: 4,
        alignItems: 'center',
        flex: 1
    },
    conversionLabel: {
        color: COLORS.LIGHT_GRAY
    },
    changeUp: {
        color: COLORS.HOT_GREEN
    },
    changeDown: {
        color: COLORS.HOT_RED
    }
});

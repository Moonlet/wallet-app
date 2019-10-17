import { StyleSheet } from 'react-native';
import COLORS from '../../styles/colors';

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
        color: COLORS.lightGray
    },
    changeUp: {
        color: COLORS.hotGreen
    },
    changeDown: {
        color: COLORS.hotRed
    }
});

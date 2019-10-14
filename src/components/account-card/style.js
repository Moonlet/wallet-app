import { StyleSheet } from 'react-native';
import COLORS from '../../styles/colors';

export default StyleSheet.create({
    container: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: 6,
        height: 80,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        marginHorizontal: 4,
        flexDirection: 'row',
        padding: 12
    },
    accountInfoContainer: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        marginHorizontal: 8
    }
});

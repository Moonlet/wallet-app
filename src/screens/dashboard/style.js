import { StyleSheet } from 'react-native';
import COLORS from '../../styles/colors';

const header = {
    height: 50,
    backgroundColor: '#999999',

    alignSelf: 'stretch'
};

export default StyleSheet.create({
    container: {
        padding: 0,
        paddingTop: 40,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#121212',
        ...StyleSheet.absoluteFill
    },
    balancesContainer: {
        height: 160
    },
    blockchainSelectorContainer: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: 20,
        height: 40,
        alignSelf: 'stretch',
        margin: 12,
        marginTop: 8,
        flexDirection: 'row'
    },
    blockchainButton: {
        flex: 1,
        flexBasis: 0,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        margin: 4
    },
    blockchainButtonActive: {
        backgroundColor: COLORS.gray
    },
    blockchainButtonTextActive: {
        color: COLORS.primary
    }
});

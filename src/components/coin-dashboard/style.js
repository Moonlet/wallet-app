import { StyleSheet } from 'react-native';
import COLORS from '../../styles/colors';

export default StyleSheet.create({
    container: {
        padding: 0,
        paddingTop: 10,
        alignItems: 'center',
        alignSelf: 'stretch',
        flex: 1,
        margin: 12,
        marginBottom: 4
    },
    exchangeCardContainer: {
        display: 'flex',
        flexDirection: 'row'
    },
    text: {
        color: COLORS.white
    },
    mainText: {
        fontSize: 34
    },
    icon: {
        color: COLORS.primary
    },
    addButton: {
        marginTop: 20,
        marginBottom: 12,
        alignSelf: 'flex-end',
        marginRight: 12
    }
});

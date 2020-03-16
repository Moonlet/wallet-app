import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.appBackground
        },
        scrollContainer: {
            flexGrow: 1,
            paddingTop: BASE_DIMENSION * 5
        },
        balanceContainer: {
            marginTop: BASE_DIMENSION,
            flexWrap: 'wrap',
            justifyContent: 'center',
            flexDirection: 'row'
        },
        buttonsContainer: {
            marginTop: BASE_DIMENSION * 8,
            marginBottom: BASE_DIMENSION * 2,
            marginHorizontal: BASE_DIMENSION,
            flexWrap: 'wrap',
            justifyContent: 'center',
            flexDirection: 'row'
        },
        button: {
            flex: 1,
            marginHorizontal: BASE_DIMENSION / 2
        },
        transactionsTitle: {
            fontSize: 22,
            lineHeight: 28,
            color: theme.colors.text,
            opacity: 0.87,
            fontWeight: 'bold',
            marginLeft: BASE_DIMENSION * 2
        }
    });

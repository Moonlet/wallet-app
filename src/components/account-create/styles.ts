import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import {
    BASE_DIMENSION,
    BORDER_RADIUS,
    ICON_CONTAINER_SIZE,
    normalize
} from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            paddingHorizontal: BASE_DIMENSION * 2
        },
        createText: {
            fontSize: normalize(22),
            lineHeight: normalize(28),
            fontWeight: 'bold',
            letterSpacing: 0.35,
            color: theme.colors.text,
            textAlign: 'center',
            marginBottom: BASE_DIMENSION
        },
        chooseUsernameText: {
            lineHeight: normalize(22),
            color: theme.colors.textSecondary,
            textAlign: 'center',
            marginBottom: BASE_DIMENSION * 4
        },
        congratsText: {
            fontSize: normalize(15),
            lineHeight: normalize(20),
            color: theme.colors.accent
        },
        invalidText: {
            fontSize: normalize(15),
            lineHeight: normalize(20),
            color: theme.colors.error
        },
        createButton: {
            width: '80%',
            alignSelf: 'center'
        },
        inputContainer: {
            marginBottom: BASE_DIMENSION * 4
        },
        inputBox: {
            height: BASE_DIMENSION * 5,
            borderRadius: BORDER_RADIUS,
            alignSelf: 'stretch',
            backgroundColor: theme.colors.cardBackground,
            paddingHorizontal: BASE_DIMENSION + BASE_DIMENSION / 2,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        input: {
            flex: 1,
            color: theme.colors.text,
            fontSize: normalize(15),
            lineHeight: normalize(20)
        },
        icon: {
            color: theme.colors.accent
        },
        rightAddressButton: {
            height: ICON_CONTAINER_SIZE,
            width: ICON_CONTAINER_SIZE,
            justifyContent: 'flex-end',
            alignItems: 'center',
            flexDirection: 'row'
        }
    });

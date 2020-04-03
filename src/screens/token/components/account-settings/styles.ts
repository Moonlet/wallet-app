import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import {
    BASE_DIMENSION,
    BORDER_RADIUS,
    ICON_CONTAINER_SIZE,
    normalize
} from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.colors.overlayBackground,
            flex: 1,
            justifyContent: 'center',
            alignContent: 'center'
        },
        modalContainer: {
            backgroundColor: theme.colors.cardBackground,
            height: normalize(380),
            borderRadius: BORDER_RADIUS * 2,
            marginHorizontal: BASE_DIMENSION * 3
        },
        contentContainer: {
            marginTop: BASE_DIMENSION * 5
        },
        rowContainer: {
            flexDirection: 'row',
            paddingVertical: BASE_DIMENSION * 2
        },
        rowChild: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        header: {
            height: ICON_CONTAINER_SIZE,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: BASE_DIMENSION
        },
        backButtonWrapper: {
            flex: 1
        },
        backButtonContainer: {
            flex: 1,
            flexDirection: 'row',
            paddingLeft: BASE_DIMENSION * 2
        },
        backText: {
            fontSize: normalize(17),
            lineHeight: normalize(22),
            color: theme.colors.text
        },
        doneWrapper: {
            flex: 1,
            alignItems: 'flex-end'
        },
        doneButton: {
            color: theme.colors.accent,
            paddingRight: BASE_DIMENSION * 2
        },
        titleWrapper: {
            flex: 2
        },
        title: {
            lineHeight: normalize(19),
            textAlign: 'center',
            fontWeight: 'bold'
        },
        leftIcon: {
            color: theme.colors.textSecondary,
            marginHorizontal: BASE_DIMENSION * 2
        },
        rightIcon: {
            color: theme.colors.accent,
            marginHorizontal: BASE_DIMENSION * 2
        },
        icon: {
            color: theme.colors.accent,
            alignSelf: 'center'
        },
        textRow: {
            fontSize: normalize(17),
            lineHeight: normalize(22),
            color: theme.colors.textSecondary
        }
    });

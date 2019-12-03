import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS, ICON_CONTAINER_SIZE } from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            backgroundColor: 'rgba(0,0,0,0.4)',
            flex: 1,
            justifyContent: 'center',
            alignContent: 'center'
        },
        modalContainer: {
            backgroundColor: theme.colors.modalBackground,
            height: 380,
            borderRadius: BORDER_RADIUS * 2,
            marginLeft: BASE_DIMENSION * 3,
            marginRight: BASE_DIMENSION * 3
        },
        contentContainer: {
            marginTop: BASE_DIMENSION * 5
        },
        rowContainer: {
            flexDirection: 'row',
            paddingVertical: BASE_DIMENSION
        },
        rowChild: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        leftIcon: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: BASE_DIMENSION * 2,
            paddingRight: BASE_DIMENSION * 2
        },
        rightIcon: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingRight: BASE_DIMENSION
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
            justifyContent: 'center',
            alignItems: 'center'
        },
        backIconContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            height: ICON_CONTAINER_SIZE,
            width: ICON_CONTAINER_SIZE
        },
        backText: {
            fontSize: 17,
            lineHeight: 22,
            opacity: 0.87,
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
            fontSize: theme.fontSize.regular,
            textAlign: 'center',
            fontWeight: 'bold'
        },
        icon: {
            color: theme.colors.accent, // TODO: check here with Figma
            padding: 4
        },
        textRow: {
            fontSize: theme.fontSize.regular,
            lineHeight: 30
        }
    });

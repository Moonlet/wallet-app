import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            paddingTop: 18,
            paddingBottom: 18,
            paddingLeft: 15,
            paddingRight: 15,
            flexDirection: 'column',
            backgroundColor: theme.colors.appBackground,
            ...StyleSheet.absoluteFillObject
        },
        address: {
            fontSize: 30,
            textAlign: 'center',
            fontWeight: 'bold',
            marginBottom: 40
        },
        input: {
            flex: 1,
            color: theme.colors.text
        },
        inputAddress: {
            flex: 1,
            color: theme.colors.text,
            paddingRight: 15
        },
        receipientLabel: {
            paddingLeft: 15,
            marginTop: 10,
            color: theme.colors.textSecondary
        },
        inputBoxAddress: {
            height: 44,
            borderRadius: 6,
            borderColor: 'gray',
            alignSelf: 'stretch',
            backgroundColor: theme.colors.inputBackground,
            paddingHorizontal: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        inputBox: {
            height: 44,
            borderRadius: 6,
            borderColor: 'gray',
            alignSelf: 'stretch',
            backgroundColor: theme.colors.inputBackground,
            paddingHorizontal: 12,
            marginTop: 40,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        bottom: {
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginBottom: 5
        },
        bottomButton: {
            width: '90%'
        },
        basicFields: {
            flex: 1,
            paddingTop: 52,
            backgroundColor: theme.colors.appBackground
        },
        icon: {
            color: theme.colors.accent,
            marginHorizontal: 0
        },
        qrButton: {
            flexDirection: 'row',
            marginRight: 5
        }
    });

import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { BASE_DIMENSION, normalize } from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: BASE_DIMENSION + BASE_DIMENSION / 2,
            paddingHorizontal: BASE_DIMENSION
        },
        generalFlex: {
            flex: 1
        },
        row: {
            flexDirection: 'row',
            alignItems: 'baseline'
        },
        firstLineText: {
            fontWeight: '500',
            marginBottom: BASE_DIMENSION
        },
        secondLine: {
            color: theme.colors.textSecondary,
            marginBottom: BASE_DIMENSION / 4
        },
        thirdLine: {
            color: theme.colors.textSecondary
        },
        actionButtonContainer: {
            justifyContent: 'center'
        },
        actionButton: {
            minWidth: normalize(100)
        }
    });

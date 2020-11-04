import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS, normalize } from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        skeletonWrapper: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            backgroundColor: theme.colors.cardBackground,
            borderRadius: BORDER_RADIUS,
            paddingHorizontal: BASE_DIMENSION + BASE_DIMENSION / 2,
            marginBottom: BASE_DIMENSION,
            paddingTop: BASE_DIMENSION + BASE_DIMENSION / 2
        },
        detailsSkeletonComp: {
            flexDirection: 'row',
            marginRight: BASE_DIMENSION * 3,
            marginBottom: BASE_DIMENSION + BASE_DIMENSION / 2
        },
        detailsSkeletonIcon: {
            width: normalize(36),
            height: normalize(36),
            borderRadius: BORDER_RADIUS,
            marginRight: BASE_DIMENSION
        },
        detailsSkeletonPrimaryValue: {
            height: normalize(14),
            width: normalize(100),
            borderRadius: BORDER_RADIUS / 2
        },
        detailsSkeletonSecondaryValue: {
            height: normalize(12),
            width: normalize(80),
            borderRadius: BORDER_RADIUS / 2
        }
    });

import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        detailsSkeletonRow: {
            width: '100%',
            height: BASE_DIMENSION * 5,
            borderRadius: BORDER_RADIUS,
            marginBottom: BASE_DIMENSION + BASE_DIMENSION / 2
        }
    });

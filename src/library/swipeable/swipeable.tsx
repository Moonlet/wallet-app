import React from 'react';

import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import RNGHSwipable from 'react-native-gesture-handler/Swipeable';

export interface ISwipableProps {
    children?: any;
    renderLeftActions?: any;
    styles: ReturnType<typeof stylesProvider>;
}

/**
 * // TODO this is not used at the moment, maybe remove it if not needed for chrom ext
 * @param props
 */
export const SwipeableComponent = (props: ISwipableProps) => (
    <RNGHSwipable renderLeftActions={props.renderLeftActions}>{props.children}</RNGHSwipable>
);

export const Swipeable = withTheme(stylesProvider)(SwipeableComponent);

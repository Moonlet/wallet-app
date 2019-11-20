import React from 'react';
import { View } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';

export interface IProps {
    opacity: any;
}

export class SkeletonRowComponent extends React.Component<
    IProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    constructor(props: IProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);
    }

    public getRandomPercentage = () => {
        return Math.floor(Math.random() * (100 - 40)) + 40 + '%';
    };

    public render() {
        const styles = this.props.styles;
        const { opacity } = this.props;

        return (
            <View style={styles.container}>
                <View style={[styles.round, { opacity }]} />
                <View style={styles.linesWrapper}>
                    <View
                        style={[styles.firstRow, { opacity, width: this.getRandomPercentage() }]}
                    />
                    <View
                        style={[styles.secondRow, { opacity, width: this.getRandomPercentage() }]}
                    />
                </View>
            </View>
        );
    }
}

export const SkeletonRow = smartConnect<IProps>(SkeletonRowComponent, [withTheme(stylesProvider)]);

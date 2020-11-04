import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { SkeletonPlaceholder } from '../../../../components/skeleton-placeholder/skeleton-placeholder';

class LoadingSkeletonComponent extends React.Component<
    IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public render() {
        const { styles, theme } = this.props;

        return (
            <View key={'skeleton-placeholder'} style={styles.skeletonWrapper}>
                {new Array(4).fill('').map((_, index: number) => (
                    <SkeletonPlaceholder
                        key={`skelet-${index}`}
                        backgroundColor={theme.colors.textTertiary}
                        highlightColor={theme.colors.accent}
                        speed={Math.floor(Math.random() * 700) + 1000}
                    >
                        <View style={styles.detailsSkeletonComp}>
                            <View style={styles.detailsSkeletonIcon} />
                            <View style={{ justifyContent: 'space-between' }}>
                                <View style={styles.detailsSkeletonPrimaryValue} />
                                <View style={styles.detailsSkeletonSecondaryValue} />
                            </View>
                        </View>
                    </SkeletonPlaceholder>
                ))}
            </View>
        );
    }
}

export const LoadingSkeleton = smartConnect(LoadingSkeletonComponent, [withTheme(stylesProvider)]);

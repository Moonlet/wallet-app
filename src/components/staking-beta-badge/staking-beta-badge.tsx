import React from 'react';
import { View, Text } from 'react-native';
import { smartConnect } from '../../core/utils/smart-connect';
import { withTheme } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { translate } from '../../core/i18n';

interface Props {
    styles: ReturnType<typeof stylesProvider>;
}

const StakingBetaBadgeComponent: React.FC<Props> = ({ styles }) => {
    return (
        <View testID="generic-badge" style={styles.container}>
            <Text style={styles.text}>{translate('App.labels.stakingPublicBeta')}</Text>
        </View>
    );
};

export const StakingBetaBadge = smartConnect(StakingBetaBadgeComponent, [
    withTheme(stylesProvider)
]);

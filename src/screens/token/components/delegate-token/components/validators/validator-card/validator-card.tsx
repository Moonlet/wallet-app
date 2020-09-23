import React from 'react';
import { View, TouchableHighlight } from 'react-native';
import stylesProvider from './styles';
import { IThemeProps, withTheme } from '../../../../../../../core/theme/with-theme';
import { SmartImage } from '../../../../../../../library/image/smart-image';
import { BASE_DIMENSION, normalize } from '../../../../../../../styles/dimensions';
import { Icon } from '../../../../../../../components/icon/icon';
import { smartConnect } from '../../../../../../../core/utils/smart-connect';
import { Text } from '../../../../../../../library';
import { formatNumber } from '../../../../../../../core/utils/format-number';
import BigNumber from 'bignumber.js';
import { getBlockchain } from '../../../../../../../core/blockchain/blockchain-factory';
import { translate } from '../../../../../../../core/i18n';
import { IconValues } from '../../../../../../../components/icon/values';
import { formatValidatorName } from '../../../../../../../core/utils/format-string';
import { getTokenConfig } from '../../../../../../../redux/tokens/static-selectors';
import {
    CardActionType,
    IStatValue,
    IStatValueType
} from '../../../../../../../redux/ui/stats/state';

export interface IExternalProps {
    icon: string;
    leftLabel: string;
    leftSmallLabel: string;
    leftSubLabel: string;
    rightTitle: string;
    rightSubtitle: string;
    actionType: CardActionType;
    actionTypeSelected: boolean;
    borderColor: string;
    bottomStats: IStatValue[];
    onSelect: () => void;
}

export function getValueString(stat: IStatValue) {
    switch (stat.type) {
        case IStatValueType.STRING:
            return stat.data.value;
        case IStatValueType.AMOUNT:
            const tokenConfig = getTokenConfig(stat.data.blockchain, stat.data.tokenSymbol);
            const blockchainInstance = getBlockchain(stat.data.blockchain);

            const amountFromStd = blockchainInstance.account.amountFromStd(
                new BigNumber(stat.data.value),
                tokenConfig.decimals
            );
            return formatNumber(new BigNumber(amountFromStd), {
                currency: blockchainInstance.config.coin,
                maximumFractionDigits: 4
            });
    }
}

export const ValidatorCardComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    return (
        <TouchableHighlight
            onPress={() => props.onSelect()}
            underlayColor={props.theme.colors.appBackground}
        >
            <View
                style={[
                    props.styles.cardContainer,
                    props.actionTypeSelected
                        ? { borderColor: props.borderColor, borderWidth: 1.5 }
                        : null
                ]}
            >
                <View style={props.styles.topContainer}>
                    <SmartImage source={{ uri: props.icon }} style={props.styles.imageStyle} />
                    <View style={props.styles.topRow}>
                        <View style={props.styles.topRowFirstLine}>
                            <View style={props.styles.primaryTextContainer}>
                                <Text
                                    style={[
                                        props.styles.primaryText,
                                        { paddingRight: BASE_DIMENSION / 2 }
                                    ]}
                                >
                                    {formatValidatorName(props.leftLabel, 15)}
                                </Text>
                                <Text style={props.styles.tertiaryText}>
                                    {props.leftSmallLabel}
                                </Text>
                            </View>

                            <Text style={props.styles.primaryText}>
                                {translate(props.rightTitle)}
                            </Text>
                        </View>

                        <View style={props.styles.topRowSecondLine}>
                            <Text style={props.styles.secondaryText}>{props.leftSubLabel}</Text>
                            <Text style={props.styles.amountText}>{props.rightSubtitle}</Text>
                        </View>
                    </View>
                    {props.actionType === CardActionType.NAVIGATE && (
                        <Icon
                            name={IconValues.CHEVRON_RIGHT}
                            size={normalize(18)}
                            style={props.styles.chevronRight}
                        />
                    )}
                    {props.actionType === CardActionType.CHECKBOX && (
                        <Icon
                            name={
                                props.actionTypeSelected === true
                                    ? IconValues.CHECK_BOX_THICKED
                                    : IconValues.CHECK_BOX
                            }
                            size={normalize(18)}
                            style={props.styles.chevronRight}
                        />
                    )}
                </View>
                <View style={props.styles.bottomContainer}>
                    {props.bottomStats.map((stat: IStatValue, i: number) => (
                        <View key={i}>
                            <Text style={props.styles.bottomSecondaryText}>{stat.title}</Text>
                            <Text style={[props.styles.bottomPrimaryText, { color: stat.color }]}>
                                {getValueString(stat)}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        </TouchableHighlight>
    );
};

export const ValidatorCard = smartConnect<IExternalProps>(ValidatorCardComponent, [
    withTheme(stylesProvider)
]);

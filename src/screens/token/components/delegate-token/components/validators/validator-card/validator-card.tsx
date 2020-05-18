import React from 'react';
import { View, TouchableHighlight } from 'react-native';
import stylesProvider from './styles';
import { IThemeProps, withTheme } from '../../../../../../../core/theme/with-theme';
import { SmartImage } from '../../../../../../../library/image/smart-image';
import { BASE_DIMENSION, normalize } from '../../../../../../../styles/dimensions';
import { Icon } from '../../../../../../../components/icon';
import { smartConnect } from '../../../../../../../core/utils/smart-connect';
import { Text } from '../../../../../../../library';
import {
    IStatValue,
    IStatValueType,
    CardActionType
} from '../../../../../../../core/blockchain/types/stats';
import { Blockchain } from '../../../../../../../core/blockchain/types/blockchain';
import { formatNumber } from '../../../../../../../core/utils/format-number';
import BigNumber from 'bignumber.js';
import { getBlockchain } from '../../../../../../../core/blockchain/blockchain-factory';

export interface IExternalProps {
    icon: string;
    leftLabel: string;
    leftSmallLabel: string;
    leftSubLabel: string;
    rightTitle: string;
    rightSubtitle: string;
    actionType: CardActionType;
    bottomStats: IStatValue[];
    blockchain: Blockchain;
    onSelect: () => void;
}

export function getValueString(stat: IStatValue) {
    switch (stat.type) {
        case IStatValueType.STRING:
            return stat.data.value;
        case IStatValueType.AMOUNT:
            return formatNumber(new BigNumber(stat.data.value), {
                currency: getBlockchain(this.props.blockchain).config.coin
            });
    }
}

export const ValidatorCardComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    return (
        <TouchableHighlight
            onPress={this.props.onSelect}
            underlayColor={props.theme.colors.appBackground}
        >
            <View style={props.styles.cardContainer}>
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
                                    {props.leftSmallLabel}
                                </Text>
                                <Text style={props.styles.tertiaryText}>
                                    {props.leftSmallLabel}
                                </Text>
                            </View>

                            <Text style={props.styles.primaryText}>{props.rightTitle}</Text>
                        </View>

                        <View style={props.styles.topRowSecondLine}>
                            <Text style={props.styles.secondaryText}>{props.leftSubLabel}</Text>
                            <Text style={props.styles.amountText}>{props.rightSubtitle}</Text>
                        </View>
                    </View>

                    <Icon
                        name={'chevron-right'}
                        size={normalize(18)}
                        style={props.styles.chevronRight}
                    />
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

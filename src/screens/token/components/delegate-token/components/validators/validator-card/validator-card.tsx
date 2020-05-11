import React from 'react';
import { View, TouchableHighlight } from 'react-native';
import stylesProvider from './styles';
import { IThemeProps, withTheme } from '../../../../../../../core/theme/with-theme';
import { SmartImage } from '../../../../../../../library/image/smart-image';
import { BASE_DIMENSION, normalize } from '../../../../../../../styles/dimensions';
import { Icon } from '../../../../../../../components/icon';
import { smartConnect } from '../../../../../../../core/utils/smart-connect';
import { Text } from '../../../../../../../library';
import { IStatValue } from '../../../../../../../core/blockchain/types/stats';
import { NavigationService } from '../../../../../../../navigation/navigation-service';

export interface IExternalProps {
    icon: string;
    labelName: string;
    smallLabelName: string;
    website: string;
    rightTitle: string;
    rightSubtitle: string;
    actionType: string;
    bottomStats: IStatValue[];
}

export const ValidatorCardComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    return (
        <TouchableHighlight
            onPress={() => {
                NavigationService.navigate('Validator', {});
            }}
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
                                    {props.labelName}
                                </Text>
                                <Text style={props.styles.tertiaryText}>
                                    {props.smallLabelName}
                                </Text>
                            </View>

                            <Text style={props.styles.primaryText}>{props.rightTitle}</Text>
                        </View>

                        <View style={props.styles.topRowSecondLine}>
                            <Text style={props.styles.secondaryText}>{props.website}</Text>
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
                    <View>
                        <Text style={props.styles.bottomSecondaryText}>{`Validators`}</Text>
                        <Text style={props.styles.bottomPrimaryText}>{`2/2`}</Text>
                    </View>

                    <View>
                        <Text style={props.styles.bottomSecondaryText}>{`Voting Power`}</Text>
                        <Text style={props.styles.bottomPrimaryText}>{`0.64%`}</Text>
                    </View>

                    <View>
                        <Text style={props.styles.bottomSecondaryText}>{`Uptime`}</Text>
                        <Text style={props.styles.bottomPrimaryText}>{`99.99%`}</Text>
                    </View>

                    <View>
                        <Text style={props.styles.bottomSecondaryText}>{`Reward`}</Text>
                        <Text
                            style={[
                                props.styles.bottomPrimaryText,
                                { color: props.theme.colors.positive }
                            ]}
                        >
                            {`6.00%`}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableHighlight>
    );
};

export const ValidatorCard = smartConnect<IExternalProps>(ValidatorCardComponent, [
    withTheme(stylesProvider)
]);

import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { Button, Text } from '../../../../library';
import { I3LinesCtaData, ICta } from '../../types';
import { PosBasicActionType } from '../../../../core/blockchain/types/token';
import { buildDummyValidator } from '../../../../redux/wallets/actions';
import { IAccountState } from '../../../../redux/wallets/state';

interface ExternalProps {
    data: I3LinesCtaData[];
    cta: ICta;
    actions: any;
    account: IAccountState;
}

const ThreeLinesCtaComponent = (
    props: IThemeProps<ReturnType<typeof stylesProvider>> & ExternalProps
) => {
    const { actions, data, cta, styles } = props;

    // console.log(JSON.stringify(cta.params, null, 4));

    const handleOnPress = () => {
        switch (cta.params.action) {
            case PosBasicActionType.CLAIM_REWARD_NO_INPUT:
                const validator = buildDummyValidator(
                    cta.params.params.validatorId,
                    cta.params.params.validatorName
                );

                actions.claimRewardNoInput(
                    props.account,
                    [validator],
                    cta.params.params.tokenSymbol,
                    undefined
                );
                break;

            // case PosBasicActionType.WITHDRAW: {
            //     this.props.withdraw(
            //         this.props.account,
            //         this.props.token.symbol,
            //         this.props.navigation,
            //         {
            //             witdrawIndex: widget?.index,
            //             validatorId: widget?.validator?.id,
            //             validatorName: widget?.validator?.name,
            //             amount: widget?.value
            //         },
            //         undefined
            //     );
            //     break;
            // }

            default:
                break;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.generalFlex}>
                <Text style={styles.firstLineText}>{data[0].firstLine}</Text>
                <Text style={styles.secondLine}>{data[0].secondLine}</Text>
                <Text style={styles.thirdLine}>{data[0].thirdLine}</Text>
            </View>

            <View style={styles.actionButtonContainer}>
                <Button
                    primary={cta.buttonProps?.primary}
                    secondary={cta.buttonProps?.secondary}
                    disabled={cta.buttonProps?.disabled}
                    style={[
                        styles.actionButton,
                        {
                            backgroundColor: cta.buttonProps?.colors.bg,
                            borderColor: cta.buttonProps?.colors.bg
                        }
                    ]}
                    onPress={handleOnPress}
                >
                    <Text style={{ color: cta.buttonProps?.colors.label }}>{cta.label}</Text>
                </Button>
            </View>
        </View>
    );
};

export const ThreeLinesCta = smartConnect<ExternalProps>(ThreeLinesCtaComponent, [
    withTheme(stylesProvider)
]);

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
import { formatDataJSXElements } from '../../utils';

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

            case PosBasicActionType.WITHDRAW: {
                actions.withdraw(
                    props.account,
                    cta.params.params.tokenSymbol,
                    { amount: cta.params.params.amount },
                    undefined
                );
                break;
            }

            default:
                break;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.generalFlex}>
                <View style={styles.row}>
                    {formatDataJSXElements(data[0].firstLine, styles.firstLineText)}
                </View>
                <View style={styles.row}>
                    {formatDataJSXElements(data[0].secondLine, styles.secondLine)}
                </View>
                <View style={styles.row}>
                    {formatDataJSXElements(data[0].thirdLine, styles.thirdLine)}
                </View>
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

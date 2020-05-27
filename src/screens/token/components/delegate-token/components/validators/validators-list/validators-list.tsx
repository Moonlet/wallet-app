import React from 'react';
import { ScrollView } from 'react-native';
import stylesProvider from './styles';
import { IThemeProps, withTheme } from '../../../../../../../core/theme/with-theme';
import { ValidatorCard } from '../validator-card/validator-card';
import { smartConnect } from '../../../../../../../core/utils/smart-connect';
import { IValidator, CardActionType } from '../../../../../../../core/blockchain/types/stats';
import { Blockchain } from '../../../../../../../core/blockchain/types';
import { getBlockchain } from '../../../../../../../core/blockchain/blockchain-factory';
import { formatNumber } from '../../../../../../../core/utils/format-number';
import BigNumber from 'bignumber.js';

interface IExternalProps {
    validators: IValidator[];
    blockchain: Blockchain;
    onSelect: (validator: IValidator) => void;
    actionType: CardActionType;
}

export const ValidatorsListComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const config = getBlockchain(props.blockchain).config;

    return (
        <ScrollView
            contentContainerStyle={props.styles.container}
            showsVerticalScrollIndicator={false}
        >
            {props.validators.map((validator: IValidator, index: number) => (
                <ValidatorCard
                    key={index}
                    icon={validator.icon}
                    leftLabel={validator.name}
                    leftSmallLabel={validator.rank}
                    leftSubLabel={validator.website}
                    rightTitle={config.ui.validator.amountCardLabel}
                    rightSubtitle={formatNumber(new BigNumber(validator.amountDelegated), {
                        currency: config.coin
                    })}
                    actionType={props.actionType}
                    bottomStats={validator.cardStats}
                    actionTypeSelected={validator.actionTypeSelected || false}
                    blockchain={props.blockchain}
                    onSelect={() => props.onSelect(validator)}
                />
            ))}
        </ScrollView>
    );
};

export const ValidatorsList = smartConnect<IExternalProps>(ValidatorsListComponent, [
    withTheme(stylesProvider)
]);

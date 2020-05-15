import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { IThemeProps, withTheme } from '../../../../../../../core/theme/with-theme';
import { ValidatorCard } from '../validator-card/validator-card';
import { smartConnect } from '../../../../../../../core/utils/smart-connect';
import { IValidatorCard } from '../../../../../../../core/blockchain/types/stats';
import { Blockchain } from '../../../../../../../core/blockchain/types';

interface IExternalProps {
    validators: IValidatorCard[];
    blockchain: Blockchain;
}

export const ValidatorsListComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    return (
        <View style={props.styles.container}>
            {props.validators.map((validator: IValidatorCard, index: number) => (
                <ValidatorCard
                    key={index}
                    icon={validator.icon}
                    labelName={validator.labelName}
                    rank={validator.rank}
                    website={validator.website}
                    rightTitle={validator.rightTitle}
                    rightSubtitle={validator.rightSubtitle}
                    actionType={validator.actionType}
                    bottomStats={validator.bottomStats}
                    blockchain={props.blockchain}
                />
            ))}
        </View>
    );
};

export const ValidatorsList = smartConnect<IExternalProps>(ValidatorsListComponent, [
    withTheme(stylesProvider)
]);

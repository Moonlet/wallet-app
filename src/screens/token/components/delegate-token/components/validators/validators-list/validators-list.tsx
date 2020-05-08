import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { IThemeProps, withTheme } from '../../../../../../../core/theme/with-theme';
import { ValidatorCard } from '../validator-card/validator-card';
import { smartConnect } from '../../../../../../../core/utils/smart-connect';
import { IValidatorCardComponent } from '../../../../../../../core/blockchain/types/stats';

interface IExternalProps {
    validators: IValidatorCardComponent[];
}

export const ValidatorsListComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    return (
        <View style={props.styles.container}>
            {props.validators.map((validator: IValidatorCardComponent, index: number) => (
                <ValidatorCard
                    key={index}
                    icon={validator.icon}
                    labelName={validator.labelName}
                    smallLabelName={validator.smallLabelName}
                    website={validator.website}
                    rightTitle={validator.rightTitle}
                    rightSubtitle={validator.rightSubtitle}
                    actionType={validator.actionType}
                    bottomStats={validator.bottomStats}
                />
            ))}
        </View>
    );
};

export const ValidatorsList = smartConnect<IExternalProps>(ValidatorsListComponent, [
    withTheme(stylesProvider)
]);

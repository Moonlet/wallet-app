import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import stylesProvider from './styles';
import { connect } from 'react-redux';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import {
    IScreenModule,
    IAmountInputData,
    IScreenValidation,
    IScreenContext,
    ISmartScreenActions,
    IAmountInputAmountBox,
    IAmountSelectableBoxData
} from '../../types';
import { formatStyles } from '../../utils';
import { Text } from '../../../../library';
import { IReduxState } from '../../../../redux/state';
import { setScreenInputData } from '../../../../redux/ui/screens/input-data/actions';
import { IScreenInputDataValidations } from '../../../../redux/ui/screens/input-data/state';
import isEqual from 'lodash/isEqual';
import { Capitalize } from '../../../../core/utils/format-string';

interface IExternalProps {
    module: IScreenModule;
    context: IScreenContext;
    screenKey: string;
    actions: ISmartScreenActions;
    screenValidation: IScreenValidation;
}

interface IReduxProps {
    inputValidation: IScreenInputDataValidations; // TODO
    amountBox: IAmountInputAmountBox;

    setScreenInputData: typeof setScreenInputData;
}

const mapStateToProps = (state: IReduxState, ownProps: IExternalProps) => {
    return {
        inputValidation: state.ui.screens.inputData[ownProps.screenKey]?.validation,
        amountBox: state.ui.screens.inputData[ownProps.screenKey]?.data?.amountBox
    };
};

const mapDispatchToProps = {
    setScreenInputData
};

class AmountSelectableBoxComponent extends React.Component<
    IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>> & IExternalProps
> {
    public componentDidMount() {
        if (this.props.module?.state?.actions) {
            this.props.actions.runScreenStateActions({
                actions: this.props.module.state.actions,
                context: this.props.context,
                screenKey: this.props.screenKey
            });
        }
    }

    private renderAmountComp(amount: IAmountInputAmountBox, index: number) {
        const { amountBox, styles } = this.props;

        const isSelected = amountBox && isEqual(amountBox, amount);

        let label = '';
        if (amount.type === 'percentage') label = `${amount.value}%`;
        if (amount.type === 'value') {
            if (typeof amount.value === 'number') label = `+${amount.value}`;
            if (typeof amount.value === 'string') label = Capitalize(amount.value);
        }

        return (
            <TouchableOpacity
                key={`amount-comp-${index}`}
                style={[
                    styles.amountComp,
                    isSelected && styles.amountCompSelected,
                    index === 0 && { marginLeft: 0 },
                    index === (this.props.module.data as IAmountInputData).amounts.length - 1 && {
                        marginRight: 0
                    }
                ]}
                activeOpacity={0.8}
                onPress={() => {
                    this.props.setScreenInputData(this.props.screenKey, {
                        amountBox: amount
                    });

                    this.props.actions.handleCta(this.props.module?.cta, {
                        screenKey: this.props.screenKey
                    });
                }}
            >
                <Text style={[styles.amountCompText, isSelected && styles.amountCompTextSelected]}>
                    {label}
                </Text>
            </TouchableOpacity>
        );
    }

    public render() {
        const { module, inputValidation, styles } = this.props;

        const data = module.data as IAmountSelectableBoxData;

        return (
            <View style={[styles.container, formatStyles(module?.style)]}>
                <View style={styles.amountsContainer}>
                    {data.amounts.map((a: IAmountInputAmountBox, index: number) =>
                        this.renderAmountComp(a, index)
                    )}
                </View>

                {(inputValidation?.fieldsErrors?.amount || []).map((fieldError, index: number) => {
                    if (fieldError.type === 'ERROR_MSG') {
                        return (
                            <Text key={`error-${index}`} style={styles.errorText}>
                                {fieldError.message}
                            </Text>
                        );
                    }

                    if (fieldError.type === 'WARN_MSG') {
                        return (
                            <Text key={`error-${index}`} style={styles.warningText}>
                                {fieldError.message}
                            </Text>
                        );
                    }
                })}
            </View>
        );
    }
}

export const AmountSelectableBox = smartConnect<IExternalProps>(AmountSelectableBoxComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);

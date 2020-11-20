import React from 'react';
import { View, TextInput } from 'react-native';
import stylesProvider from './styles';
import { connect } from 'react-redux';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { IScreenModule, IAmountInputData } from '../../types';
import { formatDataJSXElements, formatStyles } from '../../utils';
import { Text } from '../../../../library';
import { IReduxState } from '../../../../redux/state';
import {
    setScreenInputData,
    clearScreenInputData
} from '../../../../redux/ui/screens/input-data/actions';

interface IExternalProps {
    module: IScreenModule;
    screenKey: string;
}

interface IReduxProps {
    inputAmount: string;
    setScreenInputData: typeof setScreenInputData;
    clearScreenInputData: typeof clearScreenInputData;
}

const mapStateToProps = (state: IReduxState, ownProps: IExternalProps) => {
    return {
        inputAmount: ownProps?.screenKey && state.ui.screens.inputData[ownProps.screenKey]?.amount
    };
};

const mapDispatchToProps = {
    setScreenInputData,
    clearScreenInputData
};

class AmountInputComponent extends React.Component<
    IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>> & IExternalProps
> {
    public componentDidMount() {
        this.props.clearScreenInputData(this.props.screenKey, { amount: '' });
    }

    public render() {
        const { inputAmount, module, screenKey, styles, theme } = this.props;
        const data = module.data as IAmountInputData;

        // console.log('data: ', data);
        // console.log('amount: ', inputAmount);

        return (
            <View style={[styles.container, formatStyles(module?.style)]}>
                <View style={[styles.inputBox, formatStyles(data?.input?.style)]}>
                    <TextInput
                        testID="enter-amount"
                        style={styles.inputText}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        selectionColor={theme.colors.accent}
                        value={inputAmount}
                        onChangeText={text => {
                            text = text.replace(/,/g, '.');
                            this.props.setScreenInputData(screenKey, text, 'amount');
                        }}
                        keyboardType="decimal-pad"
                        returnKeyType="done"
                        // TODO: maxLength - max 8 decimals: 0.00000000
                    />
                </View>

                {data?.label && (
                    <View style={styles.row}>
                        {formatDataJSXElements(data.label, styles.label)}
                        {/* TODO */}
                        <Text style={styles.amountText}>{`100,000.00 ZIL`}</Text>
                    </View>
                )}

                <Text style={styles.errorText}>{`insufficientFundsNotice`}</Text>

                <Text style={styles.warningText}>
                    {`insufficientFundsNotice insufficientFundsNotice insufficientFundsNotice insufficientFundsNotice`}
                </Text>
            </View>
        );
    }
}

export const AmountInput = smartConnect<IExternalProps>(AmountInputComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);

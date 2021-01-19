import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { connect } from 'react-redux';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { IScreenModule, IScreenValidation, IScreenContext, ISmartScreenActions } from '../../types';
import { formatStyles } from '../../utils';
import { Text } from '../../../../library';
import { IReduxState } from '../../../../redux/state';
import { IScreenInputDataValidations } from '../../../../redux/ui/screens/input-data/state';

interface IExternalProps {
    module: IScreenModule;
    context: IScreenContext;
    screenKey: string;
    actions: ISmartScreenActions;
    screenValidation: IScreenValidation;
}

interface IReduxProps {
    inputValidation: IScreenInputDataValidations;
}

const mapStateToProps = (state: IReduxState, ownProps: IExternalProps) => {
    return {
        inputValidation: state.ui.screens.inputData[ownProps.screenKey]?.validation
    };
};

class ValidationsModuleComponent extends React.Component<
    IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>> & IExternalProps
> {
    public render() {
        const { inputValidation, module, styles } = this.props;

        return (
            <View style={[styles.container, formatStyles(module?.style)]}>
                {Object.keys(inputValidation?.fieldsErrors || []).map((fieldName: string) =>
                    inputValidation?.fieldsErrors[fieldName].map((fieldError, index: number) => {
                        // Error Messages
                        if (fieldError.type === 'ERROR_MSG') {
                            return (
                                <Text key={`error-${index}`} style={styles.errorText}>
                                    {fieldError.message}
                                </Text>
                            );
                        }

                        // Warning Messages
                        if (fieldError.type === 'WARN_MSG') {
                            return (
                                <Text key={`error-${index}`} style={styles.warningText}>
                                    {fieldError.message}
                                </Text>
                            );
                        }
                    })
                )}
            </View>
        );
    }
}

export const ValidationsModule = smartConnect<IExternalProps>(ValidationsModuleComponent, [
    connect(mapStateToProps, null),
    withTheme(stylesProvider)
]);

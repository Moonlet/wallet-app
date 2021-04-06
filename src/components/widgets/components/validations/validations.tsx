import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { connect } from 'react-redux';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import {
    IScreenModule,
    IScreenValidation,
    IScreenContext,
    ISmartScreenActions,
    IValidationData
} from '../../types';
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
    private renderFieldErrorMessage(fieldError, index) {
        const { styles } = this.props;

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
    }

    public render() {
        const { inputValidation, module, styles } = this.props;

        const data = module.data as IValidationData;

        const containerStyle = [styles.container, formatStyles(module?.style)];

        if (data?.fieldName) {
            if (inputValidation?.fieldsErrors && inputValidation?.fieldsErrors[data.fieldName]) {
                // Render custom field error
                return (
                    <View style={containerStyle}>
                        {inputValidation?.fieldsErrors[data.fieldName].map(
                            (fieldError, index: number) => {
                                return this.renderFieldErrorMessage(fieldError, index);
                            }
                        )}
                    </View>
                );
            } else return <View style={containerStyle} />;
        } else {
            // Render all field errors
            return (
                <View style={containerStyle}>
                    {Object.keys(inputValidation?.fieldsErrors || []).map((fieldName: string) =>
                        (inputValidation?.fieldsErrors[fieldName] || []).map(
                            (fieldError, index: number) => {
                                return this.renderFieldErrorMessage(fieldError, index);
                            }
                        )
                    )}
                </View>
            );
        }
    }
}

export const ValidationsModule = smartConnect<IExternalProps>(ValidationsModuleComponent, [
    connect(mapStateToProps, null),
    withTheme(stylesProvider)
]);

import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import stylesProvider from './styles';
import { connect } from 'react-redux';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { IScreenModule, IScreenContext, ISmartScreenActions, ISearchData } from '../../types';
import { formatStyles } from '../../utils';
import { IReduxState } from '../../../../redux/state';
import { setScreenInputData } from '../../../../redux/ui/screens/input-data/actions';
import { getStateSelectors } from '../ui-state-selectors/index';
import Icon from '../../../icon/icon';
import { IconValues } from '../../../icon/values';
import { normalize } from '../../../../styles/dimensions';
import { translate } from '../../../../core/i18n';
import { Text } from '../../../../library';
import { handleCta } from '../../../../redux/ui/screens/data/handle-cta';
import { NavigationService } from '../../../../navigation/navigation-service';
import { renderModules } from '../../render-module';
import { ApiClient } from '../../../../core/utils/api-client/api-client';
import { captureException as SentryCaptureException } from '@sentry/react-native';

interface IExternalProps {
    module: IScreenModule;
    context: IScreenContext;
    actions: ISmartScreenActions;
    options: {
        screenKey?: string;
        flowId?: string;
    };
}

interface IReduxProps {
    search: {
        input: string;
        result: IScreenModule[];
    };
    testnet: boolean;
    setScreenInputData: typeof setScreenInputData;
}

const mapStateToProps = (state: IReduxState, ownProps: IExternalProps) => {
    const screenKey = ownProps?.options?.screenKey;

    return {
        search: screenKey && state.ui.screens.inputData[screenKey]?.data?.search,
        testnet: state.preferences.testNet,

        ...getStateSelectors(state, ownProps.module, {
            screenKey,
            flowId: ownProps.context?.flowId
        })
    };
};

const mapDispatchToProps = {
    setScreenInputData
};

interface IState {
    apiClient: ApiClient;
}

class SearchComponent extends React.Component<
    IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>> & IExternalProps,
    IState
> {
    private textInputRef: any;

    constructor(
        props: IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>> & IExternalProps
    ) {
        super(props);
        this.state = {
            apiClient: new ApiClient()
        };
    }

    public componentDidMount() {
        this.clearInput();

        if ((this.props.module.data as ISearchData)?.focus) {
            this.textInputRef?.focus();
        }
    }

    public componentDidUpdate(prevProps: IExternalProps & IReduxProps) {
        if (this.props.search?.input !== prevProps.search?.input) {
            const input = this.props.search?.input;
            if (input && input.length >= 3) {
                this.fetchSearchInput(input);
            }
        }
    }

    private async fetchSearchInput(input: string) {
        try {
            // isLoading

            const searchResult = await this.state.apiClient.http.post('/walletUi/search', {
                type: (this.props.module.data as ISearchData).type,
                input,
                options: {
                    testnet: this.props.testnet,
                    flowId: this.props.options?.flowId
                }
            });

            const result = searchResult?.result?.data;

            this.props.setScreenInputData(this.props.options?.screenKey, {
                search: {
                    ...this.props.search,
                    result
                }
            });
        } catch (error) {
            SentryCaptureException(new Error(JSON.stringify(error)));
        }
    }

    private clearInput() {
        if (this.props.options?.screenKey) {
            this.props.actions.clearScreenInputData(this.props.options.screenKey, {
                search: undefined
            });
        }
    }

    public render() {
        const { module, search, styles, theme } = this.props;

        const input = search?.input || '';

        const data = module.data as ISearchData;

        return (
            <View style={formatStyles(module?.style)}>
                <View style={styles.row}>
                    <View style={[styles.inputBox, formatStyles(data?.input?.style)]}>
                        <Icon
                            name={data?.search?.icon || IconValues.SEARCH}
                            size={normalize(16)}
                            style={[formatStyles(data?.search?.style), styles.searchIcon]}
                        />

                        <TextInput
                            testID="enter-search"
                            ref={ref => (this.textInputRef = ref)}
                            style={[styles.inputText, formatStyles(data?.input?.textStyle)]}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            selectionColor={theme.colors.accent}
                            placeholder={data?.placeholder?.value}
                            placeholderTextColor={
                                data?.placeholder?.color || theme.colors.textTertiary
                            }
                            value={input}
                            onChangeText={text => {
                                this.props.setScreenInputData(this.props.options?.screenKey, {
                                    search: {
                                        ...this.props.search,
                                        input: text
                                    }
                                });
                            }}
                            returnKeyType="done"
                        />
                    </View>
                    {data?.cancel && (
                        <TouchableOpacity
                            style={styles.cancelContainer}
                            onPress={() => {
                                if (data?.cancel?.cta) {
                                    handleCta(data.cancel.cta);
                                } else {
                                    NavigationService.goBack();
                                }
                            }}
                        >
                            <Text style={[styles.cancel, formatStyles(data?.cancel?.style)]}>
                                {translate('App.labels.cancel')}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {(!this.props.search?.input || this.props.search?.input === '') &&
                    renderModules(
                        data.initialStateData,
                        this.props.context,
                        this.props.actions,
                        this.props.options
                    )}

                {this.props.search?.input !== '' &&
                    this.props.search?.result &&
                    renderModules(
                        this.props.search.result,
                        this.props.context,
                        this.props.actions,
                        this.props.options
                    )}
            </View>
        );
    }
}

export const SearchModule = smartConnect<IExternalProps>(SearchComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);

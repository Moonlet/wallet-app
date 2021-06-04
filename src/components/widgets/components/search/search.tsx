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
        result: any;
    };
    setScreenInputData: typeof setScreenInputData;
}

const mapStateToProps = (state: IReduxState, ownProps: IExternalProps) => {
    const screenKey = ownProps?.options?.screenKey;

    return {
        search: screenKey && state.ui.screens.inputData[screenKey]?.data?.search,

        ...getStateSelectors(state, ownProps.module, {
            screenKey,
            flowId: ownProps.context?.flowId
        })
    };
};

const mapDispatchToProps = {
    setScreenInputData
};

class SearchComponent extends React.Component<
    IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>> & IExternalProps
> {
    private textInputRef: any;

    private clearInput() {
        if (this.props.options?.screenKey) {
            this.props.actions.clearScreenInputData(this.props.options.screenKey, {
                search: undefined
            });
        }
    }

    public componentDidMount() {
        this.clearInput();

        if ((this.props.module.data as ISearchData)?.focus) {
            this.textInputRef?.focus();
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

                {renderModules(
                    data.initialStateData,
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

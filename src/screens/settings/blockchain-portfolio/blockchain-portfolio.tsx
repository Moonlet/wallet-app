import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { INavigationProps } from '../../../navigation/with-navigation-params';
import { Text } from '../../../library';
import { IReduxState } from '../../../redux/state';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import { Icon } from '../../../components/icon';
import { smartConnect } from '../../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { translate } from '../../../core/i18n';
import { INetworksOptions } from '../../../redux/app/state';
import { themes } from '../../../navigation/navigation';
import DraggableFlatList from 'react-native-draggable-flatlist';

export interface IReduxProps {
    networks: INetworksOptions;
}

const mapDispatchToProps = {};

const mapStateToProps = (state: IReduxState) => ({
    networks: state.app.networks
});

interface IState {
    networks: string[];
}

const navigationOptions = ({ theme }: any) => ({
    title: translate('Settings.blockchainPortfolio'),
    headerStyle: {
        backgroundColor: themes[theme].colors.header
    }
});

export class BlockchainPortfolioComponent extends React.Component<
    INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static navigationOptions = navigationOptions;

    constructor(
        props: INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);

        this.state = {
            networks: Object.keys(this.props.networks)
        };
    }

    public renderNetwork = ({ item, index, move, moveEnd, isActive }: any) => {
        const { styles, theme } = this.props;
        const isChecked = true;

        return (
            <View>
                <View style={styles.rowContainer}>
                    <Text style={styles.blockchainName}>{item}</Text>
                    <TouchableOpacity
                        onPress={() => {
                            // toggle is checked
                        }}
                    >
                        <Icon
                            size={18}
                            name={isChecked ? 'check-2-thicked' : 'check-2'}
                            style={[
                                styles.checkIcon,
                                {
                                    color: isChecked
                                        ? theme.colors.accent
                                        : theme.colors.textSecondary
                                }
                            ]}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onLongPress={move} onPressOut={moveEnd}>
                        <Icon size={18} name="navigation-menu" style={styles.menuIcon} />
                    </TouchableOpacity>
                </View>
                <View style={styles.divider} />
            </View>
        );
    };

    public render() {
        const { styles } = this.props;

        return (
            <View style={styles.container}>
                <DraggableFlatList
                    data={this.state.networks}
                    renderItem={this.renderNetwork}
                    keyExtractor={(item: string, index: number) => `draggable-item-${index}`}
                    scrollPercent={5}
                    onMoveEnd={({ data }) => this.setState({ networks: data })}
                />
            </View>
        );
    }
}

export const BlockchainPortfolioScreen = smartConnect(BlockchainPortfolioComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);

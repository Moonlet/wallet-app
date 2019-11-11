import React from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';
import stylesProvider from './styles';
import { withTheme } from '../../../../core/theme/with-theme';
// import { Button } from '../../../library/button/button';
import { Icon } from '../../../../components/icon';
import { ITheme } from '../../../../core/theme/itheme';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { Text } from '../../../../library';
import { translate } from '../../../../core/i18n';
import { HeaderLeft } from '../../../../components/header-left/header-left';
import { HeaderRight } from '../../../../components/header-right/header-right';
// import { withNavigationParams, INavigationProps } from '../../navigation/withNavigation';

export interface IProps {
    styles: ReturnType<typeof stylesProvider>;
    theme: ITheme;
}

export interface IExternalProps {
    onDonePressed: () => any;
}

interface IState {
    showKeyScreen: boolean;
    showBackButton: boolean;
}

export class AccountSettingsComponent extends React.Component<IProps & IExternalProps, IState> {
    constructor(props: IProps & IExternalProps) {
        super(props);

        this.state = {
            showKeyScreen: true,
            showBackButton: false
        };
    }

    public revealPrivateKey = () => {
        //
    };
    public revealPublicKey = () => {
        //
    };
    public viewOnViewBlock = () => {
        //
    };
    public reportIssue = () => {
        //
    };

    public render() {
        const styles = this.props.styles;

        return (
            <Modal animationType="fade" transparent={true} visible={true}>
                <View style={styles.container}>
                    <View style={styles.modalContainer}>
                        <View style={styles.header}>
                            {this.state.showKeyScreen ? (
                                <HeaderLeft
                                    icon="arrow-left-1"
                                    text={translate('App.buttons.back')}
                                    onPress={() => {
                                        this.setState({
                                            showKeyScreen: false,
                                            showBackButton: false
                                        });
                                    }}
                                />
                            ) : null}
                            <Text style={styles.title}>
                                {translate('AccounSettings.manageAccount')}
                            </Text>
                            <HeaderRight
                                text={translate('App.buttons.done')}
                                style={styles.headerButton}
                                onPress={() => {
                                    this.props.onDonePressed();
                                }}
                            />
                        </View>
                        <View style={styles.contentContainer}>
                            <TouchableOpacity
                                testID="private-key"
                                style={styles.rowContainer}
                                onPress={this.revealPrivateKey}
                            >
                                <View style={styles.leftIcon}>
                                    <Icon name="key" size={24} style={styles.icon} />
                                </View>
                                <Text style={styles.textRow}>
                                    {translate('AccounSettings.revealPrivate')}
                                </Text>
                                <View style={styles.rightIcon}>
                                    <Icon name="arrow-right-1" size={16} style={styles.icon} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                testID="public-key"
                                style={styles.rowContainer}
                                onPress={this.revealPrivateKey}
                            >
                                <View style={styles.leftIcon}>
                                    <Icon name="eye" size={24} style={styles.icon} />
                                </View>
                                <Text style={styles.textRow}>
                                    {translate('AccounSettings.revealPublic')}
                                </Text>
                                <View style={styles.rightIcon}>
                                    <Icon name="arrow-right-1" size={16} style={styles.icon} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                testID="view-on"
                                style={styles.rowContainer}
                                onPress={this.viewOnViewBlock}
                            >
                                <View style={styles.leftIcon}>
                                    <Icon name="search" size={24} style={styles.icon} />
                                </View>
                                <Text style={styles.textRow}>
                                    {translate('AccounSettings.viewOn')}
                                </Text>
                                <View style={styles.rightIcon}>
                                    <Icon name="arrow-right-1" size={16} style={styles.icon} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                testID="report-issue"
                                style={styles.rowContainer}
                                onPress={this.viewOnViewBlock}
                            >
                                <View style={styles.leftIcon}>
                                    <Icon name="bug" size={24} style={styles.icon} />
                                </View>
                                <Text style={styles.textRow}>
                                    {translate('AccounSettings.reportIssue')}
                                </Text>
                                <View style={styles.rightIcon}>
                                    <Icon name="arrow-right-1" size={16} style={styles.icon} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

export const AccountSettings = smartConnect(AccountSettingsComponent, [withTheme(stylesProvider)]);

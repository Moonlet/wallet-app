import React from 'react';
import { View, TouchableOpacity, Clipboard } from 'react-native';
import stylesProvider from './styles';
import { withTheme } from '../../../../core/theme/with-theme';
// import { Button } from '../../../library/button/button';
import { Icon } from '../../../../components/icon';
import { ITheme } from '../../../../core/theme/itheme';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { Text } from '../../../../library';
import { translate } from '../../../../core/i18n';
// import { withNavigationParams, INavigationProps } from '../../navigation/withNavigation';

export interface IProps {
    styles: ReturnType<typeof stylesProvider>;
    theme: ITheme;
}

export interface IExternalProps {
    key: string;
}

interface IState {
    copied: boolean;
}

export class ViewKeyComponent extends React.Component<IProps & IExternalProps, IState> {
    constructor(props: IProps & IExternalProps) {
        super(props);

        this.state = {
            copied: false
        };
    }

    public render() {
        const styles = this.props.styles;

        return (
            <View style={styles.container}>
                <View style={styles.modalContainer}>
                    <View style={styles.contentContainer}>
                        <Text style={styles.textRow}>{this.props.key}</Text>

                        <View style={styles.divider} />
                        <TouchableOpacity
                            testID="copy-clipboard"
                            style={styles.rowContainer}
                            onPress={() => {
                                Clipboard.setString(this.props.key);
                                this.setState({ copied: true });
                            }}
                        >
                            <View style={styles.leftIcon}>
                                <Icon name="copy" size={24} style={styles.icon} />
                            </View>
                            <Text style={styles.textRow}>
                                {' '}
                                {this.state.copied === false
                                    ? translate('App.buttons.clipboardBtn')
                                    : translate('App.buttons.copiedBtn')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

export const ViewKey = smartConnect(ViewKeyComponent, [withTheme(stylesProvider)]);

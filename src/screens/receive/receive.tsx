import React from 'react';
import { View, Clipboard } from 'react-native';
import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import { Button } from '../../library/button/button';
import { ITheme } from '../../core/theme/itheme';
import { smartConnect } from '../../core/utils/smart-connect';
import { HeaderLeft } from '../../components/header-left/header-left';
import { Text } from '../../library';
import { translate } from '../../core/i18n';
import QRCode from 'react-native-qrcode-svg';
// import { withNavigationParams, INavigationProps } from '../../navigation/withNavigation';

export interface IProps {
    styles: ReturnType<typeof stylesProvider>;
    theme: ITheme;
}
// export interface INavigationParams {
//     address: string;
// }

interface IState {
    copied: boolean;
    address: string;
}

const navigationOptions = ({ navigation }: any) => ({
    headerLeft: () => {
        return (
            <HeaderLeft
                icon="close"
                text="Close"
                onPress={() => {
                    navigation.goBack();
                }}
            />
        );
    },
    title: 'Receive'
});
export class ReceiveScreenComponent extends React.Component<IProps, IState> {
    public static navigationOptions = navigationOptions;

    constructor(props: IProps) {
        super(props);

        this.state = {
            copied: false,
            address: 'q345234tq'
        };
    }

    public render() {
        const styles = this.props.styles;

        return (
            <View style={styles.container}>
                <Text style={styles.address}>Reusable component</Text>
                <View style={styles.qrcode}>
                    <QRCode value={this.state.address} size={300} />
                </View>
                <View style={styles.bottom}>
                    <Button
                        testID="copy-clipboard"
                        style={styles.bottomButton}
                        primary
                        onPress={() => {
                            Clipboard.setString(this.state.address);
                            this.setState({ copied: true });
                        }}
                    >
                        {this.state.copied === false
                            ? translate('App.buttons.clipboardBtn')
                            : translate('App.buttons.copiedBtn')}
                    </Button>
                </View>
            </View>
        );
    }
}

export const ReceiveScreen = smartConnect(ReceiveScreenComponent, [withTheme(stylesProvider)]);

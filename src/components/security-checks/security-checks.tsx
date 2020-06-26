import React from 'react';
import DeviceInfo from 'react-native-device-info';
import { NativeModules, Text, View, Platform } from 'react-native';
import Modal from '../../library/modal/modal';
import { Deferred } from '../../core/utils/deferred';
import { Button } from '../../library';
import { translate, Translate } from '../../core/i18n';
import { smartConnect } from '../../core/utils/smart-connect';
import { SafeAreaView } from 'react-navigation';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import SpyImage from '../../assets/images/svg/spy.svg';
import stylesProvider from './styles';
import { SmartImage, ResizeMode } from '../../library/image/smart-image';

const { JailMonkey } = NativeModules;

interface IExternalProps {
    onReady?: () => void;
}

interface IState {
    modalVisible: boolean;
    warningType: SecurityWarningType;
}

type SecurityWarningType = 'emulator' | 'jailBreak' | 'debugged' | 'hookDetected';

export class SecurityChecksComponent extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    private modalOnHideDeffered: Deferred;
    constructor(props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);

        this.state = {
            modalVisible: false,
            warningType: undefined
        };

        !__DEV__ && this.doChecks();
    }

    public componentDidMount() {
        if (__DEV__) {
            typeof this.props.onReady === 'function' && this.props.onReady();
        }
    }

    private async doChecks() {
        let shouldDisplayWarning = false;
        let warningType: SecurityWarningType;

        if (Platform.OS !== 'web') {
            const jailMonkey = await JailMonkey.getConstants();

            if (DeviceInfo.isEmulatorSync()) {
                shouldDisplayWarning = true;
                warningType = 'emulator';
            } else if (jailMonkey.isJailBroken) {
                shouldDisplayWarning = true;
                warningType = 'jailBreak';
            } else if (jailMonkey.isDebuggedMode) {
                shouldDisplayWarning = true;
                warningType = 'debugged';
            } else if (jailMonkey.hookDetected) {
                shouldDisplayWarning = true;
                warningType = 'hookDetected';
            }
        }

        if (shouldDisplayWarning) {
            this.setState({ modalVisible: true, warningType });
        } else {
            typeof this.props.onReady === 'function' && this.props.onReady();
        }
    }

    private continue() {
        this.modalOnHideDeffered = new Deferred();
        this.setState(
            {
                modalVisible: false
            },
            async () => {
                await this.modalOnHideDeffered.promise;
                typeof this.props.onReady === 'function' && this.props.onReady();
            }
        );
    }

    public render() {
        const { styles, theme } = this.props;

        if (Platform.OS === 'web') return null;

        return (
            <Modal
                isVisible={this.state.modalVisible}
                animationInTiming={5}
                animationOutTiming={5}
                onModalHide={() => this.modalOnHideDeffered?.resolve()}
            >
                <SafeAreaView forceInset={{ bottom: 'never' }} style={styles.container}>
                    <View style={styles.content}>
                        <Text style={[styles.textStyle, styles.title]}>
                            {translate('SecurityChecks.title')}
                        </Text>

                        <View style={styles.imageContainerStyle}>
                            <SmartImage
                                resizeMode={ResizeMode.contain}
                                source={{ iconComponent: SpyImage }}
                                style={styles.imageStyle}
                            />
                            <Text style={[styles.textStyle, styles.message]}>
                                {translate(
                                    `SecurityChecks.${Platform.OS}.${this.state.warningType}`
                                )}
                            </Text>
                            <Text style={[styles.textStyle, styles.warning]}>
                                {translate('SecurityChecks.ownRisk')}
                            </Text>
                        </View>

                        <Button
                            testID="button-understand"
                            wrapperStyle={styles.bottomButton}
                            primary
                            onPress={() => this.continue()}
                        >
                            <Translate
                                text="App.labels.continue"
                                style={{ color: theme.colors.appBackground }}
                            />
                        </Button>
                    </View>
                </SafeAreaView>
            </Modal>
        );
    }
}

export const SecurityChecks = smartConnect<IExternalProps>(SecurityChecksComponent, [
    withTheme(stylesProvider)
]);

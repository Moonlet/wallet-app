import React from 'react';
import { View, ScrollView } from 'react-native';
import { IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { Text, Button } from '../../library';
import { translate } from '../../core/i18n';
import { Deferred } from '../../core/utils/deferred';
import { setInstance, waitForInstance } from '../../core/utils/class-registry';
import { IScreenModule } from '../widgets/types';
import { renderModule } from '../widgets/render-module';

interface IState {
    isVisible: boolean;
    message: string | IScreenModule;
}

export class InfoModalComponent extends React.Component<
    IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    private resultDeferred: Deferred;

    constructor(props: IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);
        setInstance(InfoModalComponent, this);
        this.state = {
            isVisible: false,
            message: undefined
        };
    }

    public static async open(message?: string | IScreenModule) {
        return waitForInstance<InfoModalComponent>(InfoModalComponent).then(ref =>
            ref.open(message)
        );
    }

    public static async close() {
        return waitForInstance<InfoModalComponent>(InfoModalComponent).then(ref => ref.close());
    }

    private open(message: string | IScreenModule) {
        this.resultDeferred = new Deferred();
        this.setState({ isVisible: true, message }, () => {
            this.resultDeferred?.resolve();
        });
        return this.resultDeferred.promise;
    }

    private close() {
        this.resultDeferred = new Deferred();
        this.setState({ isVisible: false, message: undefined }, () => {
            this.resultDeferred?.resolve();
        });
        return this.resultDeferred.promise;
    }

    public render() {
        const { styles } = this.props;
        const { message } = this.state;

        if (this.state.isVisible) {
            // maybe find a better way to handle this
            const msgJSX =
                typeof message === 'string' ? (
                    <Text style={styles.message}>{message}</Text>
                ) : (
                    renderModule(message, undefined)
                );

            return (
                <View style={styles.wrapper}>
                    <View style={styles.container}>
                        <ScrollView
                            contentContainerStyle={styles.scrollView}
                            showsVerticalScrollIndicator={false}
                        >
                            {msgJSX}
                        </ScrollView>
                        <Button onPress={() => this.close()}>
                            {translate('App.labels.close')}
                        </Button>
                    </View>
                </View>
            );
        } else {
            return null;
        }
    }
}

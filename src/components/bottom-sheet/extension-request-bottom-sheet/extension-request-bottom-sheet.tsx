import React from 'react';
import { View, Platform } from 'react-native';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../../core/utils/smart-connect';
import BottomSheet from 'reanimated-bottom-sheet';
import { Icon } from '../../icon/icon';
import { Text } from '../../../library';
import { translate } from '../../../core/i18n';
import { ICON_SIZE } from '../../../styles/dimensions';
import { BottomSheetHeader } from '../header/header';
import { LoadingIndicator } from '../../loading-indicator/loading-indicator';
import { IBottomSheetExtensionRequestData } from '../../../redux/ui/bottomSheet/state';
import { IconValues } from '../../icon/values';

interface IExternalProps {
    snapPoints: { initialSnap: number; bottomSheetHeight: number };
    onClose: () => void;
    data: IBottomSheetExtensionRequestData;
}

export class ExtensionRequestBottomSheetComponent extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public bottomSheet: any;
    public qrCodeScanner: any;

    constructor(props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);
        this.bottomSheet = React.createRef();
    }

    public componentDidMount() {
        Platform.OS !== 'web' && this.bottomSheet.current.snapTo(1);
    }

    public renderBottomSheetContent() {
        const { styles } = this.props;

        return (
            <View style={[styles.content, { height: this.props.snapPoints.bottomSheetHeight }]}>
                <View style={styles.rowContainer}>
                    <View style={styles.iconContainer}>
                        <Icon
                            name={IconValues.ARROW_RIGHT_DASH}
                            size={ICON_SIZE}
                            style={styles.icon}
                        />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{this.props.data?.mainText}</Text>
                        <Text style={styles.description}>{this.props.data?.secondaryText}</Text>
                    </View>
                </View>
                <View>
                    <Text style={styles.info}>{translate('Extension.appRequestInfo')}</Text>
                </View>
                <View key="loading" style={styles.loadingContainer}>
                    {this.props.data?.state === 'pending' && <LoadingIndicator />}
                    {this.props.data?.state === 'completed' && (
                        <Icon name={IconValues.CHECK} size={ICON_SIZE} style={styles.icon} />
                    )}
                    {this.props.data?.state === 'rejected' && (
                        <Icon name={IconValues.WARNING} size={ICON_SIZE} style={styles.icon} />
                    )}
                </View>
            </View>
        );
    }

    public render() {
        return (
            <BottomSheet
                ref={this.bottomSheet}
                initialSnap={0}
                snapPoints={[
                    this.props.snapPoints.initialSnap,
                    this.props.snapPoints.bottomSheetHeight
                ]}
                renderContent={() => this.renderBottomSheetContent()}
                renderHeader={() => (
                    <BottomSheetHeader
                        obRef={this.bottomSheet}
                        onClose={() => this.props.onClose()}
                    />
                )}
                enabledInnerScrolling={false}
                onCloseEnd={() => this.props.onClose()}
            />
        );
    }
}

export const ExtensionRequestBottomSheet = smartConnect<IExternalProps>(
    ExtensionRequestBottomSheetComponent,
    [withTheme(stylesProvider)]
);

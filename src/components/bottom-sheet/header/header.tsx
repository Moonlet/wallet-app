import React from 'react';
import { smartConnect } from '../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import stylesProvider from './styles';
import { Icon } from '../../icon';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { ICON_SIZE } from '../../../styles/dimensions';

interface IExternalProps {
    obRef: any;
}

export class BottomSheetHeaderComponent extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public render() {
        return (
            <TouchableWithoutFeedback
                onPress={() => this.props.obRef.current.snapTo(0)}
                style={this.props.styles.header}
            >
                <Icon name="chevron-up" size={ICON_SIZE / 2} style={this.props.styles.icon} />
            </TouchableWithoutFeedback>
        );
    }
}

export const BottomSheetHeader = smartConnect<IExternalProps>(BottomSheetHeaderComponent, [
    withTheme(stylesProvider)
]);

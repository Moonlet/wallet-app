import React from 'react';
import { smartConnect } from '../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import stylesProvider from './styles';
import { Icon } from '../../icon/icon';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { ICON_SIZE } from '../../../styles/dimensions';
import { Platform } from 'react-native';
import { IconValues } from '../../icon/values';

interface IExternalProps {
    obRef: any;
    onClose: () => void;
}

export const BottomSheetHeaderComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    return (
        <TouchableWithoutFeedback
            onPress={() => {
                Platform.OS !== 'web' && props.obRef.current.snapTo(0);
                props.onClose();
            }}
            style={props.styles.header}
        >
            <Icon name={IconValues.CHEVRON_UP} size={ICON_SIZE / 2} style={props.styles.icon} />
        </TouchableWithoutFeedback>
    );
};

export const BottomSheetHeader = smartConnect<IExternalProps>(BottomSheetHeaderComponent, [
    withTheme(stylesProvider)
]);

import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { Button } from '../../library';
import { smartConnect } from '../../core/utils/smart-connect';
import { normalize } from '../../styles/dimensions';

export interface IExternalProps {
    children?: any;
    ctaStlye?: any;
    label: string;
    disabled: boolean;
    onPress: () => void;
}

export const BottomCtaComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const { styles } = props;

    return (
        <View style={styles.wrapper}>
            <View style={styles.divider} />
            <View style={styles.container}>
                <View style={styles.bottomTextContainer}>
                    {/* Children */}
                    {props.children}
                </View>
                <View style={styles.buttonContainer}>
                    <Button
                        testID={props.label.toLocaleLowerCase()}
                        style={{ width: normalize(140) }}
                        primary
                        disabled={props.disabled}
                        onPress={() => props.onPress()}
                    >
                        {props.label}
                    </Button>
                </View>
            </View>
        </View>
    );
};

export const BottomCta = smartConnect<IExternalProps>(BottomCtaComponent, [
    withTheme(stylesProvider)
]);

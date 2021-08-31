import React from 'react';
import { View } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { IButtonCTA } from '../../core/blockchain/types/token';
import { Button } from '../../library';
import { BORDER_RADIUS } from '../../styles/dimensions';
import { NavigationService } from '../../navigation/navigation-service';
import { translate } from '../../core/i18n/translation/translate';
import { Blockchain } from '../../core/blockchain/types';
import { ITokenState } from '../../redux/wallets/state';
import { IValidator } from '../../core/blockchain/types/stats';
import { Dialog } from '../dialog/dialog';
import { isFeatureActive, RemoteFeature } from '../../core/utils/remote-feature-config';

export interface INavParams {
    accountIndex: number;
    blockchain: Blockchain;
    token: ITokenState;
    validators: IValidator[];
    canPerformAction: boolean;
}

export interface IExternalProps {
    mainCta: IButtonCTA;
    otherCtas?: IButtonCTA[];
    params: INavParams;
}

export const CtaGroupComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    return (
        <View style={props.styles.container}>
            {props?.otherCtas && (
                <View style={props.styles.topContainer}>
                    {props.otherCtas.length === 1 ? (
                        <Button
                            leftIcon={props.otherCtas[0].iconName}
                            onPress={() => {
                                if (
                                    props.params.canPerformAction ||
                                    isFeatureActive(RemoteFeature.IMPROVED_NONCE)
                                ) {
                                    NavigationService.navigate(
                                        props.otherCtas[0].navigateTo.screen,
                                        {
                                            ...props.otherCtas[0].navigateTo.params,
                                            ...props.params
                                        },
                                        props.otherCtas[0].navigateTo?.params?.context?.key
                                    );
                                } else {
                                    Dialog.alert(
                                        translate('Validator.cannotInitiateTxTitle'),
                                        translate('Validator.cannotInitiateTxMessage'),
                                        undefined,
                                        {
                                            text: translate('App.labels.ok'),
                                            onPress: () =>
                                                NavigationService.navigate('TransactonsHistory', {})
                                        }
                                    );
                                }
                            }}
                            wrapperStyle={{ width: '100%' }}
                        >
                            {translate(props.otherCtas[0].title)}
                        </Button>
                    ) : (
                        props.otherCtas.map((cta: IButtonCTA, index: number) => (
                            <Button
                                key={`cta-${index}`}
                                leftIcon={cta.iconName}
                                onPress={() => {
                                    if (
                                        props.params.canPerformAction ||
                                        isFeatureActive(RemoteFeature.IMPROVED_NONCE)
                                    ) {
                                        NavigationService.navigate(
                                            cta.navigateTo.screen,
                                            {
                                                ...cta.navigateTo.params,
                                                ...props.params
                                            },
                                            props.mainCta?.navigateTo?.params?.context?.key
                                        );
                                    } else {
                                        Dialog.alert(
                                            translate('Validator.cannotInitiateTxTitle'),
                                            translate('Validator.cannotInitiateTxMessage'),
                                            undefined,
                                            {
                                                text: translate('App.labels.ok'),
                                                onPress: () =>
                                                    NavigationService.navigate(
                                                        'TransactonsHistory',
                                                        {}
                                                    )
                                            }
                                        );
                                    }
                                }}
                                bottomLabel={translate(cta.title)}
                                style={{ borderRadius: BORDER_RADIUS + BORDER_RADIUS / 2 }}
                            />
                        ))
                    )}
                </View>
            )}
            <Button
                primary
                leftIcon={props.mainCta.iconName}
                onPress={() => {
                    if (
                        props.params.canPerformAction ||
                        isFeatureActive(RemoteFeature.IMPROVED_NONCE)
                    ) {
                        NavigationService.navigate(
                            props.mainCta.navigateTo.screen,
                            {
                                ...props.mainCta.navigateTo.params,
                                ...props.params
                            },
                            props.mainCta?.navigateTo?.params?.context?.key
                        );
                    } else {
                        Dialog.alert(
                            translate('Validator.cannotInitiateTxTitle'),
                            translate('Validator.cannotInitiateTxMessage'),
                            undefined,
                            {
                                text: translate('App.labels.ok'),
                                onPress: () => NavigationService.navigate('TransactonsHistory', {})
                            }
                        );
                    }
                }}
            >
                {translate(props.mainCta.title)}
            </Button>
        </View>
    );
};

export const CtaGroup = smartConnect<IExternalProps>(CtaGroupComponent, [
    withTheme(stylesProvider)
]);

import React from 'react';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import hoistNonReactStatics from 'hoist-non-react-statics';

export type INavigationProps<P = {}> = P & {
    navigation: NavigationScreenProp<NavigationState, P>;
};

interface IProps {
    children?: any;
}

export const withNavigationParams = () => (Comp: any) => {
    function Component(props: IProps & INavigationProps) {
        let params;
        if (props.navigation && props.navigation.state && props.navigation.state.params) {
            params = props.navigation.state.params;
        }
        return (
            <Comp {...props} {...params}>
                {props.children}
            </Comp>
        );
    }
    hoistNonReactStatics(Component, Comp);
    Component.displayName = `withNavigation(${Comp.displayName || Comp.name || 'Component'})`;
    return Component;
};

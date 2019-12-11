import React from 'react';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import hoistNonReactStatics from 'hoist-non-react-statics';

export type INavigationProps<P = {}> = P & {
    navigation: NavigationScreenProp<NavigationState, P>;
};

export const withNavigationParams = (options?: { forwardRef?: boolean }) => (Comp: any) => {
    const displayName = `withNavigation(${Comp.displayName || Comp.name || 'Component'})`;
    function Component(props: any) {
        let params;
        if (props.navigation && props.navigation.state && props.navigation.state.params) {
            params = props.navigation.state.params;
        }
        return <Comp {...props} {...params} ref={props.forwardedRef} />;
    }
    Component.displayName = displayName;
    hoistNonReactStatics(Component, Comp);

    function ForwardRef(props, ref) {
        return <Component {...props} forwardedRef={ref} />;
    }

    if (options?.forwardRef) {
        const forwardedRef = React.forwardRef(ForwardRef);

        ForwardRef.displayName = displayName;
        hoistNonReactStatics(forwardedRef, Comp);
        return forwardedRef;
    }
    return Component;
};

import React from 'react';
import { ThemeContext } from './theme-contex';
import { ITheme } from './itheme';
import hoistNonReactStatics from 'hoist-non-react-statics';
export interface IThemeProps<S> {
    styles: S;
    theme?: ITheme;
}

export const withTheme = (
    styleProvider: (theme: ITheme) => any,
    options?: { forwardRef?: boolean }
): any => (Comp: any) => {
    const displayName = `withTheme(${Comp.displayName || Comp.name || 'Component'})`;
    function Component(props: any) {
        const theme = React.useContext(ThemeContext);
        return (
            <Comp {...props} styles={styleProvider(theme)} theme={theme} ref={props.forwardedRef} />
        );
    }
    Component.displayName = displayName;
    hoistNonReactStatics(Component, Comp);

    function forwardRef(props, ref) {
        return <Component {...props} forwardedRef={ref} />;
    }

    if (options?.forwardRef) {
        const forwardedRef = React.forwardRef(forwardRef);

        forwardRef.displayName = displayName;
        hoistNonReactStatics(forwardedRef, Comp);
        return forwardedRef;
    }
    return Component;
};

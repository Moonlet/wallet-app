import React from 'react';
import { ThemeContext } from './theme-contex';
import { ITheme } from './itheme';

export const withTheme = (styleProvider: (theme: ITheme) => any): any => (Comp: any) => {
    function Component(props: any) {
        const theme = React.useContext(ThemeContext);
        return (
            <Comp {...props} styles={styleProvider(theme)} theme={theme}>
                {props.children}
            </Comp>
        );
    }
    Component.displayName = `withTheme(${Comp.displayName || Comp.name || 'Component'})`;
    return Component;
};

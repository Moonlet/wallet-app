import React from 'react';
import { ThemeContext } from './theme-contex';
import { ITheme } from './itheme';

export const withTheme: any = (Comp: any, styleProvider: (theme: ITheme) => any) => {
    return (props: any) => {
        const theme = React.useContext(ThemeContext);

        return (
            <Comp {...props} styles={styleProvider(theme)} theme={theme}>
                {props.children}
            </Comp>
        );
    };
};

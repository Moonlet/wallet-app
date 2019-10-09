import React from 'react';

export interface IAppContext {
    plugins: {
        wallet: any;
    };
}
export const AppContext: React.Context<IAppContext> = React.createContext<IAppContext>({
    plugins: {
        wallet: undefined
    }
});

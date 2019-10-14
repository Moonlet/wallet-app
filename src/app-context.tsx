import React from 'react';

export interface IAppContext {
    tbd?: string;
}
export const AppContext: React.Context<IAppContext> = React.createContext<IAppContext>({});

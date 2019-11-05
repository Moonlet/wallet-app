# Documentation

## Screen component
```ts
import React from 'react';
import { smartConnect } from './core/utils/smart-connect';
import { connect } from 'react-redux';
import { withTheme, IThemeProps } from './core/theme/with-theme';
import styleProvider from './screens/account/styles'
import { withNavigationParams, INavigationProps } from './navigation/withNavigation';


// props that need to be sent on navigation as params
interface INavigationParams {
    navParam: string
}

// redux props
interface IReduxProps {
    prop: string
}

export class ScreenComponent extends React.Component<INavigationProps<INavigationParams> & IThemeProps<ReturnType<typeof styleProvider>> & IReduxProps> {
    constructor(props: INavigationProps<INavigationParams> & IThemeProps<ReturnType<typeof styleProvider>> & IReduxProps) {
        super(props);
    }

    render() {
        return null;
    }
}

export const Screen = smartConnect(ScreenComponent, [
    connect((state) => state, {}),
    withTheme(() => {}),
    withNavigationParams()
])
```

## Component
```ts
import React from 'react';
import { smartConnect } from './core/utils/smart-connect';
import { connect } from 'react-redux';
import { withTheme, IThemeProps } from './core/theme/with-theme';
import styleProvider from './screens/account/styles'
import { withNavigationParams, INavigationProps } from './navigation/withNavigation';

// props that need to be passed when using a component
interface IExternalProps {
    externalProps: string
}

// redux props
interface IReduxProps {
    state: string
}

export class ExampleComponent extends React.Component<IExternalProps & IThemeProps<ReturnType<typeof styleProvider>> & IReduxProps> {
    constructor(props: IExternalProps & IThemeProps<ReturnType<typeof styleProvider>> & IReduxProps) {
        super(props);
    }

    render() {
        return null;
    }
}

export const Example = smartConnect<IExternalProps>(ScreenComponent, [
    connect((state) => state, {}),
    withTheme(() => {}),
    withNavigationParams()
])
```

## HOC
--TBD--
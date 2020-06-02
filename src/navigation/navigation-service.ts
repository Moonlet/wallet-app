import { NavigationActions, StackActions, NavigationParams } from 'react-navigation';

export const NavigationService = (() => {
    let navigator;

    const setTopLevelNavigator = navigatorRef => {
        navigator = navigatorRef;
    };

    const navigate = (routeName: string, params: NavigationParams, key?: string) => {
        navigator?.dispatch(
            NavigationActions.navigate({
                routeName,
                params,
                action: undefined,
                key
            })
        );
    };

    const replace = (routeName: string, params: NavigationParams) => {
        navigator?.dispatch(
            StackActions.replace({
                routeName,
                params
            })
        );
    };

    const popToTop = () => {
        navigator?.dispatch(StackActions.popToTop());
    };

    const goBack = (key?: string) => {
        navigator?.dispatch(NavigationActions.back({ key }));
    };

    const getRecursiveRoute = routeState => {
        if (Array.isArray(routeState.routes)) {
            return getRecursiveRoute(routeState.routes[routeState.index]);
        } else {
            return routeState.routeName;
        }
    };

    const getRecursiveRouteWithParams = (routeState: any) => {
        if (Array.isArray(routeState.routes)) {
            return getRecursiveRouteWithParams(routeState.routes[routeState.index]);
        } else {
            return {
                routeName: routeState.routeName,
                params: routeState?.params
            };
        }
    };

    const getCurrentRoute = () => navigator && getRecursiveRoute(navigator.state.nav);

    const getCurrentRouteWithParams = () =>
        navigator && getRecursiveRouteWithParams(navigator.state.nav);

    return {
        setTopLevelNavigator,
        navigate,
        replace,
        popToTop,
        getCurrentRoute,
        goBack,
        getCurrentRouteWithParams
    };
})();

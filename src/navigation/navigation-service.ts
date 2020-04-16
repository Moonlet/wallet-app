import { NavigationActions, StackActions, NavigationParams } from 'react-navigation';

export const NavigationService = (() => {
    let navigator;

    const setTopLevelNavigator = navigatorRef => {
        navigator = navigatorRef;
    };

    const navigate = (routeName: string, params: NavigationParams) => {
        navigator?.dispatch(
            NavigationActions.navigate({
                routeName,
                params
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

    const goBack = () => {
        navigator?.dispatch(NavigationActions.back());
    };

    const getRecursiveRoute = routeState => {
        if (Array.isArray(routeState.routes)) {
            return getRecursiveRoute(routeState.routes[routeState.index]);
        } else {
            return routeState.routeName;
        }
    };

    const getCurrentRoute = () => navigator && getRecursiveRoute(navigator.state.nav);

    return {
        setTopLevelNavigator,
        navigate,
        replace,
        popToTop,
        getCurrentRoute,
        goBack
    };
})();

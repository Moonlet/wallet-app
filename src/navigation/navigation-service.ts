import { NavigationActions } from 'react-navigation';

export const NavigationService = (() => {
    let navigator;

    const setTopLevelNavigator = navigatorRef => {
        navigator = navigatorRef;
    };

    const navigate = (routeName, params) => {
        navigator.dispatch(
            NavigationActions.navigate({
                routeName,
                params
            })
        );
    };

    return {
        setTopLevelNavigator,
        navigate
    };
})();

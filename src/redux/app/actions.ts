import { HintsComponent, HintsScreen } from './state';

export const SET_ACCEPTED_TC_VERSION = 'SET_ACCEPTED_TC_VERSION';
export const SHOW_HINT = 'SHOW_HINT';

export const appSetAcceptedTcVersion = (version: number) => {
    return {
        type: SET_ACCEPTED_TC_VERSION,
        data: version
    };
};

export const showHint = (screen: HintsScreen, component: HintsComponent) => {
    return {
        type: SHOW_HINT,
        data: { screen, component }
    };
};

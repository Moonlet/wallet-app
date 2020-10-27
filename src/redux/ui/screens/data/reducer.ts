import { IScreenDataState } from './state';
import { IAction } from '../../../types';
import { FETCH_SCREEN_DATA } from './actions';

const intialState: IScreenDataState = {
    dashboard: undefined,
    token: undefined
};

export default (state: IScreenDataState = intialState, action: IAction): IScreenDataState => {
    switch (action.type) {
        case FETCH_SCREEN_DATA:
            // console.log('REDUX', JSON.stringify(action.data, null, 4));

            // TODO

            return {
                ...state
            };

        default:
            break;
    }
    return state;
};

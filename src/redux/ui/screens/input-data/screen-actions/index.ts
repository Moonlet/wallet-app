import { Dispatch } from 'react';
import { IScreenContext } from '../../../../../components/widgets/types';
import { IReduxState } from '../../../../state';
import { IAction } from '../../../../types';
import { setScreenAmount } from '../actions';

const setScreenAmountAction = (
    params: any,
    context: IScreenContext,
    screenKey: string,
    getState: () => IReduxState,
    dispatch: Dispatch<IAction<any>>
) => {
    let amount = '0';

    for (const param of params) {
        if (param?.amount) amount = param.amount;
    }

    setScreenAmount(amount, {
        screenKey,
        context
    })(dispatch, getState);
};

export const screenActions = {
    setScreenAmountAction
};

import { Dispatch } from 'react';
import { ICtaAction, SmartScreenPubSubEvents } from '../../../../../components/widgets/types';
import { PubSub } from '../../../../../core/blockchain/common/pub-sub';
import { IReduxState } from '../../../../state';
import { flattenObject } from '../../../../utils/helpers';
import { setScreenInputData } from '../../input-data/actions';
import * as transactions from './transactions';
import { IAction } from '../../../../types';

export const setReduxScreenInputData = (
    context: IHandleCtaActionContext<transactions.ISwapTokenParams>
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    // console.log('value', context.action.params?.params);
    setScreenInputData(context.options.screenKey, context.action.params?.params)(
        dispatch,
        getState
    );
};

export const supportedActions = flattenObject({
    transactions,
    setReduxScreenInputData
});

export interface IHandleCtaOptions {
    screenKey?: string;
    validator?: {
        id: string;
        name: string;
        icon?: string;
        website?: string;
    };
    pubSub?: PubSub<SmartScreenPubSubEvents>;
}

export interface IHandleCtaActionContext<P = any> {
    action: ICtaAction<P>;
    options?: IHandleCtaOptions;
}

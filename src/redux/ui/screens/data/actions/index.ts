import { ICtaAction, SmartScreenPubSubEvents } from '../../../../../components/widgets/types';
import { PubSub } from '../../../../../core/blockchain/common/pub-sub';
import { flattenObject } from '../../../../utils/helpers';
import * as transactions from './transactions';

export const supportedActions = flattenObject({
    transactions
});

export interface IHandleCtaActionContext<P = any> {
    action: ICtaAction<P>;

    // TODO = make interface
    options?: {
        screenKey?: string;
        validator?: {
            id: string;
            name: string;
            icon?: string;
            website?: string;
        };
        pubSub?: PubSub<SmartScreenPubSubEvents>;
    };
}

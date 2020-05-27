import { Blockchain } from '../../../../core/blockchain/types';
import { ITokenState } from '../../../wallets/state';
import { IValidator } from '../../../../core/blockchain/types/stats';

export interface IPosActionsState {
    quickDelegateEnterAmount: {
        accountIndex: number;
        blockchain: Blockchain;
        token: ITokenState;
        validators: IValidator[];
        actionText: string;
    };
    delegateEnterAmount: {
        accountIndex: number;
        blockchain: Blockchain;
        token: ITokenState;
        validators: IValidator[];
        actionText: string;
    };
}

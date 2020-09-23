import { Blockchain, IFeeOptions } from '../../../../core/blockchain/types';
import { ITokenState } from '../../../wallets/state';
import { IValidator } from '../../stats/state';

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
    redelegateEnterAmount: {
        accountIndex: number;
        blockchain: Blockchain;
        token: ITokenState;
        validators: IValidator[];
        fromValidator: IValidator;
        actionText: string;
    };

    //
    quickDelegateConfirm: {
        accountIndex: number;
        blockchain: Blockchain;
        token: ITokenState;
        validators: IValidator[];
        actionText: string;
        amount: string;
    };
    delegateConfirm: {
        accountIndex: number;
        blockchain: Blockchain;
        token: ITokenState;
        validators: IValidator[];
        actionText: string;
        amount: string;
        feeOptions: IFeeOptions;
    };
    redelegateConfirm: {
        accountIndex: number;
        blockchain: Blockchain;
        token: ITokenState;
        validators: IValidator[];
        fromValidator: IValidator;
        actionText: string;
        amount: string;
    };
}

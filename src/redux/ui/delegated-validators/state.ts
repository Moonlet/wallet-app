import { IValidator } from '../../../core/blockchain/types/stats';

export interface IDelegatedValidatorsState {
    [blockchain: string]: {
        [chainId: string]: IValidator[];
    };
}

import { IValidator } from '../../../core/blockchain/types/stats';

export interface IValidatorsState {
    [blockchain: string]: {
        [chainId: string]: {
            validators: IValidator[];
            timestamp: number;
            loading: boolean;
        };
    };
}

import { IValidator } from '../stats/state';

export interface IValidatorsState {
    [blockchain: string]: {
        [chainId: string]: IValidator[];
    };
}

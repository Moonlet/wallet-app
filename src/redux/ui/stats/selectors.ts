import { IReduxState } from '../../state';
import { Blockchain, ChainIdType } from '../../../core/blockchain/types';
import { AccountStats } from '../../../core/blockchain/types/stats';

export const getAccountStats = (
    state: IReduxState,
    blockchain: Blockchain,
    chainId: ChainIdType,
    address: string
): AccountStats => {
    return (
        (state.ui.stats &&
            state.ui.stats[blockchain] &&
            state.ui.stats[blockchain][chainId] &&
            state.ui.stats[blockchain][chainId][address]) ||
        undefined
    );
};

import { IReduxState } from '../../state';
import { Blockchain, ChainIdType } from '../../../core/blockchain/types';
import { IValidator } from '../stats/state';

export const getDelegatedValidators = (
    state: IReduxState,
    blockchain: Blockchain,
    chainId: ChainIdType
): IValidator[] => {
    return (
        (state.ui.delegatedValidators &&
            state.ui.delegatedValidators[blockchain] &&
            state.ui.delegatedValidators[blockchain][chainId as string]) ||
        []
    );
};

import { PosBasicActionType } from '../../../core/blockchain/types/token';
import { IValidator } from '../../../core/blockchain/types/stats';
import { IReduxState } from '../../state';
import { Blockchain, ChainIdType } from '../../../core/blockchain/types';

export const getValidators = (
    state: IReduxState,
    blockchain: Blockchain,
    chainId: ChainIdType,
    posAction?: PosBasicActionType
): IValidator[] => {
    return (
        (state.ui.validators &&
            state.ui.validators[blockchain] &&
            state.ui.validators[blockchain][chainId as string]) ||
        [] // TODO: return undefined, because undefined should handle the loading state and [] should be empty state
    );
};

import { PosBasicActionType } from '../../../core/blockchain/types/token';
import { IReduxState } from '../../state';
import { Blockchain, ChainIdType } from '../../../core/blockchain/types';
import { IValidator } from '../stats/state';

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
        []
    );
};

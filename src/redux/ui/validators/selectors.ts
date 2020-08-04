import { PosBasicActionType } from '../../../core/blockchain/types/token';
import { IValidator } from '../../../core/blockchain/types/stats';
import { IReduxState } from '../../state';
import { Blockchain, ChainIdType } from '../../../core/blockchain/types';

export const getValidators = (
    state: IReduxState,
    blockchain: Blockchain,
    chainId: ChainIdType,
    myList?: boolean,
    posAction?: PosBasicActionType
): IValidator[] => {
    return state.ui.validators[blockchain][chainId as string];
};

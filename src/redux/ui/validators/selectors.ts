import { IValidator } from '../../../core/blockchain/types/stats';
import { IReduxState } from '../../state';
import { Blockchain, ChainIdType } from '../../../core/blockchain/types';

export const getValidators = (
    state: IReduxState,
    blockchain: Blockchain,
    chainId: ChainIdType
): IValidator[] => {
    return (
        state.ui.validators &&
        state.ui.validators[blockchain] &&
        state.ui.validators[blockchain][chainId as string]?.validators
    );
};

export const getValidatorsTimestamp = (
    state: IReduxState,
    blockchain: Blockchain,
    chainId: ChainIdType
): number => {
    return (
        state.ui.validators &&
        state.ui.validators[blockchain] &&
        state.ui.validators[blockchain][chainId as string]?.timestamp
    );
};

export const getValidatorsLoading = (
    state: IReduxState,
    blockchain: Blockchain,
    chainId: ChainIdType
): boolean => {
    return (
        state.ui.validators &&
        state.ui.validators[blockchain] &&
        state.ui.validators[blockchain][chainId as string]?.loading
    );
};

import { PosBasicActionType } from '../../../../../core/blockchain/types/token';
import { TransactionStatus } from '../../../../../core/wallet/types';
import { IReduxState } from '../../../../../redux/state';
import { getSelectedWallet } from '../../../../../redux/wallets/selectors';
import { IScreenModule, IScreenModuleWrapperData } from '../../../types';

export const updateClaimPending = (state: IReduxState, module: IScreenModule): IScreenModule => {
    const data = module.data as IScreenModuleWrapperData;

    const wallet = getSelectedWallet(state);

    const finalModule = {
        ...data.data.DEFAULT
    };

    for (const tx of Object.values(wallet.transactions)) {
        if (
            tx.status === TransactionStatus.PENDING &&
            tx?.data?.params &&
            tx?.data?.params[0] === finalModule?.details?.validatorId &&
            (tx?.additionalInfo?.posAction === PosBasicActionType.CLAIM_REWARD ||
                tx?.additionalInfo?.posAction === PosBasicActionType.CLAIM_REWARD_NO_INPUT)
        ) {
            finalModule.cta = data.data.PENDING.cta;
        }
    }

    return finalModule;
};

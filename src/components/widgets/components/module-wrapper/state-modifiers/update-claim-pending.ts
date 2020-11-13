import { PosBasicActionType } from '../../../../../core/blockchain/types/token';
import { TransactionStatus } from '../../../../../core/wallet/types';
import { IReduxState } from '../../../../../redux/state';
import { getSelectedAccount, getSelectedWallet } from '../../../../../redux/wallets/selectors';
import { IScreenModule, IScreenModuleWrapperData } from '../../../types';

export const updateClaimPending = (state: IReduxState, module: IScreenModule): string => {
    const wrapper = module.data as IScreenModuleWrapperData;

    const wallet = getSelectedWallet(state);
    const selectedAccount = getSelectedAccount(state);

    const wrapperCycleStart = wrapper?.data?.DEFAULT?.details?.cycleStart;
    const wrapperValidators = wrapper?.data?.DEFAULT?.details?.validators;

    const walletTransactions = wallet?.transactions || [];

    for (const tx of Object.values(walletTransactions)) {
        const posAction = tx?.additionalInfo?.posAction;

        if (
            tx?.data?.params &&
            tx?.data?.params[0] === wrapper?.data?.DEFAULT?.details?.validatorId &&
            tx?.broadcastedOnBlock > wrapperCycleStart &&
            tx?.address === selectedAccount.address &&
            (posAction === PosBasicActionType.CLAIM_REWARD ||
                posAction === PosBasicActionType.CLAIM_REWARD_NO_INPUT)
        ) {
            switch (tx.status) {
                case TransactionStatus.PENDING:
                    return 'PENDING';
                case TransactionStatus.SUCCESS:
                    return 'CLAIMED';
                default:
                    return 'DEFAULT';
            }
        }

        // Claim all module - PENDING
        if (
            // at least one claim tx in pending
            tx.status === TransactionStatus.PENDING &&
            (posAction === PosBasicActionType.CLAIM_REWARD ||
                posAction === PosBasicActionType.CLAIM_REWARD_NO_INPUT) &&
            // claim all module is identified by validators
            wrapperValidators &&
            // additional checks
            tx?.broadcastedOnBlock > wrapperCycleStart &&
            tx?.address === selectedAccount.address
        ) {
            return 'PENDING';
        }
    }

    // Claim all module - CLAIMED
    if (wrapperValidators) {
        let allClaimed = true;
        for (const v of wrapperValidators) {
            const index = Object.values(walletTransactions).findIndex(
                tx =>
                    // success claim tx
                    tx?.data?.params[0] === v.validatorId &&
                    tx.status === TransactionStatus.SUCCESS &&
                    (tx?.additionalInfo?.posAction === PosBasicActionType.CLAIM_REWARD ||
                        tx?.additionalInfo?.posAction ===
                            PosBasicActionType.CLAIM_REWARD_NO_INPUT) &&
                    // additional checks
                    tx?.broadcastedOnBlock > wrapperCycleStart &&
                    tx?.address === selectedAccount.address
            );
            if (index === -1) {
                allClaimed = false;
            }
        }
        if (allClaimed) {
            return 'CLAIMED';
        }
    }

    return 'DEFAULT';
};

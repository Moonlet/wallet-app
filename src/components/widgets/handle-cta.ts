import { PosBasicActionType } from '../../core/blockchain/types/token';
import { openURL } from '../../core/utils/linking-handler';
import { NavigationService } from '../../navigation/navigation-service';
import { buildDummyValidator } from '../../redux/wallets/actions';
import { IAccountState, ITokenState } from '../../redux/wallets/state';
import { ICta } from './types';

export const handleCta = async (
    cta: ICta,
    options?: {
        actions?: any;
        account?: IAccountState;
        screenKey?: string;
        validatorId?: string;
        validatorName?: string;
        token?: ITokenState;
    }
) => {
    if (!cta) {
        return;
    }

    switch (cta.type) {
        case 'callAction':
            switch (cta.params.action) {
                case PosBasicActionType.CLAIM_REWARD_NO_INPUT:
                    const validator = buildDummyValidator(
                        cta.params.params.validatorId,
                        cta.params.params.validatorName
                    );

                    options.actions.claimRewardNoInput(
                        options.account,
                        [validator],
                        cta.params.params.tokenSymbol,
                        undefined
                    );
                    break;

                case PosBasicActionType.WITHDRAW: {
                    const withdrawValidator =
                        cta?.params?.params?.validatorId &&
                        cta?.params?.params?.validatorName &&
                        buildDummyValidator(
                            cta.params.params.validatorId,
                            cta.params.params.validatorName
                        );

                    options.actions.withdraw(
                        options.account,
                        withdrawValidator && [withdrawValidator],
                        cta.params.params.tokenSymbol,
                        { amount: cta.params.params.amount },
                        undefined
                    );
                    break;
                }

                case 'MULTIPLE_SELECTION':
                    options.actions.toggleValidatorMultiple(options.screenKey, {
                        id: options.validatorId,
                        name: options.validatorName
                    });

                    break;
                case 'SINGLE_SELECTION':
                    options.actions.selectInput(
                        options.screenKey,
                        [
                            {
                                id: options.validatorId,
                                name: options.validatorName
                            }
                        ],
                        'validators'
                    );
                    break;

                default:
                    break;
            }
            break;

        case 'navigateTo':
            const screen = cta.params?.params?.screen || cta.params?.screen;

            NavigationService.navigate(screen, {
                ...cta.params.params,
                blockchain: options?.account?.blockchain,
                accountIndex: options?.account?.index,
                token: options?.token
            });
            break;

        case 'openUrl':
            cta?.params?.url && openURL(cta.params.url);
            break;

        default:
            break;
    }
};

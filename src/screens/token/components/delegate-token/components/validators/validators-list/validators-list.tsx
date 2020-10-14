import React from 'react';
import { FlatList } from 'react-native';
import stylesProvider from './styles';
import { IThemeProps, withTheme } from '../../../../../../../core/theme/with-theme';
import { ValidatorCard } from '../validator-card/validator-card';
import { smartConnect } from '../../../../../../../core/utils/smart-connect';
import { IValidator, CardActionType } from '../../../../../../../core/blockchain/types/stats';
import { Blockchain } from '../../../../../../../core/blockchain/types';
import { getBlockchain } from '../../../../../../../core/blockchain/blockchain-factory';
import { formatNumber } from '../../../../../../../core/utils/format-number';
import BigNumber from 'bignumber.js';
import { ITokenState } from '../../../../../../../redux/wallets/state';
import { getTokenConfig } from '../../../../../../../redux/tokens/static-selectors';

interface IExternalProps {
    validators: IValidator[];
    redelegate?: {
        validator: IValidator;
        color: string;
    };
    token: ITokenState;
    blockchain: Blockchain;
    onSelect: (validator: IValidator) => void;
    actionType: CardActionType;
    contentContainerStyle?: any;
}

export const ValidatorsListComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const blockchainInstance = getBlockchain(props.blockchain);

    const tokenConfig = getTokenConfig(props.blockchain, props.token.symbol);

    return (
        <FlatList
            data={props.validators}
            renderItem={({ item, index }) => (
                <ValidatorCard
                    key={index}
                    icon={item.icon}
                    leftLabel={item.name}
                    leftSmallLabel={item.rank}
                    leftSubLabel={item.website}
                    rightTitle={blockchainInstance.config.ui.validator.amountCardLabel}
                    rightSubtitle={formatNumber(
                        blockchainInstance.account.amountFromStd(
                            new BigNumber(item.amountDelegated.active),
                            tokenConfig.decimals
                        ),
                        {
                            currency: blockchainInstance.config.coin
                        }
                    )}
                    actionType={
                        props.redelegate?.validator.id === item.id
                            ? CardActionType.DEFAULT
                            : props.actionType
                    }
                    bottomStats={item.topStats}
                    actionTypeSelected={item.actionTypeSelected || false}
                    borderColor={
                        props.redelegate?.validator.id === item.id
                            ? props.theme.colors.labelRedelegate
                            : props.theme.colors.accent
                    }
                    onSelect={() => {
                        props.redelegate?.validator.id !== item.id && props.onSelect(item);
                    }}
                />
            )}
            keyExtractor={(_, index) => `validator-card-${index}`}
            contentContainerStyle={props?.contentContainerStyle}
            showsVerticalScrollIndicator={false}
        />
    );
};

export const ValidatorsList = smartConnect<IExternalProps>(ValidatorsListComponent, [
    withTheme(stylesProvider)
]);

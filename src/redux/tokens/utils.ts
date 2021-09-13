import { ITokenState } from '../wallets/state';

export const accountToken = (
    symbolKey: string,
    order: number,
    options?: { active?: boolean }
): ITokenState => {
    return {
        symbol: symbolKey,
        order,
        active: options?.active !== undefined ? options.active : true,
        balance: {
            value: '0',
            inProgress: false,
            timestamp: undefined,
            error: undefined,
            available: '0',
            total: '0',
            detailed: {}
        }
    };
};

export const EXCHANGE_RATE_UPDATE = 'EXCHANGE_RATE_UPDATE';

export const updateExchangeRate = (exchangeRate: { token: string; value: string }) => {
    return {
        type: EXCHANGE_RATE_UPDATE,
        data: exchangeRate
    };
};

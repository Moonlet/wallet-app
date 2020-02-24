export const EXCHANGE_RATES_UPDATE = 'EXCHANGE_RATES_UPDATE';

export const updateExchangeRates = (exchangeRates: any) => {
    return {
        type: EXCHANGE_RATES_UPDATE,
        data: exchangeRates
    };
};

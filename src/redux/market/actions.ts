export const EXCHANGE_RATE_UPDATE = 'EXCHANGE_RATE_UPDATE';
export const EXCHANGE_RATES_UPDATE = 'EXCHANGE_RATES_UPDATE';
export const EXCHANGE_RATES_TIME_UPDATED = 'EXCHANGE_RATES_TIME_UPDATED';

export const updateExchangeRate = (exchangeRate: { token: string; value: number }) => {
    return {
        type: EXCHANGE_RATE_UPDATE,
        data: exchangeRate
    };
};
export const updateExchangeRates = (exchangeRates: { [tokenType: string]: number }) => {
    return {
        type: EXCHANGE_RATES_UPDATE,
        data: exchangeRates
    };
};

export const updateExchangeRatesTimeUpdated = (timestamp: string) => {
    return {
        type: EXCHANGE_RATES_TIME_UPDATED,
        data: timestamp
    };
};

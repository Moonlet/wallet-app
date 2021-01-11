export interface IExchangeRates {
    [tokenType: string]: number;
}

export interface IMarketStateOptions {
    timestamp: string;
    isLoading: boolean;
}

export interface IMarketState {
    exchangeRates: IExchangeRates;
    options: IMarketStateOptions;
}

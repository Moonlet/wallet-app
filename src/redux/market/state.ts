export interface IExchangeRates {
    [tokenSymbol: string]: string;
}

export interface IMarketState {
    exchangeRates: IExchangeRates;
}

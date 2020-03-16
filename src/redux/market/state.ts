export interface IExchangeRates {
    [tokenType: string]: number;
}

export interface IMarketState {
    exchangeRates: IExchangeRates;
    change: any;
}

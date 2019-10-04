export interface Store {
    wallet: {
        money: number
    },
    market: {
        price: {
            eth: number
        }
    }
}
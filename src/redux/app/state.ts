export interface IAppState {
    version: number;
    tcAcceptedVersion: number;
    hints: IHints;
    failedLogins: number;
    blockUntil: Date | string;
}

export interface IHints {
    SEND_SCREEN: {
        ADDRESS_BOOK: number;
    };
    WALLETS_SCREEN: {
        WALLETS_LIST: number;
    };
    MANAGE_ACCOUNT: {
        TOKENS_LIST: number;
    };
}

export enum HintsScreen {
    SEND_SCREEN = 'SEND_SCREEN',
    WALLETS_SCREEN = 'WALLETS_SCREEN',
    MANAGE_ACCOUNT = 'MANAGE_ACCOUNT',
    NOTIFICATIONS = 'NOTIFICATIONS'
}

export enum HintsComponent {
    ADDRESS_BOOK = 'ADDRESS_BOOK',
    WALLETS_LIST = 'WALLETS_LIST',
    TOKENS_LIST = 'TOKENS_LIST',
    PULL_TO_REFRESH = 'PULL_TO_REFRESH'
}

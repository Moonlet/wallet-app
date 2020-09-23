export const AffiliateBannerType = {
    LEDGER_NANO_X: {
        url: 'https://shop.ledger.com/pages/ledger-nano-x?r=69d534ac55d9',
        image: require('../../assets/images/png/affiliate-banners/ledger_nano_x.png')
    },
    UNSTOPPABLE_DOMAINS: {
        url: 'https://unstoppabledomains.com/r/moonlet',
        image: require('../../assets/images/png/affiliate-banners/unstoppabledomains.png')
    }
};

export interface IAffiliateBannerType {
    url: string;
    image: any;
}

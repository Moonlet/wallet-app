import { navigationConfig } from '../navigation';
import { menuIcon } from '../utils';

jest.mock('../utils');

export default describe('Navigation', () => {
    describe('configuration', () => {
        test('config is ok', () => {
            navigationConfig.Wallet.navigationOptions();
            expect(menuIcon).toHaveBeenCalledWith('money-wallet-1');
            (menuIcon as any).mockClear();

            navigationConfig.Watch.navigationOptions();
            expect(menuIcon).toHaveBeenCalledWith('view-1');
            (menuIcon as any).mockClear();

            navigationConfig.Rewards.navigationOptions();
            expect(menuIcon).toHaveBeenCalledWith('accounting-coins-stack');
            (menuIcon as any).mockClear();

            navigationConfig.Settings.navigationOptions();
            expect(menuIcon).toHaveBeenCalledWith('cog');
            (menuIcon as any).mockClear();
        });
    });
});

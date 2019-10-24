import { formatNumber } from '../format-number';
import { Platform } from 'react-native';

const tests = [
    {
        amount: 1000.3243132,
        result: '1,000.32'
    },
    {
        amount: 0.16,
        result: '$0.16',
        options: {
            currency: 'USD'
        }
    },
    {
        amount: 0.00000016312332,
        result: '0.00000016 ATOM',
        options: {
            currency: 'ATOM'
        }
    },
    {
        amount: 0.1,
        result: '0.100 ETH',
        options: {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
            currency: 'ETH'
        }
    }
];

describe('format number function', () => {
    tests.forEach(t => {
        it('should format number correctly on iOS', () => {
            expect(formatNumber(t.amount, t.options)).toBe(t.result);
        });

        it('should format number correctly on Android', () => {
            Platform.OS = 'android';
            expect(formatNumber(t.amount, t.options)).toBe(t.result);
        });

        it('should format number correctly on web', () => {
            Platform.OS = 'web';
            expect(formatNumber(t.amount, t.options)).toBe(t.result);
        });
    });
});

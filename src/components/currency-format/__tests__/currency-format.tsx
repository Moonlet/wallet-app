import React from 'react';
import { CurrencyFormat } from '../currency-format';
import { shallow } from 'enzyme';

export default describe('CurrencyFormat', () => {
    test('renders corectly', () => {
        expect(shallow(<CurrencyFormat>123.123</CurrencyFormat>).debug()).toMatchSnapshot();
        expect(
            shallow(<CurrencyFormat decimals="2">123.123</CurrencyFormat>).debug()
        ).toMatchSnapshot();
    });
});

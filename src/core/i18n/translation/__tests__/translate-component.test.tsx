import React from 'react';
import { TranslateComponent, Translate } from '../translate-component';
import { shallow } from 'enzyme';
import { translate } from '../translate';

jest.mock('../translate', () => ({
    translate: jest.fn(() => 'TEST RESULT')
}));

export default describe('Translate component', () => {
    test('it renders corectly', () => {
        const T = TranslateComponent as any;
        expect(shallow(<T text="TEST" />).debug()).toMatchSnapshot();
        expect(translate).toHaveBeenCalledWith('TEST', undefined, undefined);

        (translate as any).mockClear();
        shallow(<T text="TEST" params={'PARAMS'} count={123} />);
        expect(translate).toHaveBeenCalledWith('TEST', 'PARAMS', 123);

        expect(
            shallow(<Translate text="TEST" params={'PARAMS'} count={123} />).debug()
        ).toMatchSnapshot();
    });
});

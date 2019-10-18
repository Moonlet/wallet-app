import React from 'react';
import { withTheme } from '../with-theme';
import { shallow } from 'enzyme';
import { ITheme } from '../itheme';
import { darkTheme } from '../../../styles/themes/dark-theme';

describe('Theme:withTheme', () => {
    test('withTheme works properly', () => {
        class Comp extends React.Component {
            public render() {
                return <div />;
            }
        }

        const CompWithTheme = withTheme(Comp, (theme: ITheme) => ({
            div: {
                backgroundColor: theme.colors.primary
            }
        }));

        const renderedComp = shallow(<CompWithTheme prop1="value1" prop2="value2" />);
        expect(renderedComp.getElement().props).toEqual({
            children: undefined,
            prop1: 'value1',
            prop2: 'value2',
            styles: {
                div: {
                    backgroundColor: darkTheme.colors.primary
                }
            }
        });
    });
});

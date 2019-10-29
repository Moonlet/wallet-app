import React from 'react';
import { Text, ITextProps } from '../../../library';
import { ITranslationParams, translate } from './translate';
import { withTheme } from '../../theme/with-theme';

interface IProps {
    text: string;
    params?: ITranslationParams;
    count?: number;
}

export class TranslateComponent extends React.Component<IProps & ITextProps> {
    public render() {
        return (
            <Text {...this.props}>
                {translate(this.props.text, this.props.params, this.props.count)}
            </Text>
        );
    }
}

export const Translate = withTheme(() => ({}))(TranslateComponent);

import React from 'react';
import { Text, ITextProps } from '../../../library';
import { ITranslationParams, translate } from './translate';
import { withTheme } from '../../theme/with-theme';

interface IProps {
    text: string;
    params?: ITranslationParams;
    count?: number;
}

export const TranslateComponent = (props: IProps & ITextProps) => {
    return <Text {...props}>{translate(props.text, props.params, props.count)}</Text>;
};

export const Translate = withTheme(() => ({}))(TranslateComponent);

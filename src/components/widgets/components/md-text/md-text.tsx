import React from 'react';
import { View } from 'react-native';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import stylesProvider from './styles';
import { IScreenModule, IMdTextData } from '../../types';
import { formatStyles } from '../../utils';
import RNMarkdownFormatter from 'react-native-markdown-formatter';

interface IExternalProps {
    module: IScreenModule;
}

const MdTextComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const { module, styles } = props;
    const data = module.data as IMdTextData;

    return (
        <View style={module?.style && formatStyles(module.style)}>
            <RNMarkdownFormatter
                defaultStyles={[styles.text, data?.style && formatStyles(data.style)]}
                numberOfLines={data?.options?.numberOfLines || 0} // 1 (no wrap text) or 0 (wrap text)
                text={data.text}
                regexArray={data?.options?.customMarkdownFormatterRegex || []}
            />
        </View>
    );
};

export const MdText = smartConnect<IExternalProps>(MdTextComponent, [withTheme(stylesProvider)]);

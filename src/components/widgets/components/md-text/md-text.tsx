import React from 'react';
import { View } from 'react-native';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import stylesProvider from './styles';
import { IScreenModule, IMdTextData } from '../../types';
import { formatStyles } from '../../utils';
import Markdown from 'react-native-markdown-display';

interface IExternalProps {
    module: IScreenModule;
}

const MdTextComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const { module } = props;
    const data = module.data as IMdTextData;

    return (
        <View style={module?.style && formatStyles(module.style)}>
            <Markdown style={data?.style || {}}>{data.text}</Markdown>
        </View>
    );
};

export const MdText = smartConnect<IExternalProps>(MdTextComponent, [withTheme(stylesProvider)]);

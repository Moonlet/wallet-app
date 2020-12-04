import React from 'react';
import { smartConnect } from '../../core/utils/smart-connect';

interface IExternalProps {
    source: { uri: string };
    style?: any;
    resizeMode?: string;
}

const FastImageComponent = (props: IExternalProps) => {
    return <img src={props.source.uri} style={{ ...props?.style }} />;
};

export const FastImage = smartConnect<IExternalProps>(FastImageComponent);

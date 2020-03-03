import React from 'react';
import { SCREEN_HEIGHT } from '../../styles/dimensions';
import { smartConnect } from '../../core/utils/smart-connect';

interface IExternalProps {
    source: { uri: string };
}

export const WebViewComponent = (props: IExternalProps) => {
    return (
        <iframe
            src={props.source.uri}
            height={SCREEN_HEIGHT}
            style={{ padding: 0, margin: 0, border: 0, borderWidth: 0 }}
        />
    );
};

export const WebView = smartConnect<IExternalProps>(WebViewComponent);

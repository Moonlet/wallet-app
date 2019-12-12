interface ISilentMessage {
    payload: any;
}

export const silentMessageHandler = (message: ISilentMessage) => {
    // http://webhook.site/#!/328c9b4b-a5d2-4f1a-a30c-95c7481a45a0
    fetch('http://webhook.site/328c9b4b-a5d2-4f1a-a30c-95c7481a45a0');
};

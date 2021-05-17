import { dataMessageHandler } from '../handlers/data-message';

export default async (message: any) => {
    message?.data && dataMessageHandler(message.data as any);
};

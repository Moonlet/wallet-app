export const pickInsensitiveKey = (obj: any, key: string) => {
    for (const k in obj) {
        if (k?.toLowerCase() === key?.toLowerCase()) {
            return obj[k];
        }
    }
    return undefined;
};

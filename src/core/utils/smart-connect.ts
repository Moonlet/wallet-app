export const smartConnect = (Comp: any, connectors: any[] = []): any => {
    let result = Comp;
    for (const connector of connectors) {
        result = connector(result);
    }

    return result;
};

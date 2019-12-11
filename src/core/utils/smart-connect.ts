import React from 'react';
export const smartConnect = <P = {}>(
    Comp: any,
    connectors: any[] = []
): React.ComponentType<P & { ref?: any }> => {
    let result = Comp;
    for (const connector of connectors) {
        result = connector(result);
    }

    return result;
};

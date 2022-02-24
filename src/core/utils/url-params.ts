export const getUrlParams = (search = ``) => {
    const hashes = search.slice(search.indexOf('?') + 1).split('&');
    return hashes.reduce((params, hash) => {
        const split = hash.indexOf('=');

        if (split < 0) {
            return { ...params, [hash]: null };
        }

        const key = hash.slice(0, split);
        const val = hash.slice(split + 1);

        return { ...params, [key]: decodeURIComponent(val) };
    }, {});
};

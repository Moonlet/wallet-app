export const testUtils = {
    delay: (time = 0) => new Promise(resolver => setTimeout(() => resolver(), time))
};

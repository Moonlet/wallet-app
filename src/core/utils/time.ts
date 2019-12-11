export const delay = (time: number = 0) =>
    new Promise(resolver => setTimeout(() => resolver(), time));

export const capitalizeFirstLetter = (word: string) => {
    word = word.toLocaleLowerCase();
    return word.charAt(0).toUpperCase() + word.slice(1);
};

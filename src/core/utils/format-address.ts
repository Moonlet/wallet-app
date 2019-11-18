export const formatAddress = (text: string) => {
    if (text.length === 0) {
        return '';
    }
    let convertedStr = '';
    convertedStr += text.substring(0, 5);
    convertedStr += '.'.repeat(3);
    convertedStr += text.substring(text.length - 5, text.length);
    return convertedStr;
};

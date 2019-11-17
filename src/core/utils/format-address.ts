export const formatAddress = (text: string) => {
    let convertedStr = '';
    convertedStr += text.substring(0, 5);
    convertedStr += '.'.repeat(3);
    convertedStr += text.substring(text.length - 5, text.length);
    return convertedStr;
};

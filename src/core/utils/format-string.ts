import { IValidator } from '../blockchain/types/stats';
import { translate } from '../i18n';

export const Capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLocaleLowerCase();
};

export const valuePrimaryCtaField = (validators: IValidator[]): string => {
    const selectedValidators = validators.filter(
        validator => validator.actionTypeSelected === true
    );

    if (selectedValidators.length > 1) {
        return selectedValidators.length + ' ' + translate('App.labels.validators').toLowerCase();
    } else if (selectedValidators.length === 1) {
        return formatValidatorName(selectedValidators[0].name, 15);
    }
    return '';
};

export const formatValidatorName = (str: string, length: number): string => {
    return str.length > length ? str.slice(0, length) + '...' : str;
};

export const formatPlural = (value: number): string => {
    if (value === 1) return '1st';
    if (value === 2) return '2nd';
    if (value === 3) return '3rd';
    if (value > 3) return `${value}th`;
};

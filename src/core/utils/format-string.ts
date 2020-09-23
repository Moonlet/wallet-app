import { IValidator } from '../../redux/ui/stats/state';
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

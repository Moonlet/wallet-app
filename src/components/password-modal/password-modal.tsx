import { smartConnect } from '../../core/utils/smart-connect';
import { PasswordModalComponent, mapDispatchToProps } from './password-modal-component';
import { connect } from 'react-redux';
import { withTheme } from '../../core/theme/with-theme';
import stylesProvider from './styles';

export class PasswordModal {
    public static readonly Component = smartConnect(PasswordModalComponent, [
        connect(null, mapDispatchToProps),
        withTheme(stylesProvider)
    ]);

    public static getPassword = PasswordModalComponent.getPassword;

    public static createPassword = PasswordModalComponent.createPassword;

    public static changePassword = PasswordModalComponent.changePassword;
}

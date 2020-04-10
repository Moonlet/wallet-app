import { smartConnect } from '../../core/utils/smart-connect';
import {
    PasswordModalComponent,
    mapDispatchToProps,
    mapStateToProps
} from './password-modal-component';
import { connect } from 'react-redux';
import { withTheme } from '../../core/theme/with-theme';
import stylesProvider from './styles';

export class PasswordModal {
    public static readonly Component = smartConnect(PasswordModalComponent, [
        connect(mapStateToProps, mapDispatchToProps),
        withTheme(stylesProvider)
    ]);

    public static getPassword = PasswordModalComponent.getPassword;

    public static createPassword = PasswordModalComponent.createPassword;

    public static changePassword = PasswordModalComponent.changePassword;

    public static isVisible = PasswordModalComponent.isVisible;
}

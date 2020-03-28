import { smartConnect } from '../../core/utils/smart-connect';
import { PasswordModalComponent, mapDispatchToProps } from './password-modal-component';
import { connect } from 'react-redux';

export class PasswordModal {
    public static readonly Component = smartConnect(PasswordModalComponent, [
        connect(null, mapDispatchToProps)
    ]);

    public static getPassword = PasswordModalComponent.getPassword;

    public static createPassword = PasswordModalComponent.createPassword;

    public static changePassword = PasswordModalComponent.changePassword;
}

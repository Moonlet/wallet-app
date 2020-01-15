import { DialogComponent } from './dialog-component';
import { smartConnect } from '../../core/utils/smart-connect';
import { withTheme } from '../../core/theme/with-theme';
import stylesProvider from './styles';

export class Dialog {
    public static readonly Component = smartConnect(DialogComponent, [withTheme(stylesProvider)]);

    public static alert = DialogComponent.alert;

    public static confirm = DialogComponent.confirm;

    public static prompt = DialogComponent.prompt;
}

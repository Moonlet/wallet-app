import { smartConnect } from '../../core/utils/smart-connect';
import { withTheme } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { InfoModalComponent } from './info-modal-component';

export class InfoModal {
    public static readonly Component = smartConnect(InfoModalComponent, [
        withTheme(stylesProvider)
    ]);

    public static open = InfoModalComponent.open;

    public static close = InfoModalComponent.close;
}

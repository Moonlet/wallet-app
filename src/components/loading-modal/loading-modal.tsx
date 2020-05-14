import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { withTheme } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { mapStateToProps, LoadingModalComponent } from './loading-modal-component';

export class LoadingModal {
    public static readonly Component = smartConnect(LoadingModalComponent, [
        connect(mapStateToProps, null),
        withTheme(stylesProvider)
    ]);

    public static open = LoadingModalComponent.open;

    public static close = LoadingModalComponent.close;

    public static showMessage = LoadingModalComponent.showMessage;
}

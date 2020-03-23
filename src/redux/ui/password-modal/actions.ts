export const DISPLAY_PASSWORD_MODAL = 'DISPLAY_PASSWORD_MODAL';

export const canDisplayPasswordModal = (visible: boolean) => {
    return {
        type: DISPLAY_PASSWORD_MODAL,
        data: { visible }
    };
};

export const DISPLAY_PASSWORD_MODAL = 'DISPLAY_PASSWORD_MODAL';

export const setDisplayPasswordModal = (visible: boolean) => {
    return {
        type: DISPLAY_PASSWORD_MODAL,
        data: { visible }
    };
};

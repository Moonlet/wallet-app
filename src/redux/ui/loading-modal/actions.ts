export const CLOSE_LOADING_MODAL = 'CLOSE_LOADING_MODAL';
export const OPEN_LOADING_MODAL = 'OPEN_LOADING_MODAL';

export const openLoadingModal = () => {
    return {
        type: OPEN_LOADING_MODAL
    };
};

export const closeLoadingModal = () => {
    return {
        type: CLOSE_LOADING_MODAL
    };
};

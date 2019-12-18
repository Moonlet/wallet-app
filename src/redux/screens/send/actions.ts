// actions consts
export const REVIEW_TRANSACTION = 'REVIEW_TRANSACTION';

// actions creators
export const reviewTransaction = (value: boolean) => {
    return {
        type: REVIEW_TRANSACTION,
        data: value
    };
};

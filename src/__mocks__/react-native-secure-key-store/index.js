let pass = '';

export const ACCESSIBLE = {
    WHEN_UNLOCKED: 'WHEN_UNLOCKED'
};

const get = jest.fn(service => Promise.resolve(pass));

const set = jest.fn((service, password) => {
    pass = 'hashedkey';
});

const remove = jest.fn().mockResolvedValue();

export default {
    get,
    remove,
    set
};

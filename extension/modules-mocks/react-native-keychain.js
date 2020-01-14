let pass = '';

const SECURITY_LEVEL_ANY = 'MOCK_SECURITY_LEVEL_ANY';
const SECURITY_LEVEL_SECURE_SOFTWARE = 'MOCK_SECURITY_LEVEL_SECURE_SOFTWARE';
const SECURITY_LEVEL_SECURE_HARDWARE = 'MOCK_SECURITY_LEVEL_SECURE_HARDWARE';
const setGenericPassword = (user, password) => {
    pass = password;
};
const getGenericPassword = () => pass;
const resetGenericPassword = () => {};

export {
    SECURITY_LEVEL_ANY,
    SECURITY_LEVEL_SECURE_SOFTWARE,
    SECURITY_LEVEL_SECURE_HARDWARE,
    setGenericPassword,
    getGenericPassword,
    resetGenericPassword
};

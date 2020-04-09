let pass = '';

const SECURITY_LEVEL_ANY = 'MOCK_SECURITY_LEVEL_ANY';
const SECURITY_LEVEL_SECURE_SOFTWARE = 'MOCK_SECURITY_LEVEL_SECURE_SOFTWARE';
const SECURITY_LEVEL_SECURE_HARDWARE = 'MOCK_SECURITY_LEVEL_SECURE_HARDWARE';
const setGenericPassword = jest.fn(password => {
    pass = password;
});
const getGenericPassword = jest.fn(() => pass);
const resetGenericPassword = jest.fn().mockResolvedValue();

export {
    SECURITY_LEVEL_ANY,
    SECURITY_LEVEL_SECURE_SOFTWARE,
    SECURITY_LEVEL_SECURE_HARDWARE,
    setGenericPassword,
    getGenericPassword,
    resetGenericPassword
};

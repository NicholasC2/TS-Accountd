export const validation_rules = {
    USERNAME: /^[a-zA-Z0-9_-]+$/,
    PASSWORD: /^(?=.*[A-Za-z])(?=.*\d).{6,}$/
};

export const scrypt_options = { N: 16384, r: 8, p: 1 };
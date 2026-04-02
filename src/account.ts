import { validation_rules, scrypt_options } from "./validation_rules.js";
import Crypto from "node:crypto"
import { promisify } from "node:util";

const scrypt = promisify(Crypto.scrypt) as (
    password: Crypto.BinaryLike,
    salt: Crypto.BinaryLike,
    keylen: number,
    options: Crypto.ScryptOptions
) => Promise<Buffer>;

export class Account {
    username: string = "";
    displayName: string = "";
    #password: {
        value: string;
        salt: string;
    };

    constructor(data: {
        username: string;
        password: { value: string; salt: string };
        displayName: string;
    }) {
        this.username = data.username;
        this.#password = data.password;
        this.displayName = data.displayName;
    }

    static async create(data: {
        username: string;
        password: string;
        displayName: string;
    }): Promise<Account> {
        const username = Account.normalizeUsername(data.username);
        const displayName = Account.normalizeDisplayName(data.displayName);
        const password = await Account.hashPassword(data.password);

        return new Account({
            username,
            password,
            displayName
        });
    }

    static normalizePassword(password: string): string {
        const newPassword = password.trim();
        if (!validation_rules.PASSWORD.test(newPassword)) {
            throw new Error("Password must contain one letter, one number, and be 6 characters or longer");
        }
        return newPassword;
    }

    static normalizeUsername(username: string): string {
        const newUsername = username.trim();
        if (!validation_rules.USERNAME.test(newUsername)) {
            throw new Error("Username cannot contain spaces or special characters");
        }
        return newUsername;
    }

    static normalizeDisplayName(displayName: string): string {
        const newDisplayName = displayName.trim();
        if (newDisplayName === "") {
            throw new Error("Display name cannot be blank");
        }
        return newDisplayName;
    }

    async setPassword(password: string) {
        this.#password = await Account.hashPassword(password);
    }

    setUsername(username: string) {
        this.username = Account.normalizeUsername(username);
    }

    setDisplayName(displayName: string) {
        this.displayName = Account.normalizeDisplayName(displayName);
    }

    static async hashPassword(password: string): Promise<{ value: string; salt: string }> {
        const normalizedPassword = Account.normalizePassword(password);
        const salt = Crypto.randomBytes(16).toString("hex");
        const hash = await Account.deriveKey(normalizedPassword, salt);

        return { value: hash, salt };
    }

    private static async deriveKey(password: string, salt: string): Promise<string> {
        const key = (await scrypt(password, salt, 32, scrypt_options)) as Buffer;
        return key.toString("hex");
    }
    
    async verifyPassword(password: string): Promise<boolean> {
        if (!this.#password?.value || !this.#password?.salt) {
            throw new Error("Password not set");
        }

        const inputPassword = password || "";
        const hash = await Account.deriveKey(inputPassword, this.#password.salt);

        const a = Buffer.from(hash, "hex");
        const b = Buffer.from(this.#password.value, "hex");

        if (a.length !== b.length) return false;

        return Crypto.timingSafeEqual(a, b);
    }

    getPublicAccount(): PublicAccount {
        return Object.freeze({
            username: this.username,
            displayName: this.displayName
        });
    }

    toJSON(includePassword = false) {
        return {
            username: this.username,
            displayName: this.displayName,
            ...(includePassword && { password: this.#password })
        };
    }

    static fromJSON(data: {
        username: string;
        displayName: string;
        password: { value: string; salt: string };
    }): Account {
        return new Account(data);
    }
}

export type PublicAccount = {
    username: string;
    displayName: string;
};
import { validation_rules } from "./validation_rules.js";

type AccountData = {
    username: string;
    displayName: string;
    pubKey: string;
};

export class Account {
    // Private

    private username: string;
    private displayName: string;
    private pubKey: string;

    private constructor(data: AccountData) {
        this.username = data.username;
        this.displayName = data.displayName;
        this.pubKey = data.pubKey;
    }

    // -----

    static create(data: AccountData): Account {
        const username = Account.normalizeUsername(data.username);
        const displayName = Account.normalizeDisplayName(data.displayName);
        const pubKey = Account.normalizePubKey(data.pubKey);

        return new Account({
            username,
            displayName,
            pubKey
        });
    }

    // Normalize

    static normalizePubKey(pubKey: string): string {
        const key = pubKey.trim();
        if (key.length < 32) {
            throw new Error("Invalid public key");
        }
        return key;
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

    // Setters

    setUsername(username: string) {
        this.username = Account.normalizeUsername(username);
    }

    setDisplayName(displayName: string) {
        this.displayName = Account.normalizeDisplayName(displayName);
    }

    setPubKey(pubKey: string) {
        this.pubKey = Account.normalizePubKey(pubKey);
    }

    // Getters

    getUsername(): string {
        return this.username;
    }

    getDisplayName(): string {
        return this.displayName;
    }

    getPubKey(): string {
        return this.pubKey;
    }

    // -----

    toJSON(): AccountData {
        return {
            username: this.username,
            displayName: this.displayName,
            pubKey: this.pubKey
        };
    }

    static fromJSON(data: AccountData): Account {
        return Account.create(data);
    }
}
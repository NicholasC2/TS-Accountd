import Crypto from "node:crypto"

class Session {
    id: string;
    username: string;
    createdAt: number;

    constructor(data: {
        id: string;
        username: string;
        createdAt: number;
    }) {
        this.id = data.id;
        this.username = data.username;
        this.createdAt = data.createdAt;
    }

    static create(username: string): Session {
        return new Session({
            id: Crypto.randomUUID(),
            username,
            createdAt: Date.now()
        });
    }
    
    toJSON() {
        return {
            id: this.id,
            username: this.username,
            createdAt: this.createdAt
        };
    }

    static fromJSON(data: {
        id: string;
        username: string;
        createdAt: number;
    }): Session {
        return new Session(data);
    }
}
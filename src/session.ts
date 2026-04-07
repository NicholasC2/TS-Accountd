import { randomUUID } from "node:crypto";

type SessionData = {
    id: string;
    username: string;
    createdAt: number;
};

export class Session {
    // Private

    private id: string;
    private username: string;
    private createdAt: number;

    private constructor(data: SessionData) {
        this.id = data.id;
        this.username = data.username;
        this.createdAt = data.createdAt;
    }

    // -----

    static create(username: string): Session {
        return new Session({
            id: randomUUID(),
            username,
            createdAt: Date.now()
        });
    }

    // Getters

    getId(): string {
        return this.id;
    }

    getUsername(): string {
        return this.username;
    }

    getCreatedAt(): number {
        return this.createdAt;
    }

    // -----
    
    toJSON() {
        return {
            id: this.id,
            username: this.username,
            createdAt: this.createdAt
        };
    }

    static fromJSON(data: SessionData): Session {
        if (
            typeof data.id !== "string" ||
            typeof data.username !== "string" ||
            typeof data.createdAt !== "number"
        ) {
            throw new Error("Invalid session data");
        }

        return new Session(data);
    }
}
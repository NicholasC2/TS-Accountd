import { Account } from "./account.js"
import { Session } from "./session.js"

export class AccountStore {
    private accounts = new Map<string, Account>();

    add(account: Account) {
        if (this.accounts.has(account.username)) {
            throw new Error("Username already exists");
        }

        this.accounts.set(account.username, account);
    }

    get(username: string): Account | undefined {
        return this.accounts.get(username);
    }
}

export class SessionStore {
    private sessions = new Map<string, Session>();

    create(username: string): Session {
        let session: Session;

        do {
            session = Session.create(username);
        } while (this.sessions.has(session.id));

        this.sessions.set(session.id, session);
        return session;
    }

    add(session: Session) {
        if (this.sessions.has(session.id)) {
            throw new Error("Session ID already exists");
        }

        this.sessions.set(session.id, session);
    }

    get(id: string): Session | undefined {
        return this.sessions.get(id);
    }
}
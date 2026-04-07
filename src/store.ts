import { Account } from "./account.js"
import { Session } from "./session.js"

export class AccountStore {
    private accounts = new Map<string, Account>();

    add(account: Account) {
        if (this.accounts.has(account.getUsername())) {
            throw new Error("Username already exists");
        }

        this.accounts.set(account.getUsername(), account);
    }

    get(username: string): Account | undefined {
        return this.accounts.get(username);
    }

    toJSON(): object[] {
        const accounts: object[] = [];

        this.accounts.forEach(account => {
            accounts.push(account.toJSON());
        })

        return accounts;
    }

    static fromJSON(data: []): AccountStore {
        const accountStore = new AccountStore();

        data.forEach((account)=>{
            accountStore.add(Account.fromJSON(account))
        })

        return accountStore;
    }
}

export class SessionStore {
    private sessions = new Map<string, Session>();

    create(username: string): Session {
        let session: Session;

        do {
            session = Session.create(username);
        } while (this.sessions.has(session.getId()));

        this.sessions.set(session.getId(), session);
        return session;
    }

    add(session: Session) {
        if (this.sessions.has(session.getId())) {
            throw new Error("Session ID already exists");
        }

        this.sessions.set(session.getId(), session);
    }

    get(id: string): Session | undefined {
        return this.sessions.get(id);
    }

    toJSON(): object[] {
        const sessions: object[] = [];

        this.sessions.forEach(session => {
            sessions.push(session.toJSON());
        })

        return sessions;
    }

    static fromJSON(data: []): SessionStore {
        const sessionStore = new SessionStore();

        data.forEach((session)=>{
            sessionStore.add(Session.fromJSON(session))
        })

        return sessionStore;
    }
}
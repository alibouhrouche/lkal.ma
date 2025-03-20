import Dexie, { type EntityTable } from "dexie";
// import 'dexie-observable';
import dexieCloud, { UserLogin } from "dexie-cloud-addon";
import * as Y from "yjs";
import * as awarenessProtocol from "y-protocols/awareness";
import { customAlphabet } from "nanoid";
import { useObservable } from "dexie-react-hooks";
const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet, 23);

export interface Board {
  id: string;
  name: string;
  doc: Y.Doc;
  thumbnail?: [string, string];
  created_at: Date;
  updated_at: Date;
  realmId?: string;
  owner?: string;
  spaceId?: string;
}

export interface ISpace {
  id: string;
  title: string;
  created_at: Date;
  realmId?: string;
  owner?: string;
}

class DB extends Dexie {
  boards!: EntityTable<Board, "id">;
  spaces!: EntityTable<ISpace, "id">;
  constructor() {
    super("boards", { Y, addons: [dexieCloud] });
    this.version(1).stores({
      boards: "id,name,created_at,updated_at,realmId,doc:Y,spaceId",
      spaces: "id,title",
      realms: "@realmId",
      members: "@id,[realmId+email]",
      roles: "[realmId+name]",
    });
    this.cloud.configure({
      databaseUrl: process.env.NEXT_PUBLIC_DEXIE_CLOUD_DB_URL!,
      // Enable Y.js awareness
      awarenessProtocol: awarenessProtocol,
      customLoginGui: true,
      requireAuth: false,
      tryUseServiceWorker: true,
      periodicSync: {
        minInterval: 1 * 60 * 60 * 1000,
      }
    });
    // this.cloud.sync();
  }
  getBoard(id: string) {
    return this.boards.get(id);
  }
  async newBoard() {
    const id = nanoid();
    const now = new Date();
    return await this.boards.add({
      id,
      name: "New Board",
      created_at: now,
      updated_at: now,
    });
  }
  async newSpace(title: string) {
    const id = nanoid();
    const now = new Date();
    return await this.spaces.add({
      id,
      title,
      created_at: now,
    });
  }
}

export const useUser = () => useObservable(db.cloud.currentUser);

export const userPromise = () =>
  new Promise<UserLogin>((resolve) => {
    db.cloud.sync().then(() => {
      resolve(db.cloud.currentUser.value);
    });
  });

export const db = new DB();

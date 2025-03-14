import Dexie, { type EntityTable } from "dexie";
import 'dexie-observable';
import dexieCloud from "dexie-cloud-addon";
import * as Y from "yjs";
import * as awarenessProtocol from "y-protocols/awareness";
import { customAlphabet } from 'nanoid';
import { useObservable } from "dexie-react-hooks";
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 23);

export interface Board {
  id: string;
  order: number;
  name: string;
  doc: Y.Doc;
  thumbnail?: string;
  created_at: Date;
  updated_at: Date;
  realmId?: string;
  owner?: string;
  spaceId?: string;
}

class DB extends Dexie {
  boards!: EntityTable<Board, "id">;
  constructor() {
    super("boards", { Y, addons: [dexieCloud] });
    this.version(1).stores({
      boards: "id,order,name,created_at,updated_at,realmId,doc:Y,spaceId",
      realms: "@realmId",
      members: "@id,[realmId+email]",
      roles: "[realmId+name]",
    });
    this.cloud.configure({
      databaseUrl: import.meta.env.VITE_DEXIE_CLOUD_DB_URL!,
      // Enable Y.js awareness
      awarenessProtocol: awarenessProtocol,
      customLoginGui: true,
      requireAuth: false,
    });
    this.cloud.sync();
  }
  getBoard(id: string) {
    return this.boards.get(id);
  }
  async newBoard() {
    const id = nanoid();
    const lastBoard = await this.boards.orderBy("order").last();
    const order = lastBoard ? lastBoard.order + 1 : 0;
    const now = new Date();
    return await this.boards.add({
      id,
      order,
      name: "New Board",
      created_at: now,
      updated_at: now,
    });
  }
}

export const useUser = () => useObservable(db.cloud.currentUser);

export const db = new DB();

import Dexie, { type EntityTable } from "dexie";
// import 'dexie-observable';
import dexieCloud, { DBRealmMember, UserLogin } from "dexie-cloud-addon";
import * as Y from "yjs";
import * as awarenessProtocol from "y-protocols/awareness";
import { customAlphabet } from "nanoid";
import { useObservable } from "dexie-react-hooks";
import { FileHelpers, TLAssetId, TLAssetStore, uniqueId } from "tldraw";
const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet, 23);

type BoardAssets = {
  [name: string]: Blob;
};
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
  assets?: BoardAssets;
}

export interface ISpace {
  id: string;
  title: string;
  created_at: Date;
  boards?: string[];
}

class DB extends Dexie {
  boards!: EntityTable<Board, "id">;
  spaces!: EntityTable<ISpace, "id">;
  constructor() {
    super("boards", { Y, addons: [dexieCloud] });
    this.version(1).stores({
      boards: "id,name,created_at,updated_at,realmId,doc:Y",
      spaces: "id,title",
      realms: "@realmId",
      members: "@id,[realmId+email]",
      roles: "[realmId+name]",
    });
    this.cloud.configure({
      databaseUrl: import.meta.env.PUBLIC_DEXIE_CLOUD_DB_URL!,
      // Enable Y.js awareness
      awarenessProtocol: awarenessProtocol,
      customLoginGui: true,
      requireAuth: false,
      tryUseServiceWorker: true,
      periodicSync: {
        minInterval: 1 * 60 * 60 * 1000,
      },
    });
  }
  getBoard(id: string) {
    return this.boards.get(id);
  }
  newBoard() {
    return this.transaction("rw", db.realms, db.boards, async () => {
      const id = nanoid();
      const now = new Date();
      // Create a new realm
      const newRealmId = await db.realms.add({
        name: `New Board`,
        represents: `a board`,
      });
      // Create board and put it in the new realm.
      return await this.boards.add({
        id,
        name: "New Board",
        created_at: now,
        updated_at: now,
        realmId: newRealmId,
      });
    });
  }
  async addMember(board: Board, email: string, role: string) {
    const exist = await this.members.get({ realmId: board.realmId!, email });
    if (exist) {
      return this.members.update(exist.id, { roles: [role] });
    }
    return this.members.add({
      realmId: board.realmId!,
      email,
      roles: [role],
      invite: true,
    });
  }
  async deleteMember(member: DBRealmMember) {
    return this.members.delete(member.id);
  }
  async updateBoard(member: DBRealmMember, role: string) {
    return this.members.update(member.id, { roles: [role] });
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

const boardsRegex = /^\/b\/([^/]+?)\/?$/i;

export const assetsStore: TLAssetStore = {
  upload: async (asset, file) => {
    const id = boardsRegex.exec(location.pathname)?.[1];
    if (!id) {
      throw new Error("No board id found");
    }
    const board = await db.getBoard(id);
    if (!board) {
      throw new Error("No board found");
    }
    db.boards.update(id, {
      assets: {
        ...board.assets,
        [asset.id]: file,
      },
    });
    return { src: `${location.origin}/b/${id}/${asset.id}` };
  },
  remove: async (assets) => {
    const id = boardsRegex.exec(location.pathname)?.[1];
    if (!id) {
      throw new Error("No board id found");
    }
    db.boards
      .where("id")
      .equals(id)
      .modify((board) => {
        board.assets = Object.fromEntries(
          Object.entries(board.assets ?? {}).filter(
            ([key]) => !assets.includes(key as TLAssetId)
          )
        );
      });
  },
  resolve: async (asset) => {
    return asset.props.src;
  },
};

import { db } from "@/db";
import { DexieYProvider } from "dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  computed,
  createPresenceStateDerivation,
  createTLStore,
  defaultShapeUtils,
  defaultUserPreferences,
  getUserPreferences,
  InstancePresenceRecordType,
  loadSnapshot,
  react,
  SerializedSchema,
  setUserPreferences,
  TLAnyShapeUtilConstructor,
  TLInstancePresence,
  TLRecord,
  TLStoreWithStatus,
} from "tldraw";
import { YKeyValue } from "y-utility/y-keyvalue";
import * as Y from "yjs";
// import { useBoardId } from ".";

export default function useStoreHook(
  shapeUtils: TLAnyShapeUtilConstructor[] = []
) {
  const id = useParams().id!;
  const [storeWithStatus, setStoreWithStatus] = useState<TLStoreWithStatus>({
    status: "loading",
  });
  const doc = useLiveQuery(
    () => db.boards.get(id, (b) => b?.doc ?? false),
    [id]
  );
  const notFound = doc === false;
  useEffect(() => {
    const unsubs: (() => void)[] = [];
    // Create the store
    const store = createTLStore({
      shapeUtils: [...defaultShapeUtils, ...shapeUtils],
    });
    if (!doc) {
      setStoreWithStatus({
        store: store,
        status: "not-synced",
      });
      return;
    }

    const yDoc = doc;
    const yArr = doc.getArray<{ key: string; val: TLRecord }>();
    const yStore = new YKeyValue(yArr);
    const meta = doc.getMap<SerializedSchema>("meta");
    const provider = DexieYProvider.load(doc);

    const abortController = new AbortController();
    window.addEventListener(
      "beforeunload",
      () => {
        provider.awareness.setLocalState(null);
      },
      { signal: abortController.signal }
    );

    // function handleSync() {
    unsubs.push(
      store.listen(
        function syncStoreChangesToYjsDoc({ changes }) {
          yDoc.transact(() => {
            Object.values(changes.added).forEach((record) => {
              yStore.set(record.id, record);
            });

            Object.values(changes.updated).forEach(([, record]) => {
              yStore.set(record.id, record);
            });

            Object.values(changes.removed).forEach((record) => {
              yStore.delete(record.id);
            });
          });
        },
        { source: "user", scope: "document" } // only sync user's document changes
      )
    );
    // Sync the yjs doc changes to the store
    const handleChange = (
      changes: Map<
        string,
        | { action: "delete"; oldValue: TLRecord }
        | { action: "update"; oldValue: TLRecord; newValue: TLRecord }
        | { action: "add"; newValue: TLRecord }
      >,
      transaction: Y.Transaction
    ) => {
      if (transaction.local) return;

      const toRemove: TLRecord["id"][] = [];
      const toPut: TLRecord[] = [];

      changes.forEach((change, id) => {
        switch (change.action) {
          case "add":
          case "update": {
            const record = yStore.get(id)!;
            toPut.push(record);
            break;
          }
          case "delete": {
            toRemove.push(id as TLRecord["id"]);
            break;
          }
        }
      });

      // put / remove the records in the store
      store.mergeRemoteChanges(() => {
        if (toRemove.length) store.remove(toRemove);
        if (toPut.length) store.put(toPut);
      });
    };
    yStore.on("change", handleChange);
    unsubs.push(() => yStore.off("change", handleChange));
    /* -------------------- Awareness ------------------- */

    const yClientId = provider.awareness.clientID.toString();
    setUserPreferences({ ...getUserPreferences(), id: yClientId });

    const userPreferences = computed<{
      id: string;
      color: string;
      name: string;
    }>("userPreferences", () => {
      const user = getUserPreferences();
      return {
        id: user.id,
        color: user.color ?? defaultUserPreferences.color,
        name: user.name ?? defaultUserPreferences.name,
      };
    });
    // Create the instance presence derivation
    const presenceId = InstancePresenceRecordType.createId(yClientId);
    const presenceDerivation = createPresenceStateDerivation(
      userPreferences,
      presenceId
    )(store);

    // Set our initial presence from the derivation's current value
    provider.awareness.setLocalStateField("presence", presenceDerivation.get());

    // When the derivation change, sync presence to to yjs awareness
    unsubs.push(
      react("when presence changes", () => {
        const presence = presenceDerivation.get();
        requestAnimationFrame(() => {
          provider.awareness.setLocalStateField("presence", presence);
        });
      })
    );

    // Sync yjs awareness changes to the store
    const handleUpdate = (update: {
      added: number[];
      updated: number[];
      removed: number[];
    }) => {
      const states = provider.awareness.getStates() as Map<
        number,
        { presence: TLInstancePresence }
      >;

      const toRemove: TLInstancePresence["id"][] = [];
      const toPut: TLInstancePresence[] = [];

      // Connect records to put / remove
      for (const clientId of update.added) {
        const state = states.get(clientId);
        if (state?.presence && state.presence.id !== presenceId) {
          toPut.push(state.presence);
        }
      }

      for (const clientId of update.updated) {
        const state = states.get(clientId);
        if (state?.presence && state.presence.id !== presenceId) {
          toPut.push(state.presence);
        }
      }

      for (const clientId of update.removed) {
        toRemove.push(InstancePresenceRecordType.createId(clientId.toString()));
      }

      // put / remove the records in the store
      store.mergeRemoteChanges(() => {
        if (toRemove.length) store.remove(toRemove);
        if (toPut.length) store.put(toPut);
      });
    };

    provider.awareness.on("update", handleUpdate);
    unsubs.push(() => provider.awareness.off("update", handleUpdate));
    // 2.
    // Initialize the store with the yjs doc records—or, if the yjs doc
    // is empty, initialize the yjs doc with the default store records.
    if (yStore.yarray.length) {
      // Replace the store records with the yjs doc records
      const ourSchema = store.schema.serialize();
      const theirSchema = meta.get("schema");
      if (!theirSchema) {
        throw new Error("No schema found in the yjs doc");
      }

      const records = yStore.yarray.toJSON().map(({ val }) => val);

      const migrationResult = store.schema.migrateStoreSnapshot({
        schema: theirSchema,
        store: Object.fromEntries(records.map((record) => [record.id, record])),
      });
      if (migrationResult.type === "error") {
        // if the schema is newer than ours, the user must refresh
        console.error(migrationResult.reason);
        window.alert("The schema has been updated. Please refresh the page.");
        return;
      }

      yDoc.transact(() => {
        // delete any deleted records from the yjs doc
        for (const r of records) {
          if (!migrationResult.value[r.id]) {
            yStore.delete(r.id);
          }
        }
        for (const r of Object.values(migrationResult.value) as TLRecord[]) {
          yStore.set(r.id, r);
        }
        meta.set("schema", ourSchema);
      });

      loadSnapshot(store, {
        store: migrationResult.value,
        schema: ourSchema,
      });
    } else {
      // Create the initial store records
      // Sync the store records to the yjs doc
      yDoc.transact(() => {
        for (const record of store.allRecords()) {
          yStore.set(record.id, record);
        }
        meta.set("schema", store.schema.serialize());
      });
    }

    provider.whenLoaded.then(() => {
      setStoreWithStatus({
        store,
        status: "synced-remote",
        connectionStatus: "online",
      });
    });

    provider.addCleanupHandler(() => {
      provider.awareness.setLocalState(null);
    });

    return () => {
      provider.awareness.setLocalState(null);
      abortController.abort();
      setStoreWithStatus({ status: "loading" });
      store.dispose();
      if (doc) {
        DexieYProvider.release(doc, {
          gracePeriod: 100 // Grace period to optimize for unload/reload scenarios
        });
      }
      unsubs.forEach((fn) => fn());
      unsubs.length = 0;
    };
  }, [doc, shapeUtils]);
  return { storeWithStatus, notFound };
}

import {
  InstancePresenceRecordType,
  TLAnyShapeUtilConstructor,
  TLInstancePresence,
  TLRecord,
  TLStoreWithStatus,
  computed,
  createPresenceStateDerivation,
  createTLStore,
  defaultShapeUtils,
  defaultUserPreferences,
  getUserPreferences,
  setUserPreferences,
  react,
  SerializedSchema,
  loadSnapshot,
} from "tldraw";
import { useEffect, useMemo, useState } from "react";
import { YKeyValue } from "y-utility/y-keyvalue";
import * as Y from "yjs";
import { assetsStore } from "@/db";
import {DexieYProvider} from "dexie";
import {useBoard} from "@/components/board/board-context.ts";

// Modified from https://github.com/tldraw/tldraw-yjs-example/blob/main/src/useYjsStore.ts
export function useYjsStore({
  shapeUtils = [],
}: Partial<{
  version: number;
  shapeUtils: TLAnyShapeUtilConstructor[];
}>) {
  const { board: {doc} } = useBoard();

  const [storeWithStatus, setStoreWithStatus] = useState<TLStoreWithStatus>({
    status: "loading",
  });

  const { yDoc, yStore, meta } = useMemo(() => {
    const yDoc = doc;
    const yArr = yDoc.getArray<{ key: string; val: TLRecord }>();
    const yStore = new YKeyValue(yArr);
    const meta = yDoc.getMap<SerializedSchema>("meta");

    return {
      yDoc,
      yStore,
      meta,
    };
  }, [doc]);

  useEffect(() => {
    setStoreWithStatus({ status: "loading" });
    const store = createTLStore({
      shapeUtils: [...defaultShapeUtils, ...shapeUtils],
      assets: assetsStore,
    });
    const unsub: (() => void)[] = [];
    const room = DexieYProvider.load(yDoc);
    unsub.push(() => {
      DexieYProvider.release(yDoc);
      // room.awareness.setLocalState(null);
    });

    const abortController = new AbortController();
    window.addEventListener(
      "beforeunload",
      () => {
        room.awareness.setLocalState(null);
      },
      { signal: abortController.signal },
    );

    function handleSync() {
      // 1.
      // Connect store to yjs store and vis versa, for both the document and awareness

      /* -------------------- Document -------------------- */

      // Sync store changes to the yjs doc
      unsub.push(
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
          { source: "user", scope: "document" }, // only sync user's document changes
        ),
      );

      // Sync the yjs doc changes to the store
      const handleChange = (
        changes: Map<
          string,
          | { action: "delete"; oldValue: TLRecord }
          | { action: "update"; oldValue: TLRecord; newValue: TLRecord }
          | { action: "add"; newValue: TLRecord }
        >,
        transaction: Y.Transaction,
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
          if (toPut.length) {
            try {
              store.put(toPut);
            } catch {
              const ourSchema = store.schema.serialize();
              const theirSchema = meta.get("schema");
              if (!theirSchema) {
                throw new Error("No schema found in the yjs doc");
              }
              const migrationResult = store.schema.migrateStoreSnapshot({
                schema: theirSchema,
                store: Object.fromEntries(
                  toPut.map((record) => [record.id, record]),
                ),
              });
              if (migrationResult.type === "error") {
                console.error(migrationResult.reason);
                // window.alert(
                //   "The schema has been updated. Please refresh the page."
                // );
                return;
              }
              yDoc.transact(() => {
                // delete any deleted records from the yjs doc
                for (const r of toPut) {
                  if (!migrationResult.value[r.id]) {
                    yStore.delete(r.id);
                  }
                }
                for (const r of Object.values(
                  migrationResult.value,
                ) as TLRecord[]) {
                  yStore.set(r.id, r);
                }
                meta.set("schema", ourSchema);
              });
              store.put(
                Object.entries(migrationResult.value).map(
                  ([, record]) => record,
                ),
              );
            }
          }
        });
      };

      yStore.on("change", handleChange);
      unsub.push(() => yStore.off("change", handleChange));

      /* -------------------- Awareness ------------------- */

      const yClientId = room.awareness.clientID.toString();
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
        presenceId,
      )(store);

      // Set our initial presence from the derivation's current value
      room.awareness.setLocalStateField("presence", presenceDerivation.get());

      // When the derivation change, sync presence to to yjs awareness
      unsub.push(
        react("when presence changes", () => {
          const presence = presenceDerivation.get();
          requestAnimationFrame(() => {
            room.awareness.setLocalStateField("presence", presence);
          });
        }),
      );

      // Sync yjs awareness changes to the store
      const handleUpdate = (update: {
        added: number[];
        updated: number[];
        removed: number[];
      }) => {
        const states = room.awareness.getStates() as Map<
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
          toRemove.push(
            InstancePresenceRecordType.createId(clientId.toString()),
          );
        }

        // put / remove the records in the store
        store.mergeRemoteChanges(() => {
          if (toRemove.length) store.remove(toRemove);
          if (toPut.length) store.put(toPut);
        });
      };

      room.awareness.on("update", handleUpdate);
      unsub.push(() => room.awareness.off("update", handleUpdate));

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
          store: Object.fromEntries(
            records.map((record) => [record.id, record]),
          ),
        });
        if (migrationResult.type === "error") {
          // if the schema is newer than ours, the user must refresh
          console.error(migrationResult.reason);
          //   window.alert("The schema has been updated. Please refresh the page.");
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

      setStoreWithStatus({
        store,
        status: "synced-remote",
        connectionStatus: "online",
      });
    }

    room.whenLoaded.then(() => {
      handleSync();
    });

    room.addCleanupHandler(() => {
      room.awareness.setLocalState(null);
    });

    return () => {
      room.awareness.setLocalState(null);
      abortController.abort();
      unsub.forEach((fn) => fn());
      unsub.length = 0;
    };
  }, [yDoc, yStore, meta]);

  return storeWithStatus;
}

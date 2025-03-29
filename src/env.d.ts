/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly PUBLIC_DEXIE_CLOUD_DB_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

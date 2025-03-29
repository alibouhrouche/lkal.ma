import "dexie-cloud-addon/service-worker";
import { db } from "./db";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from "workbox-precaching";
import { clientsClaim } from "workbox-core";
declare let self: ServiceWorkerGlobalScope;
self.skipWaiting();
clientsClaim();
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

const boardView = /\/b\/([^/]+?)\/?$/i;
const boardAssets = /\/b\/([^/]+?)\/(asset:[^/]+?)\/?$/i;

if (import.meta.env.PROD) {
  const boardsSpa = createHandlerBoundToURL("/b");
  registerRoute(boardView, boardsSpa);
}

registerRoute(boardAssets, async ({ url, params }) => {
    const [id, assetId] = (Array.isArray(params) ? params : boardAssets.exec(url.pathname)?.slice(1)) as [string, string];
    const board = await db.boards.get(id);
    if (!board) {
      return new Response("Not found", { status: 404 });
    }
    const assets = board.assets;
    if (!assets) {
      return new Response("Not found", { status: 404 });
    }
    const file = assets[assetId];
    if (!file) {
      return new Response("Not found", { status: 404 });
    }
    return new Response(file);
  }
)

registerRoute(
  ({ url }) => {
    return url.host === "image.pollinations.ai"
  },
  new StaleWhileRevalidate({
    cacheName: "images",
  })
);

registerRoute(
  ({ request, url }) => {
    return request.destination === "image" && url.host === "gravatar.com";
  },
  new StaleWhileRevalidate({
    cacheName: "avatars",
  })
);

registerRoute(new NavigationRoute(createHandlerBoundToURL('/404')))

import "dexie-cloud-addon/service-worker";
import { db, userPromise } from "./db";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from "workbox-precaching";

declare let self: ServiceWorkerGlobalScope;
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});
cleanupOutdatedCaches();

const boardView = /\/b\/([^/]+?)\/?$/i;
const boardAssets = /\/b\/([^/]+?)\/(asset:[^/]+?)\/?$/i;

const networkFallback = ({ request }: { request: Request }) => fetch(request);

registerRoute("/", async (props) => {
  const user = await userPromise();
  if (user?.isLoggedIn) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/boards",
      },
    });
  }
  return homepage(props);
});

precacheAndRoute(self.__WB_MANIFEST);

const boards = import.meta.env.PROD
  ? createHandlerBoundToURL("/b")
  : networkFallback;
registerRoute(boardView, boards);

const homepage = import.meta.env.PROD
  ? createHandlerBoundToURL("/")
  : networkFallback;

registerRoute(boardAssets, async ({ url, params }) => {
  const [id, assetId] = (
    Array.isArray(params) ? params : boardAssets.exec(url.pathname)?.slice(1)
  ) as [string, string];
  const board = await db.boards.get(id);
  const file = board?.assets?.[assetId];
  if (!file) {
    return new Response("Not found", { status: 404 });
  }
  return new Response(file);
});

registerRoute(
  ({ url }) => {
    return url.host === "image.pollinations.ai";
  },
  new StaleWhileRevalidate({
    cacheName: "images",
    fetchOptions: {
      mode: "cors",
      credentials: "omit",
    },
  }),
);

registerRoute(
  ({ request, url }) => {
    return request.destination === "image" && url.host === "gravatar.com";
  },
  new StaleWhileRevalidate({
    cacheName: "avatars",
  }),
);

registerRoute(
  new NavigationRoute(
    import.meta.env.PROD ? createHandlerBoundToURL("/404") : networkFallback,
  ),
);

import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { CacheFirst, NavigationRoute, RegExpRoute, Serwist, StaleWhileRevalidate } from "serwist";
import { db, userPromise } from "./db";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    // Change this attribute's name to your `injectionPoint`.
    // `injectionPoint` is an InjectManifest option.
    // See https://serwist.pages.dev/docs/build/configuring
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const isProd = process.env.NODE_ENV === "production";
const networkFallback = ({ request }: { request: Request }) => fetch(request);

const boardView = /\/b\/([^/]+?)\/?$/i;
const boardAssets = /\/b\/([^/]+?)\/(asset:[^/]+?)\/?$/i;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: false,
  clientsClaim: false,
  navigationPreload: false,
  precacheOptions: {
    cleanupOutdatedCaches: true,
    cleanURLs: true,
  }
});

const boards = isProd
  ? serwist.createHandlerBoundToUrl("/b/[id].html")
  : networkFallback;

const homepage = isProd
  ? serwist.createHandlerBoundToUrl("index.html")
  : networkFallback;

serwist.registerCapture("/", async (props) => {
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

serwist.registerRoute(new NavigationRoute(boards, {
  allowlist: [boardView],
}));

serwist.registerRoute(new RegExpRoute(boardAssets, async ({ url, params }) => {
  const [id, assetId] = (
    Array.isArray(params) ? params : boardAssets.exec(url.pathname)?.slice(1)
  ) as [string, string];
  const board = await db.boards.get(id);
  const file = board?.assets?.[assetId];
  if (!file) {
    return new Response("Not found", { status: 404 });
  }
  return new Response(file);
}));

serwist.registerCapture(
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

serwist.registerCapture(
  ({ request, url }) => {
    return request.destination === "image" && url.host === "gravatar.com";
  },
  new StaleWhileRevalidate({
    cacheName: "avatars",
  }),
);

// serwist.registerCapture(
//   ({ url }) => {
//     return url.host === "cdn.tldraw.com";
//   },
//   new CacheFirst({
//     cacheName: "tldraw",
//     fetchOptions: {
//       mode: "cors",
//       credentials: "omit",
//     },
//   }),
// )

serwist.registerCapture(
  new NavigationRoute(
    isProd ? serwist.createHandlerBoundToUrl("/404.html") : networkFallback,
  ),
);

serwist.addEventListeners();

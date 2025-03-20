import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.tsx";
import Providers from "./Providers.tsx";

/*
 * This is a workaround for a bug that occurs when TLDraw is used with dexie-cloud-addon.
 * The bug is that TLDraw patches the Uint8Array prototype with a fromBase64 method, which
 * causes a conflict with dexie-cloud-addon's that uses ("fromBase64" in Uint8Array) to check
 * if both fromBase64 and toBase64 methods are available, but since TLDraw only adds fromBase64,
 * dexie-cloud-addon throws an error.
 *
 * This workaround adds a toBase64 method to the ArrayBuffer prototype, which is used by dexie-cloud-addon
 * to convert an ArrayBuffer to a base64 string, the method is the same as the one defined by dexie-cloud-addon
 * if the check ("fromBase64" in Uint8Array) is false.
 *
 * The workaround is only applied if the method is not already defined in the ArrayBuffer prototype.
 *
 * The TLDraw patching of the Uint8Array prototype is done by core-js, which is a dependency of TLDraw.
 */
if ("toBase64" in ArrayBuffer.prototype === false) {
  // @ts-expect-error - Monkey patching ArrayBuffer
  ArrayBuffer.prototype.toBase64 = function () {
    const u8a = ArrayBuffer.isView(this)
      ? (this as Uint8Array)
      : new Uint8Array(this);
    const CHUNK_SIZE = 4096;
    const strs = [];
    for (let i2 = 0, l2 = u8a.length; i2 < l2; i2 += CHUNK_SIZE) {
      const chunk = u8a.subarray(i2, i2 + CHUNK_SIZE) as unknown as number[];
      strs.push(String.fromCharCode.apply(null, chunk));
    }
    return btoa(strs.join(""));
  };
}

// Remove the title tag from the head to prevent the title from being set twice
document.head.removeChild(document.getElementsByTagName("title")[0]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Providers>
        <App />
      </Providers>
    </BrowserRouter>
  </StrictMode>
);

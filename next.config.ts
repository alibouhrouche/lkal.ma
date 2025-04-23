import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";
import withNextraInit from "nextra";
import { globSync } from "glob";
import path from "path";
import crypto from "node:crypto";
import { readFileSync, type PathOrFileDescriptor } from "node:fs";
export const getFileHash = (file: PathOrFileDescriptor) => crypto.createHash("md5").update(readFileSync(file)).digest("hex");

const revision = crypto.randomUUID();
const pages = [
    "/index.html", 
    "/404.html", 
    "/b/[id].html", 
    "/boards.html", 
    "/docs.html",
    "/docs/components/button.html",
    "/docs/components/data.html",
    "/docs/components/image.html",
    "/docs/components/instructions.html",
    "/docs/components/text.html",
];

const publicDir = path.resolve("public");

const publicScan = globSync(["**/*"], {
    nodir: true,
    cwd: publicDir,
    ignore: ["swe-worker-*.js", "sw.js", "sw.js.map", "_redirects"],
});

const withSerwist = withSerwistInit({
    register: false,
    swSrc: "src/sw.ts",
    swDest: "public/sw.js",
    reloadOnOnline: false,
    maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
    additionalPrecacheEntries: [...publicScan.map((f) => ({
        url: path.posix.join("/", f),
        revision: getFileHash(path.join(publicDir, f)),
    })), ...pages.map((page) => ({
        url: page,
        revision,
    }))],
});

const withNextra = withNextraInit({
    theme: './src/theme.tsx',
    themeConfig: './src/theme.config.tsx',
});

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: true,
    distDir: "dist",
    output: "export",
    experimental: {
        reactCompiler: true,
    },
    images: {
        unoptimized: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default withSerwist(withNextra(nextConfig));

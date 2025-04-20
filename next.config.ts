import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";
import createMDX from "@next/mdx";
import withNextraInit from "nextra";
const revision = crypto.randomUUID();

const withSerwist = withSerwistInit({
    // disable: process.env.NODE_ENV !== "production",
    swSrc: "src/sw.ts",
    swDest: "public/sw.js",
    // injectionPoint: "self.__WB_MANIFEST",
    additionalPrecacheEntries: [
        { url: "index.html", revision },
        { url: "404.html", revision },
        { url: "b/[id].html", revision },
    ],
});

const withNextra = withNextraInit({
    
});

const withMDX = createMDX({
    // Add markdown plugins here, as desired
});

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: true,
    distDir: "dist",
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
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

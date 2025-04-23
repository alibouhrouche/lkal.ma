import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import { Geist, Geist_Mono } from "next/font/google";
import AppGlobals from "@/components/app-globals";
import { ReactElement, ReactNode } from "react";
import { ProgressProvider } from '@bprogress/next/pages';
import { NextPage } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/pages";

const geistSans = Geist({
    variable: "--font-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-mono",
    subsets: ["latin"],
});

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
    const getLayout = Component.getLayout ?? ((page) => page);
    return (
        <main className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <ProgressProvider
                    height="4px"
                    color="#a855f7"
                    options={{ showSpinner: false }}
                    shallowRouting
                >
                    <NuqsAdapter>
                        {getLayout(<Component {...pageProps} />)}
                    </NuqsAdapter>
                </ProgressProvider>
                <AppGlobals />
            </ThemeProvider>
        </main>
    );
}

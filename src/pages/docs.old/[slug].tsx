import Navbar from "@/components/navbar/navbar";
import AllMaps from "@/docs";
import { getDocsFiles, getMDXPaths, getMDXProps } from "@/utils";
import type { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from "next";
import Head from "next/head";
import { use, useMemo } from "react";

// export const getStaticProps = (async (context) => {
//     return {
//         props: await getMDXProps(context.params?.slug as string),
//     };
// }) satisfies GetStaticProps<{
//     slug: string;
// }>

// export const getStaticPaths = (async () => {
//     return {
//         paths: getMDXPaths(),
//         fallback: false,
//     }
// }) satisfies GetStaticPaths



export default function Page({
    metadata,
    slug,
}: InferGetStaticPropsType<typeof getStaticProps>) {
    const Content = AllMaps[slug as keyof typeof AllMaps];
   return <div>
    <Head>
        <title>
            {`${metadata.title} - Lkal.ma`}
        </title>
    </Head>
    <Navbar />
    <div className="container mx-auto">
        <Content />
    </div>
   </div>
}

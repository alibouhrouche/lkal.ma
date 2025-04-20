import Navbar from "@/components/navbar/navbar";
import { GetStaticPaths } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Page() {
    const router = useRouter()
   return <div>
    <Head>
        <title>
            Docs - Lkal.ma
        </title>
    </Head>
    <Navbar />
   </div>
}

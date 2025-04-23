import {SyncStatus} from "@/components/sync-status.tsx";
import {ModeToggle} from "@/components/mode-toggle.tsx";
import LoginButton from "@/components/board/login-button.tsx";
import {Logo} from "@/components/logo.tsx";
import Link from "next/link";
import BoardsGrid from "@/components/boards";
import Head from "next/head";
import Navbar from "@/components/navbar/navbar";

export default function Index() {
    return (
        <div>
            <Head>
                <title>Boards - Lkal.ma</title>
                <meta name="description" content="Lkal.ma Boards" />
            </Head>
            <Navbar className="sticky top-0 z-10" />
            {/* <div className="w-full h-16 bg-card flex items-center p-4 justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/" className="relative flex gap-4 items-center">
                        <Logo />
                        <div className="text-2xl">Boards</div>
                    </Link>
                </div>
                <div className="sm:absolute sm:left-1/2 transform sm:-translate-x-1/2">
                    <SyncStatus />
                </div>
                <div className="flex gap-4 items-center">
                    <ModeToggle />
                    <LoginButton />
                </div>
            </div> */}
            <BoardsGrid />
        </div>
    );
}
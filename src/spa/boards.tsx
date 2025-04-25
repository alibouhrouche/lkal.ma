import LoginButton from "@/components/board/login-button";
import { Logo } from "@/components/logo";
import { ModeToggle } from "@/components/mode-toggle";
import { SyncStatus } from "@/components/sync-status";
import BoardsGrid from "@/components/boards";
import Title from "@/components/title";

export default function Boards() {
    return <div>
        <Title key="title">Boards</Title>
        <div className="w-full h-16 bg-card flex items-center p-4 justify-between">
            <div className="flex items-center gap-2">
                <a href="/" className="relative flex gap-4 items-center">
                    <Logo />
                    <div className="text-2xl">Boards</div>
                </a>
            </div>
            <div className="sm:absolute sm:left-1/2 transform sm:-translate-x-1/2">
                <SyncStatus />
            </div>
            <div className="flex gap-4 items-center">
                <ModeToggle />
                <LoginButton />
            </div>
        </div>
        <BoardsGrid />
    </div>
}
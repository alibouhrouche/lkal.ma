import { buttonVariants } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { Logo } from "./logo";
import { ModeToggle } from "./mode-toggle";
import LoginButton from "./board/login-button";
import { SidebarTrigger } from "./ui/sidebar";
import Head from "next/head";
import Link from "next/link";
import Navbar from "./navbar/navbar";

export default function NotFound() {
  return (
    <div className="flex flex-col h-full">
      <Navbar className="sticky top-0 z-10" sidebarTrigger={<SidebarTrigger />} />
      {/* <div className="w-full h-16 bg-card flex items-center p-4 justify-between">
        <div className="flex gap-4 items-center">
          <SidebarTrigger />
          <Link href="/boards">
            <Logo />
          </Link>
        </div>
        <div className="flex gap-4 items-center">
          <ModeToggle />
          <LoginButton />
        </div>
      </div> */}
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <Head>
          <title key="title">404 Not Found - Lkal.ma</title>
        </Head>
        <h1 className="text-4xl font-bold">404 Not Found</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
        <Link
          className={buttonVariants({
            variant: "link",
          })}
          href="/boards"
        >
          <ArrowLeft className="size-6" />
          See all boards
        </Link>
      </div>
    </div>
  );
}

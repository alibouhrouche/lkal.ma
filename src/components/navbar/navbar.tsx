import { cn } from "@/lib/utils";
import { Logo } from "../logo";
import { ModeToggle } from "../mode-toggle";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Skeleton } from "../ui/skeleton";

const LoginButton = dynamic(() => import("@/components/board/login-button"), {
  ssr: false,
  loading: () => <Skeleton slot="fallback" className="h-10 w-[68px]" />,
});

export default function Navbar({
  className,
  sidebarTrigger = null,
}: {
  className?: string;
  sidebarTrigger?: React.ReactNode;
}) {
  return (
    <nav className={cn("h-16 bg-background border-b border-accent", className)}>
      <div className="h-full flex items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-4">
          {sidebarTrigger}
          <Link href="/">
            <Logo />
          </Link>
        </div>

        {/* Desktop Menu */}
        <NavMenu className="hidden lg:block" />

        <div className="flex items-center gap-3">
          <ModeToggle />
          <LoginButton />

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
}

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { NavigationMenuProps } from "@radix-ui/react-navigation-menu";
import { PropsWithChildren } from "react";

const navProps = {
  className: "group-data-[orientation=vertical]:w-full",
}

const NavLink = ({ href, active, children }: PropsWithChildren<{ href: string; active?: boolean }>) => {
  return (
    <NavigationMenuItem className="group-data-[orientation=vertical]:w-full">
      <NavigationMenuLink className={navigationMenuTriggerStyle(navProps)} href={href} data-active={active}>
        {children}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

export const NavMenu = ({ pathname, ...props }: NavigationMenuProps & {
  pathname: string;
}) => {
  return <NavigationMenu {...props}>
    <NavigationMenuList className="group gap-6 space-x-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start data-[orientation=vertical]:p-2 data-[orientation=vertical]:gap-2 data-[orientation=vertical]:w-full">
      <NavLink href="/" active={pathname === "/"}>Home</NavLink>
      <NavLink href="/#features">Features</NavLink>
      <NavLink href="/#faq">FAQ</NavLink>
      <NavLink href="/boards" active={pathname.startsWith("/boards")}>Boards</NavLink>
      <NavLink href="/docs" active={pathname.startsWith("/docs")}>Docs</NavLink>
    </NavigationMenuList>
  </NavigationMenu >
};
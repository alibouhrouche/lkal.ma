import React, { PropsWithChildren } from "react";
import { AppContext } from "./context";
import { Link, LinkProps } from "wouter";
import { prefetch } from "astro:prefetch";

const linkPrefetch = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
  const target = e.currentTarget;
  if (target && target.href) {
    prefetch(target.href);
  }
}

export default function LinkComp({
  ...props
}: PropsWithChildren<
  React.AnchorHTMLAttributes<HTMLAnchorElement> & LinkProps
>) {
  const context = React.useContext(AppContext);
  if (!context) {
    return <a {...props} onMouseOver={linkPrefetch} />;
  }
  return <Link {...(props as LinkProps)} />;
}

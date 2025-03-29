import React, { PropsWithChildren } from "react";
import { AppContext } from "./context";
import { Link, LinkProps } from "wouter";

export default function LinkComp({
  ...props
}: PropsWithChildren<
  React.AnchorHTMLAttributes<HTMLAnchorElement> & LinkProps
>) {
  const context = React.useContext(AppContext);
  if (!context) {
    return <a {...props} />;
  }
  return <Link {...(props as LinkProps)} />;
}

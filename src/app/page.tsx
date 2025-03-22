"use client";

import nextDynamic from "next/dynamic";
import "../index.css";
import { Loader2 } from "lucide-react";

const Loading = () => <div className="absolute inset-0 flex items-center justify-center">
  <Loader2 className="w-10 h-10 animate-spin" />
</div>;

export const dynamic = 'force-static';

const ClientOnly = nextDynamic(() => import("./client"), { ssr: false, loading: () => <Loading /> });

export default function Page() {
  return <ClientOnly />;
}

import Layout from "@/components/layout.tsx";
import React from "react";
import AppBoard from "@/components/board/app-board";

export default function Page() {
  return <AppBoard />;
}

Page.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

"use client";

import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { routes } from "@/routes";

const router = createBrowserRouter(routes);

export default function ClientOnly() {
  return (
    <RouterProvider router={router} />
  );
}

import { Outlet, ScrollRestoration } from "react-router-dom";
import { ScrollToTopButton } from "@shared/components/layout/ScrollToTopButton";

export function RootLayout() {
  return (
    <>
      <Outlet />
      <ScrollToTopButton />
      <ScrollRestoration />
    </>
  );
}

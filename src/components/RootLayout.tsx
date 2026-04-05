import { Outlet, ScrollRestoration } from "react-router-dom";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";

export function RootLayout() {
  return (
    <>
      <Outlet />
      <ScrollToTopButton />
      <ScrollRestoration />
    </>
  );
}

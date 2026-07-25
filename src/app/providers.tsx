import { type ReactNode } from "react";
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { AuthProvider } from "@auth";

/** App-wide providers: server-state cache, auth context, and dev tooling. */
export function AppProviders({
  client,
  children,
}: {
  client: QueryClient;
  children: ReactNode;
}) {
  return (
    <QueryClientProvider client={client}>
      <AuthProvider>{children}</AuthProvider>
      {import.meta.env.DEV ? <ReactQueryDevtools initialIsOpen={false} /> : null}
    </QueryClientProvider>
  );
}

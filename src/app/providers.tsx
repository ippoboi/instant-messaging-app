"use client";

import { SessionProvider } from "next-auth/react";
import { PropsWithChildren } from "react";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <SessionProvider>{children}</SessionProvider>
      </QueryClientProvider>
    </>
  );
};

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const QueryClientWrapper = ({ children }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryClientWrapper;

import { useState } from "react";
import { AiProvider } from "../types/api";

export function useProviderChoice(defaultProvider: AiProvider = "mock") {
  const [provider, setProvider] = useState<AiProvider>(defaultProvider);
  const [openRouterConfirmed, setOpenRouterConfirmed] = useState(false);

  return {
    provider,
    setProvider,
    openRouterConfirmed,
    confirmOpenRouter: () => setOpenRouterConfirmed(true)
  };
}

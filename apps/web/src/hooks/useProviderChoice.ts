import { useState } from "react";
import { AiProvider } from "../types/api";

export function useProviderChoice(defaultProvider: AiProvider = "mock") {
  const [provider, setProvider] = useState<AiProvider>(defaultProvider);
  const [geminiConfirmed, setGeminiConfirmed] = useState(false);

  return {
    provider,
    setProvider,
    geminiConfirmed,
    confirmGemini: () => setGeminiConfirmed(true)
  };
}

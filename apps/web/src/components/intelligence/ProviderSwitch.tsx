import { AiProvider, AiStatus } from "../../types/api";

export function ProviderSwitch({
  provider,
  onChange,
  status
}: {
  provider: AiProvider;
  onChange: (provider: AiProvider) => void;
  status?: AiStatus;
}) {
  return (
    <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
      {(["mock", "gemini"] as AiProvider[]).map((item) => (
        <button
          key={item}
          onClick={() => onChange(item)}
          className={`min-w-24 rounded-full px-4 py-2 text-sm font-medium transition ${
            provider === item ? "bg-slate-950 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"
          }`}
        >
          {item === "mock" ? "Mock" : "Gemini"}
          {item === "gemini" && status && !status.gemini_configured ? " off" : ""}
        </button>
      ))}
    </div>
  );
}

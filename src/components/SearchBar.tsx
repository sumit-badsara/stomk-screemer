"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";

type Result = {
  symbol: string;
  name: string;
  exchange: string;
  sector: string;
};

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const router = useRouter();

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleChange(value: string) {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(value.trim())}`);
        const data = await res.json();
        setResults(data);
        setOpen(data.length > 0);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }

  function handleSelect(symbol: string) {
    // Extract ticker without exchange suffix for our route
    const ticker = symbol.replace(/\.(NS|BO)$/, "");
    setQuery("");
    setResults([]);
    setOpen(false);
    router.push(`/stock/${ticker}`);
  }

  return (
    <div ref={ref} className="relative w-full max-w-xs">
      <div className="btn flex items-center gap-2 bg-cream px-3 py-1.5">
        <Search size={16} strokeWidth={3} className="text-fg/60 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search stocks..."
          className="bg-transparent text-sm font-bold w-full outline-none placeholder:text-fg/40"
        />
        {loading && <Loader2 size={14} strokeWidth={3} className="animate-spin text-fg/60" />}
        {query && !loading && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setOpen(false);
            }}
          >
            <X size={14} strokeWidth={3} className="text-fg/60" />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 panel bg-cream p-1 z-50 max-h-72 overflow-y-auto">
          {results.map((r) => (
            <button
              key={r.symbol}
              onClick={() => handleSelect(r.symbol)}
              className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-lavender transition-colors flex items-center justify-between gap-2"
            >
              <div className="min-w-0">
                <div className="text-sm font-bold truncate">{r.name}</div>
                <div className="text-xs text-fg/60 font-semibold">
                  {r.symbol} &middot; {r.exchange}
                </div>
              </div>
              {r.sector && (
                <span className="text-[10px] font-bold text-fg/50 uppercase tracking-wider shrink-0">
                  {r.sector}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

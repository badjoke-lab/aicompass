"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import SortSelect from "./components/SortSelect";
import { MOCK_MODELS } from "./lib/mockModels";
import { Modality } from "./lib/types";
import { SortKey, sortModels } from "./lib/utils";

const modalities: Modality[] = ["text", "image", "audio", "video", "multimodal"];
const subscoresToShow = ["reasoning", "coding", "math", "multimodal", "safety"] as const;

export default function V4HomePage() {
  const [sortKey, setSortKey] = useState<SortKey>("total-desc");
  const [selectedVendor, setSelectedVendor] = useState<string>("all");
  const [selectedModalities, setSelectedModalities] = useState<Set<Modality>>(new Set());

  const vendorOptions = useMemo(() => {
    const seen = new Set<string>();
    return MOCK_MODELS.filter((model) => {
      if (seen.has(model.vendor.id)) return false;
      seen.add(model.vendor.id);
      return true;
    }).map((model) => model.vendor);
  }, []);

  const filteredModels = useMemo(() => {
    return MOCK_MODELS.filter((model) => {
      const okVendor = selectedVendor === "all" || model.vendor.id === selectedVendor;
      const okMod =
        selectedModalities.size === 0 || model.modality.some((mod) => selectedModalities.has(mod));
      return okVendor && okMod;
    });
  }, [selectedModalities, selectedVendor]);

  const sortedModels = useMemo(
    () => sortModels(filteredModels, sortKey),
    [filteredModels, sortKey],
  );

  const toggleModality = (modality: Modality) => {
    setSelectedModalities((prev) => {
      const next = new Set(prev);
      if (next.has(modality)) {
        next.delete(modality);
      } else {
        next.add(modality);
      }
      return next;
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">v4 preview</p>
          <h1 className="text-3xl font-bold text-slate-900">AI Model Scoreboard</h1>
        </div>
        <div className="text-xs text-slate-500">mock data</div>
      </header>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <SortSelect value={sortKey} onChange={setSortKey} />

        <div className="flex items-center gap-2 text-sm text-slate-700">
          <span className="font-medium text-slate-800">Modality</span>
          <div className="flex flex-wrap gap-2">
            {modalities.map((modality) => (
              <label
                key={modality}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  checked={selectedModalities.has(modality)}
                  onChange={() => toggleModality(modality)}
                />
                <span className="capitalize">{modality}</span>
              </label>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <span className="font-medium text-slate-800">Vendor</span>
          <select
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={selectedVendor}
            onChange={(e) => setSelectedVendor(e.target.value)}
          >
            <option value="all">All vendors</option>
            {vendorOptions.map((vendor) => (
              <option key={vendor.id} value={vendor.id}>
                {vendor.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-[70px_1.6fr_1fr_110px_1.6fr] items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <div>Rank</div>
          <div>Model</div>
          <div>Vendor</div>
          <div className="text-right">Total</div>
          <div className="text-right">Subscores</div>
        </div>

        <div className="divide-y divide-slate-200">
          {sortedModels.map((model, index) => (
            <Link
              key={model.id}
              href={`/v4/models/${model.id}`}
              className="grid grid-cols-[70px_1.6fr_1fr_110px_1.6fr] items-center gap-3 px-4 py-4 text-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <div className="flex items-center gap-2">
                <span
                  className={
                    index < 3
                      ? "flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700"
                      : "text-base font-semibold text-slate-700"
                  }
                >
                  {index + 1}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <div className="text-base font-semibold text-slate-900">{model.name}</div>
                <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                  {model.modality.map((mod) => (
                    <span
                      key={mod}
                      className="rounded-full bg-slate-100 px-2 py-0.5 font-medium capitalize text-slate-700"
                    >
                      {mod}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-sm font-medium text-slate-800">{model.vendor.name}</div>

              <div className="text-right text-xl font-bold text-slate-900">{model.total.toFixed(0)}</div>

              <div className="flex flex-wrap justify-end gap-2 text-xs">
                {subscoresToShow.map((score) => (
                  <span
                    key={score}
                    className="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold capitalize text-emerald-700"
                  >
                    {score}: {model.subscores[score].toFixed(0)}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

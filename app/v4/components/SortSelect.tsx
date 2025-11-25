import { SortKey } from "../lib/utils";

type Props = {
  value: SortKey;
  onChange: (value: SortKey) => void;
};

const OPTIONS: { value: SortKey; label: string }[] = [
  { value: "total-desc", label: "Total" },
  { value: "evidence-desc", label: "Evidence" },
  { value: "velocity-desc", label: "Velocity" },
  { value: "adoption-desc", label: "Adoption" },
  { value: "stability-desc", label: "Stability" },
];

export default function SortSelect({ value, onChange }: Props) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-600">
      <span className="font-medium text-slate-800">Sort</span>
      <select
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
      >
        {OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

"use client";

interface FilterBarProps {
  application: string;
  onApplicationChange: (v: string) => void;
  onClear: () => void;
}

const APPLICATIONS = [
  { value: "", label: "Todas Aplicacoes" },
  { value: "caminhao", label: "Caminhao" },
  { value: "carro", label: "Carro" },
];

export default function FilterBar({
  application, onApplicationChange, onClear,
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <select
        value={application}
        onChange={(e) => onApplicationChange(e.target.value)}
        className="bg-turbo-card border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-turbo-orange focus:outline-none flex-1 max-w-xs"
      >
        {APPLICATIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      {application && (
        <button
          onClick={onClear}
          className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg text-sm transition-colors"
        >
          Limpar
        </button>
      )}
    </div>
  );
}

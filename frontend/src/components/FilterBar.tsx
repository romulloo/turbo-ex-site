"use client";

interface FilterBarProps {
  category: string;
  brand: string;
  application: string;
  onCategoryChange: (v: string) => void;
  onBrandChange: (v: string) => void;
  onApplicationChange: (v: string) => void;
  onClear: () => void;
}

const CATEGORIES = [
  { value: "", label: "Todas Categorias" },
  { value: "nova", label: "Nova" },
  { value: "recondicionada", label: "Recondicionada" },
];

const BRANDS = [
  { value: "", label: "Todas Marcas" },
  { value: "garrett", label: "Garrett" },
  { value: "borgwarner", label: "BorgWarner" },
  { value: "holset", label: "Holset" },
  { value: "masterpower", label: "MasterPower" },
  { value: "turbonetics", label: "Turbonetics" },
];

const APPLICATIONS = [
  { value: "", label: "Todas Aplicacoes" },
  { value: "caminhao", label: "Caminhao" },
  { value: "carro", label: "Carro" },
  { value: "agricola", label: "Agricola" },
  { value: "industrial", label: "Industrial" },
];

export default function FilterBar({
  category, brand, application,
  onCategoryChange, onBrandChange, onApplicationChange, onClear,
}: FilterBarProps) {
  const hasFilters = category || brand || application;

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="bg-turbo-card border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-turbo-orange focus:outline-none flex-1"
      >
        {CATEGORIES.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <select
        value={brand}
        onChange={(e) => onBrandChange(e.target.value)}
        className="bg-turbo-card border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-turbo-orange focus:outline-none flex-1"
      >
        {BRANDS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <select
        value={application}
        onChange={(e) => onApplicationChange(e.target.value)}
        className="bg-turbo-card border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-turbo-orange focus:outline-none flex-1"
      >
        {APPLICATIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      {hasFilters && (
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

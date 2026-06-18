"use client";

export function InvertedToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-4 cursor-pointer p-4 border-2 border-dashed border-gray-400 bg-yellow-100 hover:bg-yellow-200 transition-colors">
      <div 
        className={`w-16 h-8 rounded-full flex items-center p-1 transition-colors ${
          checked ? "bg-red-500" : "bg-green-500"
        }`}
      >
        <div 
          className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${
            checked ? "translate-x-0" : "translate-x-8"
          }`}
        />
      </div>
      <span className="text-lg font-bold font-sans">
        {label} <span className="text-xs font-normal opacity-50">(Verde = NÃO, Vermelho = SIM)</span>
      </span>
      <input 
        type="checkbox" 
        className="sr-only" 
        checked={checked} 
        onChange={(e) => onChange(e.target.checked)} 
      />
    </label>
  );
}

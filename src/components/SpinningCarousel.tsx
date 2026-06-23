"use client";

export function SpinningCarousel({
  items,
  onSelect,
}: {
  items: string[];
  onSelect: (item: string) => void;
}) {
  return (
    <div className="w-full overflow-hidden border-4 border-magenta-500 p-4 bg-black relative h-48 flex items-center">
      {/* Absolute positioning to spin them quickly */}
      <div className="flex animate-[spin_3s_linear_infinite] gap-4 sm:gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[800px] flex-wrap justify-center">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => onSelect(item)}
            className="bg-yellow-300 text-black px-4 py-2 text-xl font-bold border-2 border-red-500 transform hover:scale-150 transition-transform m-2"
          >
            {item}
          </button>
        ))}
      </div>


    </div>
  );
}

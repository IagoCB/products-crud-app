import { useCategorias } from "../hooks/useCategorias";
import type { Category } from "@repo/types";

interface CategoriaFilterProps {
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export function CategoriaFilter({
  selectedCategory,
  onCategoryChange,
}: CategoriaFilterProps) {
  const { categorias } = useCategorias();

  return (
    <div className="w-full lg:flex lg:items-center lg:space-x-2 lg:w-auto">
      <div className="relative w-full">
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="block w-full appearance-none bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer pr-12"
        >
          <option value="">Todas as categorias</option>
          {categorias.map((cat: Category) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white">
          <svg
            className="h-4 w-4 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M7 10l5 5 5-5H7z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

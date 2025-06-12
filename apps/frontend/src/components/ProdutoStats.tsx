import { useProdutos } from "../hooks/useProdutos";
import { useCategorias } from "../hooks/useCategorias";
import type { Product, Category } from "../../../../packages/types/src/index";

interface ProdutoStatsProps {
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

export function ProdutoStats({
  selectedCategory,
  onCategoryChange,
}: ProdutoStatsProps) {
  const { produtos } = useProdutos();
  const { categorias } = useCategorias();

  const categoryMap = categorias.reduce(
    (acc: Record<string, string>, cat: Category) => {
      acc[cat.id] = cat.name;
      return acc;
    },
    {} as Record<string, string>
  );

  const filteredProdutos = selectedCategory
    ? produtos.filter(
        (produto: Product) => produto.categoryId === selectedCategory
      )
    : produtos;

  const totalProdutos = filteredProdutos.length;
  const valorTotal = filteredProdutos.reduce(
    (acc: number, produto: Product) => acc + produto.price,
    0
  );
  const produtosPorCategoria = produtos.reduce(
    (acc: Record<string, number>, produto: Product) => {
      acc[produto.categoryId] = (acc[produto.categoryId] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const getCategoryName = (categoryId: string): string => {
    return categoryMap[categoryId] || `Categoria ${categoryId}`;
  };

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      aria-label="Estatísticas de Produtos"
    >
      <div
        className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between h-32"
        role="status"
      >
        <h3 className="text-sm font-medium text-gray-500">Total de Produtos</h3>
        <div className="flex items-center justify-between mt-1">
          <p className="text-3xl font-semibold text-indigo-600">
            {totalProdutos}
          </p>
          <div className="bg-indigo-100 p-3 rounded-full" aria-hidden="true">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div
        className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between h-32"
        role="status"
      >
        <h3 className="text-sm font-medium text-gray-500">Valor Total</h3>
        <div className="flex items-center justify-between mt-1">
          <p className="text-3xl font-semibold text-green-600">
            R$ {valorTotal.toFixed(2)}
          </p>
          <div className="bg-green-100 p-3 rounded-full" aria-hidden="true">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V9m0 3v2m0 3v1m0-13a9 9 0 110 18 9 9 0 010-18z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div
        className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between"
        role="status"
      >
        <h3 className="text-sm font-medium text-gray-500 mb-2">
          Produtos por Categoria
        </h3>
        <div className="space-y-2">
          {Object.entries(produtosPorCategoria).length > 0 ? (
            <>
              {Object.entries(produtosPorCategoria)
                .sort(([categoryIdA], [categoryIdB]) => {
                  const nameA = getCategoryName(categoryIdA);
                  const nameB = getCategoryName(categoryIdB);
                  return nameA.localeCompare(nameB);
                })
                .map(([categoryId, quantidade]) => (
                  <button
                    key={categoryId}
                    onClick={() =>
                      onCategoryChange(
                        selectedCategory === categoryId ? null : categoryId
                      )
                    }
                    className={`w-full flex justify-between items-center text-sm p-2 rounded bg-white hover:bg-gray-50 ${
                      selectedCategory === categoryId ? "bg-indigo-50" : ""
                    }`}
                    aria-label={`Categoria ${getCategoryName(categoryId)}: ${quantidade} produtos`}
                  >
                    <span className="text-gray-700 font-medium">
                      {getCategoryName(categoryId)}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {quantidade}
                    </span>
                  </button>
                ))}
            </>
          ) : (
            <p className="text-gray-500 text-sm">
              Nenhuma categoria encontrada.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

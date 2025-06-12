import { useState } from "react";
import { ProdutoTable } from "./components/ProdutoTable";
import { ProdutoForm } from "./components/ProdutoForm";
import { ProdutoStats } from "./components/ProdutoStats";
import { CategoriaFilter } from "./components/CategoriaFilter";
import type { Product } from "@repo/types";

function App() {
  const [selectedProduto, setSelectedProduto] = useState<Product | undefined>();
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedProduto(undefined);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduto(product);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col items-center justify-center">
      <div className="w-full py-6 px-4 md:px-6 lg:px-8 lg:max-w-7xl lg:mx-auto">
        <div className="py-6">
          <div className="flex flex-col md:flex-row md:justify-between mb-8 w-full md:items-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 md:my-0 md:leading-none">
              Gerenciamento de Produtos
            </h1>
            <div className="space-y-4 lg:flex lg:flex-row lg:items-center lg:space-x-4 lg:space-y-0 w-full lg:w-auto">
              <CategoriaFilter
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
              <button
                onClick={() => {
                  setSelectedProduto(undefined);
                  setShowForm(true);
                }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 w-full lg:w-auto"
              >
                Novo Produto
              </button>
            </div>
          </div>

          <ProdutoStats />

          {showForm && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white p-8 rounded-lg max-w-md w-full shadow-2xl relative">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  {selectedProduto ? "Editar Produto" : "Novo Produto"}
                </h2>
                <ProdutoForm
                  produto={selectedProduto}
                  onSuccess={handleFormSuccess}
                />
                <button
                  onClick={() => {
                    setShowForm(false);
                    setSelectedProduto(undefined);
                  }}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-700 bg-transparent"
                >
                  <span className="sr-only">Fechar</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <ProdutoTable
            onEdit={handleEdit}
            selectedCategory={selectedCategory}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

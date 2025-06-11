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
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Gerenciamento de Produtos
            </h1>
            <div className="flex items-center space-x-4">
              <CategoriaFilter
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
              <button
                onClick={() => {
                  setSelectedProduto(undefined);
                  setShowForm(true);
                }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
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

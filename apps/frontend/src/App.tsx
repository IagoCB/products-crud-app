import { useState } from 'react'
import { ProdutoTable } from './components/ProdutoTable'
import { ProdutoForm } from './components/ProdutoForm'
import { ProdutoStats } from './components/ProdutoStats'
import type { Product } from '@repo/types'

function App() {
  const [selectedProduto, setSelectedProduto] = useState<Product | undefined>()
  const [showForm, setShowForm] = useState(false)

  const handleFormSuccess = () => {
    setShowForm(false)
    setSelectedProduto(undefined)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Produtos</h1>
            <button
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Novo Produto
            </button>
          </div>

          <ProdutoStats />

          {showForm && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
              <div className="bg-white p-8 rounded-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">
                  {selectedProduto ? 'Editar Produto' : 'Novo Produto'}
                </h2>
                <ProdutoForm produto={selectedProduto} onSuccess={handleFormSuccess} />
                <button
                  onClick={() => {
                    setShowForm(false)
                    setSelectedProduto(undefined)
                  }}
                  className="mt-4 w-full text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          <ProdutoTable />
        </div>
      </div>
    </div>
  )
}

export default App

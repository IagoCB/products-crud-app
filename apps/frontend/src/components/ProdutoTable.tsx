import { useProdutos } from '../hooks/useProdutos';
import { useCategorias } from '../hooks/useCategorias';
import type { Product, Category } from '@repo/types';
import { memo } from 'react';

interface ProdutoTableProps {
  onEdit: (product: Product) => void;
}

export const ProdutoTable = memo(({ onEdit }: ProdutoTableProps) => {
  const { produtos, deleteProduto, isLoading, error } = useProdutos();
  const { categorias, isLoading: isLoadingCategories } = useCategorias();

  const categoryMap = new Map<string, string>(categorias.map((cat: Category) => [cat.id, cat.name]));

  if (isLoading || isLoadingCategories) {
    return <div className="text-center py-4 text-gray-700">Carregando produtos...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-4">Erro ao carregar produtos. Por favor, tente novamente.</div>;
  }

  if (produtos.length === 0) {
    return <div className="text-center py-4 text-gray-500">Nenhum produto cadastrado.</div>;
  }

  return (
    <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200 mt-8">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {produtos.map((produto: Product, index: number) => (
            <tr key={produto.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{produto.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ {produto.price.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{categoryMap.get(produto.categoryId) || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex space-x-2">
                <button
                  onClick={() => onEdit(produto)}
                  className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 bg-transparent"
                  aria-label={`Editar produto ${produto.name}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => deleteProduto(produto.id)}
                  className="text-red-600 hover:text-red-900 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 bg-transparent"
                  aria-label={`Excluir produto ${produto.name}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

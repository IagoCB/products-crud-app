import { useProdutos } from '../hooks/useProdutos';
import type { Product } from '@repo/types';

export function ProdutoTable() {
  const { produtos, deleteProduto, isLoading, error } = useProdutos();

  if (isLoading) {
    return <div className="text-center py-4">Carregando...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">Erro ao carregar produtos</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nome
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Descrição
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Preço
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Categoria
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {produtos.map((produto: Product) => (
            <tr key={produto.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">{produto.name}</td>
              <td className="px-6 py-4">{produto.description}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                R$ {produto.price.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{produto.categoryId}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => deleteProduto(produto.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 
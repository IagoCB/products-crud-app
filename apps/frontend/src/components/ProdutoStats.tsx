import { useProdutos } from '../hooks/useProdutos';

export function ProdutoStats() {
  const { produtos } = useProdutos();

  const totalProdutos = produtos.length;
  const valorTotal = produtos.reduce((acc, produto) => acc + produto.price, 0);
  const produtosPorCategoria = produtos.reduce((acc, produto) => {
    acc[produto.categoryId] = (acc[produto.categoryId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900">Total de Produtos</h3>
        <p className="mt-2 text-3xl font-bold text-indigo-600">{totalProdutos}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900">Valor Total</h3>
        <p className="mt-2 text-3xl font-bold text-indigo-600">
          R$ {valorTotal.toFixed(2)}
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900">Categorias</h3>
        <div className="mt-2">
          {Object.entries(produtosPorCategoria).map(([categoria, quantidade]) => (
            <div key={categoria} className="flex justify-between items-center">
              <span className="text-gray-600">{categoria}</span>
              <span className="font-medium text-indigo-600">{quantidade}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
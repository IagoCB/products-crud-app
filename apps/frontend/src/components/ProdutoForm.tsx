import { useState } from 'react';
import { useProdutos } from '../hooks/useProdutos';
import { useCategorias } from '../hooks/useCategorias';
import type { CreateProductDtoType, Product, Category } from '../../../../packages/types/src/index';
import { CreateProductDto } from '../../../../packages/types/src/index';
import { z } from 'zod';

interface ProdutoFormProps {
  produto?: Product;
  onSuccess?: () => void;
}

export function ProdutoForm({ produto, onSuccess }: ProdutoFormProps) {
  const { createProduto, updateProduto } = useProdutos();
  const { categorias, isLoading: loadingCategorias } = useCategorias();
  const [formData, setFormData] = useState<CreateProductDtoType>({
    name: produto?.name || '',
    price: produto?.price || 0,
    quantity: produto?.quantity || 0,
    categoryId: produto?.categoryId || '',
  });
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    const result = CreateProductDto.safeParse(formData);

    if (!result.success) {
      setErrors(result.error.issues);
      return;
    }

    try {
      if (produto) {
        await updateProduto(produto.id, result.data);
      } else {
        await createProduto(result.data);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: CreateProductDtoType) => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' ? parseFloat(value) || 0 : value,
    }));
  };

  const getErrorMessage = (path: string) => {
    return errors.find(err => err.path.includes(path))?.message;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nome
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nome do produto"
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-gray-900 ${getErrorMessage('name') ? 'border-red-500' : 'border-gray-300'}`}
          aria-invalid={!!getErrorMessage('name')}
          aria-describedby="name-error"
        />
        {getErrorMessage('name') && (
          <p className="mt-2 text-sm text-red-600" id="name-error">{getErrorMessage('name')}</p>
        )}
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Preço
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="0.00"
          min="0"
          step="0.01"
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-gray-900 appearance-none ${getErrorMessage('price') ? 'border-red-500' : 'border-gray-300'}`}
          aria-invalid={!!getErrorMessage('price')}
          aria-describedby="price-error"
        />
        {getErrorMessage('price') && (
          <p className="mt-2 text-sm text-red-600" id="price-error">{getErrorMessage('price')}</p>
        )}
      </div>

      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
          Quantidade
        </label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          placeholder="0"
          min="0"
          step="1"
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-gray-900 appearance-none ${getErrorMessage('quantity') ? 'border-red-500' : 'border-gray-300'}`}
          aria-invalid={!!getErrorMessage('quantity')}
          aria-describedby="quantity-error"
        />
        {getErrorMessage('quantity') && (
          <p className="mt-2 text-sm text-red-600" id="quantity-error">{getErrorMessage('quantity')}</p>
        )}
      </div>

      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
          Categoria
        </label>
        <select
          id="categoryId"
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-gray-900 ${getErrorMessage('categoryId') ? 'border-red-500' : 'border-gray-300'}`}
          aria-invalid={!!getErrorMessage('categoryId')}
          aria-describedby="categoryId-error"
        >
          <option value="" disabled className="text-gray-900">{loadingCategorias ? 'Carregando...' : 'Selecione uma categoria'}</option>
          {categorias.map((cat: Category) => (
            <option key={cat.id} value={cat.id} className="text-gray-900">{cat.name}</option>
          ))}
        </select>
        {getErrorMessage('categoryId') && (
          <p className="mt-2 text-sm text-red-600" id="categoryId-error">{getErrorMessage('categoryId')}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
      >
        {produto ? 'Atualizar' : 'Criar'} Produto
      </button>
    </form>
  );
}

import { useState, useEffect } from "react";
import { useProdutos } from "../hooks/useProdutos";
import { useCategorias } from "../hooks/useCategorias";
import { CategoriaForm } from "./CategoriaForm";
import type {
  CreateProductDtoType,
  Product,
  Category,
} from "../../../../packages/types/src/index";
import { CreateProductDto } from "../../../../packages/types/src/index";
import { z } from "zod";

interface ProdutoFormProps {
  produto?: Product;
  onSuccess?: () => void;
}

export function ProdutoForm({ produto, onSuccess }: ProdutoFormProps) {
  const { createProduto, updateProduto } = useProdutos();
  const {
    categorias,
    isLoading: loadingCategorias,
    refetch: refetchCategorias,
  } = useCategorias();
  const [formData, setFormData] = useState<CreateProductDtoType>({
    name: produto?.name || "",
    price: produto?.price || 0,
    quantity: produto?.quantity || 0,
    categoryId: produto?.categoryId || "",
  });
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);
  const [showCategoriaForm, setShowCategoriaForm] = useState(false);
  const [displayPrice, setDisplayPrice] = useState("");

  useEffect(() => {
    if (produto?.price !== undefined && produto.price !== null) {
      setDisplayPrice(String(produto.price));
    } else {
      setDisplayPrice("0");
    }
  }, [produto?.price]);

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
      console.error("Erro ao salvar produto:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev: CreateProductDtoType) => {
      let newPriceValue: number | undefined;
      let newQuantityValue: number | undefined;

      if (name === "price") {
        const cleanedValue = value
          .replace(/[^0-9,.]/g, "")
          .replace(/,(\d*\.?)/g, ".$1");
        setDisplayPrice(cleanedValue);
        const parsedValue = parseFloat(cleanedValue);
        newPriceValue = isNaN(parsedValue) ? 0 : parsedValue;
        return { ...prev, [name]: newPriceValue };
      } else if (name === "quantity") {
        const cleanedValue = value.replace(",", ".");
        newQuantityValue = isNaN(parseInt(cleanedValue, 10))
          ? 0
          : parseInt(cleanedValue, 10);
        return { ...prev, [name]: newQuantityValue };
      }

      return { ...prev, [name]: value };
    });
  };

  const handlePriceBlur = () => {
    const cleanedValue = displayPrice.replace(",", ".");
    const parsedValue = parseFloat(cleanedValue);

    if (!isNaN(parsedValue)) {
      setDisplayPrice(parsedValue.toFixed(2));
      setFormData((prev) => ({ ...prev, price: parsedValue }));
    } else {
      setDisplayPrice("0.00");
      setFormData((prev) => ({ ...prev, price: 0 }));
    }
  };

  const getErrorMessage = (path: string) => {
    return errors.find((err) => err.path.includes(path))?.message;
  };

  const handleCategoriaSuccess = async () => {
    setShowCategoriaForm(false);
    await refetchCategorias();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Nome
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nome do produto"
            maxLength={100}
            required
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-gray-900 ${getErrorMessage("name") ? "border-red-500" : "border-gray-300"}`}
            aria-invalid={!!getErrorMessage("name")}
            aria-describedby="name-error"
          />
          {getErrorMessage("name") && (
            <p className="mt-2 text-sm text-red-600" id="name-error">
              {getErrorMessage("name")}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Preço
          </label>
          <input
            type="text"
            id="price"
            name="price"
            value={displayPrice}
            onChange={handleChange}
            onBlur={handlePriceBlur}
            placeholder="0.00"
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-gray-900 appearance-none ${getErrorMessage("price") ? "border-red-500" : "border-gray-300"}`}
            aria-invalid={!!getErrorMessage("price")}
            aria-describedby="price-error"
          />
          {getErrorMessage("price") && (
            <p className="mt-2 text-sm text-red-600" id="price-error">
              {getErrorMessage("price")}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-700"
          >
            Quantidade
          </label>
          <input
            type="text"
            id="quantity"
            name="quantity"
            value={formData.quantity.toString()}
            onChange={handleChange}
            placeholder="0"
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-gray-900 appearance-none ${getErrorMessage("quantity") ? "border-red-500" : "border-gray-300"}`}
            aria-invalid={!!getErrorMessage("quantity")}
            aria-describedby="quantity-error"
          />
          {getErrorMessage("quantity") && (
            <p className="mt-2 text-sm text-red-600" id="quantity-error">
              {getErrorMessage("quantity")}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="categoryId"
            className="block text-sm font-medium text-gray-700"
          >
            Categoria
          </label>
          <div className="flex items-center space-x-2">
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-gray-900 ${getErrorMessage("categoryId") ? "border-red-500" : "border-gray-300"}`}
              aria-invalid={!!getErrorMessage("categoryId")}
              aria-describedby="categoryId-error"
            >
              <option value="" disabled className="text-gray-900">
                {loadingCategorias
                  ? "Carregando..."
                  : "Selecione uma categoria"}
              </option>
              {categorias.map((cat: Category) => (
                <option key={cat.id} value={cat.id} className="text-gray-900">
                  {cat.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowCategoriaForm(true)}
              className="mt-1 p-2 bg-green-100 text-green-600 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-md"
              aria-label="Adicionar nova categoria"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          {getErrorMessage("categoryId") && (
            <p className="mt-2 text-sm text-red-600" id="categoryId-error">
              {getErrorMessage("categoryId")}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
        >
          {produto ? "Atualizar" : "Criar"} Produto
        </button>
      </form>

      {showCategoriaForm && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg max-w-md w-full shadow-2xl relative">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              Nova Categoria
            </h2>
            <CategoriaForm onSuccess={handleCategoriaSuccess} />
            <button
              onClick={() => setShowCategoriaForm(false)}
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
    </>
  );
}

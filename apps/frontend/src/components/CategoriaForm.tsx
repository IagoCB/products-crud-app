import { useState } from "react";
import { trpc } from "../utils/trpc";
import { z } from "zod";

interface CategoriaFormProps {
  onSuccess?: () => void;
}

const CreateCategoriaSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
});

type CreateCategoriaDto = z.infer<typeof CreateCategoriaSchema>;

export function CategoriaForm({ onSuccess }: CategoriaFormProps) {
  const [formData, setFormData] = useState<CreateCategoriaDto>({
    name: "",
  });
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);

  const createCategoria = trpc.categoria.create.useMutation({
    onSuccess: () => {
      onSuccess?.();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    const result = CreateCategoriaSchema.safeParse(formData);

    if (!result.success) {
      setErrors(result.error.issues);
      return;
    }

    try {
      await createCategoria.mutateAsync(result.data);
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getErrorMessage = (path: string) => {
    return errors.find((err) => err.path.includes(path))?.message;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Nome da Categoria
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nome da categoria"
          maxLength={100}
          required
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-gray-900 ${
            getErrorMessage("name") ? "border-red-500" : "border-gray-300"
          }`}
          aria-invalid={!!getErrorMessage("name")}
          aria-describedby="name-error"
        />
        {getErrorMessage("name") && (
          <p className="mt-2 text-sm text-red-600" id="name-error">
            {getErrorMessage("name")}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
      >
        Criar Categoria
      </button>
    </form>
  );
}

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { escalasAPI } from "../services/api";

interface EscalaFormData {
  sala: string;
  nome1: string;
  nome2: string;
  periodo: string;
  data: string;
}

const EditarEscalaPage = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<EscalaFormData>({
    sala: "",
    nome1: "",
    nome2: "",
    periodo: "",
    data: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    if (id) {
      loadEscala(parseInt(id));
    }
  }, [isLoggedIn, navigate, id]);

  const loadEscala = async (id: number) => {
    try {
      const response = await escalasAPI.obter(id);
      const escala = response.data;
      setFormData({
        sala: escala.sala,
        nome1: escala.nome1,
        nome2: escala.nome2 || "",
        periodo: escala.periodo,
        data: escala.data,
      });
    } catch (error) {
      console.error("Erro ao carregar escala:", error);
      alert("Erro ao carregar escala");
      navigate("/escala");
    } finally {
      setInitialLoading(false);
    }
  };

  const salas = ["Bebês 1", "Médios 1", "Médios 2", "Grandes"];
  const periodos = ["Manhã", "Noite"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await escalasAPI.atualizar(parseInt(id!), {
        sala: formData.sala,
        nome1: formData.nome1,
        nome2: formData.nome2 || null,
        periodo: formData.periodo,
        data: formData.data,
      });
      navigate("/escala");
    } catch (error) {
      console.error("Erro ao atualizar escala:", error);
      alert("Erro ao atualizar escala");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/escala");
  };

  if (!isLoggedIn || initialLoading) {
    return null;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Editar Escala</h1>
        <p className="text-gray-600">Atualize os dados da escala</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="sala" className="block text-sm font-medium text-gray-700">
              Sala
            </label>
            <select
              id="sala"
              value={formData.sala}
              onChange={(e) => setFormData({ ...formData, sala: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="">Selecione a sala</option>
              {salas.map((sala) => (
                <option key={sala} value={sala}>
                  {sala}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nomes (máximo 2)
            </label>
            <div className="space-y-2">
              <input
                type="text"
                value={formData.nome1}
                onChange={(e) => setFormData({ ...formData, nome1: e.target.value })}
                placeholder="Nome 1"
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
              />
              <input
                type="text"
                value={formData.nome2}
                onChange={(e) => setFormData({ ...formData, nome2: e.target.value })}
                placeholder="Nome 2 (opcional)"
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="periodo" className="block text-sm font-medium text-gray-700">
              Período
            </label>
            <select
              id="periodo"
              value={formData.periodo}
              onChange={(e) => setFormData({ ...formData, periodo: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="">Selecione o período</option>
              {periodos.map((periodo) => (
                <option key={periodo} value={periodo}>
                  {periodo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="data" className="block text-sm font-medium text-gray-700">
              Data
            </label>
            <input
              type="date"
              id="data"
              value={formData.data}
              onChange={(e) => setFormData({ ...formData, data: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarEscalaPage;
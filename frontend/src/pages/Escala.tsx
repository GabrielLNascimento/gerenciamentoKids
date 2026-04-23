import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { escalasAPI, Escala } from "../services/api";

const EscalaPage = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [escalas, setEscalas] = useState<Escala[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    loadEscalas();
  }, [isLoggedIn, navigate]);

  const loadEscalas = async () => {
    try {
      const response = await escalasAPI.listar();
      setEscalas(response.data);
    } catch (error) {
      console.error("Erro ao carregar escalas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta escala?")) return;
    try {
      await escalasAPI.deletar(id);
      loadEscalas();
    } catch (error) {
      console.error("Erro ao excluir escala:", error);
      alert("Erro ao excluir escala");
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Escalas</h1>
          <p className="text-gray-600">
            Gerencie as escalas de voluntários
          </p>
        </div>
        <Link
          to="/escala/nova"
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium"
        >
          Criar Escala
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8">Carregando...</div>
      ) : escalas.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Nenhuma escala encontrada. Crie a primeira!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sala
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Voluntários
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Período
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {escalas.map((escala) => (
                <tr key={escala.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(escala.data).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {escala.sala}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {escala.nome1}
                    {escala.nome2 && `, ${escala.nome2}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {escala.periodo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => escala.id && handleDelete(escala.id)}
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
      )}
    </div>
  );
};

export default EscalaPage;
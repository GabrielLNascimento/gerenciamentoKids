import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { escalasAPI, Escala } from "../services/api";

const EscalaPage = () => {
  const { isLoggedIn } = useAuth();
  const [escalas, setEscalas] = useState<Escala[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSala, setFilterSala] = useState("");
  const [filterPeriodo, setFilterPeriodo] = useState("");
  const [filterData, setFilterData] = useState("");

  const salas = ["Bebês 1", "Médios 1", "Médios 2", "Grandes"];
  const periodos = ["Manhã", "Noite"];

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

  useEffect(() => {
    loadEscalas();
  }, []);

  const filteredEscalas = escalas.filter((escala) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      escala.nome1.toLowerCase().includes(term) ||
      (escala.nome2 && escala.nome2.toLowerCase().includes(term));
    const matchesSala = !filterSala || escala.sala === filterSala;
    const matchesPeriodo = !filterPeriodo || escala.periodo === filterPeriodo;
    const matchesData = !filterData || escala.data === filterData;
    return matchesSearch && matchesSala && matchesPeriodo && matchesData;
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Escalas</h1>
          <p className="text-gray-600">
            Gerencie as escalas de voluntários
          </p>
        </div>
        {isLoggedIn && (
          <Link
            to="/escala/nova"
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium"
          >
            Criar Escala
          </Link>
        )}
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Pesquisar voluntário..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500 mb-2"
        />
        <div className="flex flex-wrap gap-2">
          <select
            value={filterSala}
            onChange={(e) => setFilterSala(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Todas as salas</option>
            {salas.map((sala) => (
              <option key={sala} value={sala}>
                {sala}
              </option>
            ))}
          </select>
          <select
            value={filterPeriodo}
            onChange={(e) => setFilterPeriodo(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Todos os períodos</option>
            {periodos.map((periodo) => (
              <option key={periodo} value={periodo}>
                {periodo}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={filterData}
            onChange={(e) => setFilterData(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
          {(filterSala || filterPeriodo || filterData || searchTerm) && (
            <button
              onClick={() => {
                setFilterSala("");
                setFilterPeriodo("");
                setFilterData("");
                setSearchTerm("");
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Carregando...</div>
      ) : filteredEscalas.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Nenhuma escala encontrada.
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
                {isLoggedIn && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEscalas.map((escala) => (
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
                  {isLoggedIn && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/escala/${escala.id}/editar`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => escala.id && handleDelete(escala.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Excluir
                      </button>
                    </td>
                  )}
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
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Crianca, Culto, criancasAPI, cultosAPI } from '../services/api';

const formatarData = (data: string) => {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
};

const FrequenciaCriancaPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [crianca, setCrianca] = useState<Crianca | undefined>();
  const [cultos, setCultos] = useState<Culto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      criancasAPI.obter(Number(id)),
      cultosAPI.listar(),
      criancasAPI.listarFrequencia(Number(id)),
    ])
      .then(([criancaRes, cultosRes, frequenciaRes]) => {
        setCrianca(criancaRes.data);
        const idsPresentes = new Set(frequenciaRes.data);
        const cultosPresentes = cultosRes.data.filter((c) => idsPresentes.has(c.id!));
        cultosPresentes.sort((a, b) => b.data.localeCompare(a.data));
        setCultos(cultosPresentes);
      })
      .catch((error) => {
        console.error('Erro ao carregar frequência:', error);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-8">Carregando...</div>;
  if (!crianca) return <div className="text-center py-8 text-red-500">Criança não encontrada.</div>;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Frequência</h1>
          <p className="text-gray-600">{crianca.nome}</p>
        </div>
        <button onClick={() => navigate('/criancas')} className="btn-secondary">
          Voltar
        </button>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Cultos presentes</h2>
          <span className="text-sm text-gray-500">
            {cultos.length} presença{cultos.length !== 1 ? 's' : ''}
          </span>
        </div>

        {cultos.length === 0 ? (
          <p className="text-center py-8 text-gray-500">Esta criança não participou de nenhum culto.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Período
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cultos.map((culto) => (
                  <tr key={culto.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {culto.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatarData(culto.data)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {culto.periodo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FrequenciaCriancaPage;

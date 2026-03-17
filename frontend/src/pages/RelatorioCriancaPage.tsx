import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Crianca, criancasAPI } from '../services/api';

const RelatorioCriancaPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [crianca, setCrianca] = useState<Crianca | undefined>();
  const [relatorio, setRelatorio] = useState('');
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!id) return;
    criancasAPI
      .obter(Number(id))
      .then((response) => {
        setCrianca(response.data);
        setRelatorio(response.data.relatorio || '');
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao carregar criança:', error);
        setLoading(false);
      });
  }, [id]);

  const handleSalvar = () => {
    if (!id) return;
    setSalvando(true);
    criancasAPI
      .atualizarRelatorio(Number(id), relatorio || null)
      .then(() => {
        setSalvando(false);
        navigate('/criancas');
      })
      .catch((error) => {
        console.error('Erro ao salvar relatório:', error);
        setSalvando(false);
        alert('Erro ao salvar relatório');
      });
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  if (!crianca) {
    return <div className="text-center py-8 text-red-500">Criança não encontrada.</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Relatório</h1>
          <p className="text-gray-600">{crianca.nome}</p>
        </div>
        <button onClick={() => navigate('/criancas')} className="btn-secondary">
          Voltar
        </button>
      </div>

      <div className="card">
        <label htmlFor="relatorio" className="block text-sm font-medium text-gray-700 mb-2">
          Anotações sobre a criança
        </label>
        <textarea
          id="relatorio"
          className="input-field min-h-64 resize-y"
          value={relatorio}
          onChange={(e) => setRelatorio(e.target.value)}
          placeholder="Escreva aqui observações, anotações ou qualquer informação relevante sobre a criança..."
        />
        <div className="flex justify-end mt-4">
          <button onClick={handleSalvar} className="btn-primary" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RelatorioCriancaPage;

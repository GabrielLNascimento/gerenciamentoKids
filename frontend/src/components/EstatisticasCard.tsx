import { useEffect, useState } from 'react';
import { estatisticasAPI, Estatisticas } from '../services/api';

interface EstatisticasCardProps {
  titulo: string;
  valor: number | string;
  icone: string;
  cor: 'blue' | 'green' | 'purple' | 'orange';
}

const EstatisticasCard = ({ titulo, valor, icone, cor }: EstatisticasCardProps) => {
  const cores = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };

  return (
    <div className="card animate-fade-in">
      <div className="flex items-center">
        <div className={`${cores[cor]} p-3 rounded-lg text-white`}>
          <span className="text-2xl">{icone}</span>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{titulo}</p>
          <p className="text-2xl font-bold text-gray-900">{valor}</p>
        </div>
      </div>
    </div>
  );
};

export const EstatisticasCards = () => {
  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    estatisticasAPI
      .obter()
      .then((response) => {
        setEstatisticas(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao carregar estatísticas:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  if (!estatisticas) {
    return <div className="text-center py-8 text-red-600">Erro ao carregar estatísticas</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <EstatisticasCard
        titulo="Total de Crianças"
        valor={estatisticas.totalCriancas}
        icone="👶"
        cor="blue"
      />
      <EstatisticasCard
        titulo="Total de Cultos"
        valor={estatisticas.totalCultos}
        icone="⛪"
        cor="green"
      />
      <EstatisticasCard
        titulo="Frequência Média"
        valor={estatisticas.frequenciaMedia.toFixed(2)}
        icone="📊"
        cor="purple"
      />
    </div>
  );
};

export default EstatisticasCard;

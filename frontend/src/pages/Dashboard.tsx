import { EstatisticasCards } from '../components/EstatisticasCard';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema de gerenciamento</p>
      </div>

      <EstatisticasCards />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="space-y-3">
            <Link to="/criancas" className="block btn-primary text-center">
              Gerenciar Crianças
            </Link>
            <Link to="/cultos/novo" className="block btn-primary text-center">
              Criar Novo Evento
            </Link>
            <Link to="/cultos" className="block btn-secondary text-center">
              Ver Todos os Eventos
            </Link>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Sobre o Sistema</h2>
          <p className="text-gray-600">
            Sistema de gerenciamento para controle de crianças e presença em eventos.
            Use o menu acima para navegar entre as diferentes funcionalidades.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

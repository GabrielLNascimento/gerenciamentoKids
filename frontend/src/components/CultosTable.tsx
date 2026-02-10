import { Culto } from '../services/api';
import { Link } from 'react-router-dom';

interface CultosTableProps {
  cultos: Culto[];
  onEdit: (culto: Culto) => void;
  onDelete: (id: number) => void;
}

const CultosTable = ({ cultos, onEdit, onDelete }: CultosTableProps) => {
  if (cultos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum culto cadastrado ainda.
      </div>
    );
  }

  const formatarData = (data: string) => {
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="overflow-x-auto animate-fade-in">
      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nome
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Período
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {cultos.map((culto) => (
            <tr key={culto.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {culto.nome}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {culto.periodo}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatarData(culto.data)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link
                  to={`/cultos/${culto.id}`}
                  className="text-primary-600 hover:text-primary-900 mr-4"
                >
                  Ver
                </Link>
                <button
                  onClick={() => onEdit(culto)}
                  className="text-primary-600 hover:text-primary-900 mr-4"
                >
                  Editar
                </button>
                <button
                  onClick={() => culto.id && onDelete(culto.id)}
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
  );
};

export default CultosTable;

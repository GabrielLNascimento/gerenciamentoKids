import { Crianca } from "../services/api";

interface CriancasTableProps {
    criancas: Crianca[];
    onEdit: (crianca: Crianca) => void;
    onDelete: (id: number) => void;
}

const calcularIdade = (dataNascimento: string): number => {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesAtual = hoje.getMonth();
    const mesNascimento = nascimento.getMonth();
    if (
        mesAtual < mesNascimento ||
        (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())
    ) {
        idade--;
    }
    return idade;
};

const CriancasTable = ({ criancas, onEdit, onDelete }: CriancasTableProps) => {
    if (criancas.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                Nenhuma criança cadastrada ainda.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto animate-fade-in">
            <table className="min-w-full bg-white rounded-lg shadow-md">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nome
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Data de Nascimento
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Responsável
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Telefone
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ações
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {criancas.map((crianca) => (
                        <tr
                            key={crianca.id}
                            className="hover:bg-gray-50 transition-colors"
                        >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {crianca.nome}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(
                                    crianca.dataNascimento,
                                ).toLocaleDateString("pt-BR")}{" "}
                                ({calcularIdade(crianca.dataNascimento)} anos)
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {crianca.responsavel}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {crianca.telefone}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => onEdit(crianca)}
                                    className="text-primary-600 hover:text-primary-900 mr-4"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() =>
                                        crianca.id && onDelete(crianca.id)
                                    }
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

export default CriancasTable;

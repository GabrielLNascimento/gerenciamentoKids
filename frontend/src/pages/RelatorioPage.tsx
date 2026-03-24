import { useState, useEffect } from "react";
import { Culto, Crianca, cultosAPI } from "../services/api";

interface RelatorioItem {
  culto: Culto;
  bebes: number;
  medios1: number;
  medios2: number;
  grandes: number;
  total: number;
}

const calcularIdade = (dataNascimento: string): number => {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  if (
    hoje.getMonth() < nascimento.getMonth() ||
    (hoje.getMonth() === nascimento.getMonth() &&
      hoje.getDate() < nascimento.getDate())
  ) {
    idade--;
  }
  return idade;
};

const contarGrupos = (criancas: Crianca[]) => {
  let bebes = 0, medios1 = 0, medios2 = 0, grandes = 0;
  for (const c of criancas) {
    const idade = calcularIdade(c.dataNascimento);
    if (idade >= 1 && idade <= 2) bebes++;
    else if (idade >= 3 && idade <= 4) medios1++;
    else if (idade >= 5 && idade <= 6) medios2++;
    else if (idade >= 7 && idade <= 11) grandes++;
  }
  return { bebes, medios1, medios2, grandes, total: criancas.length };
};

const formatarData = (data: string) => {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
};

export default function RelatorioPage() {
  const [relatorio, setRelatorio] = useState<RelatorioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cultosAPI
      .listar()
      .then(async (response) => {
        const cultos = response.data;
        const itens = await Promise.all(
          cultos.map(async (culto) => {
            const criancasRes = await cultosAPI.listarCriancas(culto.id!);
            const grupos = contarGrupos(criancasRes.data);
            return { culto, ...grupos };
          })
        );
        itens.sort((a, b) => b.culto.data.localeCompare(a.culto.data));
        setRelatorio(itens);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao carregar relatório:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Carregando...</div>;
  }

  return (
    <div className="px-4 sm:px-0">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Relatório de Cultos</h1>
      <div className="card overflow-x-auto">
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
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bebês 1
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Médios 1
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Médios 2
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Grandes
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {relatorio.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  Nenhum culto encontrado.
                </td>
              </tr>
            ) : (
              relatorio.map((item) => (
                <tr key={item.culto.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.culto.nome}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatarData(item.culto.data)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.culto.periodo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                    {item.bebes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                    {item.medios1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                    {item.medios2}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                    {item.grandes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-primary-600">
                    {item.total}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

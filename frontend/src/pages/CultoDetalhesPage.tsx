import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Culto, Crianca, cultosAPI } from '../services/api';
import CriancaSeletor from '../components/CriancaSeletor';

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

const CultoDetalhesPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [culto, setCulto] = useState<Culto | null>(null);
    const [criancas, setCriancas] = useState<Crianca[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState('');
    const [mostrarCheckout, setMostrarCheckout] = useState(true);
    const [mostrarPendente, setMostrarPendente] = useState(true);

    useEffect(() => {
        if (id) {
            carregarDados();
        }
    }, [id]);

    const carregarDados = () => {
        if (!id) return;

        setLoading(true);
        Promise.all([
            cultosAPI.obter(parseInt(id)),
            cultosAPI.listarCriancas(parseInt(id)),
        ])
            .then(([cultoResponse, criancasResponse]) => {
                setCulto(cultoResponse.data);
                setCriancas(criancasResponse.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Erro ao carregar dados:', error);
                setLoading(false);
            });
    };

    const criancasFiltradas = criancas.filter((crianca) => {
        const termo = filtro.toLowerCase();
        const nomeMatch = crianca.nome.toLowerCase().includes(termo);
        const codigoMatch = crianca.codigo
            ? String(crianca.codigo).includes(termo)
            : false;

        const statusMatch =
            (crianca.checkedOut && mostrarCheckout) ||
            (!crianca.checkedOut && mostrarPendente);

        return (nomeMatch || codigoMatch) && statusMatch;
    });

    const handleAdicionarCrianca = (criancaId: number) => {
        if (!id) return;

        cultosAPI
            .adicionarCrianca(parseInt(id), criancaId)
            .then(() => {
                carregarDados();
            })
            .catch((error) => {
                console.error('Erro ao adicionar criança:', error);
                alert('Erro ao adicionar criança ao culto');
            });
    };

    const handleRemoverCrianca = (criancaId: number) => {
        if (!id) return;

        if (
            window.confirm(
                'Tem certeza que deseja remover esta criança do culto?',
            )
        ) {
            cultosAPI
                .removerCrianca(parseInt(id), criancaId)
                .then(() => {
                    carregarDados();
                })
                .catch((error) => {
                    console.error('Erro ao remover criança:', error);
                    alert('Erro ao remover criança do culto');
                });
        }
    };

    const handleMarcarCheckout = (crianca: Crianca) => {
        if (!id || !crianca.id) return;

        const novoStatus = !crianca.checkedOut;
        cultosAPI
            .marcarCheckout(parseInt(id), crianca.id, novoStatus)
            .then(() => {
                carregarDados();
            })
            .catch((error) => {
                console.error('Erro ao marcar checkout:', error);
                alert('Erro ao marcar checkout');
            });
    };

    const handleGerarEtiqueta = (crianca: Crianca, tipo: 'filho' | 'pai') => {
        // const idade = calcularIdade(crianca.dataNascimento);
        const codigoPadded = crianca.codigo
            ? String(crianca.codigo).padStart(2, '0')
            : '';
        const temCodigo = tipo === 'filho' ? 'none' : 'block';
        const nomePrincipal = tipo === 'filho' ? crianca.nome : '';
        const nomeSecundario = tipo === 'filho' ? '' : crianca.nome;
        const titulo =
            tipo === 'filho' ? 'Etiqueta Criança' : 'Etiqueta Responsável';
        const borda = tipo === 'filho' ? '2px solid black' : '2px dashed black';
        const background = tipo === 'filho' ? 'white' : '#f9f9f9';
        const nomeFontSize = tipo === 'filho' ? '26px' : '18px';
        const codigoFontSize = tipo === 'filho' ? '26px' : '48px';
        const temEtiqueta = tipo === "filho" ? true : false 

        // Monta os ícones conforme os atributos da criança
        const autorizaImagem = crianca.autorizaUsoImagem
            ? 'camera.png'
            : 'camera-proibido.png';

        const icones = [
            `<img src="${window.location.origin}/icones/${autorizaImagem}" title="Autoriza uso de imagem" style="width:48px;height:48px;object-fit:contain;" />`,
            crianca.autorizaTrocaFralda &&
                `<span title="Autoriza troca de fralda">🚼</span>`,
            crianca.restricaoAlimentar &&
                `<span title="Restrição alimentar: ${crianca.descricaoRestricaoAlimentar || 'Sim'}">🚰</span>`,
            crianca.necessidadeEspecial &&
                `<span title="Necessidade especial: ${crianca.descricaoNecessidadeEspecial || 'Sim'}">♿</span>`,
        ]
            .filter(Boolean)
            .join('');

        const etiquetaHTML = `
        <html>
        <head>
            <title>${titulo} - ${nomePrincipal}</title>
            <style>
                @page { size: 300px 150px; margin: 0; }
                body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; width: 300px; height: 150px; }
                .etiqueta {
                    width: 290px; height: 140px;
                    display: flex; justify-content: center; align-items: center; flex-direction: column;
                    border: ${borda}; border-radius: 8px;
                    gap: 4px; padding: 8px; box-sizing: border-box;
                    background: ${background};
                }
                .titulo { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #777; }
                .codigo { font-size: ${codigoFontSize}; font-weight: 900; line-height: 1; display: ${temCodigo}; }
                .nome { font-size: ${nomeFontSize}; font-weight: bold; text-align: center; }
                .info { font-size: 12px; color: #555; text-align: center; }
                .icones { display: flex; gap: 6px; font-size: 40px; margin-top: 2px; }
                @media print { body { margin: 0; } }
            </style>
        </head>
        <body>
            <div class="etiqueta">
                <span class="titulo">${titulo}</span>
                <span class="codigo">${codigoPadded}</span>
                <span class="nome">${nomePrincipal}</span>
                <span class="info">${nomeSecundario}</span>
                ${temEtiqueta ? `<div class="icones">${icones}</div>` : ''}
            </div>
        </body>
        </html>`;

        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        printWindow.document.write(etiquetaHTML);
        printWindow.document.close();
        printWindow.focus();

        setTimeout(() => {
            printWindow.print();
            const onFocus = () => {
                window.removeEventListener('focus', onFocus);
                printWindow.close();
            };
            window.addEventListener('focus', onFocus);
        }, 300);
    };

    const formatarData = (data: string) => {
        const [year, month, day] = data.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="text-center py-8">Carregando...</div>
            </div>
        );
    }

    if (!culto) {
        return (
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="text-center py-8 text-red-600">
                    Evento não encontrado
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <button
                    onClick={() => navigate('/cultos')}
                    className="btn-secondary mb-4"
                >
                    ← Voltar
                </button>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {culto.nome}
                </h1>
                <div className="flex flex-wrap gap-4 text-gray-600">
                    <span>
                        <strong>Período:</strong> {culto.periodo}
                    </span>
                    <span>
                        <strong>Data:</strong> {formatarData(culto.data)}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                    <div className="mb-4">
                        <label
                            htmlFor="search"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Pesquisar Criança (Nome ou Código)
                        </label>
                        <input
                            type="text"
                            id="search"
                            className="input-field"
                            placeholder="Ex: Fulano ou 1"
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                        />
                        <div className="flex gap-4 mt-2">
                            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                                <input
                                    type="checkbox"
                                    checked={mostrarPendente}
                                    onChange={(e) =>
                                        setMostrarPendente(e.target.checked)
                                    }
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                Pendente
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                                <input
                                    type="checkbox"
                                    checked={mostrarCheckout}
                                    onChange={(e) =>
                                        setMostrarCheckout(e.target.checked)
                                    }
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                Realizado
                            </label>
                        </div>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Crianças Presentes ({criancasFiltradas.length})
                    </h2>
                    {criancasFiltradas.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            {filtro
                                ? 'Nenhuma criança encontrada para esta busca.'
                                : 'Nenhuma criança adicionada ainda.'}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {criancasFiltradas.map((crianca) => (
                                <div
                                    key={crianca.id}
                                    className={`flex items-center justify-between p-3 rounded-lg transition-colors border border-gray-400 ${
                                        crianca.checkedOut
                                            ? 'bg-gray-200'
                                            : 'bg-gray-50 hover:bg-gray-100'
                                    }`}
                                >
                                    <div className="flex-1 flex gap-6 flex-col ">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    handleMarcarCheckout(
                                                        crianca,
                                                    )
                                                }
                                                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                                    crianca.checkedOut
                                                        ? 'bg-gray-500 hover:bg-gray-600 text-white'
                                                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                                                }`}
                                            >
                                                {crianca.checkedOut
                                                    ? '✓ Checkout'
                                                    : 'Checkout'}
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleGerarEtiqueta(
                                                        crianca,
                                                        'filho',
                                                    )
                                                }
                                                className="px-3 py-1 rounded text-sm font-medium bg-green-500 hover:bg-green-600 text-white transition-colors"
                                            >
                                                Etiqueta Filho
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleGerarEtiqueta(
                                                        crianca,
                                                        'pai',
                                                    )
                                                }
                                                className="px-3 py-1 rounded text-sm font-medium bg-yellow-500 hover:bg-yellow-600 text-white transition-colors"
                                            >
                                                Etiqueta Pai
                                            </button>

                                            <button
                                                onClick={() =>
                                                    crianca.id &&
                                                    handleRemoverCrianca(
                                                        crianca.id,
                                                    )
                                                }
                                                className={
                                                    crianca.checkedOut
                                                        ? 'text-gray-600 line-through text-sm font-medium'
                                                        : 'text-red-600 hover:text-red-800 text-sm font-medium'
                                                }
                                                disabled={crianca.checkedOut}
                                            >
                                                Remover
                                            </button>
                                        </div>

                                        <div>
                                            <p
                                                className={`font-medium ${
                                                    crianca.checkedOut
                                                        ? 'line-through text-gray-500'
                                                        : 'text-gray-900'
                                                }`}
                                            >
                                                {crianca.codigo
                                                    ? `${String(
                                                          crianca.codigo,
                                                      ).padStart(
                                                          2,
                                                          '0',
                                                      )} - ${crianca.nome} - ${calcularIdade(
                                                          crianca.dataNascimento,
                                                      )} anos`
                                                    : crianca.nome}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(
                                                    crianca.dataNascimento,
                                                ).toLocaleDateString(
                                                    'pt-BR',
                                                )}{' '}
                                                • {crianca.responsavel}
                                            </p>
                                            <div className="text-sm text-gray-600 mt-1 ml-0">
                                                <div>
                                                    <strong>
                                                        Restrição Alimentar:
                                                    </strong>{' '}
                                                    {crianca.restricaoAlimentar
                                                        ? crianca.descricaoRestricaoAlimentar ||
                                                          'Sim'
                                                        : 'Não'}
                                                </div>
                                                <div>
                                                    <strong>
                                                        Necessidade Especial:
                                                    </strong>{' '}
                                                    {crianca.necessidadeEspecial
                                                        ? crianca.descricaoNecessidadeEspecial ||
                                                          'Sim'
                                                        : 'Não'}
                                                </div>
                                                <div>
                                                    <strong>
                                                        Autoriza uso de imagem:
                                                    </strong>{' '}
                                                    {crianca.autorizaUsoImagem
                                                        ? 'Sim'
                                                        : 'Não'}
                                                </div>
                                                <div>
                                                    <strong>
                                                        Autoriza troca de
                                                        fralda:
                                                    </strong>{' '}
                                                    {crianca.autorizaTrocaFralda
                                                        ? 'Sim'
                                                        : 'Não'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Adicionar Criança
                    </h2>
                    <CriancaSeletor
                        cultoId={parseInt(id!)}
                        criancasNoCulto={criancas}
                        onAdicionar={handleAdicionarCrianca}
                        onRemover={handleRemoverCrianca}
                    />
                </div>
            </div>
        </div>
    );
};

export default CultoDetalhesPage;

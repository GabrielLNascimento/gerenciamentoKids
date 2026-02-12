import { useState, useEffect } from "react";
import { Crianca } from "../services/api";

interface CriancaFormProps {
    crianca?: Crianca;
    onSubmit: (crianca: Omit<Crianca, "id">) => void;
    onCancel: () => void;
}

const CriancaForm = ({ crianca, onSubmit, onCancel }: CriancaFormProps) => {
    const [formData, setFormData] = useState({
        nome: "",
        dataNascimento: "",
        responsavel: "",
        telefone: "",
        restricaoAlimentar: false,
        descricaoRestricaoAlimentar: "",
        necessidadeEspecial: false,
        descricaoNecessidadeEspecial: "",
        autorizaUsoImagem: false,
        autorizaTrocaFralda: false,
    });

    useEffect(() => {
        if (crianca) {
            const formatForInput = (d: string) => {
                if (!d) return "";
                // aceita ISO com hora ou apenas YYYY-MM-DD
                const dateOnly = d.length >= 10 ? d.slice(0, 10) : d;
                return dateOnly;
            };

            setFormData({
                nome: crianca.nome,
                dataNascimento: formatForInput(crianca.dataNascimento),
                responsavel: crianca.responsavel,
                telefone: crianca.telefone,
                restricaoAlimentar: crianca.restricaoAlimentar || false,
                descricaoRestricaoAlimentar:
                    crianca.descricaoRestricaoAlimentar || "",
                necessidadeEspecial: crianca.necessidadeEspecial || false,
                descricaoNecessidadeEspecial:
                    crianca.descricaoNecessidadeEspecial || "",
                autorizaUsoImagem: crianca.autorizaUsoImagem || false,
                autorizaTrocaFralda: crianca.autorizaTrocaFralda || false,
            });
        }
    }, [crianca]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            nome: formData.nome,
            dataNascimento: formData.dataNascimento,
            responsavel: formData.responsavel,
            telefone: formData.telefone,
            restricaoAlimentar: formData.restricaoAlimentar,
            descricaoRestricaoAlimentar: formData.restricaoAlimentar
                ? formData.descricaoRestricaoAlimentar
                : null,
            necessidadeEspecial: formData.necessidadeEspecial,
            descricaoNecessidadeEspecial: formData.necessidadeEspecial
                ? formData.descricaoNecessidadeEspecial
                : null,
            autorizaUsoImagem: formData.autorizaUsoImagem,
            autorizaTrocaFralda: formData.autorizaTrocaFralda,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 animate-slide-up">
            <div>
                <label
                    htmlFor="nome"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Nome *
                </label>
                <input
                    type="text"
                    id="nome"
                    className="input-field"
                    value={formData.nome}
                    onChange={(e) =>
                        setFormData({ ...formData, nome: e.target.value })
                    }
                    required
                />
            </div>

            <div>
                <label
                    htmlFor="dataNascimento"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Data de Nascimento *
                </label>
                <input
                    type="date"
                    id="dataNascimento"
                    className="input-field"
                    value={formData.dataNascimento}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            dataNascimento: e.target.value,
                        })
                    }
                    required
                />
            </div>

            <div>
                <label
                    htmlFor="responsavel"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Responsável *
                </label>
                <input
                    type="text"
                    id="responsavel"
                    className="input-field"
                    value={formData.responsavel}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            responsavel: e.target.value,
                        })
                    }
                    required
                />
            </div>

            <div>
                <label
                    htmlFor="telefone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Telefone *
                </label>
                <input
                    type="tel"
                    id="telefone"
                    className="input-field"
                    value={formData.telefone}
                    onChange={(e) =>
                        setFormData({ ...formData, telefone: e.target.value })
                    }
                    placeholder="11999999999"
                    required
                />
            </div>

            <div className="border-t pt-4 mt-6">
                <h3 className="text-md font-semibold text-gray-800 mb-4">
                    Informações Adicionais
                </h3>

                {/* Restrição Alimentar */}
                <div className="mb-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="restricaoAlimentar"
                            className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                            checked={formData.restricaoAlimentar}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    restricaoAlimentar: e.target.checked,
                                    descricaoRestricaoAlimentar: e.target
                                        .checked
                                        ? formData.descricaoRestricaoAlimentar
                                        : "",
                                })
                            }
                        />
                        <label
                            htmlFor="restricaoAlimentar"
                            className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
                        >
                            Possui restrição alimentar?
                        </label>
                    </div>

                    {formData.restricaoAlimentar && (
                        <div className="mt-2 ml-6">
                            <input
                                type="text"
                                id="descricaoRestricao"
                                className="input-field"
                                placeholder="Descreva a restrição (ex: alergia a amendoim, intolerância a lactose)"
                                value={formData.descricaoRestricaoAlimentar}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        descricaoRestricaoAlimentar:
                                            e.target.value,
                                    })
                                }
                            />
                        </div>
                    )}
                </div>

                {/* Necessidade Especial */}
                <div className="mb-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="necessidadeEspecial"
                            className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                            checked={formData.necessidadeEspecial}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    necessidadeEspecial: e.target.checked,
                                    descricaoNecessidadeEspecial: e.target
                                        .checked
                                        ? formData.descricaoNecessidadeEspecial
                                        : "",
                                })
                            }
                        />
                        <label
                            htmlFor="necessidadeEspecial"
                            className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
                        >
                            Possui necessidade especial?
                        </label>
                    </div>

                    {formData.necessidadeEspecial && (
                        <div className="mt-2 ml-6">
                            <input
                                type="text"
                                id="descricaoNecessidade"
                                className="input-field"
                                placeholder="Descreva a necessidade especial"
                                value={formData.descricaoNecessidadeEspecial}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        descricaoNecessidadeEspecial:
                                            e.target.value,
                                    })
                                }
                            />
                        </div>
                    )}
                </div>

                {/* Autoriza Uso de Imagem */}
                <div className="mb-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="autorizaUsoImagem"
                            className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                            checked={formData.autorizaUsoImagem}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    autorizaUsoImagem: e.target.checked,
                                })
                            }
                        />
                        <label
                            htmlFor="autorizaUsoImagem"
                            className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
                        >
                            Autoriza o uso de imagem?
                        </label>
                    </div>
                </div>

                {/* Autoriza Troca de Fralda */}
                <div className="mb-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="autorizaTrocaFralda"
                            className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                            checked={formData.autorizaTrocaFralda}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    autorizaTrocaFralda: e.target.checked,
                                })
                            }
                        />
                        <label
                            htmlFor="autorizaTrocaFralda"
                            className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
                        >
                            Em caso de uso de fralda, autoriza a troca?
                        </label>
                    </div>
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn-secondary"
                >
                    Cancelar
                </button>
                <button type="submit" className="btn-primary">
                    {crianca ? "Atualizar" : "Criar"}
                </button>
            </div>
        </form>
    );
};

export default CriancaForm;

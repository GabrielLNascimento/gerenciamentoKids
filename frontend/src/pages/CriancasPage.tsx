import { useState, useEffect } from "react";
import { Crianca, criancasAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import CriancasTable from "../components/CriancasTable";
import CriancaForm from "../components/CriancaForm";

type GrupoEtario =
  | "todos"
  | "bebes"
  | "medios1"
  | "medios2"
  | "grandes1"
  | "grandes2"
  | "grandes";

const GRUPOS: {
  value: GrupoEtario;
  label: string;
  min: number;
  max: number;
}[] = [
  { value: "bebes", label: "Bebês 1", min: 1, max: 2 },
  { value: "medios1", label: "Médios 1", min: 3, max: 4 },
  { value: "medios2", label: "Médios 2", min: 5, max: 6 },
  { value: "grandes", label: "Grandes", min: 7, max: 11 },
];

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

const CriancasPage = () => {
  const [criancas, setCriancas] = useState<Crianca[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filtroGrupo, setFiltroGrupo] = useState<GrupoEtario>("todos");
  const [busca, setBusca] = useState("");
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    carregarCriancas();
  }, []);

  const carregarCriancas = () => {
    setLoading(true);
    criancasAPI
      .listar()
      .then((response) => {
        setCriancas(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao carregar crianças:", error);
        setLoading(false);
      });
  };

  const handleCriar = (crianca: Omit<Crianca, "id">) => {
    criancasAPI
      .criar(crianca)
      .then(() => {
        carregarCriancas();
        setShowForm(false);
      })
      .catch((error) => {
        console.error("Erro ao criar criança:", error);
        alert("Erro ao criar criança");
      });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta criança?")) {
      criancasAPI
        .deletar(id)
        .then(() => {
          carregarCriancas();
        })
        .catch((error) => {
          console.error("Erro ao deletar criança:", error);
          alert("Erro ao deletar criança");
        });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const normalizar = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const criancasFiltradas = criancas
    .filter((c) => {
      if (filtroGrupo === "todos") return true;
      const grupo = GRUPOS.find((g) => g.value === filtroGrupo)!;
      const idade = calcularIdade(c.dataNascimento);
      return idade >= grupo.min && idade <= grupo.max;
    })
    .filter(
      (c) => busca === "" || normalizar(c.nome).includes(normalizar(busca)),
    );

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gerenciamento de Crianças
          </h1>
          <p className="text-gray-600">
            Cadastre e gerencie as crianças do sistema
          </p>
        </div>
        {!showForm && isLoggedIn && (
          <button onClick={() => setShowForm(true)} className="btn-primary">
            + Nova Criança
          </button>
        )}
      </div>

      {showForm && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Nova Criança
          </h2>
          <CriancaForm onSubmit={handleCriar} onCancel={handleCancel} />
        </div>
      )}

      <div className="mb-3">
        <input
          type="text"
          placeholder="Pesquisar por nome..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full sm:w-80 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={() => setFiltroGrupo("todos")}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            filtroGrupo === "todos"
              ? "bg-primary-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Todos
        </button>
        {GRUPOS.map((grupo) => (
          <button
            key={grupo.value}
            onClick={() => setFiltroGrupo(grupo.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filtroGrupo === grupo.value
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {grupo.label}
          </button>
        ))}
        {!loading && (
          <span className="ml-auto text-sm text-gray-500 self-center">
            {criancasFiltradas.length} criança
            {criancasFiltradas.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {loading ? (
        <div className="text-center py-8">Carregando...</div>
      ) : (
        <CriancasTable
          criancas={criancasFiltradas}
          onDelete={handleDelete}
          canEdit={isLoggedIn}
        />
      )}
    </div>
  );
};

export default CriancasPage;

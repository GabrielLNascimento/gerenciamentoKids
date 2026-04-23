import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Crianca, criancasAPI } from "../services/api";
import CriancaForm from "../components/CriancaForm";

const EditarCriancaPage = () => {
  const { isLoggedIn } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [crianca, setCrianca] = useState<Crianca | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redireciona usuários não-admin
    if (!isLoggedIn) {
      navigate("/criancas");
      return;
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (!id) return;
    criancasAPI
      .obter(Number(id))
      .then((response) => {
        setCrianca(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao carregar criança:", error);
        setLoading(false);
      });
  }, [id]);

  const handleAtualizar = (dados: Omit<Crianca, "id">) => {
    if (!id) return;
    criancasAPI
      .atualizar(Number(id), dados)
      .then(() => {
        navigate("/criancas");
      })
      .catch((error) => {
        console.error("Erro ao atualizar criança:", error);
        alert("Erro ao atualizar criança");
      });
  };

  const handleCancel = () => {
    navigate("/criancas");
  };

  if (!isLoggedIn) {
    return null;
  }

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  if (!crianca) {
    return (
      <div className="text-center py-8 text-red-500">
        Criança não encontrada.
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Editar Criança
        </h1>
        <p className="text-gray-600">Atualize as informações da criança</p>
      </div>
      <div className="card">
        <CriancaForm
          crianca={crianca}
          onSubmit={handleAtualizar}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default EditarCriancaPage;

import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import CriancasPage from "./pages/CriancasPage";
import CultosPage from "./pages/CultosPage";
import CultoDetalhesPage from "./pages/CultoDetalhesPage";
import CriarCultoPage from "./pages/CriarCultoPage";
import EditarCriancaPage from "./pages/EditarCriancaPage";
import RelatorioCriancaPage from "./pages/RelatorioCriancaPage";
import RelatorioPage from "./pages/RelatorioPage";
import FrequenciaCriancaPage from "./pages/FrequenciaCriancaPage";
import LoginPage from "./pages/LoginPage";
import Escala from "./pages/Escala"
import CriarEscalaPage from "./pages/CriarEscalaPage"

const NavLink = ({
  to,
  children,
  onClick,
}: {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  const location = useLocation();
  const isActive =
    location.pathname === to ||
    (to !== "/" && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`${
        isActive
          ? "border-primary-500 text-primary-600"
          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
    >
      {children}
    </Link>
  );
};

const MobileNavLink = ({
  to,
  children,
  onClick,
}: {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  const location = useLocation();
  const isActive =
    location.pathname === to ||
    (to !== "/" && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`${
        isActive
          ? "bg-primary-50 border-primary-500 text-primary-700"
          : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
      } block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors`}
    >
      {children}
    </Link>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              {/* ESQUERDA */}
              <div className="flex items-center">
                <Link
                  to="/"
                  className="text-2xl font-bold text-primary-600 hover:text-primary-700"
                >
                  Gerenciador Kids
                </Link>

                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <NavLink to="/">Dashboard</NavLink>
                  <NavLink to="/criancas">Crianças</NavLink>
                  <NavLink to="/cultos">Eventos</NavLink>
                  {isLoggedIn && <NavLink to="/escala">Escala</NavLink>}
                  <NavLink to="/relatorio">Relatório</NavLink>
                </div>
              </div>

              {/* DIREITA */}
              <div className="flex items-center gap-3">
                {isLoggedIn ? (
                  <button
                    onClick={logout}
                    className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </Link>
                )}

                {/* BOTÃO MOBILE */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                >
                  {mobileMenuOpen ? (
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* MENU MOBILE */}
            {mobileMenuOpen && (
              <div className="sm:hidden border-t border-gray-200 pb-2">
                <MobileNavLink to="/" onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                </MobileNavLink>
                {isLoggedIn && (
                  <MobileNavLink
                    to="/criancas"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Crianças
                  </MobileNavLink>
                )}
                {isLoggedIn && (
                  <MobileNavLink
                    to="/cultos"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Eventos
                  </MobileNavLink>
                )}
                {isLoggedIn && (
                  <MobileNavLink
                    to="/escala"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Escala
                  </MobileNavLink>
                )}
                <MobileNavLink
                  to="/relatorio"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Relatório
                </MobileNavLink>

                {isLoggedIn ? (
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left pl-3 pr-4 py-2 text-gray-600 hover:bg-gray-50"
                  >
                    Logout
                  </button>
                ) : (
                  <MobileNavLink
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </MobileNavLink>
                )}
              </div>
            )}
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/criancas" element={<CriancasPage />} />
            <Route path="/cultos" element={<CultosPage />} />
            <Route
              path="/cultos/novo"
              element={
                <ProtectedRoute>
                  <CriarCultoPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cultos/:id"
              element={
                <ProtectedRoute>
                  <CultoDetalhesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cultos/:id/editar"
              element={
                <ProtectedRoute>
                  <CriarCultoPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/criancas/:id/editar"
              element={
                <ProtectedRoute>
                  <EditarCriancaPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/criancas/:id/relatorio"
              element={<RelatorioCriancaPage />}
            />
            <Route
              path="/criancas/:id/frequencia"
              element={<FrequenciaCriancaPage />}
            />
            <Route path="/relatorio" element={<RelatorioPage />} />
            <Route path="/escala" element={<Escala />} />
            <Route
              path="/escala/nova"
              element={
                <ProtectedRoute>
                  <CriarEscalaPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

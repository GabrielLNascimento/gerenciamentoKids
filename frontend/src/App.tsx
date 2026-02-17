import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CriancasPage from './pages/CriancasPage';
import CultosPage from './pages/CultosPage';
import CultoDetalhesPage from './pages/CultoDetalhesPage';
import CriarCultoPage from './pages/CriarCultoPage';

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={`${isActive
          ? 'border-primary-500 text-primary-600'
          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
        } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
    >
      {children}
    </Link>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link to="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700">
                    Gerenciador Kids
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <NavLink to="/">Dashboard</NavLink>
                  <NavLink to="/criancas">Crianças</NavLink>
                  <NavLink to="/cultos">Eventos</NavLink>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/criancas" element={<CriancasPage />} />
            <Route path="/cultos" element={<CultosPage />} />
            <Route path="/cultos/novo" element={<CriarCultoPage />} />
            <Route path="/cultos/:id" element={<CultoDetalhesPage />} />
            <Route path="/cultos/:id/editar" element={<CriarCultoPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

import { ArrowRight, Building2, LayoutDashboard, Menu, X } from 'lucide-react';
import { Link, NavLink, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Cadastro from './components/Cadastro';
import PainelCliente from './components/PainelCliente';
import Simulador from './components/Simulador';
import Sucesso from './pages/Sucesso';

function Layout() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const linkClass = ({ isActive }: { isActive: boolean }) => `nav-link ${isActive ? 'nav-link-active' : ''}`;
  return (
    <div className="min-h-screen">
      <header className={`site-header ${isHome ? 'site-header-home' : ''}`}>
        <Link to="/" className="brand" aria-label="Página inicial +Projetos">
          <span className="brand-lockup">
            <svg className="brand-symbol" viewBox="0 0 48 48" role="img" aria-label="Símbolo de três camadas geométricas">
              <path d="M24 2 45 12.5 24 23 3 12.5 24 2Z" fill="#FF6A00" />
              <path d="m24 17 21 10.5L24 38 3 27.5 24 17Z" fill="#2E3136" />
              <path d="m24 30 21 10.5L24 51 3 40.5 24 30Z" fill="#9AA0A6" transform="translate(0 -5)" />
            </svg>
            <span><span className="brand-name"><b>+</b>Projetos</span><span className="brand-tagline">Conectar, projetar, realizar.</span></span>
          </span>
        </Link>
        {isHome ? <HomeNavigation /> : (
          <nav className="main-nav" aria-label="Navegação principal">
            <NavLink to="/" end className={linkClass}><Building2 size={17} /> Orçamento</NavLink>
            <NavLink to="/painel" className={linkClass}><LayoutDashboard size={17} /> Meu projeto</NavLink>
          </nav>
        )}
      </header>
      <main className={`page-shell ${isHome ? 'page-shell-home' : ''}`}>
        {location.pathname !== '/' && (
          <div className="breadcrumbs"><Link to="/">Início</Link><ArrowRight size={13} /><span>{location.pathname.replace('/', '').replace('-', ' ')}</span></div>
        )}
        <Outlet />
      </main>
      <footer className="site-footer"><span>+Projetos</span><span>Conectar, projetar, realizar.</span></footer>
    </div>
  );
}

function HomeNavigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  return (
    <>
      <nav className={`home-nav ${menuOpen ? 'home-nav-open' : ''}`} id="home-navigation" aria-label="Navegação principal">
        <a href="#inicio" onClick={closeMenu}>Início</a>
        <a href="#projetos" onClick={closeMenu}>Projetos</a>
        <a href="#sobre" onClick={closeMenu}>Sobre</a>
        <a href="#duvidas" onClick={closeMenu}>Dúvidas</a>
        <a href="#contato" onClick={closeMenu}>Contato</a>
        <Link to="/painel" className="home-panel-link" onClick={closeMenu}><LayoutDashboard size={16} /> Meu projeto</Link>
        <a href="#simulador" className="home-nav-cta" onClick={closeMenu}>Solicitar orçamento <ArrowRight size={16} /></a>
      </nav>
      <button
        type="button"
        className="home-menu-toggle"
        aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={menuOpen}
        aria-controls="home-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <X size={21} /> : <Menu size={21} />}
      </button>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Simulador />} />
        <Route path="cadastro" element={<Cadastro />} />
        <Route path="sucesso" element={<Sucesso />} />
        <Route path="painel" element={<PainelCliente />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

import { Outlet, Link } from "react-router-dom";

function Layout() {
  return (
    <div className="app-container">
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>
      <header className="app-header glass-panel">
        <Link to="/" className="app-title-link">
          <div className="logo-container">
            <svg viewBox="0 0 100 100" className="pokeball-logo" width="32" height="32">
              <circle cx="50" cy="50" r="45" fill="white" stroke="#333" strokeWidth="5"/>
              <path d="M 5 50 A 45 45 0 0 1 95 50 Z" fill="#EF4444" stroke="#333" strokeWidth="5"/>
              <circle cx="50" cy="50" r="12" fill="white" stroke="#333" strokeWidth="5"/>
              <circle cx="50" cy="50" r="6" fill="#333" />
            </svg>
            <h1>PokéDex <span className="highlight">Pro</span></h1>
          </div>
        </Link>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="app-footer glass-panel">
        <p>Designed with ✨ for Week 6 Project</p>
      </footer>
    </div>
  );
}

export default Layout;

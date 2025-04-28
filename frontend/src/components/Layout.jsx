import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1 py-4">
        <div className="container">
          {children}
        </div>
      </main>
      <footer className="bg-light py-3 mt-auto">
        <div className="container text-center">
          <p className="text-muted mb-0">
            &copy; {new Date().getFullYear()} Sistema de Gestão de Cursos e Anotações
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

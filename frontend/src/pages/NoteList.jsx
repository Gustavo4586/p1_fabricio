import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';

const NoteList = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); 
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const params = {};
        if (filter === 'favorites') {
          params.favorite = true;
        }
        
        const response = await api.get('/api/notes', { params });
        setNotes(response.data.data);
        setError('');
      } catch (error) {
        console.error('Erro ao carregar anotações:', error);
        setError('Não foi possível carregar suas anotações. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [filter]);

  
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Layout>
      <div className="row mb-4">
        <div className="col-md-8">
          <h1>Minhas Anotações</h1>
          <p className="lead">Gerencie suas anotações de estudo</p>
        </div>
        <div className="col-md-4 d-flex justify-content-md-end align-items-center">
          <Link to="/notes/new" className="btn btn-primary">
            <i className="bi bi-plus-circle me-2"></i>Nova Anotação
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row mb-4">
        <div className="col-md-8 mb-3 mb-md-0">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Pesquisar anotações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setSearchTerm('')}
              >
                Limpar
              </button>
            )}
          </div>
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Todas as anotações</option>
            <option value="favorites">Favoritas</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      ) : (
        <>
          {filteredNotes.length === 0 ? (
            <div className="alert alert-info" role="alert">
              {searchTerm 
                ? 'Nenhuma anotação encontrada com os termos de pesquisa.' 
                : filter === 'favorites'
                  ? 'Você não tem anotações favoritas.'
                  : 'Você ainda não criou nenhuma anotação.'}
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {filteredNotes.map((note) => (
                <div key={note._id} className="col">
                  <div className="card h-100 shadow-sm">
                    <div className="card-header d-flex justify-content-between align-items-center" 
                         style={{ backgroundColor: note.metadata?.color || '#ffffff' }}>
                      <h5 className="card-title mb-0">{note.title}</h5>
                      {note.favorite && (
                        <i className="bi bi-star-fill text-warning"></i>
                      )}
                    </div>
                    <div className="card-body">
                      <p className="card-text" style={{ maxHeight: '100px', overflow: 'hidden' }}>
                        {note.content}
                      </p>
                      {note.tags.length > 0 && (
                        <div className="mb-2">
                          {note.tags.map((tag, index) => (
                            <span key={index} className="badge bg-secondary me-1">{tag}</span>
                          ))}
                        </div>
                      )}
                      <p className="card-text">
                        <small className="text-muted">
                          Criado em: {new Date(note.metadata.createdAt).toLocaleDateString()}
                        </small>
                      </p>
                    </div>
                    <div className="card-footer bg-transparent border-top-0">
                      <Link to={`/notes/edit/${note._id}`} className="btn btn-primary w-100">
                        Ver/Editar
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Layout>
  );
};

export default NoteList;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/courses');
        setCourses(response.data.data);
        
        
        const uniqueCategories = [...new Set(response.data.data.map(course => 
          course.category ? course.category.name : 'Sem categoria'
        ))];
        setCategories(uniqueCategories);
        
        setError('');
      } catch (error) {
        console.error('Erro ao carregar cursos:', error);
        setError('Não foi possível carregar os cursos. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  
  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory ? 
      (course.category && course.category.name === selectedCategory) : true;
    
    const matchesSearch = searchTerm ? 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      <div className="row mb-4">
        <div className="col-12">
          <h1>Cursos Disponíveis</h1>
          <p className="lead">Explore nossos cursos e comece a aprender hoje mesmo!</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row mb-4">
        <div className="col-md-6 mb-3 mb-md-0">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Pesquisar cursos..."
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
        <div className="col-md-6">
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Todas as categorias</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
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
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filteredCourses.length === 0 ? (
            <div className="col-12">
              <p className="text-center text-muted">Nenhum curso encontrado com os filtros selecionados.</p>
            </div>
          ) : (
            filteredCourses.map((course) => (
              <div key={course.id} className="col">
                <div className="card h-100 shadow-sm">
                  {course.imageUrl ? (
                    <img 
                      src={course.imageUrl} 
                      className="card-img-top" 
                      alt={course.title}
                      style={{ height: '180px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div 
                      className="bg-light d-flex justify-content-center align-items-center"
                      style={{ height: '180px' }}
                    >
                      <span className="text-muted">Sem imagem</span>
                    </div>
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{course.title}</h5>
                    <p className="card-text text-truncate">{course.description || 'Sem descrição'}</p>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-primary">{course.category ? course.category.name : 'Sem categoria'}</span>
                      <span className="badge bg-secondary">{course.level}</span>
                    </div>
                    <p className="card-text">
                      <small className="text-muted">
                        Duração: {course.duration} horas
                      </small>
                    </p>
                  </div>
                  <div className="card-footer bg-transparent border-top-0">
                    <Link to={`/courses/${course.id}`} className="btn btn-primary w-100">
                      Ver Detalhes
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </Layout>
  );
};

export default CourseList;

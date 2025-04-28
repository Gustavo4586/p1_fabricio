import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import api from '../services/api';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 0,
    level: 'iniciante',
    imageUrl: '',
    categoryId: '',
    active: true
  });
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        
        const coursesResponse = await api.get('/api/courses');
        setCourses(coursesResponse.data.data);
        
        
        const uniqueCategories = [...new Set(coursesResponse.data.data
          .filter(course => course.category)
          .map(course => ({ 
            id: course.category.id, 
            name: course.category.name 
          })))];
        
        
        const categoriesMap = new Map();
        uniqueCategories.forEach(cat => categoriesMap.set(cat.id, cat));
        setCategories(Array.from(categoriesMap.values()));
        
        setError('');
      } catch (error) {
        console.error('Erro ao carregar cursos:', error);
        setError('Não foi possível carregar os cursos. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  
  const filteredCourses = courses.filter(course => {
    const matchesSearch = searchTerm 
      ? course.title.toLowerCase().includes(searchTerm.toLowerCase()) 
      : true;
    
    const matchesStatus = showInactive 
      ? true 
      : course.active;
    
    return matchesSearch && matchesStatus;
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const openCreateModal = () => {
    setEditingCourse(null);
    setFormData({
      title: '',
      description: '',
      duration: 0,
      level: 'iniciante',
      imageUrl: '',
      categoryId: '',
      active: true
    });
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description || '',
      duration: course.duration,
      level: course.level,
      imageUrl: course.imageUrl || '',
      categoryId: course.category ? course.category.id : '',
      active: course.active
    });
    setFormError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.duration || !formData.categoryId) {
      setFormError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    try {
      setSaving(true);
      
      const courseData = {
        ...formData,
        duration: parseInt(formData.duration),
        categoryId: parseInt(formData.categoryId)
      };
      
      let response;
      
      if (editingCourse) {
        
        response = await api.put(`/api/courses/${editingCourse.id}`, courseData);
        
        
        setCourses(courses.map(course => 
          course.id === editingCourse.id ? response.data.data : course
        ));
      } else {
        
        response = await api.post('/api/courses', courseData);
        
        
        setCourses([...courses, response.data.data]);
      }
      
      setShowModal(false);
    } catch (error) {
      console.error('Erro ao salvar curso:', error);
      setFormError('Não foi possível salvar o curso. Tente novamente mais tarde.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (course) => {
    try {
      const updatedCourse = {
        ...course,
        active: !course.active
      };
      
      const response = await api.put(`/api/courses/${course.id}`, updatedCourse);
      
      
      setCourses(courses.map(c => 
        c.id === course.id ? response.data.data : c
      ));
    } catch (error) {
      console.error('Erro ao atualizar status do curso:', error);
      setError('Não foi possível atualizar o status do curso. Tente novamente mais tarde.');
    }
  };

  return (
    <Layout>
      <div className="row mb-4">
        <div className="col-md-8">
          <h1>Gerenciamento de Cursos</h1>
          <p className="lead">Administre os cursos da plataforma</p>
        </div>
        <div className="col-md-4 d-flex justify-content-md-end align-items-center">
          <button className="btn btn-primary" onClick={openCreateModal}>
            <i className="bi bi-plus-circle me-2"></i>Novo Curso
          </button>
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
        <div className="col-md-6 d-flex justify-content-md-end">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="showInactive"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="showInactive">
              Mostrar cursos inativos
            </label>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Título</th>
                  <th scope="col">Categoria</th>
                  <th scope="col">Nível</th>
                  <th scope="col">Duração</th>
                  <th scope="col">Status</th>
                  <th scope="col">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-3">
                      Nenhum curso encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredCourses.map((course) => (
                    <tr key={course.id} className={!course.active ? 'table-secondary' : ''}>
                      <td>{course.id}</td>
                      <td>{course.title}</td>
                      <td>{course.category ? course.category.name : 'N/A'}</td>
                      <td>{course.level}</td>
                      <td>{course.duration} horas</td>
                      <td>
                        <span className={`badge ${course.active ? 'bg-success' : 'bg-danger'}`}>
                          {course.active ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => openEditModal(course)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => handleToggleStatus(course)}
                          >
                            {course.active ? 'Desativar' : 'Ativar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Criação/Edição de Curso */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingCourse ? 'Editar Curso' : 'Novo Curso'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {formError && (
                  <div className="alert alert-danger" role="alert">
                    {formError}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">Título *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Descrição</label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label htmlFor="duration" className="form-label">Duração (horas) *</label>
                      <input
                        type="number"
                        className="form-control"
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        min="1"
                        required
                      />
                    </div>
                    
                    <div className="col-md-4">
                      <label htmlFor="level" className="form-label">Nível *</label>
                      <select
                        className="form-select"
                        id="level"
                        name="level"
                        value={formData.level}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="iniciante">Iniciante</option>
                        <option value="intermediário">Intermediário</option>
                        <option value="avançado">Avançado</option>
                      </select>
                    </div>
                    
                    <div className="col-md-4">
                      <label htmlFor="categoryId" className="form-label">Categoria *</label>
                      <select
                        className="form-select"
                        id="categoryId"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Selecione uma categoria</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="imageUrl" className="form-label">URL da Imagem</label>
                    <input
                      type="url"
                      className="form-control"
                      id="imageUrl"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                  </div>
                  
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="active"
                      name="active"
                      checked={formData.active}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor="active">
                      Curso ativo
                    </label>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Salvando...
                    </>
                  ) : (
                    'Salvar'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminCourses;

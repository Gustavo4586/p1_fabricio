import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';

const NoteEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const courseIdParam = queryParams.get('courseId');
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [favorite, setFavorite] = useState(false);
  const [courseId, setCourseId] = useState(courseIdParam || '');
  const [courses, setCourses] = useState([]);
  const [color, setColor] = useState('#ffffff');
  const [lessonNumber, setLessonNumber] = useState(1);
  const [lessonTitle, setLessonTitle] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isEdit, setIsEdit] = useState(!!id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        
        const coursesResponse = await api.get('/api/courses/student/enrolled');
        setCourses(coursesResponse.data.data.map(enrollment => ({
          id: enrollment.courseId,
          title: enrollment.course.title
        })));
        
        
        if (id) {
          const noteResponse = await api.get(`/api/notes/${id}`);
          const note = noteResponse.data.data;
          
          setTitle(note.title);
          setContent(note.content);
          setTags(note.tags.join(', '));
          setFavorite(note.favorite);
          setCourseId(note.courseId.toString());
          
          if (note.metadata) {
            setColor(note.metadata.color || '#ffffff');
            setLessonNumber(note.metadata.lessonNumber || 1);
            setLessonTitle(note.metadata.lessonTitle || '');
          }
        }
        
        setError('');
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Não foi possível carregar os dados. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !content || !courseId) {
      setError('Por favor, preencha os campos obrigatórios: título, conteúdo e curso.');
      return;
    }
    
    try {
      setSaving(true);
      
      const noteData = {
        title,
        content,
        courseId: parseInt(courseId),
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        favorite,
        metadata: {
          color,
          lessonNumber: parseInt(lessonNumber),
          lessonTitle
        }
      };
      
      if (isEdit) {
        await api.put(`/api/notes/${id}`, noteData);
      } else {
        await api.post('/api/notes', noteData);
      }
      
      navigate('/notes');
    } catch (error) {
      console.error('Erro ao salvar anotação:', error);
      setError('Não foi possível salvar a anotação. Tente novamente mais tarde.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir esta anotação?')) {
      return;
    }
    
    try {
      setSaving(true);
      await api.delete(`/api/notes/${id}`);
      navigate('/notes');
    } catch (error) {
      console.error('Erro ao excluir anotação:', error);
      setError('Não foi possível excluir a anotação. Tente novamente mais tarde.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="row mb-4">
        <div className="col-12">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/notes">Anotações</Link></li>
              <li className="breadcrumb-item active" aria-current="page">
                {isEdit ? 'Editar Anotação' : 'Nova Anotação'}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-12">
          <h1>{isEdit ? 'Editar Anotação' : 'Nova Anotação'}</h1>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-8">
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">Título *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">Conteúdo *</label>
                    <textarea
                      className="form-control"
                      id="content"
                      rows="10"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="tags" className="form-label">Tags (separadas por vírgula)</label>
                    <input
                      type="text"
                      className="form-control"
                      id="tags"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="Ex: importante, revisão, dúvida"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card shadow-sm mb-4">
                <div className="card-header">
                  <h5 className="mb-0">Configurações</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label htmlFor="courseId" className="form-label">Curso *</label>
                    <select
                      className="form-select"
                      id="courseId"
                      value={courseId}
                      onChange={(e) => setCourseId(e.target.value)}
                      required
                    >
                      <option value="">Selecione um curso</option>
                      {courses.map(course => (
                        <option key={course.id} value={course.id}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="lessonNumber" className="form-label">Número da Aula</label>
                    <input
                      type="number"
                      className="form-control"
                      id="lessonNumber"
                      value={lessonNumber}
                      onChange={(e) => setLessonNumber(e.target.value)}
                      min="1"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="lessonTitle" className="form-label">Título da Aula</label>
                    <input
                      type="text"
                      className="form-control"
                      id="lessonTitle"
                      value={lessonTitle}
                      onChange={(e) => setLessonTitle(e.target.value)}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="color" className="form-label">Cor</label>
                    <input
                      type="color"
                      className="form-control form-control-color w-100"
                      id="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      title="Escolha uma cor para a anotação"
                    />
                  </div>
                  
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="favorite"
                      checked={favorite}
                      onChange={(e) => setFavorite(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="favorite">
                      Marcar como favorita
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="d-grid gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Salvando...
                    </>
                  ) : (
                    'Salvar Anotação'
                  )}
                </button>
                
                {isEdit && (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDelete}
                    disabled={saving}
                  >
                    Excluir Anotação
                  </button>
                )}
                
                <Link to="/notes" className="btn btn-outline-secondary">
                  Cancelar
                </Link>
              </div>
            </div>
          </div>
        </form>
      )}
    </Layout>
  );
};

export default NoteEditor;

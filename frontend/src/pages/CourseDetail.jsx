import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        
        
        const courseResponse = await api.get(`/api/courses/${id}`);
        setCourse(courseResponse.data.data);
        
        
        if (currentUser) {
          try {
            const enrollmentsResponse = await api.get('/api/courses/student/enrolled');
            const enrollments = enrollmentsResponse.data.data;
            
            const enrollment = enrollments.find(e => e.courseId === parseInt(id));
            if (enrollment) {
              setIsEnrolled(true);
              setEnrollmentStatus(enrollment.status);
            }
          } catch (error) {
            console.error('Erro ao verificar matrícula:', error);
          }
          
          
          try {
            setLoadingNotes(true);
            const notesResponse = await api.get(`/api/notes/course/${id}`);
            setNotes(notesResponse.data.data);
          } catch (error) {
            console.error('Erro ao buscar anotações:', error);
          } finally {
            setLoadingNotes(false);
          }
        }
        
        setError('');
      } catch (error) {
        console.error('Erro ao carregar detalhes do curso:', error);
        setError('Não foi possível carregar os detalhes do curso. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id, currentUser]);

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      await api.post(`/api/courses/${id}/enroll`);
      setIsEnrolled(true);
      setEnrollmentStatus('ativo');
    } catch (error) {
      console.error('Erro ao matricular no curso:', error);
      setError('Não foi possível realizar a matrícula. Tente novamente mais tarde.');
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <Layout>
      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : course ? (
        <>
          <div className="row mb-4">
            <div className="col-12">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/courses">Cursos</Link></li>
                  <li className="breadcrumb-item active" aria-current="page">{course.title}</li>
                </ol>
              </nav>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-8">
              <h1>{course.title}</h1>
              <div className="d-flex gap-2 mb-3">
                <span className="badge bg-primary">{course.category ? course.category.name : 'Sem categoria'}</span>
                <span className="badge bg-secondary">{course.level}</span>
                <span className="badge bg-info">{course.duration} horas</span>
              </div>
              <p className="lead">{course.description || 'Sem descrição disponível.'}</p>
              
              <div className="mt-4">
                <h4>Instrutor</h4>
                <p>{course.instructor ? course.instructor.name : 'Instrutor não especificado'}</p>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card shadow-sm">
                {course.imageUrl ? (
                  <img 
                    src={course.imageUrl} 
                    className="card-img-top" 
                    alt={course.title}
                  />
                ) : (
                  <div 
                    className="bg-light d-flex justify-content-center align-items-center"
                    style={{ height: '200px' }}
                  >
                    <span className="text-muted">Sem imagem</span>
                  </div>
                )}
                <div className="card-body">
                  {isEnrolled ? (
                    <>
                      <div className="alert alert-success">
                        Você está matriculado neste curso!
                      </div>
                      <p>Status: <strong>{enrollmentStatus}</strong></p>
                      <Link to={`/notes/new?courseId=${course.id}`} className="btn btn-primary w-100 mb-2">
                        Criar Anotação
                      </Link>
                      <Link to={`/notes/course/${course.id}`} className="btn btn-outline-primary w-100">
                        Ver Minhas Anotações
                      </Link>
                    </>
                  ) : (
                    <button 
                      className="btn btn-success w-100" 
                      onClick={handleEnroll}
                      disabled={enrolling}
                    >
                      {enrolling ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Matriculando...
                        </>
                      ) : (
                        'Matricular-se'
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {isEnrolled && (
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h4 className="mb-0">Minhas Anotações</h4>
                  </div>
                  <div className="card-body">
                    {loadingNotes ? (
                      <div className="d-flex justify-content-center my-3">
                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                          <span className="visually-hidden">Carregando...</span>
                        </div>
                      </div>
                    ) : notes.length === 0 ? (
                      <p className="text-muted">Você ainda não tem anotações para este curso.</p>
                    ) : (
                      <div className="list-group">
                        {notes.slice(0, 3).map(note => (
                          <Link 
                            key={note._id} 
                            to={`/notes/edit/${note._id}`}
                            className="list-group-item list-group-item-action"
                          >
                            <div className="d-flex w-100 justify-content-between">
                              <h5 className="mb-1">{note.title}</h5>
                              <small>{new Date(note.metadata.createdAt).toLocaleDateString()}</small>
                            </div>
                            <p className="mb-1 text-truncate">{note.content}</p>
                            {note.tags.length > 0 && (
                              <div>
                                {note.tags.map((tag, index) => (
                                  <span key={index} className="badge bg-secondary me-1">{tag}</span>
                                ))}
                              </div>
                            )}
                          </Link>
                        ))}
                        
                        {notes.length > 3 && (
                          <div className="text-center mt-3">
                            <Link to={`/notes/course/${course.id}`} className="btn btn-outline-primary">
                              Ver todas as anotações ({notes.length})
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="alert alert-warning" role="alert">
          Curso não encontrado.
        </div>
      )}
    </Layout>
  );
};

export default CourseDetail;

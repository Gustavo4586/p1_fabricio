import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [noteStats, setNoteStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        
        const coursesResponse = await api.get('/api/courses/student/enrolled');
        setEnrolledCourses(coursesResponse.data.data);
        
        
        const statsResponse = await api.get('/api/notes/stats');
        setNoteStats(statsResponse.data.data);
        
        setError('');
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        setError('Não foi possível carregar os dados. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Layout>
      <div className="row mb-4">
        <div className="col-12">
          <h1>Dashboard</h1>
          <p className="lead">Bem-vindo(a), {currentUser?.name}!</p>
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
        <>
          <div className="row mb-4">
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Meus Cursos</h5>
                  <Link to="/courses" className="btn btn-sm btn-primary">Ver Todos</Link>
                </div>
                <div className="card-body">
                  {enrolledCourses.length === 0 ? (
                    <p className="text-muted">Você ainda não está matriculado em nenhum curso.</p>
                  ) : (
                    <div className="list-group">
                      {enrolledCourses.slice(0, 5).map((enrollment) => (
                        <Link 
                          key={enrollment.id} 
                          to={`/courses/${enrollment.courseId}`}
                          className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                        >
                          <div>
                            <h6 className="mb-1">{enrollment.course.title}</h6>
                            <small className="text-muted">
                              {enrollment.course.category.name} • {enrollment.course.level}
                            </small>
                          </div>
                          <span className={`badge bg-${enrollment.status === 'ativo' ? 'primary' : enrollment.status === 'concluído' ? 'success' : 'secondary'}`}>
                            {enrollment.status}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Minhas Anotações</h5>
                  <Link to="/notes" className="btn btn-sm btn-primary">Ver Todas</Link>
                </div>
                <div className="card-body">
                  {!noteStats || noteStats.totalNotes === 0 ? (
                    <p className="text-muted">Você ainda não criou nenhuma anotação.</p>
                  ) : (
                    <>
                      <div className="mb-4">
                        <h6>Resumo</h6>
                        <div className="d-flex justify-content-between">
                          <div className="text-center p-3 border rounded">
                            <h3>{noteStats.totalNotes}</h3>
                            <small className="text-muted">Total de Anotações</small>
                          </div>
                          <div className="text-center p-3 border rounded">
                            <h3>{noteStats.favoriteCount}</h3>
                            <small className="text-muted">Favoritas</small>
                          </div>
                          <div className="text-center p-3 border rounded">
                            <h3>{noteStats.notesByCourse.length}</h3>
                            <small className="text-muted">Cursos</small>
                          </div>
                        </div>
                      </div>

                      <h6>Anotações por Curso</h6>
                      <div className="list-group">
                        {noteStats.notesByCourse.slice(0, 3).map((item) => (
                          <Link 
                            key={item.courseId} 
                            to={`/notes/course/${item.courseId}`}
                            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                          >
                            <div>
                              <h6 className="mb-1">{item.courseName || `Curso ${item.courseId}`}</h6>
                              <small className="text-muted">
                                Última atualização: {new Date(item.lastUpdated).toLocaleDateString()}
                              </small>
                            </div>
                            <span className="badge bg-info">{item.count}</span>
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Ações Rápidas</h5>
                </div>
                <div className="card-body">
                  <div className="d-flex flex-wrap gap-2">
                    <Link to="/courses" className="btn btn-outline-primary">
                      Explorar Cursos
                    </Link>
                    <Link to="/notes/new" className="btn btn-outline-success">
                      Nova Anotação
                    </Link>
                    <Link to="/profile" className="btn btn-outline-secondary">
                      Editar Perfil
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Dashboard;

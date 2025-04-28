import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import api from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    courses: 0,
    enrollments: 0,
    notes: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        
        const usersResponse = await api.get('/api/users');
        const users = usersResponse.data.data;
        
       
        const coursesResponse = await api.get('/api/courses');
        const courses = coursesResponse.data.data;
        
        
        const activeUsers = users.filter(user => user.active).length;
        const activeCourses = courses.filter(course => course.active).length;
        
       
        let totalEnrollments = 0;
        courses.forEach(course => {
          if (course.students) {
            totalEnrollments += course.students.length;
          }
        });
        
        setStats({
          users: activeUsers,
          courses: activeCourses,
          enrollments: totalEnrollments,
          notes: 0 
        });
        
        setError('');
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
        setError('Não foi possível carregar as estatísticas. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <Layout>
      <div className="row mb-4">
        <div className="col-12">
          <h1>Dashboard Administrativo</h1>
          <p className="lead">Visão geral do sistema</p>
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
            <div className="col-md-3 mb-4">
              <div className="card bg-primary text-white h-100">
                <div className="card-body">
                  <h5 className="card-title">Usuários</h5>
                  <h2 className="display-4">{stats.users}</h2>
                </div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <Link to="/admin/users" className="text-white text-decoration-none">
                    Ver Detalhes
                  </Link>
                  <div className="small text-white">
                    <i className="bi bi-chevron-right"></i>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-3 mb-4">
              <div className="card bg-success text-white h-100">
                <div className="card-body">
                  <h5 className="card-title">Cursos</h5>
                  <h2 className="display-4">{stats.courses}</h2>
                </div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <Link to="/admin/courses" className="text-white text-decoration-none">
                    Ver Detalhes
                  </Link>
                  <div className="small text-white">
                    <i className="bi bi-chevron-right"></i>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-3 mb-4">
              <div className="card bg-warning text-white h-100">
                <div className="card-body">
                  <h5 className="card-title">Matrículas</h5>
                  <h2 className="display-4">{stats.enrollments}</h2>
                </div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <span className="text-white text-decoration-none">
                    Total
                  </span>
                  <div className="small text-white">
                    <i className="bi bi-chevron-right"></i>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-3 mb-4">
              <div className="card bg-info text-white h-100">
                <div className="card-body">
                  <h5 className="card-title">Anotações</h5>
                  <h2 className="display-4">{stats.notes}</h2>
                </div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <span className="text-white text-decoration-none">
                    Total
                  </span>
                  <div className="small text-white">
                    <i className="bi bi-chevron-right"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="card shadow-sm mb-4">
                <div className="card-header">
                  <h5 className="mb-0">Ações Rápidas</h5>
                </div>
                <div className="card-body">
                  <div className="d-flex flex-wrap gap-2">
                    <Link to="/admin/courses" className="btn btn-primary">
                      Gerenciar Cursos
                    </Link>
                    <Link to="/admin/users" className="btn btn-success">
                      Gerenciar Usuários
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

export default AdminDashboard;

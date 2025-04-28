import  User  from '../models/User.js';


const UserController = {
  
  async getAllUsers(req, res) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] }
      });
      
      return res.status(200).json({
        success: true,
        data: users
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar usuários',
        error: process.env.NODE_ENV === 'development' ? error.message : {}
      });
    }
  },
  
  
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      
      const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] }
      });
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar usuário',
        error: process.env.NODE_ENV === 'development' ? error.message : {}
      });
    }
  },
  
  
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, email, password, role, active } = req.body;
      
      
      const user = await User.findByPk(id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }
      
     
      if ((role || active !== undefined) && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Permissão negada para alterar role ou status'
        });
      }
      
      
      if (req.user.id !== user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Permissão negada para atualizar outro usuário'
        });
      }
      
      
      await user.update({
        name: name || user.name,
        email: email || user.email,
        password: password ? password : undefined, 
        role: role || user.role,
        //active: active !== undefined ? active : user.active
      });
      
      
      const userResponse = { ...user.get() };
      delete userResponse.password;
      
      return res.status(200).json({
        success: true,
        message: 'Usuário atualizado com sucesso',
        data: userResponse
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao atualizar usuário',
        error: process.env.NODE_ENV === 'development' ? error.message : {}
      });
    }
  },
  
  
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      
      
      const user = await User.findByPk(id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }
      
      
      await user.update({ active: false });
      
      return res.status(200).json({
        success: true,
        message: 'Usuário desativado com sucesso'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao desativar usuário',
        error: process.env.NODE_ENV === 'development' ? error.message : {}
      });
    }
  }
};

export default UserController;

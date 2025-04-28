import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import  User  from '../models/User.js';


const AuthController = {

  async register(req, res) {
    try {
      const { name, email, password, role } = req.body;
      if (!name || !email || !password ) {
        return res.status(400).json({
          success: false,
          message: 'Campos obrigatórios faltando: name, email, password, role.'
        });
      }

      if (!role || (role !== 'user' && role !== 'admin')) {
        role = 'user';
      }

      
  
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email já está em uso'
        });
      }
  
      
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || 'aluno'
      });
  
      const userResponse = { ...user.get() };
      delete userResponse.password;
  
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
  
      return res.status(201).json({
        success: true,
        message: 'Usuário registrado com sucesso',
        data: {
          user: userResponse,
          token
        }
      });
    } catch (error) {
      console.error('Erro no register:', error); 
      return res.status(500).json({
        success: false,
        message: 'Erro ao registrar usuário',
        error: process.env.NODE_ENV === 'development' ? error.message : {}
      });
    }
  },
  
  
 
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Email ou senha inválidos'
        });
      }
      
    
      //if (!user.active) {
        //return res.status(401).json({
         // success: false,
        //  message: 'Usuário inativo'
       // });
      //}
      
   
      const isPasswordValid = await user.checkPassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Email ou senha inválidos'
        });
      }
      
     
      const userResponse = { ...user.get() };
      delete userResponse.password;
      
      const expiresIn = process.env.JWT_EXPIRES_IN || '1h';
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn }
      );
      
      return res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso',
        data: {
          user: userResponse,
          token
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao realizar login',
        error: process.env.NODE_ENV === 'development' ? error.message : {}
      });
    }
  },
  
  
  async getProfile(req, res) {
    try {
      
      const user = req.user;
      
      
      const userResponse = { ...user.get() };
      delete userResponse.password;
      
      return res.status(200).json({
        success: true,
        data: userResponse
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao obter perfil',
        error: process.env.NODE_ENV === 'development' ? error.message : {}
      });
    }
  }
};

export default AuthController;

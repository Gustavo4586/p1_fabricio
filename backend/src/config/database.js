import { Sequelize } from 'sequelize';
import path from 'path';
import dotenv from 'dotenv';


dotenv.config();


const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

console.log('Senha do banco:', process.env.DB_PASSWORD, typeof process.env.DB_PASSWORD);


const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com PostgreSQL estabelecida com sucesso.');
    return true;
  } catch (error) {
    console.error('Não foi possível conectar ao PostgreSQL:', error);
    return false;
  }
};

export{
  sequelize,
  testConnection
};

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();


const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conexão com MongoDB estabelecida com sucesso.');
    return true;
  } catch (error) {
    console.error('Não foi possível conectar ao MongoDB:', error);
    return false;
  }
};

export{
  connectMongoDB,
  mongoose
};

import { connect, set } from 'mongoose';

const dbConnection = async () => {
  try {
    set('strictQuery', false);

    console.log('Connecting to database...');
    await connect(process.env.DB_CONN);

    console.log('DB Online');
  } catch (error) {
    console.log(error);
    throw new Error('Error starting database');
  }
};

export default dbConnection;

import mongoose from 'mongoose';

import winstonLogger from './logger.js';

const connectDatabase = async () => {
  try {
    await mongoose.connect(`${process.env.DATABASE_URL}${process.env.DATABASE_NAME}?authSource=admin`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      user: process.env.DATABASE_USER,
      pass: process.env.DATABASE_PASSWORD,
    });

    mongoose.connection.on('connected', () => {
      winstonLogger.info(`Database ${process.env.DATABASE_URL}${process.env.DATABASE_NAME}?authSource=admin connected`);
    });

    mongoose.connection.on('error', error => {
      winstonLogger.error(error);
      throw error;
    });
  } catch (error) {
    winstonLogger.error(error);
    throw error;
  }

  return mongoose;
};

export default connectDatabase;

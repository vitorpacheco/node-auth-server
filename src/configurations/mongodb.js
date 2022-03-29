import mongoose from 'mongoose';

import winstonLogger from './logger.js';

const connectDatabase = async () => {
  mongoose.connect(`${process.env.DATABASE_URL}${process.env.DATABASE_NAME}?authSource=admin`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: process.env.DATABASE_USER,
    pass: process.env.DATABASE_PASSWORD,
  });

  winstonLogger.info(`Database ${process.env.DATABASE_URL}${process.env.DATABASE_NAME}?authSource=admin connected`);

  return mongoose;
};

export default connectDatabase;

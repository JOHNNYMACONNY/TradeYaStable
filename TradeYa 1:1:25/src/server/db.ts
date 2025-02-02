import { MongoClient, Db } from 'mongodb';

let db: Db;

const connectDB = async () => {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    db = client.db(process.env.MONGODB_DB_NAME);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export { db, connectDB };
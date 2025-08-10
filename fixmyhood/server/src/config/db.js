import mongoose from 'mongoose';

export async function connectToDatabase() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not set');
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 15000,
  });
  console.log('Connected to MongoDB');
}
import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  const MONGO_URI = process.env.MONGO_URI || '';

  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB successfully connected!');
    return;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Exit process with failure code if connection fails
    process.exit(1);
  }
};

export default connectDB;

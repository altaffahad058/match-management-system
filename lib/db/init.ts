import { initDatabase } from './connection';

// Initialize database connection on module load
if (typeof window === 'undefined') {
  // Only initialize on server side
  try {
    initDatabase();
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}


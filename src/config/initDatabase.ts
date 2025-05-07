import sequelize from './database';

export const initializeDatabase = async () => {
  try {
    // Test connection first
    await sequelize.authenticate();
    console.log('PostgreSQL connection has been established successfully.');

    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');

    return true;
  } catch (error) {
    console.error('Unable to initialize database:', error);
    throw error;
  }
};

export const closeDatabaseConnection = async () => {
  try {
    await sequelize.close();
    console.log('Database connection closed successfully.');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
}; 
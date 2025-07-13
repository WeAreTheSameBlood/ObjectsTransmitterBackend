const { DataSource } = require('typeorm');
require('dotenv').config();

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: true,
  entities: ['dist/modules/**/entities/**/*.js'],
  migrations: ['dist/migrations/*.js'],
  migrationsTableName: 'migrations',
});

module.exports = AppDataSource;

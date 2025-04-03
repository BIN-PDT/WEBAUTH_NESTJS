import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'sqlite',
  database: 'db.sqlite3',
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/**/*.ts'],
  migrationsTableName: 'migration_table',
});

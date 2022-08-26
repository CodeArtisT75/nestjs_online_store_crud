import 'dotenv/config';
import * as path from 'path';
import { DataSource } from 'typeorm';

const TypeOrmDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  entities: [path.join(__dirname, '..', '..', 'src', '**', '*.entity.ts')],
  extra: {
    charset: 'utf8mb4_unicode_ci'
  },
  synchronize: false,
  logging: false
});

export async function clearDataBase() {
  try {
    const dataSource = await TypeOrmDataSource.initialize();
    const entities = dataSource.entityMetadatas;

    for (const entity of entities) {
      const repository = await TypeOrmDataSource.getRepository(entity.name);
      await repository.query(`TRUNCATE TABLE ${entity.tableName} CASCADE;`);
    }

    await dataSource.destroy();
  } catch (error) {
    throw new Error(`ERROR: Cleaning test db: ${error}`);
  }
}

import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

async function bootstrap() {
  console.log('🧹 Starting database reset...');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    await clearAllData(dataSource);
    
    console.log('✅ Database reset completed successfully!');
  } catch (error) {
    console.error('❌ Database reset failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

async function clearAllData(dataSource: DataSource) {
  console.log('🗑️  Clearing all data...');
  
  const tables = ['tasks', 'call_tags', 'calls', 'tags', 'users'];
  
  for (const table of tables) {
    await dataSource.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`);
    console.log(`  ✓ Cleared and reset ${table}`);
  }
}

bootstrap();
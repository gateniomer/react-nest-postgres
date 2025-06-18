import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { UsersService } from 'src/modules/users/users.service';
import { TagService } from 'src/modules/tag/tag.service';
import { CallService } from 'src/modules/call/call.service';
import { TasksService } from 'src/modules/tasks/tasks.service';
import { TaskStatus } from 'src/entities/task.entity';

async function bootstrap() {
  console.log('🌱 Starting database seeding...');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  const tagsService = app.get(TagService);
  const callsService = app.get(CallService);
  const tasksService = app.get(TasksService);

  try {
    await seedUsers(usersService);
    const tags = await seedTags(tagsService);
    const calls = await seedCalls(callsService, tags);
    await seedTasks(tasksService, calls);
    
    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

async function seedUsers(usersService: UsersService) {
  console.log('👤 Seeding users...');
  
  const users = [
    { username: 'admin', password: '1', role: 'admin' },
    { username: 'user', password: '1', role: 'user' }
  ];

  for (const userData of users) {
    const existingUser = await usersService.findByUsername(userData.username);
    
    if (!existingUser) {
      await usersService.create(userData.username, userData.password, userData.role);
      console.log(`  ✓ Created user: ${userData.username} (${userData.role})`);
    } else {
      console.log(`  - User already exists: ${userData.username}`);
    }
  }
}

async function seedTags(tagsService: TagService) {
  console.log('🏷️  Seeding tags...');
  
  const tags = [
    { name: 'Urgent', description: 'High priority items', color: '#ff4444' },
    { name: 'Important', description: 'Important but not urgent', color: '#ffaa00' },
    { name: 'Follow-up', description: 'Requires follow-up action', color: '#44ff44' },
    { name: 'Meeting', description: 'Meeting related calls', color: '#4444ff' },
    { name: 'Customer', description: 'Customer service calls', color: '#ff44ff' },
  ];

  const createdTags: any[] = [];
  for (const tagData of tags) {
    const tag = await tagsService.create(tagData);
    createdTags.push(tag);
    console.log(`  ✓ Created tag: ${tagData.name}`);
  }
  
  return createdTags;
}

async function seedCalls(callsService: CallService, tags: any[]) {
  console.log('📞 Seeding calls...');
  
  const calls = [
    { title: 'Client consultation call', userId: 1, tagIds: [tags[0].id, tags[1].id] }, // Urgent + Important
    { title: 'Team standup meeting', userId: 2, tagIds: [tags[3].id] }, // Meeting
    { title: 'Product demo session', userId: 1, tagIds: [tags[1].id, tags[3].id] }, // Important + Meeting
    { title: 'Customer support call', userId: 3, tagIds: [tags[0].id, tags[4].id] }, // Urgent + Customer
    { title: 'Project review meeting', userId: 4, tagIds: [tags[2].id, tags[3].id] }, // Follow-up + Meeting
  ];

  const createdCalls: any[] = [];
  for (const callData of calls) {
    const call = await callsService.create(callData);
    createdCalls.push(call);
    console.log(`  ✓ Created call: ${callData.title}`);
  }
  
  return createdCalls;
}

async function seedTasks(tasksService: TasksService, calls: any[]) {
  console.log('✅ Seeding tasks...');
  
  const tasks = [
    { title: 'Send follow-up email', status: TaskStatus.OPEN, callId: calls[0].id },
    { title: 'Update project timeline', status: TaskStatus.IN_PROGRESS, callId: calls[0].id },
    { title: 'Schedule next meeting', status: TaskStatus.COMPLETED, callId: calls[1].id },
    { title: 'Prepare demo materials', status: TaskStatus.OPEN, callId: calls[2].id },
    { title: 'Review customer feedback', status: TaskStatus.IN_PROGRESS, callId: calls[3].id },
    { title: 'Document action items', status: TaskStatus.OPEN, callId: calls[4].id },
  ];

  for (const taskData of tasks) {
    await tasksService.create(taskData);
    console.log(`  ✓ Created task: ${taskData.title} (${taskData.status})`);
  }
}

bootstrap();
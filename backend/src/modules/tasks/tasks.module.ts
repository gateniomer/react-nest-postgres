import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { Call, Task } from 'src/entities';

@Module({
    imports: [TypeOrmModule.forFeature([Task, Call])],
    providers: [TasksService],
    controllers: [TasksController]
})
export class TasksModule {}

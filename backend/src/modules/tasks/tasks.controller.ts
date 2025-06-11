import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  Put,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from 'src/entities';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll(@Query('callId') callId?: string): Promise<Task[]> {
    if (callId) {
      return this.tasksService.findByCall(parseInt(callId, 10));
    }
    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.tasksService.remove(id);
  }
}
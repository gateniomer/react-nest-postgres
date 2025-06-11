import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Call, Task} from 'src/entities';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Call)
    private callRepository: Repository<Call>
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const callId = createTaskDto.callId;

    if (!callId) {
      throw new NotFoundException(`Call ID must be provided`);
    }
    
    const call = await this.callRepository.findOne({
      where: {id: callId}
    });

    if (!call) {
      throw new NotFoundException(`Call with ID ${callId} not found`);
    }

    const task = this.taskRepository.create(createTaskDto);
    task.call = call;
    return await this.taskRepository.save(task);
  }

  async findAll(): Promise<Task[]> {
    return await this.taskRepository.find({
      relations: ['call'],
    });
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['call'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async findByCall(callId: number): Promise<Task[]> {
    return await this.taskRepository.find({
      where: { call: { id: callId } },
      relations: ['call'],
    });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    
    Object.assign(task, updateTaskDto);
    return await this.taskRepository.save(task);
  }

  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);
    await this.taskRepository.remove(task);
  }
}
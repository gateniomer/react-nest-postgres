import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Call, Tag } from 'src/entities';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';

@Injectable()
export class CallService {
  constructor(
    @InjectRepository(Call)
    private readonly callRepository: Repository<Call>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async findAll(): Promise<Call[]> {
    return this.callRepository.find({
      relations: ['tags', 'tasks']
    });
  }

  async findOne(id: number): Promise<Call> {
    const call = await this.callRepository.findOne({
      where: { id },
      relations: ['tags', 'tasks']
    });
    if (!call) throw new NotFoundException(`Call with id ${id} not found`);
    return call;
  }

  async create(createCallDto: CreateCallDto): Promise<Call> {
    const { tagIds, ...callData } = createCallDto;
    
    const call = this.callRepository.create(callData);
    
    if (tagIds && tagIds.length > 0) {
      const tags = await this.tagRepository.findByIds(tagIds);
      call.tags = tags;
    }
    
    return this.callRepository.save(call);
  }

  async update(id: number, updateCallDto: UpdateCallDto): Promise<Call> {
    const call = await this.findOne(id);
    const { tagIds, ...updateData } = updateCallDto;
    
    Object.assign(call, updateData);
    
    if (tagIds !== undefined) {
      if (tagIds.length > 0) {
        const tags = await this.tagRepository.findByIds(tagIds);
        call.tags = tags;
      } else {
        call.tags = [];
      }
    }
    
    return this.callRepository.save(call);
  }

  async addTagsToCall(callId: number, tagIds: number[]): Promise<Call> {
    const call = await this.findOne(callId);
    const tags = await this.tagRepository.findByIds(tagIds);
    
    const existingTagIds = call.tags.map(tag => tag.id);
    const newTags = tags.filter(tag => !existingTagIds.includes(tag.id));
    call.tags = [...call.tags, ...newTags];
    
    return this.callRepository.save(call);
  }

  async removeTagsFromCall(callId: number, tagIds: number[]): Promise<Call> {
    const call = await this.findOne(callId);
    call.tags = call.tags.filter(tag => !tagIds.includes(tag.id));
    return this.callRepository.save(call);
  }

  async remove(id: number): Promise<void> {
    const call = await this.callRepository.findOne({
      where: { id },
      relations: ['tasks', 'tags']
    });
    
    if (!call) {
      throw new NotFoundException(`Call with id ${id} not found`);
    }
    
    call.tags = [];
    await this.callRepository.save(call);
    
    await this.callRepository.remove(call);
  }
}
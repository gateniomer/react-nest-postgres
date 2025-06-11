import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from 'src/entities';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async findAll(): Promise<Tag[]> {
    return this.tagRepository.find();
  }

  async findOne(id: number): Promise<Tag> {
    const tag = await this.tagRepository.findOneBy({ id });
    if (!tag) throw new NotFoundException(`Tag with id ${id} not found`);
    return tag;
  }

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const tag = this.tagRepository.create(createTagDto);
    return this.tagRepository.save(tag);
  }

  async update(id: number, updateTagDto: UpdateTagDto): Promise<Tag> {
    const tag = await this.findOne(id);
    Object.assign(tag, updateTagDto);
    return this.tagRepository.save(tag);
  }

  async remove(id: number): Promise<void> {
    const tag = await this.tagRepository.findOne({
      where: { id },
      relations: ['calls']
    });
    
    if (!tag) {
      throw new NotFoundException(`Tag with id ${id} not found`);
    }
    
    tag.calls = [];
    await this.tagRepository.save(tag);
    
    await this.tagRepository.remove(tag);
  }
}

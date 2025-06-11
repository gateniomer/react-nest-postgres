import { Controller, Get, Post, Delete, Param, Body, ParseIntPipe, Put, UseGuards } from '@nestjs/common';
import { TagService } from './tag.service';
import { Tag } from 'src/entities';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Roles('admin', 'user')
  @Get()
  findAll(): Promise<Tag[]> {
    return this.tagService.findAll();
  }

  @Roles('admin', 'user')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Tag> {
    return this.tagService.findOne(id);
  }

  @Roles('admin')
  @Post()
  create(@Body() createTagDto: CreateTagDto): Promise<Tag> {
    return this.tagService.create(createTagDto);
  }

  @Roles('admin')
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTagDto: UpdateTagDto,
  ): Promise<Tag> {
    return this.tagService.update(id, updateTagDto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.tagService.remove(id);
  }
}

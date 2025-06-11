import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from 'src/entities';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';


@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  providers: [TagService],
  controllers: [TagController],
})
export class TagModule {}

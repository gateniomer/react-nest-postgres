import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CallService } from './call.service';
import { CallController } from './call.controller';
import { Tag, Call } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Call, Tag])],
  providers: [CallService],
  controllers: [CallController],
})
export class CallModule {}

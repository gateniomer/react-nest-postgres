import { Controller, Get, Post, Delete, Param, Body, ParseIntPipe, Put, UseGuards } from '@nestjs/common';
import { CallService } from './call.service';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';
import { Call } from 'src/entities';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin', 'user')
@Controller('calls')
export class CallController {
  constructor(private readonly callService: CallService) {}


  @Get()
  findAll(): Promise<Call[]> {
    return this.callService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Call> {
    return this.callService.findOne(id);
  }

  @Post()
  create(@Body() createCallDto: CreateCallDto): Promise<Call> {
    return this.callService.create(createCallDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCallDto: UpdateCallDto,
  ): Promise<Call> {
    return this.callService.update(id, updateCallDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.callService.remove(id);
  }
}

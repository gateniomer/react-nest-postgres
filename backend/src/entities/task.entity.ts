import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Call } from './call.entity';
import { IsEnum } from 'class-validator';

export enum TaskStatus {
  OPEN = 'Open',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed'
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.OPEN
  })
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @ManyToOne(() => Call, call => call.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'callId' })
  call: Call;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
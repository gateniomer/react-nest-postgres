import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Tag } from './tag.entity';
import { Task } from './task.entity';

@Entity('calls')
export class Call {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  userId: number;

  @ManyToMany(() => Tag, (tag) => tag.calls)
  @JoinTable({ name: 'call_tags' })
  tags: Tag[];

  @OneToMany(() => Task, task => task.call)
  tasks: Task[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
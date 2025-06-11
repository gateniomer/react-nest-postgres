import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';
import { Call } from './call.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  color: string;

  @ManyToMany(() => Call, (call) => call.tags)
  calls: Call[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
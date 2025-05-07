import {
  Entity,
  PrimaryGeneratedColumn,
  Column, CreateDateColumn,
  OneToMany, ManyToMany, JoinTable,
} from 'typeorm';
import { ObjectFile } from '@models/storage/object.file';

@Entity('users')
export class User {
  // Properties
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  name?: string;

  @CreateDateColumn({ name: 'date_registered' })
  dateRegistration: Date;

  // Related
  @OneToMany(() => ObjectFile, (file) => file.owner, {
    cascade: ['insert', 'update'],
  })
  addedModels: ObjectFile[];

  @ManyToMany(() => ObjectFile, { cascade: true })
  @JoinTable({
    name: 'user_favorite_models',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'model_id',
      referencedColumnName: 'id',
    },
  })
  favoriteModels: ObjectFile[];
}

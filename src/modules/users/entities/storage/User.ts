import {
  Entity,
  PrimaryGeneratedColumn,
  Column, CreateDateColumn,
  OneToMany, ManyToMany, JoinTable,
} from 'typeorm';
import { ModelFile } from '@src/modules/models/entities/storage/model-file';

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
  @OneToMany(() => ModelFile, (file) => file.owner, {
    cascade: ['insert', 'update'],
  })
  addedModels: ModelFile[];

  @ManyToMany(() => ModelFile, { cascade: true })
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
  favoriteModels: ModelFile[];
}

import {
    Entity, Column,
    PrimaryGeneratedColumn,
    CreateDateColumn, ManyToOne
} from 'typeorm';
import { User } from '@modules/users/entities/storage/User';

@Entity('model_files')
export class ModelFile {
  // Properties
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  model_file_url_key: string;

  @Column('float')
  size: number;             // in Mb

  @CreateDateColumn()
  date_created: Date;

  // Realated
  @ManyToOne(() => User, (user) => user.addedModels, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  owner?: User;
}

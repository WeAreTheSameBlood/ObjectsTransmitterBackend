import {
  Entity,
  PrimaryGeneratedColumn,
  Column, CreateDateColumn,
  OneToMany, ManyToMany, JoinTable,
} from 'typeorm';
import { StoreItem } from '@src/modules/store-items/entities/storage/store-item';

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
  @OneToMany(() => StoreItem, (file) => file.media, {
    cascade: ['insert', 'update'],
  })
  addedModels: StoreItem[];

  @ManyToMany(() => StoreItem, { cascade: true })
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
  favoriteModels: StoreItem[];
}

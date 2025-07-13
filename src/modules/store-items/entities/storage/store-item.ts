import {
    Entity, Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    OneToMany
} from 'typeorm';
import { StoreItemMedia } from './store-item-media';
import { ItemCategory } from '../domain/item-categories';

@Entity('store_items')
export class StoreItem {
  // Properties
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: ItemCategory,
    array: true,
  })
  categories: ItemCategory[];

  @Column({ name: 'model_file_url_key' })
  modelFileUrlKey: string;

  @Column({ name: 'title_image_url_key' })
  titleImageUrlKey: string;

  @Column('decimal', { name: 'price', precision: 5, scale: 2, default: 0 })
  price: number;

  @CreateDateColumn({ name: 'date_created' })
  dateCreated: Date;

  // Realate
  @OneToMany(() => StoreItemMedia, (file) => file.store_item)
  media: StoreItemMedia[];
}
import {
    Entity, Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    OneToMany
} from 'typeorm';
import { StoreItemMedia } from './store-item-media';

@Entity('store_items')
export class StoreItem {
  // Properties
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  brand: string;

  @Column({
    name: 'barcode_value',
    nullable: true,
    default: null,
  })
  barcodeValue: string;

  @Column({ name: 'model_file_url_key' })
  modelFileUrlKey: string;

  @Column({ default: 0 })
  amount: number;

  @CreateDateColumn({ name: 'date_created' })
  dateCreated: Date;

  // Realate
  @OneToMany(() => StoreItemMedia, (file) => file.store_item)
  media: StoreItemMedia[];
}
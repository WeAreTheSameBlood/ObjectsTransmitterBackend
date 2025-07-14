import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { StoreItem } from "./store-item";

@Entity('store_item_media_files')
export class StoreItemMedia {
  // Properties
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => StoreItem, (item) => item.media, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'storeItemId' })
  store_item: StoreItem;

  @Column()
  media_file_url_key: string;
}

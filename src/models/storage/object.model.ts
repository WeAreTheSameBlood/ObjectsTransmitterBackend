import {
    Entity, Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
} from 'typeorm';

@Entity()
export class ObjectModel {
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
}

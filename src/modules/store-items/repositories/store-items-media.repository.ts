import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { StoreItemMedia } from "../entities/storage/store-item-media";


@Injectable()
export class ItemMediaRepository {
  // Init
  constructor(
    @InjectRepository(StoreItemMedia)
    private readonly repo: Repository<StoreItemMedia>,
  ) {}

  // Create
  create(partial: Partial<StoreItemMedia>): StoreItemMedia {
    return this.repo.create(partial);
  }

  // Save
  save(mediaFile: StoreItemMedia): Promise<StoreItemMedia> {
    return this.repo.save(mediaFile);
  }
}

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { StoreItem } from "../entities/storage/store-item";


@Injectable()
export class ItemRepository {
  // Init
  constructor(
    @InjectRepository(StoreItem)
    private readonly repo: Repository<StoreItem>,
  ) {}

  // Create
  create(partial: Partial<StoreItem>): StoreItem {
    return this.repo.create(partial);
  }

  // Save
  save(objectFile: StoreItem): Promise<StoreItem> {
    return this.repo.save(objectFile);
  }

  // Find All
  findAll(): Promise<StoreItem[]> {
    return this.repo.find();
  }

  // Find One by ID
  findOneById(model_id: string): Promise<StoreItem | null> {
    return this.repo.findOne({
      where: { id: model_id },
      relations: ['media'],
    });
  }

  // Delete by ID
  async delete(modelId: string): Promise<boolean> {
    const result = await this.repo.delete({ id: modelId });
    if (result.affected) {
      return result.affected > 0;
    }
    return false;
  }
}
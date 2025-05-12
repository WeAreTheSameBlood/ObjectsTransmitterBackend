import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ModelFile } from "../entities/storage/model-file";


@Injectable()
export class ModelsRepository {
  // Init
  constructor(
    @InjectRepository(ModelFile)
    private readonly repo: Repository<ModelFile>,
  ) {}

  // Create
  create(data: Partial<ModelFile>): ModelFile {
    return this.repo.create(data);
  }

  // Save
  save(objectFile: ModelFile): Promise<ModelFile> {
    return this.repo.save(objectFile);
  }

  // Find All
  findAll(): Promise<ModelFile[]> {
    return this.repo.find();
  }

  // Find All by User
  findAllByUser(userId: string): Promise<ModelFile[]> {
    return this.repo.findBy({ owner: { id: userId } })
  }

  // Find One by ID
  findOneById(model_id: string): Promise<ModelFile | null> {
    return this.repo.findOne({
      where: { id: model_id },
      relations: [
        'owner',
        'owner.addedModels'
      ]
    });
  }

  // Delete by ID
  async delete(modelId: string): Promise<boolean> {
    const result = await this.repo.delete({ id: modelId });
    if (result.affected) {
      return result.affected > 0
    }
    return false;
  }
}
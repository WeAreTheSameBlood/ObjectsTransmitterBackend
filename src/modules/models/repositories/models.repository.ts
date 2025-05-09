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

  // Find One by ID
  findOne(id: string): Promise<ModelFile | null> {
    return this.repo.findOne({
      where: { id },
      relations: [
        'owner',
        'owner.addedModels'
      ]
    });
  }
}
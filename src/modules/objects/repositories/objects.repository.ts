import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ObjectFile } from "../entities/storage/ObjectFile";


@Injectable()
export class ObjectsRepository {
  // Init
  constructor(
    @InjectRepository(ObjectFile)
    private readonly repo: Repository<ObjectFile>,
  ) {}

  // Create
  create(data: Partial<ObjectFile>): ObjectFile {
    return this.repo.create(data);
  }

  // Save
  save(objectFile: ObjectFile): Promise<ObjectFile> {
    return this.repo.save(objectFile);
  }

  // Find All
  findAll(): Promise<ObjectFile[]> {
    return this.repo.find();
  }

  // Find One by ID
  findOne(id: string): Promise<ObjectFile | null> {
    return this.repo.findOne({
      where: { id },
      relations: [
        'owner',
        'owner.addedModels'
      ]
    });
  }
}
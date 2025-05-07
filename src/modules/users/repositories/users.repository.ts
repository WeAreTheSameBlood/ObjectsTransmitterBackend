import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/storage/User';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  create(data: Partial<User>): User {
    return this.repo.create(data);
  }

  save(user: User): Promise<User> {
    return this.repo.save(user);
  }

  findAll(): Promise<User[]> {
    return this.repo.find({ relations: ['addedModels', 'favoriteModels'] });
  }

  findOne(id: string): Promise<User | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['addedModels', 'favoriteModels'],
    });
  }
}

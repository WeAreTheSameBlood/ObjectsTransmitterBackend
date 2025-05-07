import { Injectable } from '@nestjs/common';
import { User } from '../entities/storage/User'
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
export class UsersService {
  // MARK: - Init
  constructor(
    private readonly usersRepo: UsersRepository,
  ) {}

  // MARK: - Create
  async create(data: Partial<User>): Promise<String> {
    const user = this.usersRepo.create(data);
    const newUser = this.usersRepo.save(user);
    return (await newUser).id
  }

  // MARK: - Find All
  async findAll(): Promise<User[]> {
    return this.usersRepo.findAll();
  }

  // MARK: - Find by Id
  async findOne(id: string): Promise<User | null> {
    return this.usersRepo.findOne(id);
  }
}

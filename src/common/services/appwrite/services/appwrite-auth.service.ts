import { Injectable } from '@nestjs/common';
import { Account, Users, Query } from 'node-appwrite';
import { AppWriteBaseClientService } from '../services/appwrite-base-client.service';
import { IAppWriteAuthManager } from '../interfaces/appwrite-auth-manager.interface';

@Injectable()
export class AppWriteAuthService implements IAppWriteAuthManager {
  // MARK: - Properties
  private account: Account;

  // MARK: - Init
  constructor(private clientService: AppWriteBaseClientService) {
    this.account = new Account(this.clientService.client);
  }

  // MARK: - Create User
  public async createUser(
    email: string,
    password: string,
    username: string,
  ): Promise<{
    userId: string;
    email: string;
  }> {
    const user = await this.account.create(
      'unique()',
      email,
      password,
      username,
    );
    return {
      userId: user.$id,
      email: user.email,
    };
  }

  // MARK: - Create Session
  public async createSession(
    email: string,
    password: string,
  ): Promise<{
    userId: string;
    sessionId: string;
  }> {
    const session = await this.account.createEmailPasswordSession(
      email,
      password,
    );
    return {
      userId: session.userId,
      sessionId: session.$id,
    };
  }

  // MARK: - Delete Session
  public async deleteSession(sessionId: string): Promise<void> {
    await this.account.deleteSession(sessionId);
  }

  // MARK: - Check Username
  public async isUsernameUnique(username: string): Promise<boolean> {
    const users = new Users(this.clientService.client);
    const response = await users.list([
      Query.equal('name', username),
    ]);
    return response.total === 0;
  }
}

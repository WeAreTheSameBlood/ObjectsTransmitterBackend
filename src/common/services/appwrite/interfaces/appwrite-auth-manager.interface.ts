export interface IAppWriteAuthManager {
  // Create User
  createUser(
    email: string,
    password: string,
    name: string,
  ): Promise<{ userId: string; email: string }>;

  // Create Sessin
  createSession(
    email: string,
    password: string
  ): Promise<{ userId: string }>;

  // Delete Session
  deleteSession(sessionId: string): Promise<void>;
}
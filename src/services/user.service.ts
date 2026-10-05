import { UserRepository } from '../repositories/user.repository.js';

export class UserService {
  private userRepo = new UserRepository();

  async getUserProfile(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error('User not found');
    return user;
  }
}
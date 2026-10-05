import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository.js';
import { env } from '../config/env.js';

export class AuthService {
  private userRepo = new UserRepository();

  async register(email: string, username: string, plainTextPass: string) {
    const existingEmail = await this.userRepo.findByEmail(email);
    if (existingEmail) throw new Error('Email is already registered');

    const existingUsername = await this.userRepo.findByUsername(username);
    if (existingUsername) throw new Error('Username is taken');

    const passwordHash = await bcrypt.hash(plainTextPass, 10);
    const user = await this.userRepo.createUser({ email, username, passwordHash });

    const token = jwt.sign({ id: user.id, email: user.email, username: user.username }, env.JWT_SECRET, {
      expiresIn: '7d'
    });

    return { token, user: { id: user.id, email: user.email, username: user.username, eloRating: user.eloRating } };
  }

  async login(email: string, plainTextPass: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new Error('Invalid email or password');

    const isMatch = await bcrypt.compare(plainTextPass, user.passwordHash);
    if (!isMatch) throw new Error('Invalid email or password');

    const token = jwt.sign({ id: user.id, email: user.email, username: user.username }, env.JWT_SECRET, {
      expiresIn: '7d'
    });

    return { token, user: { id: user.id, email: user.email, username: user.username, eloRating: user.eloRating } };
  }
}
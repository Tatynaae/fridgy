import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './database/entities/index.js';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async health(): Promise<{ status: string; database: string }> {
    await this.users.exists();
    return { status: 'ok', database: 'up' };
  }
}

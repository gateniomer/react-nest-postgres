import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    
    if (user && await this.usersService.validatePassword(password, user.password)) {
      const payload = { username: user.username, sub: user.id, role: user.role };
      return { 
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        }
      };
    }
    return null;
  }

  async register(username: string, password: string, role: string = 'user') {
    const existingUser = await this.usersService.findByUsername(username);
    if (existingUser) {
      throw new Error('Username already exists');
    }
    
    return this.usersService.create(username, password, role);
  }
}
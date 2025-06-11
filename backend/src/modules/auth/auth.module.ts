import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from 'src/guards/roles.guard';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [AuthService, JwtStrategy, RolesGuard],
  controllers: [AuthController],
})
export class AuthModule {}
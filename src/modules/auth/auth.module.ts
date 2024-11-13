import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({
    global: true,
    secret: process.env.SECRET_WORD,
    signOptions: { expiresIn: "1d" },
  }),],
  providers: [AuthService, UsersService, PrismaService],
  controllers: [AuthController]
})
export class AuthModule {}
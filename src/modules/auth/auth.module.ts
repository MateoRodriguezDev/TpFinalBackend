import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({
    global: true,
    secret: process.env.TOKEN || 'secreto',
    signOptions: { expiresIn: "1d" },
  }),],
  providers: [AuthService, UsersService, PrismaService],
  controllers: [AuthController]
})
export class AuthModule {}

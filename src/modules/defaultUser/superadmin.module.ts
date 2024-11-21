import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SuperAdminService } from './superadmin.service';

@Module({
  providers: [SuperAdminService, PrismaService],
})
export class SuperAdminModule {}

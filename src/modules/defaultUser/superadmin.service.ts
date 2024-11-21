import { Injectable, OnModuleInit } from '@nestjs/common';
import { hashPassword } from 'src/helpers/bcrypt.helper';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SuperAdminService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.createSuperAdmin();
  }

  private async createSuperAdmin() {
    const superAdmin = await this.prisma.user.findFirst({
      where: { role: 'superadmin' },
    });

    if (!superAdmin) {
      const password = await hashPassword('superadmin');
      await this.prisma.user.create({
        data: {
          email: 'super@super.com',
          password,
          role: 'superadmin',
        },
      });
      console.log('Superadmin created');
    }
  }
}

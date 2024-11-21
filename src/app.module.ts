import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { SuperAdminModule } from './modules/defaultUser/superadmin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    ProductsModule,
    AuthModule,
    SuperAdminModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

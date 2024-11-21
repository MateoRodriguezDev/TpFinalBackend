import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService){}

  async create(createProductDto: CreateProductDto)  {
    return await this.prisma.product.create({data: createProductDto})
  }

  async findAll() :  Promise<CreateProductDto[]> {
    const product = await this.prisma.product.findMany({where: {deletedAt: null}})

    //Verifico si hay productos
    if(product.length === 0) throw new NotFoundException('Could Not Find Products')

    return product;
  }

  async findOne(id: number, getDeletes?: boolean) : Promise<CreateProductDto>{
    const where = { id, deletedAt: null };
    if (getDeletes) delete where['deletedAt'];
    const product = await this.prisma.product.findFirst({where});
    if (!product) throw new NotFoundException('Product Not Found');

    return product;
  }

  async update(id: number, updateUserDto: Partial<UpdateProductDto>, getDeletes?: boolean) {
    const product = await this.findOne(id, getDeletes);
    return await this.prisma.product.update({ where: { id }, data: updateUserDto });
  }

  async remove(id: number) {
    const product = await this.findOne(id, false)

    await this.update(id, { deletedAt: new Date() });
    return `#${id} has been deleted`;
  }

  async restore(id: number) {
    const product = await this.update(id, { deletedAt: null }, true);
    return product;
  }
}

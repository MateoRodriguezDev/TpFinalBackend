import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma.service';

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

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}

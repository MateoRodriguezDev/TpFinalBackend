import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthRolGuard } from '../auth/guards/auth_rol.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('products')
@UseGuards(AuthGuard, AuthRolGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}


  @Post()
  @Roles('admin', 'superadmin')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @Roles('user', 'admin', 'superadmin')
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'superadmin', 'user')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @Roles('superadmin')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @Roles('admin', 'superadmin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(+id);
  }

  @Patch('restore/:id')
  @Roles('admin', 'superadmin')
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.restore(+id);
  }
}

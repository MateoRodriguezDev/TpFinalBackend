import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsString, IsNumber, IsOptional, IsDate } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @IsOptional()
    @IsString()
    name?: string

    @IsOptional()
    @IsNumber()
    price?: number

    @IsOptional()
    @IsString()
    description?: string

    @IsOptional()
    @IsNumber()
    quantity?: number

    @IsOptional()
    @IsDate()
    deletedAt?: Date
}

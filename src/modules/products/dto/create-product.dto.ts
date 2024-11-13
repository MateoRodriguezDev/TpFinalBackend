import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"


export class CreateProductDto {

    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsNumber()
    price: number

    @IsNotEmpty()
    @IsString()
    description: string

    @IsNotEmpty()
    @IsNumber()
    quantity: number

    @IsOptional()
    @IsDate()
    deletedAt?: Date
}

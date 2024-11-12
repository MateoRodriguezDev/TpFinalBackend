import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @IsOptional()
    @IsString()
    email?: string

    @IsOptional()
    @IsString()
    password?: string

    @IsOptional()
    @IsString()
    role?: string

    @IsOptional()
    @IsDate()
    deletedAt?: Date
}

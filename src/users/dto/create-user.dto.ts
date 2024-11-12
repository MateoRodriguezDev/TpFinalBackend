import {IsDate, IsNotEmpty, IsOptional, IsString} from 'class-validator'

export class CreateUserDto {
    
    @IsNotEmpty()
    @IsString()
    email: string

    @IsNotEmpty()
    @IsString()
    password: string

    @IsOptional()
    @IsString()
    role?: string

    @IsOptional()
    @IsDate()
    deletedAt?: Date
}

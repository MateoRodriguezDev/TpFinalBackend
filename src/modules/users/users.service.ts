import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { hashPassword } from 'src/helpers/bcrypt.helper';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, @Inject(REQUEST) private readonly request: Request){}

  async create(createUserDto: CreateUserDto) : Promise<CreateUserDto> {
    const {email} = createUserDto

    //Hasheo la contraseña
    createUserDto.password = await hashPassword(createUserDto.password)
    
    //Verifico si el usuario existe
    const user = await this.prisma.user.findUnique({where: {email}})
    if(!user.deletedAt) throw new BadRequestException('User Already Exists')
    
    //Si el usuario tiene un deletedAt quiere decir que fue borrado
    //Osea que puedo usar su correo para crear otro usuario
    await this.prisma.user.delete({where: {email: user.email}})

    //Creo el usuario
    return await this.prisma.user.create({data: {...createUserDto}})
  }

  async findAll() :  Promise<CreateUserDto[]> {
    const users = await this.prisma.user.findMany({where: {deletedAt: null}})

    //Verifico si hay usuarios
    if(users.length === 0) throw new NotFoundException('Could Not Find Users')

    return users;
  }

  async findOne(id: number, getDeletes?: boolean) : Promise<CreateUserDto>{
    const where = { id, deletedAt: null };
    if (getDeletes) delete where['deletedAt'];
    const user = await this.prisma.user.findFirst({where});
    if (!user) throw new NotFoundException('User Not Found');

    return user;
  }

  async findOneByEmail(email: string, getDeletes?: boolean) : Promise<CreateUserDto>{
    const where = { email, deletedAt: null };
    if (getDeletes) delete where['deletedAt'];
    const user = await this.prisma.user.findFirst({where});
    if (!user) throw new NotFoundException('User Not Found');

    return user;
  }

  async update(id: number, updateUserDto: Partial<UpdateUserDto>, getDeletes?: boolean) {
    const user = await this.findOne(id, getDeletes);

    //Evito errores cuando se utiliza el mismo email dos veces
    if(updateUserDto.email !== undefined){
      const isUsed = await this.prisma.user.findFirst({where: {email: updateUserDto.email}})
      if(isUsed) throw new BadRequestException('Email is already used')
    }

    return await this.prisma.user.update({ where: { id }, data: updateUserDto });
  }

  async changeToAdmin(id: number) {
    const user = await this.update(id, { role: "admin" }, false);
    return user;
  }

  async changeToUser(id: number) {
    const user = await this.update(id, { role: "user" }, false);
    return user;
  }

  async changeRole(id: number) {
    const user = await this.findOne(id)
  
    if(user.role === 'admin'){
      const newUser = this.update(id, {role: 'user'})
      return newUser
    }else if(user.role === 'user'){
      const newUser = await this.update(id, {role: 'admin'})
      return newUser
    }else{
      throw new BadRequestException('Superadmin cant change role')
    }
  
  }


  async remove(id: number) {
    const user = await this.findOne(id, false)

    if(user.role === 'superadmin'){
      throw new BadRequestException('Superadmin cant be deleted')
    }

    await this.update(id, { deletedAt: new Date() });
    return `#${user.email} has been deleted`;
  }

  async restore(id: number) {
    const user = await this.update(id, { deletedAt: null }, true);
    return user;
  }

  


}

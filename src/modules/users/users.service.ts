import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { hashPassword } from 'src/helpers/bcrypt.helper';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService){}

  async create(createUserDto: CreateUserDto) : Promise<CreateUserDto> {
    const {email} = createUserDto

    //Hasheo la contraseña
    createUserDto.password = await hashPassword(createUserDto.password)
    
    //Verifico si el usuario existe
    const user = await this.prisma.user.findUnique({where: {email}})
    if(user) throw new BadRequestException('User Already Exists')

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


  async remove(id: number) {
    const user = await this.findOne(id, false)

    await this.update(id, { deletedAt: new Date() });
    return `#${user.email} has been deleted`;
  }

  async restore(id: number) {
    const user = await this.update(id, { deletedAt: null }, true);
    return user;
  }


}

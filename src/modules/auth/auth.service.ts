import {BadRequestException, Injectable, UnauthorizedException} from "@nestjs/common";
import { LoginDto } from "./dto/login-dto";
import { UsersService } from "../users/users.service";
import { checkPassword } from "src/helpers/bcrypt.helper";
import { JwtService } from "@nestjs/jwt";
  
  @Injectable()
  export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {}
  
    async login({ email, password }: LoginDto) {
        const user = await this.usersService.findOneByEmail(email);
    
        if (!user) {
          throw new UnauthorizedException("Invalid email");
        }
    
        const isPasswordValid = await checkPassword(password, user.password);
    
        if (!isPasswordValid) {
          throw new UnauthorizedException("Invalid password");
        }
    
        const payload = { email: user.email };
    
        const token = await this.jwtService.signAsync(payload);
    
        return {
          token: token,
          email: user.email,
        };
      }
  }
  
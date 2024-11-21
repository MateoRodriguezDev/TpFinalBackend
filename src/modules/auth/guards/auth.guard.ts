import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {Request} from 'express'




@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService
  ){}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)

    if(!token){
      throw new UnauthorizedException()
    }

    try {
      //Verifica el token con la palabra secreta
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.TOKEN || 'secreto',
      });

      //Guarda una copia del usuario extraido del token en el request
      request.user = payload;
    } catch (error) {
      throw new UnauthorizedException();
    }

    return true;
  }

  //Funcion para retirar el token del header
  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}

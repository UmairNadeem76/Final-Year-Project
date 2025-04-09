import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from './users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersGuard implements CanActivate {

  constructor(private usersService: UsersService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.cookies['accessToken'];

    if (!accessToken) {
      return false;
    }

   const res = this.usersService.isAccessTokenValid(accessToken);
   if (!res) return false;

   request.user = {
    email: res.email,
    role: res.role,
   }

  return true;

  }
}

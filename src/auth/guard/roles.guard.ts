import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Role } from '../model/role.model';
import { Reflector } from '@nestjs/core';
import { Constant } from '../../common/constant';
import { Request } from 'express';
import { JWTPayloadModel } from '../model/jwt_payload.model';
import { User } from '../../user/entity/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        //Only validate handler. If that is public, don't validate parent's role
        const isPublic: boolean = this.reflector.get<boolean>(
            Constant.metadataNames.IS_PUBLIC,
            context.getHandler(),
        );
        if (isPublic) return true;

        //TODO: Validate how to use getAllAndMerge method from reflector. Fail with login route
        const roles: Role[] = this.reflector.getAllAndOverride<Role[]>(
            Constant.metadataNames.ROLE,
            [context.getHandler(), context.getClass()],
        );
        if (!roles) return true;

        const request: Request = context.switchToHttp().getRequest();
        const user: User = request.user as User;

        return roles.includes(user.role as Role);
    }
}

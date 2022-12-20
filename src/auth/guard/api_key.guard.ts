import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { Constant } from '../../common/constant';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const isPublicEndPoint: boolean = this.reflector.get<boolean>(
            Constant.metadataNames.PUBLIC_ENDPOINT,
            context.getHandler(),
        );
        if (isPublicEndPoint) return isPublicEndPoint;

        const request: Request = context.switchToHttp().getRequest<Request>();
        const headerFrom = request.header('x-from');
        return headerFrom === 'EX';
    }
}

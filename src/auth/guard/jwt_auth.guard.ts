import { AuthGuard } from "@nestjs/passport";
import { BadRequestException, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { Reflector } from "@nestjs/core";
import { Constant } from "../../common/constant";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const isPublic: boolean = this.reflector.getAllAndOverride<boolean>(Constant.metadataNames.IS_PUBLIC, [
            context.getHandler(), //Manage the method http(@Ger, @Post, etc) context.
            context.getClass() //Manage the controller context.
        ]);
        if(isPublic) return true;

        return super.canActivate(context);
    }

    handleRequest(err, user, info) {
        if(err || !user) {
            if(info instanceof TokenExpiredError){
                throw new UnauthorizedException(`${info.message} at ${info.expiredAt.getTime()}`);
            } else if(info instanceof JsonWebTokenError || info instanceof SyntaxError){
                throw new BadRequestException(info.message);
            }
            throw err || new UnauthorizedException(info && info?.message);
        }

        return user;
    }
}

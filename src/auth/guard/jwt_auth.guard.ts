import { AuthGuard } from "@nestjs/passport";
import { BadRequestException, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
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

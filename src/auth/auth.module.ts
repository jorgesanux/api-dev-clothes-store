import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { AuthController } from './controller/auth.controller';

@Module({
    providers: [AuthService, LocalStrategy],
    imports: [UserModule, PassportModule],
    controllers: [AuthController],
})
export class AuthModule {}

import { DynamicModule, Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { AuthController } from './controller/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import config from '../config';
import { ConfigType } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';
import { JwtStrategy } from './strategy/jwt.strategy';

const jwtModule: DynamicModule = JwtModule.registerAsync({
    useFactory: async (
        configService: ConfigType<typeof config>,
    ): Promise<JwtModuleOptions> => {
        return {
            secret: configService.jwt.secret,
            signOptions: {
                expiresIn: '60s',
            },
        };
    },
    inject: [config.KEY],
});

@Module({
    providers: [AuthService, LocalStrategy, JwtStrategy],
    imports: [UserModule, PassportModule, jwtModule],
    controllers: [AuthController],
    exports: [JwtStrategy],
})
export class AuthModule {}

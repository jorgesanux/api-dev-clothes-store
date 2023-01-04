import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../../user/service/user.service';
import { User } from '../../user/entity/user.entity';
import { AuthHelper } from '../../common/helper/auth.helper';
import { CastHelper } from '../../common/helper/cast.helper';
import { JwtService } from '@nestjs/jwt';
import { JWTPayloadModel } from '../model/jwt_payload.model';
import { JWTResponseModel } from '../model/jwt_response.model';
import { CustomerService } from '../../user/service/customer.service';
import { Customer } from '../../user/entity/customer.entity';
import { SignupDTO } from '../dto/signup.dto';
import {
    DataSource,
    EntityManager,
    QueryFailedError,
    QueryRunner,
} from 'typeorm';
import { CreateUserDTO } from '../../user/dto/user.dto';
import { CreateCustomerDTO } from '../../user/dto/customer.dto';
import { QueryFailedErrorHandler } from '../../common/handler/query_failed_error.handler';
import { EmailService } from '../../email/service/email.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private customerService: CustomerService,
        private jwtService: JwtService,
        private emailService: EmailService,
        private dataSource: DataSource,
    ) {}

    async validateUser(email: string, password: string): Promise<User> {
        try {
            const user: User = await this.userService.findByEmail(email);
            if (!user) return null;

            const isValidPassword: boolean = await AuthHelper.comparePassword(
                password,
                CastHelper.BufferToString(user.password),
            );
            if (!isValidPassword) return null;

            delete user.password;
            return user;
        } catch (e: unknown) {
            if (e instanceof NotFoundException) return null;
            throw e;
        }
    }

    generateToken(user: User): JWTResponseModel {
        const payload: JWTPayloadModel = {
            sub: user.id,
            user,
        };
        const token: string = this.jwtService.sign(payload);
        const decodedToken: JWTPayloadModel = this.jwtService.decode(token, {
            json: true,
        }) as JWTPayloadModel;
        return {
            accessToken: token,
            expiresIn: AuthHelper.calculateTimeToExpire(decodedToken.exp),
            exp: decodedToken.exp,
            user,
        };
    }

    async registerUserAndCustomer(payload: SignupDTO): Promise<Customer> {
        const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const manager: EntityManager = queryRunner.manager;
            const userDTO: CreateUserDTO = {
                email: payload.email,
                role: 'CUS',
                password: payload.password,
            };
            const user: User = await this.userService.create(userDTO, manager);

            const customerDTO: CreateCustomerDTO = {
                userId: user.id,
                address: payload.address,
                companyName: payload.companyName,
                lastName: payload.lastName,
                name: payload.name,
                phone: payload.phone,
            };
            const customer: Customer = await this.customerService.create(
                customerDTO,
                manager,
            );
            await queryRunner.commitTransaction();
            return customer;
        } catch (e: unknown) {
            await queryRunner.rollbackTransaction();
            if (e instanceof QueryFailedError)
                QueryFailedErrorHandler.handle(e as QueryFailedError);
            throw e;
        } finally {
            await queryRunner.release();
        }
    }
}

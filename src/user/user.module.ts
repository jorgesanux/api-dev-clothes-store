import { Module } from '@nestjs/common';
import { CustomerController } from './controller/customer.controller';
import { UserController } from './controller/user.controller';
import { CustomerService } from './service/customer.service';
import { UserService } from './service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UserController, CustomerController],
    providers: [UserService, CustomerService],
    exports: [CustomerService],
})
export class UserModule {}

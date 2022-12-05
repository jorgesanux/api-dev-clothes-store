import { Module } from '@nestjs/common';
import { CustomerController } from './controller/customer.controller';
import { UserController } from './controller/user.controller';
import { CustomerService } from './service/customer.service';
import { UserService } from './service/user.service';

@Module({
    imports: [],
    controllers: [UserController, CustomerController],
    providers: [UserService, CustomerService],
})
export class UserModule {}

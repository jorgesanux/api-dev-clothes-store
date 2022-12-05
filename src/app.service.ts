import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHello(): string {
        return 'Hello World!';
    }
    getName(name: string): string {
        return `Name: ${name}.`;
    }
    getProduct(idProduct): string {
        return `Product: ${idProduct}.`;
    }
}

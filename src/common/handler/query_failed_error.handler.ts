import { QueryFailedError } from "typeorm";
import { ConflictException, UnprocessableEntityException } from "@nestjs/common";

import { Constant } from "../constant";

export class QueryFailedErrorHandler {
    public static handle(error: QueryFailedError): void {
        const message: string = QueryFailedErrorHandler.formatErrorMessage(error);
        if(error.driverError.code === Constant.dbDriverErrors.DUPLICATE_KEY_VIOLATES_UNIQUE_CONSTRAINT){
            throw new ConflictException(message);
        }
        throw new UnprocessableEntityException(message);
    }

    private static formatErrorMessage(error: QueryFailedError): string{
        return `[${error.driverError.code}] ${error.driverError.message}\n${error.driverError.detail}`;
    }
}

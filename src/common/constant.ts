class ProviderKey {
    /** @deprecated **/
    PG_CLIENT: string = "PG_CLIENT";
    ENV_CONFIG: string = "config";
}

class DBDriverError {
    DUPLICATE_KEY_VIOLATES_UNIQUE_CONSTRAINT: string = "23505";
}

export class Constant {
    static providerKeys: ProviderKey = new ProviderKey();
    static dbDriverErrors: DBDriverError = new DBDriverError();
}

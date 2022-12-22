class ProviderKey {
    /** @deprecated **/
    PG_CLIENT = 'PG_CLIENT';
    ENV_CONFIG = 'config';
}

class DBDriverError {
    DUPLICATE_KEY_VIOLATES_UNIQUE_CONSTRAINT = '23505';
}

class ControllerParam {
    LIMIT = 10;
    PAGE = 1;
}

class MetadataName {
    IS_PUBLIC = 'isPublic';
    ROLE = 'role';
}

class AuthParam {
    ROUNDS_HASH_PASSWORD = 10;
}

export class Constant {
    static providerKeys: ProviderKey = new ProviderKey();
    static dbDriverErrors: DBDriverError = new DBDriverError();
    static controllerParams: ControllerParam = new ControllerParam();
    static metadataNames: MetadataName = new MetadataName();
    static authParams: AuthParam = new AuthParam();
}

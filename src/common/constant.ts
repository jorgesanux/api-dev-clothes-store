class ProviderKey {
    PG_CLIENT: string = "PG_CLIENT";
    ENV_CONFIG: string = "config";
}

export class Constant {
    static providerKeys: ProviderKey = new ProviderKey();
}

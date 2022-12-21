export interface JWTPayloadModel {
    sub: string;
    email: string;
    role: string;
    exp?: number;
    iat?: number;
}

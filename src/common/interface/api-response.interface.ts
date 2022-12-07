export interface ApiResponse<T = any> {
    message: string;
    statusCode: number;
    result?: T;
    results?: Array<T>;
    count?: number;
}

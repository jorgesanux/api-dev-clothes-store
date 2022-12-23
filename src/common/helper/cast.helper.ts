export class CastHelper {
    static UTF8_ENCODING: BufferEncoding = 'utf-8';
    static BufferToString = (
        data: Buffer,
        encoding = CastHelper.UTF8_ENCODING,
    ): string => data.toString(encoding);
    static StringToBuffer = (
        text: string,
        encoding = CastHelper.UTF8_ENCODING,
    ): Buffer => Buffer.from(text, encoding);
}

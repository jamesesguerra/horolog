export class ImageUrlHelper {
    static resolve(baseStorageDomain: string, uri?: string | null): string | undefined {
        if (!uri) {
            return undefined;
        }
        return /^https?:\/\//i.test(uri) ? uri : baseStorageDomain + uri;
    }
}

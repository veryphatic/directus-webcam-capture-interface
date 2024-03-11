import { AxiosInstance } from "axios";

/**
 * Fetch an image and return it as a base64 blob
 * @param url image url
 * @param api axois instance
 * @returns Blob
 */
export async function fetchImageBase64(
    url: string,
    api: AxiosInstance,
): Promise<Record<string, any>> {
    if (!api) throw new Error("useApi reference is missing");
    try {
        const response = await api.get(url, {
            responseType: "blob",
        });

        const base64Data = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(response.data);
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
        });

        return {
            data: base64Data,
            blob: response.data,
            error: false,
        };
    } catch (e) {
        console.error("Could not fetch image: ", e);
        return {
            data: {
                error: `fetchImageBase64 failed: ${e}`,
            },
            error: true,
        };
    }
}
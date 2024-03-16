import { useApi } from "@directus/extensions-sdk"

export const useFolders = () => {

    const api = useApi();

    const getDefaultFolder = async () => {
        try {
            const res = await api.get('/folders');
            return res.data;
        } catch (error: any) {
            throw new Error(error)
        }
    }

    return { getDefaultFolder }
}

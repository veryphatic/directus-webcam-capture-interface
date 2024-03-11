import { useStores } from '@directus/extensions-sdk';


const useFieldsStore = () => {

    const { useFieldsStore } = useStores();
    const fieldsStore = useFieldsStore();

    const getFieldDefaultValue = async (collection: string, fieldKey: string) => {
        console.log('collection/field', fieldsStore, collection, fieldKey)
        const field = await fieldsStore.getField(collection, fieldKey);
        console.log('field', field);
    }

    return {
        getFieldDefaultValue
    }
};

export { useFieldsStore }
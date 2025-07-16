import {
  ref,
  computed,
  Ref,
} from "vue";
import { useApi } from "@directus/extensions-sdk";
import { FileObject, FileObjectItem } from "./../types";
import { RelationM2M } from "./use-relation-m2m";
import { Item } from "@directus/types";


const useRelatedImages = (
  relation: Ref<RelationM2M | undefined>,
  itemId: Ref<string | number>,
) => {
  const api = useApi();
  const loading = ref<boolean>(false);
  const fetchedItems = ref<Item[]>([]);

  const selectedItem = ref<Partial<FileObjectItem>>();
  const selectedItemFileObj = ref<FileObject | null>();

  // directus staged emit payloads
  const createItemsList = ref<Item[]>([]);
  const deleteItemsList = ref<number[]>([]);
  const updateItemsList = ref<Item[]>([]);

  // related field
  const relationField = computed(() => {
    return relation.value?.relation?.field as string;
  })

  // returns a parsable list of items
  const displayItems = computed(() => {
    return fetchedItems.value.map((item) => {
      const relatedItem = item[relationField.value] as Item;
      return {
        ...relatedItem,
        itemId: item.id,
        deleted: deleteItemsList.value.includes(item.id),
      };
    }) as FileObjectItem[];
  });

  // display items with edits applied
  const displayItemsWithEdits = computed(() => {
    return displayItems.value.map(item => {
      // apply edits
      const idx = updateItemsList.value.findIndex(uItem => uItem.directus_files_id.id === item.id);

      if (idx === -1) {
        return item;
      }

      return {
        ...item,
        ...updateItemsList.value[idx]?.directus_files_id,
      }
    })
  });

  // Parsable list of staged (to be created) items
  const stagedItems = computed(() => {
    return createItemsList.value.map(item => {
      return item.directus_files_id
    })
  });

  // deduped merge of fetched and to be created items
  const allItems = computed(() => {
    return Array.from(
    new Map(
      [...displayItemsWithEdits.value, ...stagedItems.value]
        .map(item => [item.id, item])
    ).values()
  );
  });

  // fetch image collection { id, modified, type, title, file size}
  const fetchCollectionItems = async () => {
    loading.value = true;
    const collectionName = relation.value?.relation.collection;
    const endpoint = `${location.origin}/items/${collectionName}`;
    const junctionField = relation.value?.relation?.meta
      ?.junction_field as string;

    try {
      const response = await api.get(endpoint, {
        params: {
          filter: {
            [junctionField]: {
              _eq: itemId.value,
            },
          },
          fields: [
            "id",
            `${relationField.value}.id`,
            `${relationField.value}.type`,
            `${relationField.value}.title`,
            `${relationField.value}.description`,
            `${relationField.value}.filename_download`,
            `${relationField.value}.modified_on`,
          ],
        },
      });
      fetchedItems.value = response.data.data;
    } catch (e) {
      console.error('Could not fetch collection', e);
    } finally {
      loading.value = false;
    }
  };

  // select item to for editing/viewing
  const selectItem = (item: FileObjectItem) => {
    selectedItem.value = item;
  };

  // delete a saved item
  const deleteItem = (item: FileObjectItem) => {
    deleteItemsList.value.push(item?.itemId);
  };

  // undelete a saved item
  const undeleteItem = (item: FileObjectItem) => {
    const newList = deleteItemsList.value.filter(itemId => itemId !== item.itemId);
    deleteItemsList.value = newList
  }

  /**
   * Delete unsaved item from the file system
   * and clear the stagedItem ref
   * @param item Unsaved Item
   * @returns 
   */
  const deleteStagedItem = async (item: FileObjectItem) => {
    const endpoint = `${location.origin}/files/${item.id}`;
    try {
      const response = await api.delete(endpoint);
      // remove item from staging lists
      removeStagedItem(item);

      return {
        data: response,
        error: false,
      };
    } catch (e) {
      console.error("Could not delete item", e);
      return {
        data: null,
        error: e,
      };
    }
  }

  // adds the new item to the created list
  const stageItem = (item: FileObject, collection: string) => {
    const collectionPrimaryKey = `${collection}_id`;
    const fileRef = {
      [collectionPrimaryKey]: itemId,
      directus_files_id: {
        ...item
      },
    };
    createItemsList.value.push(fileRef)
  }

  // remove from staged item list and createdItems list
  const removeStagedItem = (item: FileObjectItem) => {
    createItemsList.value = createItemsList.value.filter(createItem => {
      return item.id !== createItem[relationField.value].id
    })
  };

  // update staged item
  const updateStagedItem = (update: Partial<FileObject>) => {
    // update create item list
    const idx = createItemsList.value.findIndex(cItem => {
      return cItem.directus_files_id.id === selectedItem.value?.id
    });

    if (idx === -1) return;

    createItemsList.value[idx] = {
      ...createItemsList.value[idx],
      directus_files_id: {
        ...createItemsList.value[idx]?.directus_files_id,
        ...update
      },
    }
  }

  // Creates updates from the selected item
  const updateFileObject = (update: Partial<FileObject>) => {
    if (!selectedItem.value) return;

    // update already exist?
    const idx = updateItemsList.value.findIndex(item => {
      return selectedItem.value?.id === item.directus_files_id.id
    });

    const fileRef = {
      directus_files_id: {
        id: selectedItem.value.id,
        ...updateItemsList.value[idx]?.directus_files_id ?? {},
        ...update,
      },
      id: selectedItem.value.itemId
    };

    // Replace or add
    if (idx === -1) {
      updateItemsList.value.push(fileRef)
    }
    else {
      updateItemsList.value[idx] = fileRef;
    }
  }


  return {
    fetchCollectionItems,
    loading,
    displayItems,
    allItems,
    stageItem,
    removeStagedItem,
    selectItem,
    selectedItem,
    selectedItemFileObj,
    updateFileObject,
    deleteItem,
    undeleteItem,
    createItemsList,
    deleteItemsList,
    updateItemsList,
    deleteStagedItem,
    updateStagedItem
  };
};

export { useRelatedImages };

<script lang="ts" setup>
import { ref, toRefs, computed, watch } from "vue";
import { useRelationM2M } from "./../hooks/use-relation-m2m";
import { useRelatedImages } from "./../hooks/useRelatedImages";
import ImageList from "./ImageList.vue";
import ImagePreviewDrawer from "./../drawers/ImagePreviewDrawer.vue";
import LiveImageDrawer from "./../drawers/LiveImageDrawer.vue";
import { FileObject, FileObjectItem } from "./../types";
import { onMounted } from "vue";

const props = withDefaults(
  defineProps<{
    // directus props
    value:
      | (number | string | Record<string, any>)[]
      | Record<string, any>
      | null;
    primaryKey: string | number;
    collection: string;
    field: string;
    disabled?: boolean;
    showNavigation?: boolean;

    // interface props
    folder: string;
    device_width: number;
    device_height: number;
  }>(),
  {
    device_width: 1920,
    device_height: 1080,
  },
);

const emit = defineEmits(["input"]);
const {
  collection,
  field,
  primaryKey,
  folder,
  device_width: deviceWidth,
  device_height: deviceHeight,
} = toRefs(props);
const showLiveViewCaptureDrawer = ref(false);

const { relationInfo } = useRelationM2M(collection, field);

const {
  fetchCollectionItems,
  loading,
  selectItem,
  selectedItem,
  selectedItemFileObj,
  updateFileObject,
  deleteItem,
  undeleteItem,
  allItems,
  createItemsList,
  deleteItemsList,
  updateItemsList,
  updateStagedItem,
  stageItem,
  removeStagedItem,
} = useRelatedImages(relationInfo, primaryKey);

const value = computed({
  get: () => props.value,
  set: (val) => {
    emit("input", val);
  },
});

watch(primaryKey, (newValue, oldValue) => {
  if (newValue !== "+") {
    fetchCollectionItems();
  }
});

// Close ImagePreviewDrawer
const closeImagePreviewDrawer = () => {
  selectedItem.value = undefined;
  selectedItemFileObj.value = null;
};

// Close LiveImageDrawer
const closeLiveImageDrawer = () => {
  showLiveViewCaptureDrawer.value = false;
};

// Select an item for viewing/editing
const onSelectItem = (item: FileObject) => {
  selectItem(item as FileObjectItem);
};

// Update an item (text and description only)
const updateItem = async (
  formValues: Partial<FileObject>,
  imageBlob: Blob | null = null,
) => {
  if (imageBlob) throw new Error("Not implemented");

  // Saved item
  if (selectedItem.value?.itemId) {
    // add update object
    updateFileObject(formValues);
    selectedItem.value = undefined;
  }
  // Staged item
  else {
    // update staged object
    updateStagedItem(formValues);
    selectedItem.value = undefined;
  }

  emitUpdate();
};

const onDeleteItem = async (item: FileObjectItem) => {
  if (item?.itemId) {
    deleteItem(item);
    emitUpdate();
  } else {
    removeStagedItem(item);
    emitUpdate();
  }
};

const onUndeleteItem = (item: FileObjectItem) => {
  if (item.itemId) undeleteItem(item);
};

// Called when Live View image is uploaded to files
const onItemSaved = (item: FileObject) => {
  // stage item
  stageItem(item, collection.value);
  // emit update
  emitUpdate();
  // close drawer
  showLiveViewCaptureDrawer.value = false;
};

// Emit input event for alias (multiple file) types
const emitUpdate = () => {
  emit("input", {
    create: createItemsList.value,
    update: updateItemsList.value,
    delete: deleteItemsList.value,
  });
};
</script>

<template>
  <!-- Actions -->
  <div class="actions">
    <v-button @click="showLiveViewCaptureDrawer = true">Capture Image</v-button>
  </div>

  <!-- Image list -->
  <div v-if="!loading" class="imageList">
    <ImageList
      :items="allItems"
      @select="onSelectItem"
      @delete="onDeleteItem"
      @undelete="onUndeleteItem"
    />
  </div>

  <!-- Image capture drawer -->
  <template v-if="showLiveViewCaptureDrawer">
    <LiveImageDrawer
      :folder="folder"
      @close="closeLiveImageDrawer"
      @item-saved="onItemSaved"
      :deviceWidth="deviceWidth"
      :deviceHeight="deviceHeight"
    />
  </template>

  <!-- Image preview -->
  <template v-if="selectedItem">
    <ImagePreviewDrawer
      :fileObject="selectedItem as FileObjectItem"
      @update="updateItem"
      @close="closeImagePreviewDrawer"
    />
  </template>
</template>

<style scoped>
.imageList {
  margin-top: 1rem;
}
</style>

<script lang="ts" setup>
import ImageListItem from "./ImageListItem.vue";
import { FileObjectItem } from "../types";

const props = defineProps<{
  items: FileObjectItem[];
}>();

const emit = defineEmits<{
  (e: "select", item: FileObjectItem): null;
  (e: "delete", item: FileObjectItem): null;
  (e: "undelete", item: FileObjectItem): null;
}>();

const onItemClick = (item: FileObjectItem) => {
  emit("select", item);
};

const onDeleteItem = (item: FileObjectItem) => {
  emit("delete", item);
};

const onUndeleteItem = (item: FileObjectItem) => {
  emit("undelete", item);
};
</script>

<template>
  <div v-if="props.items.length">
    <v-list>
      <ImageListItem
        v-for="item in props.items"
        :item="item"
        @click="() => onItemClick(item)"
        @delete="() => onDeleteItem(item)"
        @undelete="() => onUndeleteItem(item)"
        :key="item.id"
      />
    </v-list>

    <div v-if="false" id="imageListContainer">
      <div v-for="item in props.items" :key="item.id">
        <div class="itemContainer">
          <ImageListItem
            :item="item"
            @click="() => onItemClick(item)"
            :key="item.id"
          />
          <div class="actions">
            <v-button
              v-if="!item.deleted"
              @click="() => onDeleteItem(item)"
              small
            >
              Delete
            </v-button>
            <v-button v-if="item.deleted" @click="() => onUndeleteItem(item)">
              Undelete
            </v-button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="!props.items.length">
    <v-notice type="info">No images added</v-notice>
  </div>
</template>

<style scoped>
#imageListContainer {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  flex-wrap: wrap;
  gap: 1rem;
  row-gap: 0.5rem;
}
.itemContainer {
  position: relative;
}

.actions {
  position: absolute;
  bottom: 0;
}
</style>

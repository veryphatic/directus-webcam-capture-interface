<script lang="ts" setup>
import { toRefs, ref, computed } from "vue";
import { useApi } from "@directus/extensions-sdk";
import { FileObjectItem } from "../types";
import { onMounted } from "vue";

const props = defineProps<{
  fileObject: FileObjectItem;
}>();

const emit = defineEmits<{
  (e: "update", formValues: { title: string; description: string }): void;
  (e: "close"): void;
}>();

const api = useApi();
const apiHeaders = ref();
const { fileObject } = toRefs(props);
const showSelectedItemDrawer = ref<boolean>(true);
const hasChanged = ref<boolean>(false);
// Create local refs for title and description
const localTitle = ref(fileObject.value?.title ?? "");
const localDescription = ref(fileObject.value?.description ?? "");

onMounted(async () => {
  apiHeaders.value = await api.head(window.location.origin);
});

const previewImageUrl = computed(() => {
  if (!apiHeaders.value) return;
  const token =
    apiHeaders.value.config.headers.getAuthorization() as unknown as string;
  return `${window.location.origin}/assets/${fileObject.value.id}?access_token=${token.split(" ")[1]}`;
});

const closeDrawer = () => {
  emit("close");
};

const saveChanges = () => {
  emit("update", {
    title: localTitle.value,
    description: localDescription.value,
  });
};
</script>

<template>
  <v-drawer v-model="showSelectedItemDrawer" @cancel="closeDrawer">
    <template #title>Captured Image</template>

    <template v-if="previewImageUrl">
      <div class="imageContainer">
        <img
          :src="`${previewImageUrl}&cache-buster=${Date.now().toString()}`"
        />

        <div class="imageMetaForm">
          <div class="formField">
            <label>Title (optional)</label>
            <v-input v-model="localTitle" @update:modelValue="hasChanged = true" />
          </div>
          <div class="formField">
            <label>Description (optional)</label>
            <v-textarea v-model="localDescription" @update:modelValue="hasChanged = true" />
          </div>
        </div>
      </div>
    </template>

    <template #actions v-if="previewImageUrl">
      <v-button
        :download="fileObject?.id"
        :href="`${previewImageUrl}&cache-buster=${Date.now().toString()}`"
        >Download
      </v-button>
      <v-button v-if="hasChanged" @click="saveChanges">Update</v-button>
    </template>
  </v-drawer>
</template>

<style scoped>
.imageContainer {
  max-width: 100%;
  padding: 2rem;
}
.imageContainer img {
  width: 100%;
  height: auto;
}
.imageMetaForm {
  margin-top: 1rem;
}
.formField {
  margin-bottom: 0.5rem;
}
</style>

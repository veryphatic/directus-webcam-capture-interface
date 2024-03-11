<script lang="ts" setup>
import { ref } from "vue";
import { useApi } from "@directus/extensions-sdk";
import { FileObject } from "./../types";
import LiveView from "../components/LiveView.vue";

const props = defineProps<{
  folder: string;
  deviceWidth: number;
  deviceHeight: number;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "itemSaved", item: FileObject): void;
}>();

const api = useApi();
const drawerOpen = ref<boolean>(true);
const title = ref<string>("");
const description = ref<string>("");
const imageBlob = ref<Blob>();

const onUpdateImage = (image: Blob) => {
  imageBlob.value = image;
};

const saveImage = async () => {
  const filenameDownload = `${Date.now().toString()}.${imageBlob.value?.type.split("/")[1]}`;
  const { data, error } = await uploadFile(
    imageBlob.value as Blob,
    title.value,
    description.value,
    filenameDownload,
    props.folder,
  );

  if (error) {
    console.error("error", error);
  } else {
    emit("itemSaved", data);
  }
};

const uploadFile = async (
  imageBlob: Blob,
  title: string,
  description: string,
  filename_download: string,
  folder: string,
) => {
  console.log(
    "uploadFile",
    imageBlob,
    title,
    description,
    filename_download,
    folder,
  );
  const formData = new FormData();
  formData.append("title", title);
  formData.append("folder", folder);
  formData.append("description", description);
  formData.append("image", imageBlob, filename_download);

  try {
    const response = await api.post(`${location.origin}/files`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const { data } = response;

    return {
      data: data.data,
      error: false,
    };
  } catch (e) {
    return {
      data: null,
      error: e,
    };
  }
};
</script>

<template>
  <v-drawer v-model="drawerOpen" @cancel="() => emit('close')">
    <template #title>Live Camera Capture</template>
    <div class="webcam-container-body">
      <LiveView
        @update="onUpdateImage"
        :deviceWidth="props.deviceWidth"
        :deviceHeight="props.deviceHeight"
      />

      <div class="imageMetaForm">
        <div class="formField">
          <label>Title (optional)</label>
          <v-input v-model="title" />
        </div>
        <div class="formField">
          <label>Description (optional)</label>
          <v-textarea v-model="description" />
        </div>
      </div>
    </div>
    <template #actions v-if="imageBlob">
      <v-button @click="saveImage">Save Image</v-button>
    </template>
  </v-drawer>
</template>

<style scoped>
.imageMetaForm {
  margin-top: 1rem;
  padding: 16px;
}

.formField {
  margin-bottom: 0.5rem;
}
</style>

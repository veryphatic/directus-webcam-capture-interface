<script lang="ts" setup>
import { computed } from "vue";
import { FileObjectItem } from "../types";

const props = defineProps<{
  item: FileObjectItem;
}>();

const emit = defineEmits<{
  (e: "click"): null;
  (e: "delete"): null;
  (e: "undelete"): null;
}>();

const previewImageUrl = computed(() => {
  return `${window.location.origin}/assets/${props.item.id}`;
});
</script>

<template>
  <template v-if="previewImageUrl">
    <v-list-item
      :block="true"
      clickable
      @click="() => emit('click')"
      :style="{ paddingLeft: 0 }"
    >
      <div
        :style="{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
        }"
      >
        <div :style="{ display: 'flex', alignItems: 'center' }">
          <img
            :src="`${previewImageUrl}&width=200&fit=contain&cache-buster=${Date.now().toString()}`"
            :style="{
              objectFit: 'contain',
              height: '80px',
              marginRight: '1rem',
            }"
          />
          {{ item.title }}
        </div>
        <div :style="{ display: 'flex', alignItems: 'center' }">
          <v-icon
            v-if="item.deleted"
            @click.stop="() => emit('undelete')"
            name="settings_backup_restore"
            class="undelete"
          />
          <v-icon v-else name="delete" @click.stop="() => emit('delete')" />

          <v-menu show-arrow placement="bottom-end">
            <template #activator="{ toggle }">
              <v-icon name="more_vert" clickable @click.stop="toggle" />
            </template>

            <v-list>
              <v-list-item clickable :href="previewImageUrl">
                <v-list-item-icon><v-icon name="launch" /></v-list-item-icon>
                <v-list-item-content>Open file in new tab</v-list-item-content>
              </v-list-item>

              <v-list-item
                clickable
                :download="item?.filename_download ?? item?.id"
                :href="previewImageUrl"
              >
                <v-list-item-icon><v-icon name="download" /></v-list-item-icon>
                <v-list-item-content>Download File</v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>
    </v-list-item>
  </template>
</template>

<style scoped>
.undelete {
  color: var(--theme--danger);
}
</style>
../utils/image
